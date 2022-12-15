import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: '_index',
    redirect: '/meeting',
    component: () => import('@/layout/Index.vue'),
    meta: {
      hideInMenu: false,
      notCache: true
    },
    children: [
      {
        path: '/meeting',
        name: 'meeting',
        meta: {
          hideInMenu: false,
          title: '会议',
          notCache: true,
          icon: 'md-home'
        },
        component: () => import('_v/meeting/index.vue')
      }
    ]
  }
]

export default routes