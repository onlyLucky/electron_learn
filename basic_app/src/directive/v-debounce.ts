/*
 * @Author: fg
 * @Date: 2022-12-27 15:01:42
 * @LastEditors: fg
 * @LastEditTime: 2023-01-04 14:40:51
 * @Description: 防抖自定义指令
 */
import _ from 'lodash';

import { App, Directive, DirectiveBinding } from "vue"

let deHandle: any;
const vDebounce: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    deHandle = _.debounce(function () { binding.value() }, 300)
    el.addEventListener('click', deHandle)
  },
  unmounted() {
    deHandle.cancel()
  }
}

// 定义的名称为debounce 使用方式为v-debounce
export default (app: App<Element>) => {
  app.directive('debounce', vDebounce)
}