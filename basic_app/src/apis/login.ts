/*
 * @Author: fg
 * @Date: 2022-12-27 10:19:32
 * @LastEditors: fg
 * @LastEditTime: 2023-02-01 16:09:09
 * @Description: 登录api 
 */
import http from "@/libs/request"
import { number } from "@intlify/core-base"
// import { getCurrentInstance } from "vue"

/* const currentInstance = getCurrentInstance()
const { $http } = currentInstance?.appContext.config.globalProperties as any
 */
/* const { proxy } = getCurrentInstance() as any */

const path = {
  login: '/auth/client/login',
  getFileIp: '/enum/getFileIp'
}

type loginType = {
  token: string,
  nickname: string,
  phone: string,
  id: number,
  deptId: number,
  deptName: string,
  userName: string,
  mobileType: number,
  userSex: number,
  avatarPath: string,
}
// : Promise<ResultData<loginType>>
export const goLogin = (params: object): Promise<ResultData<loginType>> => {
  return http.post<loginType>(path.login, params)
}

export const getFileIp = (params: object): Promise<ResultData<any>> => {
  return http.get(path.getFileIp, params)
}