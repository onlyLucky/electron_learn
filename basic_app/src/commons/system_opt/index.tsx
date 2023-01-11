/*
 * @Author: fg
 * @Date: 2022-12-14 17:24:52
 * @LastEditors: fg
 * @LastEditTime: 2023-01-11 14:13:45
 * @Description: content
 */
import { ref } from "vue";
import style from "./style.module.less";
import { Tooltip } from "view-ui-plus";
import { ipcRenderer } from "electron";
import SvgIcon from "../SvgIcon/index.vue";

// icons (require 方式别名配置读取不到)
/* import icon_close from "@/assets/icons/system/icon_sys_close.png";
import icon_max from "@/assets/icons/system/icon_sys_maximize.png";
import icon_min from "@/assets/icons/system/icon_sys_minimize.png";
import icon_restore from "@/assets/icons/system/icon_sys_restore.png"; */

interface Props {
  isShowChangeSize?: boolean;
  isShowMinSize?: boolean;
  color?: string;
}

let smallSizeFlag = ref<boolean>(true);

const onMinTap = () => {
  ipcRenderer.send("window_min");
};

const onMaxTap = (flag: boolean) => {
  smallSizeFlag.value = flag;
  ipcRenderer.send("window_max");
};
const onCloseTap = () => {
  ipcRenderer.send("window_close");
};

const SystemOpt = (props: Props = { isShowChangeSize: true }) => {
  // 上面给默认值的方式不接受，不知道为什么tsx
  if (props.isShowChangeSize == undefined) {
    props.isShowChangeSize = true;
  }
  if (props.isShowMinSize == undefined) {
    props.isShowMinSize = true;
  }
  if (props.color == undefined) {
    props.color = "var(--fontColor)";
  }
  return (
    <div class={style.sOpt_Box}>
      <div class={style.sIconBox} onClick={onMinTap}>
        {props.isShowMinSize ? (
          <SvgIcon
            style={{ width: "18px", height: "18px" }}
            iconName="icon-2zuixiaohua-2"
            color={props.color}
          ></SvgIcon>
        ) : (
          ""
        )}
        {/* <img src={icon_min} alt="" /> */}
      </div>
      {props.isShowChangeSize ? (
        smallSizeFlag.value ? (
          <div class={style.sIconBox} onClick={onMaxTap.bind(this, false)}>
            <SvgIcon
              iconName="icon-zuidahua1"
              style={{ width: "20px", height: "20px" }}
              color="var(--fontColor)"
            ></SvgIcon>
            {/* <img src={icon_max} alt="" /> */}
          </div>
        ) : (
          <Tooltip content="还原">
            <div class={style.sIconBox} onClick={onMaxTap.bind(this, true)}>
              <SvgIcon
                iconName="icon-chuangkouhuanyuan"
                style={{ width: "20px", height: "20px" }}
                color={props.color}
              ></SvgIcon>
              {/* <img src={icon_restore} alt="" /> */}
            </div>
          </Tooltip>
        )
      ) : (
        ""
      )}

      <div class={style.sIconBox} onClick={onCloseTap}>
        <SvgIcon
          iconName="icon-guanbi1"
          style={{ width: "16px", height: "16px" }}
          color={props.color}
        ></SvgIcon>
        {/* <img src={icon_close} alt="" /> */}
      </div>
    </div>
  );
};

export default SystemOpt;
