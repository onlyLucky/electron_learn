/*
 * @Author: fg
 * @Date: 2023-04-13 10:44:46
 * @LastEditors: fg
 * @LastEditTime: 2023-04-19 15:24:33
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
  // 备份数据
  let copyData = reactive(hdObj.getConfigItem());
  let menuData = reactive(hdObj.menu);
  let searchData = reactive(hdObj.mList);

  console.log(menuData, 'menuData')
  // 检测json对象 配置 更新
  const compareJson = () => {
    let res: any[] = []
    menuData.map((menu, menuIndex) => {
      menu.children.map((item: any, index: number) => {
        if (copyData[item.parent][item.name].value != item.value) {
          res.push(item)
        }
      })
    })
  }
  // 计算当前点击搜索配置项属于在menuData中的的下标
  const computedSearchIndex = (searchKey: string) => {
    let res: number[] = []
    menuData.map((item, index) => {
      // 判断当前是否为主标题
      if (item.name === searchKey) {
        res = [index]
        return index
      } else {
        if (item.hasOwnProperty(searchKey)) {
          res = [index, item[searchKey].index]
          return index
        }
      }

    })
    console.log(res, 'computedSearchIndex')
    return res
  }


  return {
    menuData,
    searchData,
    copyData,
    computedSearchIndex
  }
}