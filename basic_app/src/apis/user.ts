/*
 * @Author: fg
 * @Date: 2023-03-16 17:14:52
 * @LastEditors: fg
 * @LastEditTime: 2023-03-23 10:44:47
 * @Description: user api
 */

import http from "@/libs/request"

const path = {
  dept: '/dept',//获取部门结构
  downloadTemplate: '/user/downloadTemplate',//下载人员模板文件
  user: '/user',// 获取用户 新增用户
  getUserByDeptIdPage: '/user/getUserByDeptIdPage',// 根据用户组织结构获取用户
  getUserCareer: '/userCareer/getAllNoPageList',// 获取职位列表
  deleteUser: '/user/deleteBatch',// 删除用户
  quitJobUser: '/user/quitJobUser', // 离职
  updatePassward: '/user/updatePassward', // 重置用户密码
  upload: '/user/upload',// 用户上传头像
  validateUserName: '/user/validateUserName',// 校验登录账号唯一性
  userUpdateRole: '/role/userUpdateRole',// 更新用户角色
  updateDept: '/user/updateDept',// 更新部门数据
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

// 更新用户密码
export const uploadPassword = (params?: { id: number, password: string }): Promise<ResultData<any>> => {
  return http.put(path.updatePassward, params)
}

// 用户上传头像文件
export const postUploadAvatar = (params: any): Promise<ResultData<any>> => {
  return http.post<any>(path.upload, params, {
    headers: {
      'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryxsyBo4G6FcXHp1RF'
    }
  })
}

// 校验登录账号
export const validateUserName = (params?: { username: string }): Promise<ResultData<any>> => {
  return http.get(path.validateUserName, params)
}

// 新增用户
export const addUser = (params: any): Promise<ResultData<any>> => {
  return http.post<any>(path.user, params, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
}

// 更新用户角色
export const updateRole = (params: { userId: number, ids: string }): Promise<ResultData<any>> => {
  return http.post<any>(path.userUpdateRole, params)
}

// 更新用户部门
export const updateDept = (params: { userId: number, newDept: number }): Promise<ResultData<any>> => {
  return http.post<any>(path.updateDept, params)
}
