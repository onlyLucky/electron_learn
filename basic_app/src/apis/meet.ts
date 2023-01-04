/*
 * @Author: fg
 * @Date: 2022-12-28 13:44:32
 * @LastEditors: fg
 * @LastEditTime: 2023-01-04 16:24:23
 * @Description: 会议api
 */


/* 
后缀缩写说明：
PT paramsType 接口请求参数类型 
RD res.data 返回res.data类型

*/
import http from "@/libs/request"

const path = {
  deviceList: '/device/deviceList',
  getMeetingById: '/meet/getMeetingById',
  deleteByIds: '/meet/deleteByIds',
  putMeet: '/meet',
}

export const getDeviceList = (params?: object) => {
  return http.get<any[]>(path.deviceList, params)
}

type meetingByIdRD = {
  records: any[];
  total: number;
}

export const getMeetingById = (params?: object) => {
  return http.get<meetingByIdRD>(path.getMeetingById, params)
}

export const deleteByIds = (params?: { ids: string }) => {
  return http.delete(path.deleteByIds, params)
}
// 
type putMeetPT = {
  id: number,
  secrecy?: number,//会议保密
  meetShare?: number,//会议分享
}
export const reviseMeetDetail = (params: putMeetPT) => {
  return http.put(path.putMeet, params)
}