/*
 * @Author: fg
 * @Date: 2023-01-30 18:00:53
 * @LastEditors: fg
 * @LastEditTime: 2023-01-30 18:00:53
 * @Description: 会议详情下载
 */

import { getAllFileByMeetId } from "@/apis/meet"


export const useDownload = (meetId: number) => {
  getAllFileByMeetId({ meetId }).then(res => {
    console.log(res)
  })
}