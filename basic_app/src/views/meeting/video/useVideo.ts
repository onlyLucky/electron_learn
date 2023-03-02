/*
 * @Author: fg
 * @Date: 2023-02-28 15:40:04
 * @LastEditors: fg
 * @LastEditTime: 2023-03-02 16:34:07
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
export const useVideo = () => {
  // console.log(obj.value.clientHeight, 'obj')
}