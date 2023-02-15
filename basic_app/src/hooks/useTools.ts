import { isNumber } from "lodash";

export const useBytesUnit = (bytes: number) => {
  if (!isNumber(bytes)) {
    return '0 B';
  }
  if (bytes === 0) return '0 B';
  var k = 1024,
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
    i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
}