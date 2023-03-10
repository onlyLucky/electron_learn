/*
 * @Author: fg
 * @Date: 2023-03-03 14:02:00
 * @LastEditors: fg
 * @LastEditTime: 2023-03-03 14:07:00
 * @Description: 文件数据处理
 */
import hdObj from "_v/setting/handleData"
import { join } from 'path'
import { Message } from "view-ui-plus"
const fs = require('fs')

// 文件储存地址
const downloadPath = hdObj.getConfigItem('download').downloadPath

type FileType = {
  name: string,
  xml: string,
  stt: string,
  videoSrc: string,
  audioSrc: string,
  videoBg: string
}

export const useFile = (mName: string, mId: any) => {
  let fileList = ref<FileType[]>([])
  // 检测文件夹
  const handleFolder = () => {
    let tempLen = 0;
    let files = fs.readdirSync(join(downloadPath, `${mName}.${mId}`))
    files.map((item: any) => {
      if (item.split('.')[1] == 'mp4') {
        tempLen++
      }
    })
    let tempFiles = []
    for (let i = 0; i < tempLen; i++) {
      tempFiles.push({
        name: `${mName}-${i + 1}`,
        xml: join(downloadPath, `/${mName}.${mId}/${mName}-${i + 1}.xml`),
        stt: join(downloadPath, `/${mName}.${mId}/${mName}-${i + 1}.stt`),
        videoSrc: join(downloadPath, `/${mName}.${mId}/${mName}-${i + 1}.mp4`),
        audioSrc: join(downloadPath, `/${mName}.${mId}/${mName}-${i + 1}.amr`),
        videoBg: join(downloadPath, `/${mName}.${mId}/${mName}-${i + 1}.jpg`)
      })
    }
    fileList.value = tempFiles
  }
  if (isRef(mName)) {
    watchEffect(handleFolder)
  } else {
    handleFolder()
  }
  return { fileList, handleFolder }
}