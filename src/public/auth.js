/**
 * 用户会话信息，auth.user = window.user
 * auth 作为模块供其他模块使用
 */

const auth = {

  isLoggedIn() {
    return !!auth.user
  },

  register(user) {
    auth.user = user
  },

  destroy() {
    auth.user = null
  }
}

if (process.env.NODE_ENV !== 'production') {
  window.user = {
    name: '管理员',
    type: {
      SALES_FORECAST: 1,
      SALES_HISTORY: 1,
      SYS_MANAGER: 1,
      SALES_FORECAST_ALL: 1,
      SALES_FORECAST_CATE: 1,
      SALES_HISTORY_COUNT: 1,
      SALES_HISTORY_SINGLE: 1,
      DEPT_MANAGER: 1,
      ROLE_MANAGER: 1,
      USER_MANAGER: 1
    }
  }
}

auth.register(window.user)

export default auth