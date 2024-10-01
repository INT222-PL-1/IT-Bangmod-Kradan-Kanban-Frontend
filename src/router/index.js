import { createRouter, createWebHistory } from 'vue-router'
import TaskBoardLayout from '@/layouts/TaskBoardLayout.vue'
import { useUserStore } from '@/stores/user'
import zyos from 'zyos'
import BoardView from '@/views/BoardView.vue'
import { useBoardStore } from '@/stores/board'
import { useToastStore } from '@/stores/toast'
import { refreshAccessToken } from '@/libs/userManagement'

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
        boardStore.clearBoardData()
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

// router.beforeEach(async (to, from, next) => {
//   const userStore = useUserStore()
//   const toastStore = useToastStore()
//   if (['login', 'not-found', 'forbidden'].includes(to.name)) {
//     console.log('Public route', to.name)
//     next()
//   }
//   else if (localStorage.getItem('itbkk_access_token')) {
//     console.log('Private route', to.name)
//     if (userStore.user) {
//       console.log('User already loaded', to.name)
//       next()
//       return
//     }
//     try {
//       const res = await zyos.fetch(`${import.meta.env.VITE_SERVER_URL}/token/validate`)
//       if (res.status === 'error') {
//         localStorage.removeItem('itbkk_access_token')
//         throw new Error('Invalid token')
//       }
//       console.log('User loaded', to.name)
//       userStore.loadUserData()
//       console.log('User: ', userStore.user)
//       next()
//     } catch (error) {
//       console.error(error)
//       userStore.clearUserData()
//       toastStore.createToast({
//         title: 'Error',
//         description: 'Cannot enter the page. Please login and try again.',
//         status: 'error',
//       })
//       next({ name: 'login' })
//       return
//     }
//   }
//   else {
//     console.log('No token', to.name)
//     try {
//       if (localStorage.getItem('itbkk_refresh_token')) {
//         const res = await refreshAccessToken()
//         if (res.status === 'success') {
//           localStorage.setItem('itbkk_access_token', res.data.access_token)
//         }
//         next()
//         return
//       } else {
//         if (['all-task', 'status-manage', 'task-view'].includes(to.name)) {
//           next()
//           return
//         } else {
//           throw new Error('Cannot enter the page. Please login and try again.')
//         }
//       }
//     } catch (error) {
//       userStore.clearUserData()
//       toastStore.createToast({
//         title: 'Error',
//         description: 'Cannot enter the page. Please login and try again.',
//         status: 'error',
//       })
//       next({ name: 'login' })
//     }
//   }
// })

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()
  const toastStore = useToastStore()

  // Check if the route is public
  if (['login', 'not-found', 'forbidden'].includes(to.name)) {
    console.log('Public route:', to.name)
    next()
    return
  }

  // If access token exists
  const accessToken = localStorage.getItem('itbkk_access_token')
  if (accessToken) {
    console.log('Private route:', to.name)

    // If user data is already loaded
    if (userStore.user) {
      console.log('User already loaded:', to.name)
      next()
      return
    }

    try {
      const res = await zyos.fetch(`${import.meta.env.VITE_SERVER_URL}/token/validate`)
      
      if (res.status === 'error') {
        localStorage.removeItem('itbkk_access_token')
        throw new Error('Invalid token')
      }

      // Load user data after validation
      console.log('User loaded:', to.name)
      userStore.loadUserData();
      console.log('User:', userStore.user)
      next()

    } catch (error) {
      console.error(error)
      userStore.clearUserData()
      toastStore.createToast({
        title: 'Error',
        description: 'Cannot enter the page. Please login and try again.',
        status: 'error',
      });
      next({ name: 'login' })
    }

    return
  }

  // No access token, check for refresh token
  console.log('No access token:', to.name)
  const refreshToken = localStorage.getItem('itbkk_refresh_token')

  if (refreshToken) {
    try {
      const res = await refreshAccessToken()
      
      if (res.status === 'success') {
        localStorage.setItem('itbkk_access_token', res.data.access_token)
        next()
        return
      }

    } catch (error) {
      console.error('Failed to refresh access token:', error)
    }
  }

  // Handle routes that don't require login or show error
  if (['all-task', 'status-manage', 'task-view'].includes(to.name)) {
    next()
    return
  }

  toastStore.createToast({
    title: 'Error',
    description: 'Cannot enter the page. Please login and try again.',
    status: 'error',
  })
  next({ name: 'login' })
})

export default router
