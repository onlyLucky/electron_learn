/*
 * @Author: fg
 * @Date: 2023-02-14 14:41:51
 * @LastEditors: fg
 * @LastEditTime: 2023-02-16 14:07:26
 * @Description: 设备功能api
 */

/* 
后缀缩写说明：
PT paramsType 接口请求参数类型 
RD res.data 返回res.data类型
*/
import http from "@/libs/request"

const path = {
  device: '/device',//获取设备列表表格
  downloadTemplate: '/device/downloadTemplate',//获取导入设备模板
  deleteBatch: '/device/deleteBatch',// 删除多个设备
}

// 获取设备列表表格
type GetDevicePagePT = {
  pageSize: number;
  pageNum: number;
  name?: string;
};
export const getDevicePage = (params: GetDevicePagePT): Promise<ResultData<any>> => {
  return http.get<any[]>(path.device, params)
}

export const getDownloadTemplate = (params?: any): Promise<any> => {
  // { responseType: 'arraybuffer' }
  return http.get(path.downloadTemplate, params, { responseType: 'arraybuffer', headers: { "Content-Type": "application/octet-stream" } })
}

// 根据id批量删除设备
export const deleteEquipByIds = (params?: { ids: string }): Promise<ResultData<any>> => {
  return http.delete<any>(path.deleteBatch, params)
}

