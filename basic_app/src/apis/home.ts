import http from "@/libs/request"

const path = {
  meetChart: '/home/meetChart', // 查看会议图表
  deviceChart: '/home/deviceChart',// 查看设备图表
}

type TypeChart = {
  type: 1 | 2 | 3;// 1 最近一周 2最近一月 3最近一年
}
export const getMeetChart = (params: TypeChart): Promise<ResultData<any>> => {
  return http.get(path.meetChart, params)
}
export const getDeviceChart = (params: TypeChart): Promise<ResultData<any>> => {
  return http.get(path.deviceChart, params)
}