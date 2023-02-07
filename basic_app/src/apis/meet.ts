/*
 * @Author: fg
 * @Date: 2022-12-28 13:44:32
 * @LastEditors: fg
 * @LastEditTime: 2023-02-07 15:06:17
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
  getListByMeetId: '/meetText/getListByMeetId',
  getMeetingUserBymeetId: '/meet/getMeetingUserBymeetIdAndNickname',
  deleteMeetConf: '/meet/deleteMeetConf',
  getAllFileByMeetId: "/meetFile/getAllFileByMeetId"
}

// 获取设备列表
export const getDeviceList = (params?: object): Promise<ResultData<any>> => {
  return http.get<any[]>(path.deviceList, params)
}

type listRD = {
  records: any[];
  total: number;
  [propsName: string]: any
}

// 根据会议id获取会议详情
export const getMeetingById = (params?: object): Promise<ResultData<listRD>> => {
  return http.get<listRD>(path.getMeetingById, params)
}

// 根据会议id获取用户列表
type meetUserPT = {
  meetId: number,
  nickname?: string,
  pageSize: number,
  pageNum: number
}
export const getMeetingUserBymeetId = (params: meetUserPT): Promise<ResultData<listRD>> => {
  return http.get<listRD>(path.getMeetingUserBymeetId, params)
}
// 根据会议id批量删除会议
export const deleteByIds = (params?: { ids: string }): Promise<ResultData<any>> => {
  return http.delete<any>(path.deleteByIds, params)
}
type putMeetPT = {
  id: number,
  secrecy?: number,//会议保密
  meetShare?: number,//会议分享
}
// 修改切换会议保密会议分享
export const reviseMeetDetail = (params: putMeetPT): Promise<ResultData<any>> => {
  return http.put(path.putMeet, params)
}
// 根据会议id获取会议详情
export const getMeetDetailById = (id: number): Promise<ResultData<any>> => {
  return http.get(`${path.putMeet}/${id}`)
}

// 通过会议id查询会议列表
export const getListByMeetId = (params: any): Promise<ResultData<any>> => {
  return http.get(path.getListByMeetId, params)
}

type MeetIdPT = {
  meetId: number
}
// 退出会议
export const deleteMeetConf = (params: MeetIdPT): Promise<ResultData<any>> => {
  return http.delete(path.deleteMeetConf, params)
}

// 根据会议id获取会议文件
export const getAllFileByMeetId = (params: MeetIdPT): Promise<ResultData<any>> => {
  return http.get<{ data: any[] }>(path.getAllFileByMeetId, params)
}