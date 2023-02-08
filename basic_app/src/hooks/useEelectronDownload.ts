/*
 * @Author: fg
 * @Date: 2023-02-08 15:07:47
 * @LastEditors: fg
 * @LastEditTime: 2023-02-08 16:26:43
 * @Description: electron 文件下载处理
 */
import hdObj from "_v/setting/handleData"
import { join } from 'path'
import { ipcRenderer } from "electron"
import _ from "lodash"
const fs = require('fs')

// 文件存在
const downloadPath = hdObj.getConfigItem('download').downloadPath
// 需要下载的file
let needDownloadArr = reactive<any[]>([])
// 文件列表
let fileList = reactive<any[]>([])
// 储存文件夹
let directoryName = ref<string>('')


/**
 * @description: 判断文件是否存在
 * @param {string} path
 * @return {*}
 */
const isHasFile = (path: string) => {
  return fs.existsSync(join(downloadPath, path))
}


/**
 * @description: 文件列表下载，文件下载监听（多个文件打包下载处理）
 * @param {any} list 下载列表信息
 * @param {string} directory 下载存储文件夹
 * @return {*}
 */
const useDownload = (list: any[], directory: string) => {
  // 初始化数据
  initData()
  // 数据储存
  fileList = [...list]
  directoryName.value = directory

  let downloadStatus = ref<0 | 1 | 2>(0); //下载状态 0 未下载 1下载中 2下载完成
  // 总下载量
  let downloadSize = 0;
  // 下载进度
  let progress = ref<number>(0)
  // 处理需要下载文件
  list.map((item, index) => {
    // 检测文件是否存在
    if (!isHasFile(`/${directory}/${item.realName}`)) {
      downloadSize += item.fileSize
      needDownloadArr.push({
        fId: item.id,
        path: localStorage.getItem("staticPath") + item.fileUrl,
        directory,
        fileName: item.realName,
        fileSize: item.fileSize
      })
    }
  })
  // 多个下载（触发下载）
  ipcRenderer.send("download", needDownloadArr);
  downloadStatus.value = 1
  // 下载监听
  ipcRenderer.on("downloadUpload", (event, args) => {
    progress.value = Math.trunc((args.total / downloadSize) * 100)
    console.log(progress.value, args.total, downloadSize)
  })
  ipcRenderer.on("downloadEnd", (event) => {
    console.log('downloadEnd')
    progress.value = 100
    downloadStatus.value = 2
  })


  return {
    downloadStatus,
    progress,
  }
}

/**
 * @description: 初始化下载数据
 * @return {*}
 */
const initData = () => {
  // 初始化文件列表
  fileList = [];
  // 初始化需要下载列表
  needDownloadArr = [];
  // 初始化下载文件夹
  directoryName.value = ''

}

export default {
  isHasFile,
  useDownload
}