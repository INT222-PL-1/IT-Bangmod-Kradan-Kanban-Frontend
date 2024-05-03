import { createRouter, createWebHistory } from 'vue-router'
import TaskView from '../views/TaskView.vue'

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
    }
  ]
})

export default router
