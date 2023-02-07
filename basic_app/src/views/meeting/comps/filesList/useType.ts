/*
 * @Author: fg
 * @Date: 2023-02-06 18:02:41
 * @LastEditors: fg
 * @LastEditTime: 2023-02-07 11:33:23
 * @Description: useType 文件类型逻辑处理
 */
import resXlsx from "@/assets/icons/files/icon_fileType1.png"
import resPptx from "@/assets/icons/files/icon_fileType2.png"
import resTxt from "@/assets/icons/files/icon_fileType3.png"
import resCode from "@/assets/icons/files/icon_fileType4.png"
import resPdf from "@/assets/icons/files/icon_fileType5.png"
import resMp3 from "@/assets/icons/files/icon_fileType6.png"
import resMp4 from "@/assets/icons/files/icon_fileType7.png"
import resPng from "@/assets/icons/files/icon_fileType8.png"
import resOther from "@/assets/icons/files/icon_fileType9.png"
import resWord from "@/assets/icons/files/icon_fileType10.png"
import resZip from "@/assets/icons/files/icon_fileType11.png"

export const useType = (fileName: string) => {
  // 图片
  if (/\.(jpg|png|gif|bmp|jpeg)$/.test(fileName.toLowerCase())) {
    return resPng
  }
  // 文档
  if (/\.(doc|docx)$/.test(fileName.toLowerCase())) {
    return resWord
  }
  // 音频
  if (/\.(mp3|amr|wma|rm|wav|mid)$/.test(fileName.toLowerCase())) {
    return resMp3
  }
  // 视频
  if (/\.(mp4|avi|dat|mkv|flv|vob)$/.test(fileName.toLowerCase())) {
    return resMp4
  }
  // ppt
  if (/\.(pptx)$/.test(fileName.toLowerCase())) {
    return resPptx
  }
  // pdf
  if (/\.(pdf)$/.test(fileName.toLowerCase())) {
    return resPdf
  }
  // code
  if (/\.(xml|json|html)$/.test(fileName.toLowerCase())) {
    return resCode
  }
  // zip
  if (/\.(zip)$/.test(fileName.toLowerCase())) {
    return resZip
  }
  // 表格
  if (/\.(xls|xlsx|xlsm)$/.test(fileName.toLowerCase())) {
    return resXlsx
  }
  // txt
  if (/\.(txt)$/.test(fileName.toLowerCase())) {
    return resTxt
  }
  return resOther
}