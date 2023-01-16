/*
 * @Author: fg
 * @Date: 2022-12-27 10:19:32
 * @LastEditors: fg
 * @LastEditTime: 2023-01-16 17:40:40
 * @Description: 登录api 
 */
import http from "@/libs/request"
// import { getCurrentInstance } from "vue"

/* const currentInstance = getCurrentInstance()
const { $http } = currentInstance?.appContext.config.globalProperties as any
 */
/* const { proxy } = getCurrentInstance() as any */

const path = {
  login: '/auth/client/login'
}


type loginType = {
  token: string
}
// : Promise<ResultData<loginType>>
export const goLogin = (params: object): Promise<ResultData<loginType>> => {
  return http.post<loginType>(path.login, params)
}