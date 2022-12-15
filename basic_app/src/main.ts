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
import { Button, Input, Icon } from 'view-ui-plus'
// 样式文件引入
import "@/styles/index"

import config from '@/config'
// import axios from './libs/axiosTool'

const app = createApp(App);

app.use(router)
app.use(i18n)
app.use(ViewUIPlus, {
  i18n
})
app.config.globalProperties.$config = config;

app.component('Button', Button);
app.component('Input', Input);
app.component('Icon', Icon);
app.mount('#app').$nextTick(() => {
  postMessage({ payload: 'removeLoading' }, '*')
});
