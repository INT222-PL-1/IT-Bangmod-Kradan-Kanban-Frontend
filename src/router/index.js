import { createRouter, createWebHistory } from 'vue-router'
import TaskBoardLayout from '@/layouts/TaskBoardLayout.vue'
import { useUserStore } from '@/stores/user'
import zyos from 'zyos'
import BoardView from '@/views/BoardView.vue'
import { useBoardStore } from '@/stores/board'

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
      name: 'all-board',
      component: BoardView,
      beforeEnter: async (to, from, next) => {
        const boardStore = useBoardStore()
        await boardStore.loadAllBoards()
        if (from.name === 'all-task') {
          next()
          return
        }
        if (boardStore.boards.length === 1) {
          next({ name: 'all-task', params: { boardId: boardStore.boards[0].id } })
        }
        else next()
      },
      children: [
        {
          path: 'add',
          name: 'board-add',
          component: () => import('@/components/BoardAddModal.vue')
        }
      ]
    },
    {
      path: '/board/:boardId',
      redirect: { name: 'all-task' },
      component: TaskBoardLayout,
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
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/forbidden',
      name: 'forbidden',
      component: () => import('../views/ForbiddenView.vue')
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFoundView.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  if (['login', 'not-found', 'forbidden'].includes(to.name)) {
    console.log('Public route', to.name)
    next()
  }
  else if (localStorage.getItem('itbkk-token')) {
    console.log('Private route', to.name)
    if (userStore.user) {
      next()
      return
    }
    try {
      const res = await zyos.fetch(`${import.meta.env.VITE_SERVER_URL}/token/validate`)
      if (res.status === 'error') {
        localStorage.removeItem('itbkk-token')
        throw new Error('Invalid token')
      }
      userStore.loadUserData()
      next()
    } catch (error) {
      console.error(error)
      next({ name: 'login' })
      return
    }
  }
  else {
    console.log('No token', to.name)
    if (to.name === 'all-task') {
      next()
      return
    }
    next({ name: 'login' })
  }
})

export default router
