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
    component: () => import("@/views/meeting/summary/index.vue")
  },
  {
    path: '/models/meet/share',
    name: 'meet_share',
    component: () => import("@/views/meeting/share/index.vue")
  },
  {
    path: '/models/meet/video',
    name: 'meet_share',
    component: () => import("@/views/meeting/video/index.vue")
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
          keepAlive: true,
        },
        component: () => import('@/views/meeting/files/list.vue')
      },
      {
        path: '/meet',
        name: 'files_meet',
        meta: {
          hideInMenu: false,
          title: '会议列表',
          keepAlive: true,
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
      keepAlive: true
    },
    children: [
      {
        path: '/home',
        name: 'home',
        meta: {
          hideInMenu: false,
          title: '首页',
          keepAlive: true,
          icon: 'icon-shouye'
        },
        component: () => import('_v/home/index.vue')
      },
      {
        path: '/meeting',
        name: 'meeting',
        meta: {
          hideInMenu: false,
          title: '会议',
          keepAlive: true,
          icon: 'icon-changyonghuiyi'
        },
        component: () => import('_v/meeting/index.vue')
      },
      {
        path: '/equipment',
        name: 'equipment',
        meta: {
          hideInMenu: false,
          title: '设备',
          keepAlive: true,
          icon: 'icon-ziyuanxhdpi'
        },
        component: () => import('_v/equipment/index.vue')
      },
      {
        path: '/person',
        name: 'person',
        meta: {
          hideInMenu: false,
          title: '人员',
          keepAlive: true,
          icon: 'icon-renyuan1'
        },
        component: () => import('_v/user/index.vue')
      }
    ]
  }

]

export default routes