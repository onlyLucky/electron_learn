/*
 * @Author: fg
 * @Date: 2022-12-14 17:24:52
 * @LastEditors: fg
 * @LastEditTime: 2022-12-15 13:27:41
 * @Description: content
 */
import { ref } from "vue";
import style from "./style.module.less";
import { Tooltip } from "view-ui-plus";
import { ipcRenderer } from "electron";

// icons (require 方式别名配置读取不到)
import icon_close from "@/assets/icons/system/icon_sys_close.png";
import icon_max from "@/assets/icons/system/icon_sys_maximize.png";
import icon_min from "@/assets/icons/system/icon_sys_minimize.png";
import icon_restore from "@/assets/icons/system/icon_sys_restore.png";

type Props = {
  isShowChangeSize: boolean;
};

let smallSizeFlag = ref<boolean>(true);

const onMinTap = () => {
  ipcRenderer.send("window_min");
};

const onMaxTap = (flag) => {
  console.log(flag, "flag");
  smallSizeFlag.value = flag;
  ipcRenderer.send("window_max");
};
const onCloseTap = () => {
  ipcRenderer.send("window_close");
};

const SystemOpt = (props: Props) => {
  return (
    <div class={style.sOpt_Box}>
      <div class={style.sIconBox} onClick={onMinTap}>
        <img src={icon_min} alt="" />
      </div>
      {smallSizeFlag.value ? (
        <div class={style.sIconBox} onClick={onMaxTap.bind(this, false)}>
          <img src={icon_max} alt="" />
        </div>
      ) : (
        <Tooltip content="还原">
          <div class={style.sIconBox} onClick={onMaxTap.bind(this, true)}>
            <img src={icon_restore} alt="" />
          </div>
        </Tooltip>
      )}
      <div class={style.sIconBox} onClick={onCloseTap}>
        <img src={icon_close} alt="" />
      </div>
    </div>
  );
};

export default SystemOpt;
