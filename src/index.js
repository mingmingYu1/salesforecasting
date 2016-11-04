/**
 * 整个应用的入口，所有资源的根源
 */

import xhr from 'bfd/xhr'
import message from 'bfd/message'
import auth from 'public/auth'
import router from './router'
import env from './env'
import pace from './pace'
import './pace.less'

pace.start()

/**
 * AJAX 全局配置，比如请求失败、会话过期的全局处理。参考 bfd-ui AJAX 请求组件
 */


xhr.baseUrl = env.baseUrl + '/'
xhr.success = (res, option) => {
  if (typeof res !== 'object') {
    message.danger(option.url + ': response data should be JSON')
    return
  }
  if (!res.code) {
    message.danger(res.message || '未知错误')
    return
  }
  switch (res.code) {
    case 200:
      option.success && option.success(res.data)
      break
    case 101:
      message.danger(res.message || '用户未登录或登录超时')
      auth.destroy()
      router.history.replaceState({
        referrer: router.state.location.pathname
      }, '/login')
      break
    case 501:
      message.danger(res.message || '传入的参数不正确')
      break
    case 502:
      message.danger(res.message || '发生未知异常，请稍后再试')
      break
    default:
      //message.danger(res.message || 'unknown error')
      option.success && option.success(res)
  }
}