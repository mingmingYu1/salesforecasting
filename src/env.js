/**
 * 开发环境、线上环境的不同配置
 */

var env = {}

if (process.env.NODE_ENV === 'production') {

  /**
   * 线上环境
   */
  
  // 数据接口基础 URL
  env.baseUrl = '/api'

  // 页面根路径
  env.basePath = '/bre'

} else {

  /**
   * 开发环境
   */

  // 数据接口基础 URL
  env.baseUrl = 'http://localhost:9000/data'

  // 页面根路径
  env.basePath = '/'

}

module.exports = env