import { createApp } from 'vue'
import App from './App.vue'
import './samples/node-api'

import router from './router'
import store from './store'
// 国际化
import i18n from '@/locale'
// iview 
import ViewUIPlus from 'view-ui-plus';
import { Button, Input } from 'view-ui-plus'
import config from '@/config'
import axios from './libs/axiosTool'

import 'view-ui-plus/dist/styles/viewuiplus.css'
import "@/styles/global.less"
import "@/styles/default.less"

import cascaderMulti from "cascader-multi";

const app = createApp(App);

/* app.use(ViewUI, {
  i18n: (path, options) => {
    let value = i18n.t(path, options);
    if (value !== null && value !== undefined) return value;
    return '';
  }
}) */
app.use(i18n)
app.use(ViewUIPlus, {
  i18n
})

app.component('Button', Button);
app.component('Input', Input);
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
});
