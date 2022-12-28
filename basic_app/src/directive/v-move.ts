/*
 * @Author: fg
 * @Date: 2022-12-28 09:51:11
 * @LastEditors: fg
 * @LastEditTime: 2022-12-28 10:00:41
 * @Description: v-move 拖拽自定义指令
 */
import { App, Directive, DirectiveBinding } from "vue"

const vMove: Directive = {
  mounted(el: HTMLElement) {
    const mouseDown = (e: MouseEvent) => {
      // console.log(e.clientX, e.clientY, "-----起始", el.offsetLeft);
      let X = e.clientX - el.offsetLeft;
      let Y = e.clientY - el.offsetTop;
      console.log('test---')
      const move = (e: MouseEvent) => {
        el.style.left = e.clientX - X + "px";
        el.style.top = e.clientY - Y + "px";
        // console.log(e.clientX, e.clientY, "---改变");
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", move);
      });
    };
    el.addEventListener("mousedown", mouseDown);
  },
}

// 需要绝对定位 absolute fixed
export default (app: App<Element>) => {
  app.directive('move', vMove)
}