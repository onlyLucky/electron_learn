/*
 * @Author: fg
 * @Date: 2022-12-27 10:19:32
 * @LastEditors: fg
 * @LastEditTime: 2023-01-30 16:08:45
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
  login: '/auth/client/login'
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