/*
 * @Author: fg
 * @Date: 2023-04-07 16:28:40
 * @LastEditors: fg
 * @LastEditTime: 2023-04-07 16:28:46
 * @Description: 消息类型图标
 */

import resMsg1 from '@/assets/icons/message/icon_message1.png'
import resMsg2 from '@/assets/icons/message/icon_message2.png'
import resMsg3 from '@/assets/icons/message/icon_message3.png'
import resMsg4 from '@/assets/icons/message/icon_message4.png'

export const useMsgType = (type: number) => {
  if (type == 1) {
    return resMsg1
  }
  if (type == 2) {
    return resMsg2
  }
  if (type == 3) {
    return resMsg3
  }
  if (type == 4) {
    return resMsg4
  }
}