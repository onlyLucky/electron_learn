/*
 * @Author: fg
 * @Date: 2022-12-27 15:01:42
 * @LastEditors: fg
 * @LastEditTime: 2022-12-27 15:23:27
 * @Description: 防抖自定义指令
 */
import _ from 'lodash';

import { App, Directive, DirectiveBinding } from "vue"

const vDebounce: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    console.log(el, binding, 'console.log(el, binding)')
    el.addEventListener('click', () => {
      console.log(el, binding)
    })
  }
}

// 定义的名称为debounce 使用方式为v-debounce
export default (app: App<Element>) => {
  app.directive('debounce', vDebounce)
}