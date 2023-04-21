/*
 * @Author: fg
 * @Date: 2023-04-13 10:44:46
 * @LastEditors: fg
 * @LastEditTime: 2023-04-21 18:01:49
 * @Description: 设置处理逻辑
 */
/* 
  备份config data（用于比较修改数据，筛选出来更改的数据--检测是否需要系统重启）
  数据处理
  数据储存更改
  是否需要系统重启，发送消息更改
*/
import hdObj from "./handleData";
import { ipcRenderer } from "electron";
export const useSetting = () => {
  // 备份数据
  let copyData = reactive(hdObj.getConfigItem());
  // 更改过后的数据（应用存活的状态下，config更改数据）
  let configData = reactive<any>({})
  let menuData = reactive<any[]>([]);
  let searchData = reactive<any[]>([]);
  // 是否需要重新加载
  let isNeedReload = ref<boolean>(false)

  console.log(copyData, 'menuData', menuData)
  // 检测json对象 配置 更新
  const compareJson: () => any[] = () => {
    let res: any[] = []
    menuData.map((menu, menuIndex) => {
      menu.children.map((item: any, index: number) => {
        if (copyData[item.parent] && copyData[item.parent][item.name]) {
          if (copyData[item.parent][item.name].value != item.value) {
            res.push(item)
          }
        }
      })
    })
    return res
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
  // 计算备份数据处理
  const computedUpdateConfig = () => {
    isNeedReload.value = false
    let tempDiff: any[] = compareJson()
    if (tempDiff.length > 0) {
      tempDiff.map((item: any) => {
        let tempIndex = configData[item.parent][item.name].index
        configData[item.parent][item.name].value = item.value
        configData[item.parent].children[tempIndex] = item
        if (item.isNeedReload) {
          isNeedReload.value = true
        }
      })
    }
    console.log(copyData, 'copyData')
  }

  const toLine: (data: any[]) => any[] = (data) => {
    return data.reduce(
      (arr, { name, description, children = [], show = true }) => {
        let temp: any[] = show ? [{ name, description }] : [];
        return arr.concat(temp, toLine(children))
      },
      []
    )
  }

  // 取消
  const handleCancel = () => {
    ipcRenderer.send(
      "set_global",
      ["system", "config"],
      JSON.stringify({
        data: copyData,
        isNeedUpload: isNeedReload.value,
      })
    );
  }
  // 重启
  const handleReload = () => {
    ipcRenderer.send(
      "set_global",
      ["system", "config"],
      JSON.stringify({
        data: configData,
        isNeedUpload: isNeedReload.value,
      })
    );
  }

  onMounted(async () => {
    const result = await ipcRenderer.invoke("get_global", ["system", "config"]);
    Object.assign(configData, result.data)
    isNeedReload.value = result.isNeedUpload
    let key: any
    for (key in configData) {
      if (configData.hasOwnProperty(key)) {
        if ((configData[key] as any).show) {
          let temp = JSON.parse(JSON.stringify(configData[key]))
          temp.select = false
          temp.hover = false
          menuData.push(temp)
        }
      }
    }
    menuData[0].select = true;
    Object.assign(searchData, toLine(menuData))
  })


  return {
    menuData,
    searchData,
    copyData,
    isNeedReload,
    compareJson,
    computedUpdateConfig,
    computedSearchIndex,
    handleCancel,
    handleReload
  }
}