/*
 * @Author: fg
 * @Date: 2023-03-30 17:50:16
 * @LastEditors: fg
 * @LastEditTime: 2023-04-03 17:44:17
 * @Description: 用户信息处理
 */
import { getUserInfo, postUploadAvatar } from "@/apis/user"
import { Message } from "view-ui-plus";
import _ from "lodash"
import { join } from 'path'
import { useConfig } from "@/hooks/useConfig"
const fs = require("fs");

const { Config } = useConfig();
const useUserInfo = () => {
  let isEdit = ref<boolean>(false);
  let userInfo = reactive<any>({});
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
    getUserInfo({}).then(res => {
      res.data.user.careerName = res.data.careerName
      res.data.user.deptName = res.data.deptName
      Object.assign(userInfo, res.data.user)
      Object.assign(totalData, _.omit(res.data, ['user', 'deptName', 'careerName']))
      handleDownNum()
      let tempDeviceRatio = Math.ceil((totalData.UseDeviceNum / totalData.DeviceAllNum) * 100)
      tempDeviceRatio = isNaN(tempDeviceRatio) ? 0 : tempDeviceRatio
      tempDeviceRatio = tempDeviceRatio >= 100 ? 100 : tempDeviceRatio
      totalData.useDeviceRatio = tempDeviceRatio
      let tempSecretRatio = Math.ceil((totalData.SecretMeetNum / totalData.MeetAllNum) * 100)
      tempSecretRatio = isNaN(tempSecretRatio) ? 0 : tempSecretRatio
      tempSecretRatio = tempSecretRatio >= 100 ? 100 : tempSecretRatio
      totalData.secretRatio = tempSecretRatio

      console.log(totalData, 'totalData')
    })
  }

  // 计算本地下载个数
  const handleDownNum = () => {
    // Config
    let temp = fs.readdirSync(Config.download.downloadPath, { encoding: 'utf8' }) || []
    temp.map((item: any, index: number) => {
      if (fs.statSync(join(Config.download.downloadPath, item)).isFile()) {
        temp.splice(index, 1)
      }
    })
    totalData.downAlreadyNum = temp.length
    let tempRatio = Math.ceil((totalData.downAlreadyNum / totalData.DownMeetNum) * 100)
    tempRatio = isNaN(tempRatio) ? 0 : tempRatio;
    tempRatio = tempRatio >= 100 ? 100 : tempRatio;
    totalData.downRatio = tempRatio
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

  onMounted(() => {
    getInfo()
  })



  return {
    isEdit,
    userInfo,
    totalData,
    numDuration,
    getInfo,
    handleUpload,
    computedAvatarPath
  }
}

export default useUserInfo