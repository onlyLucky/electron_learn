/*
 * @Author: fg
 * @Date: 2023-03-07 11:27:17
 * @LastEditors: fg
 * @LastEditTime: 2023-03-08 09:45:23
 * @Description: canvas 绘制
 */
import { XmlToJson } from '@/libs/xml2json.js'
const fs = require('fs');

export type TypeCanvasConfig = {
  duration: number,// 时长 s
  currentTime: number,// 当前播放进度时间
  currentPath: number,//当前绘制笔画的index
  currentClear: number,//当前绘制处于第几处清除位置
}

const pathType = {
  PENU: 'Penu', //自由画
  RECT: 'Rect', //矩形
  OVAL: 'Oval', //椭圆
  LINE: 'Line', //直线
}
const optionType = {
  CLEAR: 'Clear', //清除
  UNDO: 'Undo', //撤销
  REDO: 'Redo', //重绘
  CHANGE_MOUSE: 'ChangeMouse', //改变鼠标编号
  CHANGE_STROKE: 'ChangeStroke', //改变鼠标笔触
  CHANGE_COLOR: 'ChangeColor', //改变颜色
  CHANGE_PAINT: 'ChangePaint', //改变画笔
  CHANGE_NAME: 'ChangeName', //改变名字
  MENU_SHOW: 'ShowMenu', //隐藏菜单
  MENU_HIDE: 'HideMenu', //隐藏菜单
}

export const useCanvas = () => {
  const FPS = 25;
  let timer = null;
  // canvas 配置
  let canvasConfig = reactive<TypeCanvasConfig>({
    duration: 0,
    currentTime: 0,
    currentPath: -1,
    currentClear: 0
  })
  // 用户列表
  let userList = ref<any[]>([])
  // path列表
  let pathList = ref<any[]>([])
  //  clear 数据 分段数据
  let pathClearList = ref<any[]>([])
  // json 数据
  let jsonData = reactive<any>({})
  const doCanvas = () => {
    console.log('doCanvas')
  }
  // 解析数据
  const parseXmlFile = (path: string) => {

    let xmlData = fs.readFileSync(path, 'utf-8');
    jsonData = (XmlToJson.parse(xmlData, {
      textKey: 'value'
    }) as any).dcf;
    // 数据初始化
    canvasConfig.duration = Number(jsonData.length)
    let tempPathList: any[] = []
    let tempPathClearList: any[] = []
    jsonData.pathbean.pathbean.map((item: any) => {
      if (item.mSerPath) {
        if (Object.prototype.toString.call(item.mSerPath.mTimes.long) != '[object Array]') {
          item.mSerPath.mTimes.long = [item.mSerPath.mTimes.long]
        }
        item.endTime = item.mSerPath.mTimes.long[item.mSerPath.mTimes.long.length - 1]
      } else {
        item.endTime = Number(item.time) + (1000 / FPS) * 2
      }
      switch (item.type) {
        case pathType.PENU:
          tempPathList.push({
            ...item
          })
          break;
        case pathType.RECT:
          tempPathList.push({
            ...item
          })
          break;
        case pathType.OVAL:
          tempPathList.push({
            ...item
          })
          break;
        case pathType.LINE:
          tempPathList.push({
            ...item
          })
          break;
        case optionType.UNDO:
          tempPathList.push({
            ...item
          })
          break;
        case optionType.REDO:
          tempPathList.push({
            ...item
          })
          break;
        case optionType.CLEAR:
          tempPathClearList.push({
            paths: tempPathList,
            start: item.time
          })
          tempPathList = []
          break;
        default:
          break;
      }
    })
    // 最后一笔clear 数据处理
    if (tempPathClearList.length > 0) {
      tempPathClearList.push({
        path: tempPathList,
        start: tempPathList.length > 0 ? tempPathList[0].time : tempPathClearList[tempPathClearList.length - 1].start
      })
    } else {
      tempPathClearList.push({
        path: tempPathList,
        start: tempPathList.length > 0 ? tempPathList[0].time : 0
      })
    }
    pathClearList.value = tempPathClearList
    pathList.value = tempPathList
    getCurrentPathClear()

    // 人员数据初始化
    let tempUserList: any[] = []
    jsonData.UserList.user.map((item: any) => {
      tempUserList.push({
        username: item.name,
        active: item.isShow == 1 ? true : item.isShow == 2 ? false : null,
        id: item.number
      })
    })
    userList.value = tempUserList
    console.log(userList, 'jsonData')
    console.log(tempPathClearList, tempPathList, 'data')
  }

  // 获取当前处于第几个清除点
  const getCurrentPathClear = () => {
    let temp: any[] = []
    pathClearList.value.map(item => {
      temp.push(item.start)
    })
    canvasConfig.currentClear = getTimeIndex(temp, canvasConfig.currentTime)
    // console.log(JSON.stringify(temp),this.currentTimer)
    // this.pathList = this.pathClearList[this.currentClear].paths
  }

  // 获取时间处于
  const getTimeIndex = (timeArr: number[], time: any) => {
    let timeIndex: number = -1;
    if (timeArr.length > 0) {
      if (time >= timeArr[timeArr.length - 1]) {
        return timeArr.length - 1
      }
      // console.log(timeArr,time)
      for (let index in timeArr) {
        if (Number(timeArr[index]) >= time) {
          timeIndex = Number(index);
          break;
        }
      }
    }

    return timeIndex;
  }
  // 开始绘制
  const startPath = () => {
    let fps = 1000 / FPS;
    timer = setInterval(() => {
      canvasConfig.currentTime = canvasConfig.currentTime + fps
      // 判断当前处于第几段的clear
      if (pathClearList.value.length > 1) {
        if (canvasConfig.currentClear <= pathClearList.value.length - 1) {
          handleUserPath();
        }
      }
    }, fps)
  }

  // 处理用户选择
  const handleUserPath = () => {
    let tempIds = userList.value.filter((item: any) => {
      if (item.active) {
        return item.id
      }
    }).map(item => item.id)
    let temp: any[] = []
    pathClearList.value[canvasConfig.currentClear].paths.map((item: any) => {
      if (tempIds.indexOf(item.number) !== -1) {
        temp.push(item)
      }
    })
    pathList.value = temp;
  }


  /* setTimeout(() => {
    userList[0].active = false;
    console.log('setTimeout 3s--', userList)
  }, 3000) */

  watchEffect(doCanvas)
  return { canvasConfig, userList, parseXmlFile }
}