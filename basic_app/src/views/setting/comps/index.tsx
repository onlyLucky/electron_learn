/*
 * @Author: fg
 * @Date: 2023-01-16 10:10:33
 * @LastEditors: fg
 * @LastEditTime: 2023-01-16 10:13:04
 * @Description: content
 */
export const MListTable = defineComponent({
  components: {},
  props: {},
  // 这里居然还可以使用data method
  setup(props, ctx) {
    // const { expose, emit } = ctx;
    // 监听搜索项的改变
    // 导出属性，ref 中可以使用 ,属性需要响应式的数据
    return {};
  },
  render() {
    return <p>hello</p>;
  },
  unmounted() {},
});
