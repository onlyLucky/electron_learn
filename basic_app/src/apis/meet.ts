/*
 * @Author: fg
 * @Date: 2022-12-28 13:44:32
 * @LastEditors: fg
 * @LastEditTime: 2022-12-28 14:20:42
 * @Description: 会议api
 */

import http from "@/libs/request"

const path = {
  deviceList: '/device/deviceList'
}



export const getDeviceList = (params?: object) => {
  return http.get<any[]>(path.deviceList, params)
}