import { createRouter, createWebHistory } from 'vue-router'
// import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      // component: HomeView
      redirect: '/task'
    },
    {
      path: '/task',
      name: 'task',
      component: () => import('../views/TaskView.vue'),
      children: [
        {
          path: ':taskId',
          name: 'task-id'
          // component: () => import('../components/TaskModal.vue')
        }
      ]
    }
  ]
})

export default router
