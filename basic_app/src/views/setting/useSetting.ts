/*
 * @Author: fg
 * @Date: 2023-04-13 10:44:46
 * @LastEditors: fg
 * @LastEditTime: 2023-04-13 11:30:36
 * @Description: 设置处理逻辑
 */
/* 
  备份config data（用于比较修改数据，筛选出来更改的数据--检测是否需要系统重启）
  数据处理
  数据储存更改
  是否需要系统重启，发送消息更改
*/
import hdObj from "./handleData";
export const useSetting = () => {
  let copyData = reactive(hdObj.getConfigItem());
  let menuData = reactive(hdObj.menu);
  let searchData = reactive(hdObj.mList);
  return {
    menuData,
    searchData,
    copyData
  }
}