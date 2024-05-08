import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '../views/TaskView.vue'
// import { useTaskStore } from '@/stores/task'
// import { useToastStore } from '@/stores/toast'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/task'
    },
    {
      path: '/task',
      name: 'all-task',
      component: TaskView,
      children: [
        {
          path: ':taskId',
          name: 'task-view',
          component: () => import('../components/TaskModal.vue')
        },
        {
          path: ':taskId/edit',
          name: 'task-edit',
          component: () => import('../components/TaskModal.vue')
        },
        {
          path: 'add',
          name: 'task-add',
          component: () => import('../components/TaskModal.vue')
        }
      ]
    },
    {
      path: '/status/manage',
      name: 'status-manage',
      component: () => import('../views/StatusManageView.vue'),
      children: [
        {
          path: '/status/add',
          name: 'status-add',
          component: () => import('../components/StatusModal.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      component: () => import('../views/NotFound.vue')
    }
  ]
})

// router.beforeEach((to, from, next) => {
//   if (to.name === 'task-view' || to.name === 'task-edit') {
//     const taskId = to.params.taskId
//     console.log(useTaskStore().tasks.findIndex((task) => task.id === taskId))
//     if (useTaskStore().tasks.findIndex((task) => task.id === parseInt(taskId)) > -1) {
//       next()
//     } else {
//       useToastStore().createToast({
//         title: 'Error',
//         description: 'An error has occurred, the task does not exist.',
//         status: 'error'
//       })
//       next({ name: 'all-task' })
//     }
//   } else {
//     next()
//   }
// })

export default router
