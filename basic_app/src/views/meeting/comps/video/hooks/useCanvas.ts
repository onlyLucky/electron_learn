/*
 * @Author: fg
 * @Date: 2023-03-07 11:27:17
 * @LastEditors: fg
 * @LastEditTime: 2023-03-11 15:24:26
 * @Description: canvas 绘制
 */
import { XmlToJson } from '@/libs/xml2json.js'
import { TypeVideoConfig } from "./useVideo"
const fs = require('fs');
import { Message } from "view-ui-plus"
export type TypeCanvasConfig = {
  duration: number,// 时长 s
  currentTime: number,// 当前播放进度时间
  currentPath: number,//当前绘制笔画的index
  currentClear: number,//当前绘制处于第几处清除位置
  width: number,//canvas width
  height: number,//canvas height
  ratio: number,//canvas ratio
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
  // CanvasRenderingContext2D
  const FPS = 25;
  let timer: any = null;
  let ctx: CanvasRenderingContext2D;
  // canvas 配置
  let canvasConfig = reactive<TypeCanvasConfig>({
    duration: 0,
    currentTime: 0,
    currentPath: -1,
    currentClear: 0,
    width: 0,
    height: 0,
    ratio: 1
  })
  // 用户列表
  let userList = ref<any[]>([])
  // path列表
  let pathList = ref<any[]>([])
  //  clear 数据 分段数据
  let pathClearList = ref<any[]>([])
  // json 数据
  let jsonData = reactive<any>({})
  // 当前撤销的是第几个,放置到数组里面
  let undoIndexs = ref<any[]>([])
  // 当前是否为最后一笔
  let isEndPath = ref<boolean>(true)
  const doCanvas = () => {
    console.log('doCanvas')
    clearInterval(timer)
  }
  // 解析数据
  const parseXmlFile = (path: string) => {

    let xmlData = fs.readFileSync(path, 'utf-8');
    jsonData = (XmlToJson.parse(xmlData, {
      textKey: 'value'
    }) as any).dcf;
    if (!jsonData) {
      Message.error('视频批注文件内容解析失败');
      return false;
    }
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
        paths: tempPathList,
        start: tempPathList.length > 0 ? tempPathList[0].time : tempPathClearList[tempPathClearList.length - 1].start
      })
    } else {
      tempPathClearList.push({
        paths: tempPathList,
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
    let tempType: any[] = []
    tempPathList.map(item => {
      tempType.push(item.type)
    })
    // console.log(userList, 'jsonData')
    // console.log(tempPathClearList, tempPathList, 'data')
  }

  // 获取当前时间处于第几段
  const getCurrentPath = () => {
    let temp: any[] = [];
    pathList.value.map(item => {
      temp.push(item.time)
    })
    if (canvasConfig.currentTime < temp[0]) {
      canvasConfig.currentPath = -1
    } else {
      canvasConfig.currentPath = Number(getTimeIndex(temp, canvasConfig.currentTime)) - 1
    }
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
      // console.log(`${canvasConfig.currentTime}: ${canvasConfig.currentClear}-${canvasConfig.currentPath}`, 'canvasConfig.currentPath')
      // 判断当前处于第几段的clear
      if (pathClearList.value.length > 1) {
        if (canvasConfig.currentClear <= pathClearList.value.length - 1) {
          handleUserPath();
        } else {
          if (canvasConfig.currentTime >= pathClearList.value[canvasConfig.currentClear].start) {
            cleanAll()
            canvasConfig.currentClear = canvasConfig.currentClear + 1
            canvasConfig.currentPath = 0
            handleUserPath()
          }
        }
      }
      // 空数组判断
      if (pathList.value.length > 0 && canvasConfig.currentPath == -1) {
        getCurrentPath()
      }
      if (pathList.value.length > 0 && canvasConfig.currentPath >= 0) {
        // 需要绘制当前path
        let epathTime = pathList.value[canvasConfig.currentPath].endTime
        // 暂存
        let tempUndoIndexs = undoIndexs.value
        // 判断当前时间是否处于当前绘制的时间段中
        if (canvasConfig.currentTime >= pathList.value[canvasConfig.currentPath].time && (canvasConfig.currentTime < epathTime)) {
          // 进行绘制
          handlePathOpt()
          // 判断当前这一笔是否画完
        } else if (canvasConfig.currentPath < pathList.value.length - 1 && canvasConfig.currentTime >= pathList.value[canvasConfig.currentPath + 1].time) {
          // 判定当前是否为撤销
          if (canvasConfig.currentPath > 0 && pathList.value[canvasConfig.currentPath].type == optionType.UNDO) {
            // 判定上一个是否为撤销
            if (pathList.value[canvasConfig.currentPath - 1].type === optionType.UNDO) {
              if (undoIndexs.value.length > 0 && undoIndexs.value.indexOf(undoIndexs.value[undoIndexs.value.length - 1] - 1) == -1) {
                tempUndoIndexs.push(undoIndexs.value[undoIndexs.value.length - 1] - 1)
              }
            } else {
              if (undoIndexs.value.indexOf(canvasConfig.currentPath - 1) == -1) {
                tempUndoIndexs.push(canvasConfig.currentPath - 1)
              }
            }
          }
          // 判定当前是否为恢复上一笔
          if (pathList.value[canvasConfig.currentPath].type == optionType.REDO) {
            if (undoIndexs.value.length > 0) {
              tempUndoIndexs.splice(undoIndexs.value.length - 1, 1)
            }
          }
          undoIndexs.value = tempUndoIndexs
          canvasConfig.currentPath = Number(canvasConfig.currentPath + 1)
        } else {
          // 执行是否为最后一笔
          if (isEndPath.value && canvasConfig.currentPath == pathList.value.length - 1) {
            isEndPath.value = false;
            // 判定当前是否为撤销
            if (pathList.value[canvasConfig.currentPath].type == optionType.UNDO) {
              // 判断上一个是否为撤销
              if (pathList.value[canvasConfig.currentPath - 1].type == optionType.UNDO) {
                if (undoIndexs.value.length > 0 && undoIndexs.value.indexOf(undoIndexs.value[undoIndexs.value.length - 1] - 1) == -1) {
                  tempUndoIndexs.push(undoIndexs.value[undoIndexs.value.length - 1] - 1)
                }
              } else {
                if (undoIndexs.value.indexOf(canvasConfig.currentPath - 1) == -1) {
                  tempUndoIndexs.push(canvasConfig.currentPath - 1)
                }
              }
            }
            // 判定当前是否为恢复上一笔
            if (pathList.value[canvasConfig.currentPath].type == optionType.REDO) {
              if (undoIndexs.value.length > 0) {
                tempUndoIndexs.splice(undoIndexs.value.length - 1, 1)
              }
            }
            undoIndexs.value = tempUndoIndexs
          }
          // 最后一笔的绘制
          handlePathOpt()
        }
      }
    }, fps)
  }

  const pausePath = () => {
    clearInterval(timer)
  }

  // 绘制操作执行方法
  const handlePathOpt = () => {
    // 先清除
    cleanAll();
    // 判断当前是否为第一笔
    if (canvasConfig.currentPath == 0) {
      handlePath(0)
    } else {
      for (let i = 0; i <= canvasConfig.currentPath; i++) {
        // 判断是否有撤销
        if (undoIndexs.value.indexOf(i) !== -1) {
          continue
        }
        handlePath(i)
      }
    }
  }

  // 路径类型类别处理
  const handlePath = (index: number) => {
    switch (pathList.value[index].type) {
      case pathType.PENU:
        handlePenu(index)
        break;
      case pathType.RECT:
        handleRect(index)
        break;
      case pathType.OVAL:
        handleOval(index)
        break;
      case pathType.LINE:
        handleLine(index)
        break;
      default:
        break;
    }
  }

  // 处理自由画
  const handlePenu = (current: number) => {
    let path = pathList.value[current].mSerPath
    ctx.beginPath();
    // 画笔样式预设
    ctx.lineWidth = pathList.value[current].size * canvasConfig.ratio
    if (Object.prototype.toString.call(path.mTimes.long) != '[object Array]') {
      path.mTimes.long = [path.mTimes.long]
    }
    // 判断current 是否与当前笔数相等
    if (current == canvasConfig.currentPath) {
      let index = Number(getTimeIndex(path.mTimes.long, canvasConfig.currentTime)) - 1
      if (index != -1) {
        ctx.strokeStyle = pathList.value[current].color;
        for (let i = 0; i < index; i++) {
          let x = Number(path.mPoints.SerPoint[i].x) * canvasConfig.ratio
          let y = Number(path.mPoints.SerPoint[i].y) * canvasConfig.ratio
          if (i == 0) {

            ctx.moveTo(x, y);
          } else {
            let prevX = Number(path.mPoints.SerPoint[i - 1].x) * canvasConfig.ratio
            let prevY = Number(path.mPoints.SerPoint[i - 1].y) * canvasConfig.ratio
            // this.ctx.lineTo(x, y);
            ctx.quadraticCurveTo(prevX, prevY, (x + prevX) / 2, (y + prevY) / 2)
          }
        }
        ctx.stroke();
        ctx.closePath();
      }
    } else {
      ctx.strokeStyle = pathList.value[current].color;
      if (Object.prototype.toString.call(path.mPoints.SerPoint) !== '[object Array]') {
        path.mPoints.SerPoint = [path.mPoints.SerPoint]
      }
      path.mPoints.SerPoint.map((item: any, index: number) => {
        let x = Number(item.x) * canvasConfig.ratio
        let y = Number(item.y) * canvasConfig.ratio
        // let x1 = Number(path.mPoints.SerPoint[index+1].x)* this.screenBili
        // let y1 = Number(path.mPoints.SerPoint[index+1].y)* this.screenBili
        let t = 1
        if (index == 0) {
          ctx.moveTo(x, y);
        } else {
          let prevX = Number(path.mPoints.SerPoint[index - 1].x) * canvasConfig.ratio
          let prevY = Number(path.mPoints.SerPoint[index - 1].y) * canvasConfig.ratio
          // this.ctx.lineTo(x, y);
          ctx.quadraticCurveTo(prevX, prevY, (x + prevX) / 2, (y + prevY) / 2)
        }
        // 添加贝塞尔曲线
        // let cx = Math.pow(1-t, 2) * x + 2 * t * (1-t) * cx + Math.pow(t, 2) * x2
        // this.ctx.moveTo(x, y);
        // quadraticCurveTo(cx, cy, x1, y1);
      })
      ctx.stroke();
      ctx.closePath();
    }
  }
  // 处理矩形
  const handleRect = (current: number) => {
    let path = pathList.value[current].mSerPath;
    ctx.beginPath();
    //画笔样式预设
    ctx.lineWidth = pathList.value[current].size * canvasConfig.ratio;
    ctx.strokeStyle = pathList.value[current].color;
    if (Object.prototype.toString.call(path.mTimes.long) != '[object Array]') {
      path.mTimes.long = [path.mTimes.long]
    }
    // 判断current 是否与当前笔数相等
    if (current == canvasConfig.currentPath) {
      let index = Number(getTimeIndex(path.mTimes.long, canvasConfig.currentTime)) - 1
      if (index != -1) {
        let x = Number(path.mPoints.SerPoint[0].x) * canvasConfig.ratio
        let y = Number(path.mPoints.SerPoint[0].y) * canvasConfig.ratio
        let width = Number(path.mPoints.SerPoint[index].x) * canvasConfig.ratio - x
        let height = Number(path.mPoints.SerPoint[index].y) * canvasConfig.ratio - y
        ctx.strokeRect(x, y, width, height)
        ctx.closePath();
      }

    } else {
      let x = Number(path.mPoints.SerPoint[0].x) * canvasConfig.ratio
      let y = Number(path.mPoints.SerPoint[0].y) * canvasConfig.ratio
      let width = Number(path.mPoints.SerPoint[path.mPoints.SerPoint.length - 1].x) * canvasConfig.ratio - x
      let height = Number(path.mPoints.SerPoint[path.mPoints.SerPoint.length - 1].y) * canvasConfig.ratio - y
      ctx.strokeRect(x, y, width, height)
      ctx.closePath();
    }
  }
  // 处理直线
  const handleLine = (current: number) => {
    let path = pathList.value[current].mSerPath;
    // 画笔样式预设
    ctx.lineWidth = pathList.value[current].size * canvasConfig.ratio;
    ctx.strokeStyle = pathList.value[current].color;
    // 判断current 是否与当前笔数相等
    let x, y, x1, y1;
    if (current == canvasConfig.currentPath) {
      let index = Number(getTimeIndex(path.mTimes, canvasConfig.currentTime)) - 1
      if (index != -1) {
        x = Number(path.mPoints.SerPoint[0].x) * canvasConfig.ratio
        y = Number(path.mPoints.SerPoint[0].y) * canvasConfig.ratio
        x1 = Number(path.mPoints.SerPoint[index].x) * canvasConfig.ratio
        y1 = Number(path.mPoints.SerPoint[index].y) * canvasConfig.ratio
        ctx.beginPath();
        ctx.moveTo(x, y)
        ctx.lineTo(x1, y1)
        ctx.stroke();
        ctx.closePath();
      }

    } else {
      x = Number(path.mPoints.SerPoint[0].x) * canvasConfig.ratio
      y = Number(path.mPoints.SerPoint[0].y) * canvasConfig.ratio
      x1 = Number(path.mPoints.SerPoint[path.mPoints.SerPoint.length - 1].x) * canvasConfig.ratio
      y1 = Number(path.mPoints.SerPoint[path.mPoints.SerPoint.length - 1].y) * canvasConfig.ratio
      ctx.beginPath();
      ctx.moveTo(x, y)
      ctx.lineTo(x1, y1)
      ctx.stroke();
      ctx.closePath();
    }
  }
  // 椭圆绘制
  const handleOval = (current: number) => {
    let path = pathList.value[current].mSerPath;
    // 画笔样式预设
    ctx.lineWidth = pathList.value[current].size * canvasConfig.ratio;
    ctx.strokeStyle = pathList.value[current].color;
    // 判断current 是否与当前笔数相等;
    let rx, ry, r1, r2;
    let x0 = Number(path.mPoints.SerPoint[0].x) * canvasConfig.ratio;
    let y0 = Number(path.mPoints.SerPoint[0].y) * canvasConfig.ratio;
    if (current == canvasConfig.currentPath) {
      let index = Number(getTimeIndex(path.mTimes, canvasConfig.currentTime)) - 1
      if (index !== -1) {
        let x1 = Number(path.mPoints.SerPoint[index].x) * canvasConfig.ratio
        let y1 = Number(path.mPoints.SerPoint[index].y) * canvasConfig.ratio
        rx = x0 < x1 ? x0 + (x1 - x0) / 2 : x1 + (x0 - x1) / 2
        ry = y0 < x1 ? y0 + (y1 - y0) / 2 : y1 + (y0 - y1) / 2
        r1 = Math.abs((x1 - x0) / 2)
        r2 = Math.abs((y1 - y0) / 2)
        ctx.beginPath();
        ctx.ellipse(rx, ry, r1, r2, 0, 0, Math.PI * 2)
        ctx.stroke();
        ctx.closePath();
      }

    } else {
      let x1 = Number(path.mPoints.SerPoint[path.mPoints.SerPoint.length - 1].x) * canvasConfig.ratio
      let y1 = Number(path.mPoints.SerPoint[path.mPoints.SerPoint.length - 1].y) * canvasConfig.ratio
      rx = x0 < x1 ? x0 + (x1 - x0) / 2 : x1 + (x0 - x1) / 2
      ry = y0 < x1 ? y0 + (y1 - y0) / 2 : y1 + (y0 - y1) / 2
      r1 = Math.abs((x1 - x0) / 2)
      r2 = Math.abs((y1 - y0) / 2)
      ctx.beginPath();
      ctx.ellipse(rx, ry, r1, r2, 0, 0, Math.PI * 2)
      ctx.stroke();
      ctx.closePath();
    }
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
    console.log(pathList.value, 'pathList.value')
  }

  // 清空
  const cleanAll = () => {
    ctx.clearRect(0, 0, canvasConfig.width, canvasConfig.height)
  }

  // 更新ctx对象
  const uploadCtx = (canvas: HTMLCanvasElement) => {
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  }
  // 更新canvas size
  const uploadCanvasSize = (w: number, h: number) => {
    canvasConfig.width = w;
    canvasConfig.height = h;
  }

  // 获取undoIndexs处理
  const getUndoIndex = () => {
    let temp: any[] = []
    let res: any[] = []
    temp = pathList.value.slice(0, canvasConfig.currentPath + 1)
    temp.map((item: any, index: number) => {
      if (index > 0 && temp[index - 1].type == optionType.UNDO) {
        // 判断上一步是否为undo
        if (res.length > 0 && temp[index - 1].type == optionType.UNDO) {
          res.push(res[res.length - 1] - 1)
        } else {
          res.push(index - 1)
        }
      }
    })
    undoIndexs.value = res
  }

  // 跳转
  const seekToCanvas = (videoConfig: TypeVideoConfig) => {
    canvasConfig.currentTime = Math.floor(videoConfig.currentTime * 1000)
    handleCtxPlay(videoConfig)
    /* setTimeout(() => {
      // startPath()
    }, 200) */
  }

  // 处理人员选择
  const userDataChange = (users: any[], videoConfig: TypeVideoConfig) => {
    userList.value = users
    handleCtxPlay(videoConfig)
  }

  // 处理canvas播放处理
  const handleCtxPlay = (videoConfig: TypeVideoConfig) => {
    cleanAll()
    if (videoConfig.playing) {
      pausePath()
    }
    getCurrentPathClear()
    handleUserPath()
    getCurrentPath()
    getUndoIndex()
    // console.log(undoIndexs.value, 'undoIndexs.value', `${canvasConfig.currentTime}: ${canvasConfig.currentClear}-${canvasConfig.currentPath}`)
    if (pathList.value.length > 0) {
      handlePathOpt()
    }
    if (videoConfig.playing) {
      startPath()
    }
  }
  const onPathEnd = () => {
    clearInterval(timer)
    let temp = {
      duration: 0,
      currentTime: 0,
      currentPath: -1,
      currentClear: 0,
      width: 0,
      height: 0,
      ratio: 1
    }
    Object.assign(canvasConfig, temp)
  }

  /* setTimeout(() => {
    userList[0].active = false;
    console.log('setTimeout 3s--', userList)
  }, 3000) */

  watchEffect(doCanvas)
  return { canvasConfig, userList, parseXmlFile, uploadCtx, startPath, pausePath, seekToCanvas, onPathEnd, userDataChange, handleCtxPlay }
}