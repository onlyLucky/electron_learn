/*
 * @Author: fg
 * @Date: 2023-03-16 17:14:52
 * @LastEditors: fg
 * @LastEditTime: 2023-03-21 14:43:14
 * @Description: user api
 */

import http from "@/libs/request"

const path = {
  dept: '/dept',//获取部门结构
  downloadTemplate: '/user/downloadTemplate',//下载人员模板文件
  user: '/user',// 获取用户
  getUserByDeptIdPage: '/user/getUserByDeptIdPage',// 根据用户组织结构获取用户
  getUserCareer: '/userCareer/getAllNoPageList',// 获取职位列表
  deleteUser: '/user/deleteBatch',// 删除用户
  quitJobUser: '/user/quitJobUser', // 离职
}

export const getDept = (): Promise<ResultData<any>> => {
  return http.get(path.dept, {})
}

//获取导入设备模板
export const getDownloadTemplate = (params?: any): Promise<any> => {
  return http.get(path.downloadTemplate, params, { responseType: 'arraybuffer', headers: { "Content-Type": "application/octet-stream" } })
}
// 获取用户
export const getUserList = (params: any): Promise<ResultData<any>> => {
  return http.get(path.user, params)
}

// 根据用户组织结构获取用户
export const getUserByDeptIdPage = (params: any): Promise<ResultData<any>> => {
  return http.get(path.getUserByDeptIdPage, params)
}

// 获取职位列表
export const getUserCareer = (params: any): Promise<ResultData<any>> => {
  return http.get(path.getUserCareer, params)
}

// 删除用户
export const deleteUser = (params?: { ids: string }): Promise<ResultData<any>> => {
  return http.delete<any>(path.deleteUser, params)
}

// 离职
export const quitJobUser = (params?: { userId: number }): Promise<ResultData<any>> => {
  return http.get(path.quitJobUser, params)
}