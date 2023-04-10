/*
 * @Author: fg
 * @Date: 2023-02-28 17:44:17
 * @LastEditors: fg
 * @LastEditTime: 2023-04-10 14:46:52
 * @Description: content
 */
import { getAllFileByMeetId } from "@/apis/meet"
import hdObj from "_v/setting/handleData"
import { join } from 'path'
import { ipcRenderer } from "electron"
import _ from "lodash"
import { Message } from "view-ui-plus"
const fs = require('fs')

// 文件存在
const downloadPath = hdObj.getConfigItem('download').downloadPath

export const useDownload = (meetId: number, meetName: string) => {
  let resData = reactive<any>({})
  let downloadUse = reactive<DownloadType>({
    fileList: [],
    needDownloadArr: [],
    status: 0,
    progress: 0,
    isNeedDownload: false
  })
  // 计算下载总量
  let downloadSize: number = 0

  /**
   * @description: 检测文件是否存在
   * @return {*}
   */
  const isExistMeetFile = () => {
    // 暂缓downloadUse.needDownloadArr
    let temp: any[] = []
    // 判断当前是否存在会议文件夹
    if (fs.existsSync(join(downloadPath, `${meetName}.${meetId}`))) {
      // 判读当前会议的本地文件是否完整(every 检测文件无法检测完全)

      downloadUse.fileList.map((item: any, index: number) => {
        // console.log(fs.existsSync(join(downloadPath, `/${meetName}.${meetId}/${item.realName}`)), join(downloadPath, `/${meetName}.${meetId}/${item.realName}`))
        // console.log(item.realName, fs.existsSync(join(downloadPath, `/${meetName}.${meetId}/${item.realName}`)));
        if (!fs.existsSync(join(downloadPath, `/${meetName}.${meetId}/${item.realName}`))) {
          temp.push({
            fId: item.id,
            path: localStorage.getItem("staticPath") + item.fileUrl,
            directory: `${meetName}.${meetId}`,
            fileName: item.realName,
            fileSize: item.fileSize
          })
        }
      })
      downloadUse.needDownloadArr = temp
      return downloadUse.needDownloadArr.length == 0
    } else {
      // 当前没有会议文件夹
      downloadUse.fileList.map((item: any, index: number) => {
        temp.push({
          fId: item.id,
          path: localStorage.getItem("staticPath") + item.fileUrl,
          directory: `${meetName}.${meetId}`,
          fileName: item.realName,
          fileSize: item.fileSize
        })
      })
      /* downloadUse.needDownloadArr = Array.apply(null, { length: downloadUse.fileList.length } as any[]).map((item, index) => {
        return index
      }) */
      downloadUse.needDownloadArr = temp
      return false
    }
  }

  const isExistMeetFileAsync = () => {
    return new Promise((resolve, reject) => {
      try {
        // 暂缓downloadUse.needDownloadArr
        let temp: any[] = []
        // 判断当前是否存在会议文件夹
        if (fs.existsSync(join(downloadPath, `${meetName}.${meetId}`))) {
          // 判读当前会议的本地文件是否完整(every 检测文件无法检测完全)

          downloadUse.fileList.map((item: any, index: number) => {
            // console.log(fs.existsSync(join(downloadPath, `/${meetName}.${meetId}/${item.realName}`)), join(downloadPath, `/${meetName}.${meetId}/${item.realName}`))
            // console.log(item.realName, fs.existsSync(join(downloadPath, `/${meetName}.${meetId}/${item.realName}`)));
            if (!fs.existsSync(join(downloadPath, `/${meetName}.${meetId}/${item.realName}`))) {
              temp.push({
                fId: item.id,
                path: localStorage.getItem("staticPath") + item.fileUrl,
                directory: `${meetName}.${meetId}`,
                fileName: item.realName,
                fileSize: item.fileSize
              })
            }
          })
          downloadUse.needDownloadArr = temp
          resolve({
            isNeedDownload: downloadUse.needDownloadArr.length != 0
          })
        } else {
          // 当前没有会议文件夹
          downloadUse.fileList.map((item: any, index: number) => {
            temp.push({
              fId: item.id,
              path: localStorage.getItem("staticPath") + item.fileUrl,
              directory: `${meetName}.${meetId}`,
              fileName: item.realName,
              fileSize: item.fileSize
            })
          })
          downloadUse.needDownloadArr = temp
          resolve({
            isNeedDownload: true
          })
        }
      } catch (error) {
        reject(error)
      }
    })
  }


  const doDownload = async () => {
    initData()
    // 获取会议文件列表
    try {
      const res = await getAllFileByMeetId({ meetId })
      // 文件列表
      // 添加暂存文件目录
      let temp: any[] = []
      res.data.map((item: any) => {
        item.cachePath = join(downloadPath, `/${meetName}.${meetId}/${item.realName}`)
        temp.push(item)
      })

      downloadUse.fileList = temp
      console.log('downloadUse.fileList:文件列表', downloadUse.fileList)
    } catch (error) {
      Message.error(error || '文件列表获取失败');
    }
    downloadUse.isNeedDownload = !isExistMeetFile()
  }

  const doDownloadAsync = () => {
    initData()
    return new Promise((resolve, reject) => {
      getAllFileByMeetId({ meetId }).then(res => {
        // 添加暂存文件目录
        let temp: any[] = []
        res.data.map((item: any) => {
          item.cachePath = join(downloadPath, `/${meetName}.${meetId}/${item.realName}`)
          temp.push(item)
        })
        downloadUse.fileList = temp
        resolve(res)
      }).catch(error => {
        Message.error(error || '文件列表获取失败');
        reject(error)
      })
    });
  }

  /**
   * @description: 
   * @param {boolean} flag 是否需要检测文件  true 检测 false 不检测
   * @return {*}
   */
  const handleDownload = (flag: boolean = true) => {
    // 计算需要下载总量
    initData()
    if (flag) isExistMeetFile()
    if (downloadUse.needDownloadArr.length > 0) {
      downloadUse.status = 1
    }
    downloadUse.needDownloadArr.map((item: any) => {
      downloadSize = downloadSize + item.fileSize
    })
    // toRaw(downloadUse.needDownloadArr) reactive 转普通对象
    setTimeout(() => {
      ipcRenderer.send("download", toRaw(downloadUse.needDownloadArr));
    })
    /* downloadUse.fileList.map((item, index) => {
      // 只下载缺省的文件
      if (downloadUse.needDownloadArr.indexOf(index) != -1) {
        downloadUse.status = 1
        ipcRenderer.send("download", {
          path: localStorage.getItem("staticPath") + item.fileUrl,
          directory: `${meetName}.${meetId}`,
          fileName: item.realName
        });
      }
    }) */
    // 监听下载进度
    ipcRenderer.on("downloadUpload", (event, args) => {
      downloadUse.progress = Math.trunc((args.total / downloadSize) * 100)
      // console.log(downloadUse.progress, args, downloadSize)
    })
    ipcRenderer.on("downloadEnd", (event) => {
      // console.log('downloadEnd')
      downloadUse.progress = 100
      downloadUse.status = 2
      downloadUse.isNeedDownload = false
    })
    // downloadError
    ipcRenderer.on("downloadError", (event) => {
      // console.log('downloadEnd')
      console.log('下载失败');
    })
  }

  // 异步处理下载
  const handleDownloadAsync = () => {
    return new Promise((resolve, reject) => {
      if (downloadUse.needDownloadArr.length > 0) {
        downloadUse.status = 1
      }
      downloadUse.needDownloadArr.map((item: any) => {
        downloadSize = downloadSize + item.fileSize
      })
      setTimeout(() => {
        ipcRenderer.send("download", toRaw(downloadUse.needDownloadArr));
      })
      // 监听下载进度
      ipcRenderer.on("downloadUpload", (event, args) => {
        downloadUse.progress = Math.trunc((args.total / downloadSize) * 100)
        // console.log(downloadUse.progress, args, downloadSize)
      })
      ipcRenderer.on("downloadEnd", (event) => {
        // console.log('downloadEnd')
        downloadUse.progress = 100
        downloadUse.status = 2
        downloadUse.isNeedDownload = false
        resolve(downloadUse)
      })
      // downloadError
      ipcRenderer.on("downloadError", (event) => {
        // console.log('downloadEnd')
        console.log('下载失败');
        throw new Error("下载失败");
      })
    })
  }

  const initData = () => {
    downloadUse.progress = 0
    downloadUse.status = 0
    downloadSize = 0
  }
  if (isRef(meetId)) {
    watchEffect(doDownload)
  } else {
    doDownload()
  }

  return { downloadUse, doDownloadAsync, handleDownload, isExistMeetFile, isExistMeetFileAsync, handleDownloadAsync }
}

export type DownloadType = {
  fileList: any[],
  needDownloadArr: number[],
  status: 0 | 1 | 2,//下载状态 0未下载 1下载中 2下载结束
  progress: number,
  isNeedDownload: boolean
}
