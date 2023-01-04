/*
 * @Author: fg
 * @Date: 2022-12-28 13:44:32
 * @LastEditors: fg
 * @LastEditTime: 2023-01-04 15:30:13
 * @Description: 会议api
 */

import http from "@/libs/request"

const path = {
  deviceList: '/device/deviceList',
  getMeetingById: '/meet/getMeetingById',
  deleteByIds: '/meet/deleteByIds'
}

export const getDeviceList = (params?: object) => {
  return http.get<any[]>(path.deviceList, params)
}

type MeetingByIdType = {
  records: any[];
  total: number;
}

export const getMeetingById = (params?: object) => {
  return http.get<MeetingByIdType>(path.getMeetingById, params)
}

export const deleteByIds = (params?: { ids: string }) => {
  return http.delete(path.deleteByIds, params)
}