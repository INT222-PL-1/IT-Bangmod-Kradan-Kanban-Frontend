import { createRouter, createWebHistory } from 'vue-router'
import TaskBoardLayout from '@/layouts/TaskBoardLayout.vue'
import { useUserStore } from '@/stores/user'
import BoardView from '@/views/BoardView.vue'
import { useBoardStore } from '@/stores/board'
import { useToastStore } from '@/stores/toast'
import { refreshAccessToken, validateAccessToken } from '@/libs/userManagement'
import BoardSelectLayout from '@/layouts/BoardSelectLayout.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'all-board' }
    },
    {
      path: '/board',
      component: BoardSelectLayout,
      children: [
        {
          path: '',
          name: 'all-board',
          component: BoardView,
          meta: { title: 'Boards' },
          beforeEnter: async (to, from) => {
            const boardStore = useBoardStore()
            boardStore.clearBoardData()
            await boardStore.loadAllBoards()
            if (boardStore.boards.length > 0 && to.name === 'board-add') {
              return { name: 'all-board' }
            }
            if (from.name === 'login' && boardStore.boards.length === 1 && boardStore.collaborativeBoards.length === 0) {
              return { name: 'all-task', params: { boardId: boardStore.boards[0].id } }
            }
            else return
          },
          children: [
            {
              path: 'add',
              name: 'board-add',
              component: () => import('@/components/BoardAddModal.vue')
            }
          ]
        }
      ]
    },
    {
      path: '/board/:boardId',
      redirect: { name: 'all-task' },
      component: TaskBoardLayout,
      meta: { title: 'Tasks' },
      children: [
        {
          path: 'task',
          name: 'all-task',
          component: () => import('@/views/TaskView.vue'),
          children: [
            {
              path: ':taskId',
              name: 'task-view',
              component: () => import('@/components/TaskModal.vue')
            },
            {
              path: ':taskId/edit',
              name: 'task-edit',
              component: () => import('@/components/TaskModal.vue')
            },
            {
              path: 'add',
              name: 'task-add',
              component: () => import('@/components/TaskModal.vue')
            }
          ]
        },
        {
          path: 'status',
          redirect: { name: 'status-manage' }
        },
        {
          path: 'status/manage',
          name: 'status-manage',
          meta: { title: 'Status Management' },
          component: () => import('@/views/StatusManageView.vue'),
          children: [
            {
              path: '/board/:boardId/status/add',
              name: 'status-add',
              component: () => import('@/components/StatusModal.vue')
            },
            {
              path: '/board/:boardId/status/:statusId/edit',
              name: 'status-edit',
              component: () => import('@/components/StatusModal.vue')
            }
          ]
        },
        {
          path: 'collab',
          name: 'collab-manage',
          meta: { title: 'Collaborator Management' },
          component: () => import('@/views/CollabManageView.vue'),
        }
      ]
    },
    {
      path: '/login',      
      name: 'login',
      meta: { title: 'Login' },
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      meta: { title: 'Forbidden' },
      component: () => import('../views/ForbiddenView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      meta: { title: 'Not found' },
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

router.beforeEach(async (to) => {

  const userStore = useUserStore()
  const boardStore = useBoardStore()
  const toastStore = useToastStore()
  
  // ? User can enter login, not-found and  forbidden page even user is not logged in.
  if ([ 'login', 'not-found', 'forbidden' ].includes(to.name)) return
  
  async function handleUserValidation() {
    const accessToken = localStorage.getItem('itbkk_access_token')
    const refreshToken = localStorage.getItem('itbkk_refresh_token')

    // ? If access token exists.
    if (accessToken) {

      // ? Load user data after re-validation token.
      try {
        // ? If access token is valid, load user data. Otherwise, try to refresh access token.
        const isAccessTokenValid = await validateAccessToken(accessToken)
        if (isAccessTokenValid) {
          userStore.loadUserData()
          return
        } else {
          throw new Error('Access token is invalid')
        }
      } catch (error) {
        console.error(error)
      }
    }

    // ? If refresh token exists, try to refresh access token.
    if (refreshToken) {
      try {
        // ? If refresh token is valid, refresh access token and run user validation again.
        const res = await refreshAccessToken(refreshToken)
        
        if (res.ok) {
          localStorage.setItem('itbkk_access_token', res.data.access_token)
          return await handleUserValidation()
        } else {
          throw new Error('Failed to refresh access token')
        }

      } catch (error) {
        console.error(error)
      }
    }

    // ? If user is not logged in, redirect to login page.
    if ([ 'all-task', 'task-view', 'status-manage', 'collab-manage' ].includes(to.name)) return

    // ? Clear all data and redirect to login
    localStorage.removeItem('itbkk_access_token')
    localStorage.removeItem('itbkk_refresh_token')
    boardStore.clearBoardData()
    userStore.clearUserData()

    toastStore.createToast({
      title: 'Error',
      description: 'Cannot enter the page. Please login and try again later.',
      status: 'error',
    })

    return { name: 'login' } 
  }

  const nextRoute = await handleUserValidation()
  return nextRoute
})

router.afterEach((to) => {
  if (to.meta.title) document.title = `ITBKK - ${to.meta.title}`
  else document.title = 'ITBKK'
})

export default router
