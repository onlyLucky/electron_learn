/*
 * @Author: fg
 * @Date: 2023-01-29 14:17:06
 * @LastEditors: fg
 * @LastEditTime: 2023-01-30 14:25:28
 * @Description: views index.d.ts
 */
type MeetDetailType = {
  name: string,
  createUserName: string | null,
  deviceName: string | null,
  deviceId: number,
  createTime: string | null,
  endTime: string | null,
  meetShare: 0 | 1,
  secrecy: 0 | 1,
  secrecyPassword: string | null,
  state: 0 | 1,
}