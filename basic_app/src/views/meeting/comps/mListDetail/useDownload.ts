/*
 * @Author: fg
 * @Date: 2023-01-30 18:00:53
 * @LastEditors: fg
 * @LastEditTime: 2023-02-07 17:02:59
 * @Description: 会议详情下载
 */

import { getAllFileByMeetId } from "@/apis/meet"
import hdObj from "_v/setting/handleData"
import { join } from 'path'
import { ReactiveEffect, Ref } from "vue"
import { ipcRenderer } from "electron"
import _ from "lodash"
const fs = require('fs')


// 文件存在
const downloadPath = hdObj.getConfigItem('download').downloadPath

export const useDownload = async (meetId: number, meetName: string) => {
  // 下载文件
  const handleDownload = () => {
    // 计算需要下载总量
    downloadUse.progress = 0
    isExistMeetFile()
    let tempDownArr: any[] = []
    if (downloadUse.needDownloadArr.length > 0) {
      downloadUse.status = 1
    }
    downloadUse.needDownloadArr.map(item => {
      downloadSize += downloadUse.fileList[item].fileSize
      tempDownArr.push({
        fId: downloadUse.fileList[item].id,
        path: localStorage.getItem("staticPath") + downloadUse.fileList[item].fileUrl,
        directory: `${meetName}.${meetId}`,
        fileName: downloadUse.fileList[item].realName,
        fileSize: downloadUse.fileList[item].fileSize
      })
    })
    ipcRenderer.send("download", tempDownArr);
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
  }

  const isExistMeetFile = () => {
    // 判断当前是否存在会议文件夹
    downloadUse.needDownloadArr = [];
    if (fs.existsSync(join(downloadPath, `${meetName}.${meetId}`))) {
      // 判读当前会议的本地文件是否完整(every 检测文件无法检测完全)
      downloadUse.fileList.map((item: any, index: number) => {
        // console.log(fs.existsSync(join(downloadPath, `/${meetName}.${meetId}/${item.realName}`)), join(downloadPath, `/${meetName}.${meetId}/${item.realName}`))
        console.log(item.realName, fs.existsSync(join(downloadPath, `/${meetName}.${meetId}/${item.realName}`)));
        if (!fs.existsSync(join(downloadPath, `/${meetName}.${meetId}/${item.realName}`))) {
          downloadUse.needDownloadArr.push(index)
        }
      })
      return downloadUse.needDownloadArr.length == 0
    } else {
      // 当前没有会议文件夹
      console.log('当前没有会议文件夹', downloadPath)
      downloadUse.needDownloadArr = Array.apply(null, { length: downloadUse.fileList.length } as any[]).map((item, index) => {
        return index
      })
      return false
    }
  }
  let downloadUse = reactive<DownloadType>({
    fileList: [],
    needDownloadArr: [],// 需要下载的文件
    status: 0,//下载状态 0未下载 1下载中 2下载结束
    progress: 0,
    isNeedDownload: true,
    isExistMeetFile,
    handleDownload,
  })
  const res = await getAllFileByMeetId({ meetId })
  // 文件列表
  downloadUse.fileList = res.data

  // 文件是否需要下载
  // 这里返回函数的true false 是异步函数 会堵塞赋值，无法进行响应式处理 v-show v-if 展示错误，虽然值是对的
  downloadUse.isNeedDownload = !isExistMeetFile()
  console.log(downloadUse.isNeedDownload, 'isNeedDownload', downloadUse.needDownloadArr)

  downloadUse.status = 0

  // 计算下载总量
  let downloadSize: number = 0
  downloadUse.progress = 0;//当前进度

  // 监听下载进度
  ipcRenderer.on("downloadUpload", (event, args) => {
    downloadUse.progress = Math.trunc((args.total / downloadSize) * 100)
    console.log(downloadUse.progress, args.total, downloadSize)
  })
  ipcRenderer.on("downloadEnd", (event) => {
    console.log('downloadEnd')
    downloadUse.progress = 100
    downloadUse.status = 2
    downloadUse.isNeedDownload = false
  })

  return downloadUse
}

export const useHasFiles = (path: string) => {
  return fs.existsSync(join(downloadPath, path))
}
export type DownloadType = {
  fileList: any[],
  needDownloadArr: number[],
  status: 0 | 1 | 2,//下载状态 0未下载 1下载中 2下载结束
  progress: number,
  isNeedDownload: boolean,
  isExistMeetFile: Function,
  handleDownload: Function
}