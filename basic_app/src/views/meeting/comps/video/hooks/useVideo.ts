/*
 * @Author: fg
 * @Date: 2023-02-28 15:40:04
 * @LastEditors: fg
 * @LastEditTime: 2023-03-06 09:13:50
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
 - 1. 检测会议文件夹，处理视频文件（useFile）
 - 2. 数据处理，选集数据处理，文件地址，状态，当前播放下标，当前播放数据
 - 3. 播放控制，视频切换，音频声音，上一，下一，...

*/

export type TypeVideoConfig = {
  progress: number,// 播放进度0-100
  current: number,// 当前播放视频index
  playing: boolean,// 是否播放
  voiceNum: number,// 音量值,从0.0至1.0之间
  SpeedNum: number,// 音频倍速0.5 - 2
  ProgressTime: number,// 当前播放时长 ms
  isVideoCanPlay: boolean,// 视频是否为可播放状态
  isAudioCanPlay: boolean,// 音频是否为可播放状态
  duration: number,// 时长 s
}
export const useVideo = (mName: string, mId: any,) => {
  // 媒体dom对象
  let playObj: HTMLVideoElement;
  let audioObj: HTMLAudioElement;

  let videoConfig = reactive<TypeVideoConfig>({
    progress: 0,
    current: 0,
    playing: false,
    voiceNum: 0.5,
    SpeedNum: 1,
    ProgressTime: 0,
    isVideoCanPlay: false,
    isAudioCanPlay: false,
    duration: 0,
  })
  const doVideo = () => {
    initData()
    // playObj.play()
  }
  // 初始化数据
  const initData = () => {
    let initTemp = {
      progress: 0,
      current: 0,
      playing: false,
      voiceNum: 0.5,
      SpeedNum: 1,
      ProgressTime: 0,
      isVideoCanPlay: false,
      isAudioCanPlay: false,
      duration: 0,
    }
    Object.assign(videoConfig, initTemp)
  }

  // 播放暂停控制
  const onMediaCtrl = () => {
    if (playObj.paused) {
      // 播放
      if (videoConfig.isVideoCanPlay && videoConfig.isAudioCanPlay) {
        let tempTime = (videoConfig.progress / 100) * videoConfig.duration
        playObj.currentTime = tempTime;
        audioObj.currentTime = tempTime;
        playObj.play();
        audioObj.play();
        videoConfig.playing = true;
      }
    } else {
      playObj.pause();
      audioObj.pause();
      videoConfig.playing = false;
    }
  }

  const seekTo = () => {

  }

  // 监听是否可以播放
  const onVideoCanPlay = (e: any) => {
    console.log(playObj.paused, 'paused')
    videoConfig.duration = playObj.duration
    videoConfig.isVideoCanPlay = true
  }
  const onAudioCanPlay = (e: any) => {
    videoConfig.isAudioCanPlay = true
  }
  // 获取数据
  const getDate = () => {
    return {
      videoConfig
    }
  }
  // upload
  const uploadDomObj = (flag: boolean, val: HTMLVideoElement | HTMLAudioElement) => {
    if (flag) {
      playObj = val as HTMLVideoElement
    } else {
      audioObj = val as HTMLAudioElement
    }
  }



  if (mId) {
    watchEffect(doVideo)
  } else {
    doVideo()
  }
  return { videoConfig, onVideoCanPlay, onAudioCanPlay, getDate, uploadDomObj, onMediaCtrl }
}