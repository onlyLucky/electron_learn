import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'
import 'amfe-flexible'

// 路由引入
import router from './router';
// 国际化
import ViewUIPlus from 'view-ui-plus';
import i18n from '@/locale'
// iview 
import { Button, Input, Icon, DatePicker, Table, Row, Col, Poptip, Page, Tooltip, Tag } from 'view-ui-plus'
// 样式文件引入
import "@/styles/index"
// 自定义指令引入
import { vDebounce, vMove } from "./directive/index"
import config from '@/config'
import http from './libs/request'
import { webFrame } from "electron"

// webFrame.setZoomFactor(0.5) 设置适配窗口分辨率缩放
const app = createApp(App);

app.use(router)
app.use(i18n)
/* app.use(ViewUIPlus, {
  i18n
}) */
app.use(vDebounce).use(vMove)

app.config.globalProperties.$config = config;
app.config.globalProperties.$http = http

app.component('Button', Button)
app.component('Input', Input)
app.component('DatePicker', DatePicker)
app.component('Table', Table)
app.component('Row', Row)
app.component('Col', Col)
app.component('Poptip', Poptip)
app.component('Tooltip', Tooltip)
app.component('Page', Page)
app.component('Tag', Tag)
app.component('Icon', Icon);
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
});
