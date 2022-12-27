/*
 * @Author: fg
 * @Date: 2022-12-27 15:01:42
 * @LastEditors: fg
 * @LastEditTime: 2022-12-27 15:55:41
 * @Description: 防抖自定义指令
 */
import _ from 'lodash';

import { App, Directive, DirectiveBinding } from "vue"

const vDebounce: Directive = {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    el.addEventListener('click', _.debounce(function () { binding.value() }, 300))
  }
}

// 定义的名称为debounce 使用方式为v-debounce
export default (app: App<Element>) => {
  app.directive('debounce', vDebounce)
}