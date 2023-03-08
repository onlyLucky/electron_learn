/*
 * @Author: fg
 * @Date: 2023-02-28 15:40:04
 * @LastEditors: fg
 * @LastEditTime: 2023-03-07 19:17:54
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
  isVideoCanPlay: boolean,// 视频是否为可播放状态
  isAudioCanPlay: boolean,// 音频是否为可播放状态
  duration: number,// 时长 s
  currentTime: number,// 当前播放进度时间
  durationTxt: string, // 视频时长字符串
  currentTimeTxt: string, // 播放进度时间字符串
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
    isVideoCanPlay: false,
    isAudioCanPlay: false,
    duration: 0,
    currentTime: 0,
    durationTxt: '',
    currentTimeTxt: ''
  })
  // 播放选集数据
  let videoArr = ref<TypeVideoConfig[]>([])

  let showTimeStringType = ref<'h' | 'm'>('h');// m: 00:00  h  00:00:00

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
      isVideoCanPlay: false,
      isAudioCanPlay: false,
      duration: 0,
      currentTime: 0,
      durationTxt: '',
      currentTimeTxt: ''
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

  // 跳转播放
  const seekTo = (progress: number) => {
    console.log(progress, 'progress')
    if (videoConfig.playing) {
      playObj.pause();
      audioObj.pause();
    }
    let cTime = videoConfig.duration * (progress / 100)
    videoConfig.progress = progress;
    videoConfig.currentTime = cTime;
    videoConfig.currentTimeTxt = computedTime(cTime)
    if (videoConfig.playing) {
      onMediaCtrl()
    }

  }

  // 监听是否可以播放
  const onVideoCanPlay = (e: any) => {
    console.log('onVideoCanPlay', playObj.videoWidth, playObj.videoHeight)
    videoConfig.duration = playObj.duration
    showTimeStringType.value = playObj.duration >= 60 * 60 ? 'h' : 'm'
    if (videoConfig.currentTime == 0) {
      videoConfig.currentTimeTxt = showTimeStringType.value == 'h' ? '00:00:00' : '00:00'
    }
    videoConfig.durationTxt = computedTime(playObj.duration)
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
  // 更新current
  const uploadCurrentTime = (cTime: number) => {
    videoConfig.currentTime = cTime
    videoConfig.progress = (videoConfig.currentTime / videoConfig.duration) * 100
    videoConfig.currentTimeTxt = computedTime(cTime)
  }

  const computedTime = (seconds: number): string => {
    let res = ''
    if (seconds == 0) return res
    let hour = Math.trunc(seconds / 3600) >= 10
      ? Math.trunc(seconds / 3600)
      : "0" + Math.trunc(seconds / 3600);
    let min = Math.trunc(seconds / 60) >= 10
      ? Math.trunc(seconds / 60)
      : "0" + Math.trunc(seconds / 60);
    let sec = Math.trunc(seconds % 60) >= 10
      ? Math.trunc(seconds % 60)
      : "0" + Math.trunc(seconds % 60);

    res = showTimeStringType.value == 'h' ? `${hour}:${min}:${sec}` : `${min}:${sec}`
    return res;
  };

  const onEnd = () => {
    // TODO: 下一首判断， 设置=> 自动连播 循环单首 播放完结束(默认)
    playObj.pause();
    audioObj.pause();
    videoConfig.playing = false;
  }

  // 更新当前播放第几个
  const uploadCurrent = (index: number) => {
    // TODO 更新当前储存数据，判断index之前是否入库，进行赋值操作
    videoConfig.current = index;
  }

  if (mId) {
    watchEffect(doVideo)
  } else {
    doVideo()
  }
  return { videoConfig, onVideoCanPlay, onAudioCanPlay, getDate, uploadDomObj, onMediaCtrl, uploadCurrentTime, onEnd, uploadCurrent, seekTo }
}