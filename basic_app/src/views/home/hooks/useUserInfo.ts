/*
 * @Author: fg
 * @Date: 2023-03-30 17:50:16
 * @LastEditors: fg
 * @LastEditTime: 2023-04-20 13:34:00
 * @Description: 用户信息处理
 */
import { getUserInfo, postUploadAvatar } from "@/apis/user"
import { getPlayHistoryByUserId } from "@/apis/meet"
import { Message } from "view-ui-plus";
import _ from "lodash"
import { join } from 'path'
import { useConfig } from "@/hooks/useConfig"
const fs = require("fs");

const { Config } = useConfig();
const useUserInfo = () => {
  let isEdit = ref<boolean>(false);
  let userInfo = reactive<any>({});
  let historyList = ref<any[]>([]);
  let topTipIndex = ref<number>(-1)
  type TypeTotalData = {
    DeviceAllNum: number,
    DeviceNum: number,
    DownMeetNum: number,
    MeetAllNum: number,
    MeetNum: number,
    SecretMeetNum: number,
    UseDeviceNum: number,
    UserNum: number,
    meetList: any[],
    todayMeetList: any[],
    downAlreadyNum: number,
    downRatio: number,
    useDeviceRatio: number,
    secretRatio: number,
  }
  let totalData = reactive<TypeTotalData>({
    DeviceAllNum: 0,
    DeviceNum: 0,
    DownMeetNum: 0,
    MeetAllNum: 0,
    MeetNum: 0,
    SecretMeetNum: 0,
    UseDeviceNum: 0,
    UserNum: 0,
    meetList: [],
    todayMeetList: [],
    downAlreadyNum: 0,
    downRatio: 0,
    useDeviceRatio: 0,
    secretRatio: 0
  })
  let numDuration = ref<number>(1.5)

  const getInfo = () => {
    topTipIndex.value = -1
    getUserInfo({}).then(res => {
      res.data.user.careerName = res.data.careerName
      res.data.user.deptName = res.data.deptName
      Object.assign(userInfo, res.data.user)
      Object.assign(totalData, _.omit(res.data, ['user', 'deptName', 'careerName']))
      // 计算本地下载ratio
      handleDownNum()
      // 计算使用中设备ratio
      let tempDeviceRatio = Math.ceil((totalData.UseDeviceNum / totalData.DeviceAllNum) * 100)
      tempDeviceRatio = isNaN(tempDeviceRatio) ? 0 : tempDeviceRatio
      tempDeviceRatio = tempDeviceRatio >= 100 ? 100 : tempDeviceRatio
      totalData.useDeviceRatio = tempDeviceRatio
      // 计算保密ratio
      let tempSecretRatio = Math.ceil((totalData.SecretMeetNum / totalData.MeetAllNum) * 100)
      tempSecretRatio = isNaN(tempSecretRatio) ? 0 : tempSecretRatio
      tempSecretRatio = tempSecretRatio >= 100 ? 100 : tempSecretRatio
      totalData.secretRatio = tempSecretRatio
      // 反转会议列表，时间
      totalData.meetList = totalData.meetList.reverse()
      totalData.todayMeetList = totalData.todayMeetList.reverse()
      // 处理当前时间属于第几个
      handleTopTip()
    })
  }

  const getHistoryData = () => {
    getPlayHistoryByUserId().then((res: any) => {
      historyList.value = res.data;
    })
  }

  // 计算本地下载个数
  const handleDownNum = () => {
    // Config
    let temp: any[] = []
    let tempFile = []
    try {
      tempFile = fs.readdirSync(Config.download.downloadPath.value, { encoding: 'utf8' }) || []
    } catch (error) {

    }
    tempFile.map((item: any, index: number) => {
      if (fs.statSync(join(Config.download.downloadPath.value, item)).isDirectory()) {
        temp.push(item)
      }
    })
    totalData.downAlreadyNum = temp.length
    let tempRatio = Math.ceil((totalData.downAlreadyNum / totalData.DownMeetNum) * 100)
    tempRatio = isNaN(tempRatio) ? 0 : tempRatio;
    tempRatio = tempRatio >= 100 ? 100 : tempRatio;
    totalData.downRatio = tempRatio
  }

  // 
  const handleTopTip = () => {
    let temp: any = []
    let today = new Date().getTime()
    totalData.meetList.map((item, index) => {
      if (new Date(item.meetTime).getTime() >= today) {
        temp.push(index)
      }
    })
    topTipIndex.value = temp.length > 0 ? temp[0] : -1
  }

  // 上传静态资源
  const handleUpload = (file: any) => {
    userInfo.avatarPath = "";
    postUploadAvatar({ files: file })
      .then((res) => {
        userInfo.avatarPath = res.data;
      })
      .catch((err) => {
        Message.error(err || "上传头像资源失败");
      });
    return false;
  };

  const computedAvatarPath = computed(() => {
    return userInfo.avatarPath
      ? localStorage.getItem("staticPath") + userInfo.avatarPath
      : "";
  });

  const computedMeetName = computed(() => {
    return topTipIndex.value < 0 ? '' : totalData.meetList[topTipIndex.value].name
  })

  const computedMeetTime = computed(() => {
    return topTipIndex.value < 0 ? '' : new Date(totalData.meetList[topTipIndex.value].meetTime).getTime()
  })

  onMounted(() => {
    getInfo()
    getHistoryData()
  })



  return {
    isEdit,
    userInfo,
    totalData,
    numDuration,
    historyList,
    topTipIndex,
    getInfo,
    handleUpload,
    computedAvatarPath,
    computedMeetTime,
    computedMeetName
  }
}

export default useUserInfo