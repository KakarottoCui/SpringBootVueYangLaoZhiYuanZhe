import axios from 'axios'
import {message, Modal, notification} from 'ant-design-vue'
import moment from 'moment'
import store from '@/store'
import db from './localstorage'
import baseUtils from './baseUtils'
moment.locale('zh-cn')

let BASE_API = process.env.BASE_API;

// 统一配置
let VUE_REQUEST = axios.create({
  baseURL: BASE_API,
  responseType: 'json',
  validateStatus (status) {
    // 200 外的状态码都认定为失败
    return status === 200
  }
})

// 拦截请求
VUE_REQUEST.interceptors.request.use((config) => {
  let expireTime = store.state.account.expireTime
  //let now = moment().format('YYYYMMDDHHmmss')
  let now = moment().format('X');
  // 让token早10秒种过期，提升“请重新登录”弹窗体验
  if (now - expireTime >= -10) {
    Modal.error({
      title: '登录已过期',
      content: '很抱歉，登录已过期，请重新登录',
      okText: '重新登录',
      mask: false,
      onOk: () => {
        return new Promise((resolve, reject) => {
          db.clear()
          location.reload()
        })
      }
    })
  }
  // 有 token就带上
  if (store.state.account.token) {
    config.headers.Authentication = store.state.account.token
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// 拦截响应
VUE_REQUEST.interceptors.response.use((response) => {
  let resultCode = response.data.code; //系统返回码
  let result = response.data; //系统返回的数据
  //此处处理系统的业务异常
  //此处判断返回码是不是200 在返回码不为空才判断
  if(!baseUtils.isNull(resultCode) && resultCode != 200) {
    switch (resultCode) {
      case 404:
        notification.error({
          message: '系统提示',
          description: '很抱歉，资源未找到',
          duration: 5
        })
        break
      case 500:
        notification.error({
          message: '系统提示',
          description: '系统异常',
          duration: 5
        })
        break
      case 403:
      case 401:
      default:
        notification.error({
          message: result.message,
          description: '业务异常，状态码 : ' + resultCode,
          duration: 5
        })
        break
    }
  }
  return response
}, (error) => { //抓取到HTTP的异常的状态码
  if (error.response) {
    let result = error.response.data;
    let errorMessage = result === null ? '系统内部异常，请联系网站管理员' : result.message
    let resultCode = error.response.data.code;
    console.log(resultCode)
    //对返回码值进行判断
    switch (resultCode) {
      case 404:
        notification.error({
          message: '系统提示',
          description: '很抱歉，资源未找到',
          duration: 5
        })
        break
      case 500:
        notification.error({
          message: '系统提示',
          description: '系统异常',
          duration: 5
        })
        break
      //以下几种异常需要跳转到首页
      case 403:
      case 401:
        notification.warn({
          message: '系统提示',
          description: result.message,
          duration: 5
        });
        return new Promise((resolve, reject) => {
          db.clear();
          location.reload();
        })
        break
      case '0000007':
        notification.warn({
          message: '系统提示',
          description: result.message,
          duration: 5
        });
        return new Promise((resolve, reject) => {
          db.clear();
          location.reload();
        })
        break
      default:
        notification.error({
          message: '系统提示',
          description: errorMessage,
          duration: 5
        })
        break
    }
  }
  return Promise.reject(error)
})

const request = {
  //发送post请求
  postBodyRequest (url, params) {
    return VUE_REQUEST.post(url, params, {
      //设置Header
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //发送post请求
  post (url, params) {
    return VUE_REQUEST.post(url, params, {
      transformRequest: [(params) => {
        let result = ''
        Object.keys(params).forEach((key) => {
          if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
          }
        })
        return result
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        //'Content-Type': 'application/json'
      }
    })
  },
  //发送post的form请求
  postFormRequest (url, params) {
    return VUE_REQUEST.post(url, params, {
      transformRequest: [(params) => {
        let result = ''
        Object.keys(params).forEach((key) => {
          if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
          }
        })
        return result
      }],
      headers: {
        'Content-Type': 'multipart/form-data'
        //'Content-Type': 'application/json'
      }
    })
  },
  //发送put请求
  putBodyRequest (url, params) {
    return VUE_REQUEST.put(url, params, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
  },
  //发送put请求
  put (url, params) {
    return VUE_REQUEST.put(url, params, {
      transformRequest: [(params) => {
        let result = ''
        Object.keys(params).forEach((key) => {
          if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
          }
        })
        return result
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  },
  //get请求封装
  get (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return VUE_REQUEST.get(`${url}${_params}`)
  },
  delete (url, params) {
    let _params
    if (Object.is(params, undefined)) {
      _params = ''
    } else {
      _params = '?'
      for (let key in params) {
        if (params.hasOwnProperty(key) && params[key] !== null) {
          _params += `${key}=${params[key]}&`
        }
      }
    }
    return VUE_REQUEST.delete(`${url}${_params}`)
  },
  exportData (url, params = {}) { //导出数据方法封装
    message.loading('正在导出数据')
    return VUE_REQUEST.post(url, params, {
      //设置Header
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'blob'
    }).then((r) => {
      const content = r.data
      const blob = new Blob([content])
      const fileName = `${new Date().getTime()}-导出结果.xlsx`
      if ('download' in document.createElement('a')) {
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      } else {
        navigator.msSaveBlob(blob, fileName)
      }
    }).catch((r) => {
      console.error(r)
      message.error('导出失败')
    })
  },
  export (url, params = {}) { //导出数据方法封装
    message.loading('正在导出数据')
    return VUE_REQUEST.post(url, params, {
      transformRequest: [(params) => {
        let result = ''
        Object.keys(params).forEach((key) => {
          if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
          }
        })
        return result
      }],
      headers: {
        'Content-Type': 'application/json'
      },
      responseType: 'blob'
    }).then((r) => {
      const content = r.data
      const blob = new Blob([content])
      const fileName = `${new Date().getTime()}-导出结果.xlsx`
      if ('download' in document.createElement('a')) {
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      } else {
        navigator.msSaveBlob(blob, fileName)
      }
    }).catch((r) => {
      console.error(r)
      message.error('导出失败')
    })
  },
  download (url, params, filename) {
    message.loading('文件传输中')
    return VUE_REQUEST.post(url, params, {
      transformRequest: [(params) => {
        let result = ''
        Object.keys(params).forEach((key) => {
          if (!Object.is(params[key], undefined) && !Object.is(params[key], null)) {
            result += encodeURIComponent(key) + '=' + encodeURIComponent(params[key]) + '&'
          }
        })
        return result
      }],
      responseType: 'blob'
    }).then((r) => {
      const content = r.data
      const blob = new Blob([content])
      if ('download' in document.createElement('a')) {
        const elink = document.createElement('a')
        elink.download = filename
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href)
        document.body.removeChild(elink)
      } else {
        navigator.msSaveBlob(blob, filename)
      }
    }).catch((r) => {
      console.error(r)
      message.error('下载失败')
    })
  },
  upload (url, params) {
    return VUE_REQUEST.post(url, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }
}

export default request
