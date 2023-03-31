/*
 * @Author: fg
 * @Date: 2023-03-30 17:50:16
 * @LastEditors: fg
 * @LastEditTime: 2023-03-30 17:55:48
 * @Description: 用户信息处理
 */

const useUserInfo = () => {
  let isEdit = ref<boolean>(false);
  
  return {
    isEdit
  }
}

export default useUserInfo