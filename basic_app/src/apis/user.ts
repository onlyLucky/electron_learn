/*
 * @Author: fg
 * @Date: 2023-03-16 17:14:52
 * @LastEditors: fg
 * @LastEditTime: 2023-03-17 15:42:32
 * @Description: user api
 */

import http from "@/libs/request"

const path = {
  dept: '/dept',//获取部门结构
  downloadTemplate: '/user/downloadTemplate',//下载人员模板文件
  user: '/user',// 获取用户
  getUserByDeptIdPage: '/user/getUserByDeptIdPage',// 根据用户组织结构获取用户
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