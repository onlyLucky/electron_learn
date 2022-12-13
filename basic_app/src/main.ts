import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'

import router from './router'
import store from './store'
// 国际化
import ViewUIPlus from 'view-ui-plus';
import i18n from '@/locale'
// iview 
import { Button, Input } from 'view-ui-plus'
// 样式文件引入
import "@/styles/index"

import config from '@/config'
import axios from './libs/axiosTool'

import cascaderMulti from "cascader-multi";

const app = createApp(App);

app.use(i18n)
app.use(ViewUIPlus, {
  i18n
})

app.component('Button', Button);
app.component('Input', Input);
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
});
