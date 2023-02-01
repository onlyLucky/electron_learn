/*
 * @Author: fg
 * @Date: 2023-01-30 18:00:53
 * @LastEditors: fg
 * @LastEditTime: 2023-02-01 16:18:20
 * @Description: 会议详情下载
 */

import { getAllFileByMeetId } from "@/apis/meet"
import hdObj from "_v/setting/handleData"
import { join } from 'path'
import { ReactiveEffect, Ref } from "vue"
import { ipcRenderer } from "electron"
const fs = require('fs')


export const useDownload = async (meetId: number, meetName: string) => {
  const res = await getAllFileByMeetId({ meetId })
  // 文件列表
  let fileList = reactive<any[]>(res.data)
  // 文件存在
  const downloadPath = hdObj.getConfigItem('download').downloadPath
  const isExistMeetFile = () => {
    // 判断当前是否存在会议文件夹
    if (fs.existsSync(join(downloadPath, `${meetName}.${meetId}`))) {
      // 判读当前会议的本地文件是否完整
      return fileList.every((item: any) => {
        return fs.existsSync(join(downloadPath, `/${meetName}.${meetId}/${item.realName}`))
      })
    } else {
      // 当前没有会议文件夹
      console.log('当前没有会议文件夹')
      return false
    }
  }
  // 文件是否需要下载
  // 这里返回函数的true false 是异步函数 会堵塞赋值，无法进行响应式处理 v-show v-if 展示错误，虽然值是对的
  let isNeedDownload = ref<boolean>(true)
  isNeedDownload.value = !isExistMeetFile()

  // 下载文件
  const handleDownload = () => {
    if (isNeedDownload.value) {
      fileList.map(item => {
        ipcRenderer.send("download", {
          path: localStorage.getItem("staticPath") + item.fileUrl,
          directory: meetName,
          fileName: item.realName,
        });
      })
    }
  }

  // 监听下载进度
  ipcRenderer.on("downloadUpload", (event, args) => {

  })

  return {
    fileList,
    isNeedDownload,
    isExistMeetFile,
    handleDownload
  }
}
export type DownloadType = {
  fileList: any[],
  isNeedDownload: Ref<boolean>,
  isExistMeetFile: Function,
  handleDownload: Function
}