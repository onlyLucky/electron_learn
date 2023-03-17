/*
 * @Author: fg
 * @Date: 2023-03-16 17:14:52
 * @LastEditors: fg
 * @LastEditTime: 2023-03-17 14:17:43
 * @Description: user api
 */

import http from "@/libs/request"

const path = {
  dept: '/dept',//获取部门结构
  downloadTemplate: '/user/downloadTemplate',//下载人员模板文件
}

export const getDept = (): Promise<ResultData<any>> => {
  return http.get(path.dept, {})
}

//获取导入设备模板
export const getDownloadTemplate = (params?: any): Promise<any> => {
  return http.get(path.downloadTemplate, params, { responseType: 'arraybuffer', headers: { "Content-Type": "application/octet-stream" } })
}