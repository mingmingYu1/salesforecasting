import React from 'react'
import env from '../../env'
import auth from 'public/auth'

//     此页面用于跳转index页面

export default React.createClass({

  componentWillMount() {            //   仅挂载前调用一次
    // 页面加载后判断是否需要跳转到登录页
    if (auth.user.type.SALES_FORECAST === 1) {
      this.props.history.replaceState(null, (env.basePath + '/forecast').replace(/\/\//, '/'))
      return
    }

    if (auth.user.type.SALES_FORECAST !== 1 && auth.user.type.SALES_HISTORY === 1) {
      this.props.history.replaceState(null, (env.basePath + '/history').replace(/\/\//, '/'))
      return
    }

    if (auth.user.type.SALES_FORECAST !== 1 && auth.user.type.SALES_HISTORY !== 1) {
      this.props.history.replaceState(null, (env.basePath + '/system').replace(/\/\//, '/'))
    }

  },

  render() {
    return (
      <div className="function-overview"></div>
    )
  }
})