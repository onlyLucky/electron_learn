/*
 * @Author: fg
 * @Date: 2023-01-05 15:46:34
 * @LastEditors: fg
 * @LastEditTime: 2023-01-05 17:50:06
 * @Description: 会议详情
 */
import { Drawer } from "view-ui-plus";
import { PropType, Teleport } from "vue";
import style from "./style.module.less";

let isShowDetail = ref<boolean>(false);
interface Props {
  modelValue: boolean;
}
export const MDetail = defineComponent({
  components: {
    Drawer,
  },
  props: {
    modelValue: {
      type: Object as PropType<Props["modelValue"]>, //Props["search"]
      default: false,
    },
  },
  // 这里居然还可以使用data method
  setup(props, ctx) {
    // const { expose, emit } = ctx;
    // 导出属性，ref 中可以使用 ,属性需要响应式的数据
    return {
      isShowDetail,
    };
  },
  render() {
    // DetailModel
    return (
      <Teleport to="#DetailModel">
        <div class={style.detailModel}></div>
        <div class={style.detail}>test</div>
      </Teleport>
    );
  },
});
