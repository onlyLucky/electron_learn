import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('_v/login/index.vue')
  },
  {
    path: '/',
    name: '_index',
    redirect: '/meeting',
    component: () => import('@/layout/Index.vue'),
    meta: {
      hideInMenu: true,
      notCache: true
    },
    children: [
      {
        path: '/meeting',
        name: 'meeting',
        meta: {
          hideInMenu: false,
          title: '会议',
          notCache: false,
          icon: 'ios-people'
        },
        component: () => import('_v/meeting/index.vue')
      },
      {
        path: '/equipment',
        name: 'equipment',
        meta: {
          hideInMenu: false,
          title: '设备',
          notCache: false,
          icon: 'ios-construct'
        },
        component: () => import('_v/equipment/index.vue')
      }
    ]
  }
]

export default routes