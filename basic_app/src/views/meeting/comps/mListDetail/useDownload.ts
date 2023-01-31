/*
 * @Author: fg
 * @Date: 2023-01-30 18:00:53
 * @LastEditors: fg
 * @LastEditTime: 2023-01-31 11:00:21
 * @Description: 会议详情下载
 */

import { getAllFileByMeetId } from "@/apis/meet"


const useDownload = async (meetId: number) => {
  const res = await getAllFileByMeetId({ meetId })
  // 文件列表
  let fileList = reactive(res.data)
  // 文件存在
  if (fileList.length > 0) {

  }
  return {
    fileList
  }
}

export default useDownload