export default {
  /**
   * @description 配置显示在浏览器标签的title
   */
  title: '基于iviewUI的框架',
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 1,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,
  /**
   * @description api请求基础路径 dev开发请求地址   pro生产请求地址
   */
  baseUrl: 'http://192.168.19.89:8888',
  /**
   * @description 多窗口文件配置
   * 
   */
  modelConfig: {
    length: 1,//默认一个
  }
}
