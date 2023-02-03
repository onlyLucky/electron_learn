import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('_v/login/index.vue')
  },
  {
    path: '/setting',
    name: 'setting',
    component: () => import('_v/setting/index.vue')
  },
  {
    path: '/models/meet/summary',
    name: 'meet_summary',
    component: () => import("_v/meeting/summary.vue")
  },
  {
    path: '/models/meet/file',
    name: 'meet_file',
    component: () => import("_v/meeting/files/index.vue"),
    redirect: '/list',
    children: [
      {
        path: '/list',
        name: 'files_list',
        meta: {
          hideInMenu: false,
          title: '会议文件',
          notCache: false,
        },
        component: () => import('@/views/meeting/files/list.vue')
      },
      {
        path: '/meet',
        name: 'files_meet',
        meta: {
          hideInMenu: false,
          title: '会议列表',
          notCache: false,
        },
        component: () => import('@/views/meeting/files/meet.vue')
      },
    ]
  },
  {
    path: '/',
    name: '_index',
    redirect: '/login',
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