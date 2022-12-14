/*
 * @Author: fg
 * @Date: 2022-12-14 17:24:52
 * @LastEditors: fg
 * @LastEditTime: 2022-12-14 19:29:53
 * @Description: content
 */
import { ref } from "vue";
import style from "./style.module.less";
import { Tooltip } from "view-ui-plus";

type Props = {
  isShowChangeSize: boolean;
};

let smallSizeFlag = ref<boolean>(true);

console.log(style, "style");

const SystemOpt = (props: Props) => {
  return (
    <div class={style.sOpt_Box}>
      <div class={style.sIconBox}>2</div>
      {smallSizeFlag.value ? (
        <Tooltip content="还原">
          <div class={style.sIconBox}>1</div>
        </Tooltip>
      ) : (
        <div class={style.sIconBox}>2</div>
      )}
      <div class={style.sIconBox}>2</div>
    </div>
  );
};

export default SystemOpt;
