import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '@/views/TaskView.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import { useUserStore } from '@/stores/user'
import zyos from 'zyos'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: { name: 'all-task' }
    },
    {
      path: '/',
      component: MainLayout,
      children: [
        {
          path: 'task',
          name: 'all-task',
          component: TaskView,
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
          path: 'status/manage',
          name: 'status-manage',
          component: () => import('@/views/StatusManageView.vue'),
          children: [
            {
              path: '/status/add',
              name: 'status-add',
              component: () => import('@/components/StatusModal.vue')
            },
            {
              path: '/status/:statusId/edit',
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
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

router.beforeEach(async (to, from, next) => {
  if (['login', 'not-found'].includes(to.name)) next()
  else if (localStorage.getItem('itbkk-token')) {
    try {
      const res = await zyos.fetch(`${import.meta.env.VITE_SERVER_URL}/validate-token`, { useToken: true })
      if (res.status !== 'success') {
        localStorage.removeItem('itbkk-token')
        throw new Error('Invalid token')
      }
      const userStore = useUserStore()
      userStore.loadUserData()
      next()
    } catch (error) {
      console.error(error)
      next({ name: 'login' })
      return
    }
  }
  else next({ name: 'login' })
})

export default router
