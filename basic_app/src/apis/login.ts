/*
 * @Author: fg
 * @Date: 2022-12-27 10:19:32
 * @LastEditors: fg
 * @LastEditTime: 2022-12-27 14:43:14
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

export const goLogin = (params: object) => {
  return http.post(path.login, params)
}