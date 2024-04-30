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
      name: 'task',
      component: TaskView,
      children: [
        {
          path: ':taskId',
          name: 'task-id',
          component: () => import('../components/TaskModal.vue')
        }
      ]
    }
  ]
})

export default router
