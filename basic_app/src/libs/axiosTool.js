import Vue from 'vue'
import axios from 'axios'

import { Message } from 'iview'

import vm from "../main.js"
//取消请求
let CancelToken = axios.CancelToken;


// axios.defaults.headers = {
//     'X-Requested-With': 'XMLHttpRequest'
// }
// 请求超时的时间限制
axios.defaults.timeout = 200000
axios.defaults.baseURL = baseUrl;
//session 要设置为true
axios.defaults.withCredentials = true;
// 开始设置请求 发起的拦截处理
// config 代表发起请求的参数的实体
axios.interceptors.request.use(config => {
  let token =sessionStorage.getItem('SET_TOKEN')
  if (token && token!='') {
    config.headers.common['Authorization'] =token
  }

  // config.headers = {
  //   'Content-Type':"application/x-www-form-urlencoded", //配置请求头
  //   // 'Content-Type':'application/x-www-form-urlencoded', //配置请求头
  // }

  // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
  // 如果没有 requestName 就默认添加一个 不同的时间戳
  let requestName
  if (config.method === 'post') {
    if (config.data && config.data.requestName) {
      requestName = config.data.requestName;
    } else {
      requestName = new Date().getTime();
    }
  } else {
    if (config.params && config.params.requestName) {
      requestName = config.params.requestName;
    } else {
      requestName = new Date().getTime();
    }
  }
  // 判断，如果这里拿到的参数中的 requestName 在上一次请求中已经存在，就取消上一次的请求
  // if (requestName) {
  //   if (axios[requestName] && axios[requestName].cancel) {
  //     axios[requestName].cancel()
  //   }
  //   config.cancelToken = new CancelToken(c => {
  //     axios[requestName] = {}
  //     axios[requestName].cancel = c
  //   })
  // }
  return config;
}, error => {
  return Promise.reject(error);
})

// 请求到结果的拦截处理
axios.interceptors.response.use(config => {
  // 返回请求正确的结果
  return config;

}, error => {
  // 错误的请求结果处理，这里的代码根据后台的状态码来决定错误的输出信息

  if (error && error.response) {
    switch (error.response.status) {
      case 400:
        error.message = '错误请求';
        break;
      case 401:
        error.message = '未授权，请重新登录';
        break;
      case 403:
        error.message = '拒绝访问';
        break;
      case 404:
        error.message = '请求错误,未找到该资源';
        break;
      case 405:
        error.message = '请求方法未允许';
        break;
      case 408:
        error.message = '请求超时';
        break;
      case 500:
        error.message = '服务器端出错';
        break;
      case 501:
        error.message = '网络未实现';
        break;
      case 502:
        error.message = '网络错误';
        break;
      case 503:
        error.message = '服务不可用';
        break;
      case 504:
        error.message = '网络超时';
        break;
      case 505:
        error.message = 'http版本不支持该请求';
        break;
      default:
        error.message = `连接错误${error.response.status}`;
    }
  } else {
    error.message = "连接到服务器失败";
    // console.log(router)
    if(sessionStorage.getItem("tokenMessage")){
      sessionStorage.setItem("tokenMessage", false)
      Message.error({
        content: 'token已经过期请重新登陆！',
        duration: 1
      });
    }
    sessionStorage.clear()
    // Message.error("token已经过期请重新登陆！")
    vm.$router.push({path: '/login'})
  }
  return Promise.reject(error.message);
})
// 将axios 的 post 方法，绑定到 vue 实例上面的 $post
var qs = require('qs');
Vue.prototype.$Loginpost = function (url, params) {

  return new Promise((resolve, reject) => {
    axios.post(url,qs.stringify(params) )
      .then(res => {
        resolve(res)
      }).catch(err => {
        reject(err)
      })
  })
}

Vue.prototype.$post = function (url, params,headers) {
  var header=""
  if(headers!='undefined'){
    header=headers
  }else{
    header="application/json;charset=UTF-8"
  }
  return new Promise((resolve, reject) => {
    axios.post(url,params,{headers: {'Content-Type': header}} )
        .then(res => {
          resolve(res)
        }).catch(err => {
      reject(err)
    })
  })
}


Vue.prototype.$postExt = function (url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        if (res.data.code == 104) {
          //没有登入
          sessionStorage.setItem("loginAuto", "2"); // 标识没有登录
        } else if (res.data.code == 105) {
          //没有权限
          sessionStorage.setItem("loginAuto", "3"); // 标识没有登录
        } else {
          resolve(res)
        }
      }).catch(err => {
        reject(err)
      })
  })
}
// 将axios 的 get 方法，绑定到 vue 实例上面的 $get
Vue.prototype.$get = function (url, params,headers) {
  
  return new Promise((resolve, reject) => {
    var header=""
    if(headers!='undefined'){
      header=headers
    }else{
      header="application/json;charset=UTF-8"
    }

    axios.get(url, {
      params: params,
    },{headers: {'Content-Type': header}}).then(res => {
      if (res.data.code == 104) {
        //没有登入
        sessionStorage.setItem("loginAuto", "2"); // 标识没有登录
      } else if (res.data.code == 105) {
        //没有权限
        sessionStorage.setItem("loginAuto", "3"); // 标识没有登录
      } else {
        resolve(res)
      }
    }).catch(err => {
      reject(err)
    })
  })
}
Vue.prototype.$getFiles = function (url, params, fileName) {
  fileName = fileName || "";
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      responseType: 'blob',
    }).then(res => {
      if (res.data.code == 104) {
        //没有登入
        sessionStorage.setItem("loginAuto", "2"); // 标识没有登录
      } else if (res.data.code == 105) {
        //没有权限
        sessionStorage.setItem("loginAuto", "3"); // 标识没有登录
      } else {
        let url = window.URL.createObjectURL(res.data);
        let link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        link.setAttribute('download', res.headers.pragma ? decodeURI(res.headers.pragma) : "附件.rar");
        document.body.appendChild(link);
        link.click();
        resolve(res);
      }
    }).catch(err => {
      reject(err)
    })
  })
}

/**
 * delete
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
 Vue.prototype.$delete=function(url, params) {
  return new Promise((resolve, reject) => {
      axios.delete(url, {params:params})
          .then(res => {
              resolve(res);
          })
          .catch(err => {
              reject(err)
          })
  });
}

/**
 * put
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
 Vue.prototype.$put=function(url, params,headers) {
  return new Promise((resolve, reject) => {
      var header=""
      if(headers!='undefined'){
        header=headers
      }else{
        header="application/json;charset=UTF-8"
      }
      axios.put(url, params,{headers: {'Content-Type': header}})
          .then(res => {
              resolve(res);
          })
          .catch(err => {
              reject(err)
          })
  });
}

export default axios
