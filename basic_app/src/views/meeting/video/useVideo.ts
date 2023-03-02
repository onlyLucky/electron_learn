/*
 * @Author: fg
 * @Date: 2023-02-28 15:40:04
 * @LastEditors: fg
 * @LastEditTime: 2023-03-02 18:45:54
 * @Description: 视频播放处理
 */
import hdObj from "_v/setting/handleData"
import { join } from 'path'
import _ from "lodash"
import { Message } from "view-ui-plus"
const fs = require('fs')

// 文件存在
const downloadPath = hdObj.getConfigItem('download').downloadPath

/* 
 TODO步骤处理：
 - 1. 检测会议文件夹，处理视频文件
 - 2. 数据处理，选集数据处理，文件地址，状态，当前播放下标，当前播放数据
 - 3. 播放控制，视频切换，音频声音，上一，下一，...

*/

type ConfigType = {
  playObj: HTMLVideoElement,
  mId: any,
  mName: any
}
type TypeVideoConfig = {
  progress: number,// 播放进度
  fileList: any[],// 分段视频文件列表
  current: number,// 当前播放视频index
}
export const useVideo = (config: ConfigType) => {
  let videoConfig = reactive<TypeVideoConfig>({
    progress: 0,
    fileList: [],
    current: 0,
  })
  const doVideo = () => {
    handleFolder()
  }


  // 检测文件夹
  const handleFolder = () => {
    let tempLen = 0;
    let files = fs.readdirSync(join(downloadPath, `${config.mName}.${config.mId}`))
    files.map((item: any) => {
      if (item.split('.')[1] == 'mp4') {
        tempLen++
      }
    })
    let tempFiles = []
    for (let i = 0; i < tempLen; i++) {
      tempFiles.push({
        name: `${config.mName}-${i + 1}`,
        stt: join(downloadPath, `/${config.mName}.${config.mId}/${config.mName}-${i + 1}.stt`),
        videoSrc: join(downloadPath, `/${config.mName}.${config.mId}/${config.mName}-${i + 1}.mp4`),
        audioSrc: join(downloadPath, `/${config.mName}.${config.mId}/${config.mName}-${i + 1}.amr`),
        videoBg: join(downloadPath, `/${config.mName}.${config.mId}/${config.mName}-${i + 1}.jpg`)
      })
    }
    videoConfig.fileList = tempFiles
  }
  if (config.mId) {
    watchEffect(doVideo)
  } else {
    doVideo()
  }
} 