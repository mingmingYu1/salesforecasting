import React, { PropTypes } from 'react'
import { Link } from 'react-router'
import { Nav, NavItem } from 'bfd/Nav'
import xhr from 'bfd/xhr'
import auth from 'public/auth'
import confirm from 'bfd-ui/lib/confirm'
import env from './env'
import './App.less'

const LOGIN_PATH = (env.basePath + '/login').replace(/\/\//, '/')
const FORECAST_PATH = (env.basePath + '/forecast').replace(/\/\//, '/')
const HISTORY_PATH = (env.basePath + '/history').replace(/\/\//, '/')
const SYSTEM_PATH = (env.basePath + '/system').replace(/\/\//, '/')

const App = React.createClass({

  contextTypes: {
    history: PropTypes.object
  },

  getInitialState() {
    return {
      // 用户是否登录
      loggedIn: auth.isLoggedIn()
    }
  },

  componentWillMount() {
    // 页面加载后判断是否需要跳转到登录页
    if (!this.state.loggedIn && !this.isInLogin()) {
      this.login()
    }
  },

  componentWillReceiveProps() {
    this.setState({
      loggedIn: auth.isLoggedIn()
    })
  },

  // 当前 URL 是否处于登录页
  isInLogin() {
    return this.props.location.pathname === LOGIN_PATH
  },

  // 权限判断
  hasPermission() {
    // ...根据业务具体判断
    if ( auth.user.type.SALES_FORECAST !== 1  && this.props.location.pathname === FORECAST_PATH ) {
      return false
    }
    if ( auth.user.type.SALES_HISTORY !== 1  && this.props.location.pathname === HISTORY_PATH ) {
      return false
    }
    if ( auth.user.type.SYS_MANAGER !== 1  && this.props.location.pathname === SYSTEM_PATH ) {
      return false
    }
    return true
  },

  // 跳转到登录页
  login() {
    this.context.history.replaceState({
      referrer: this.props.location.pathname
    }, LOGIN_PATH)
  },

  // 安全退出
  handleLogout(e) {
    e.preventDefault()
    confirm('您确认退出吗？', () => {
      xhr({
        url: 'logout.json',
        success: () => {
          auth.destroy()
          this.login()
        }
      })
    })

  },

  render() {

    let Children = this.props.children

    // 当前 URL 属于登录页时，不管是否登录，直接渲染登录页
    if (this.isInLogin()) return Children

    if (this.state.loggedIn) {

      if (!this.hasPermission()) {
        Children = <div>您无权访问该页面</div>
      }

      return (
        <div id="wrapper">
          {Children}
          <div id="header">
            <div className="logo pull-left">
              <img src={require('public/logo.png')} />
            </div>
            <Nav href={env.basePath} className="headerNav pull-left">
              {auth.user.type.SALES_FORECAST === 1 ? <NavItem href="forecast" title="销量预测" /> : null}
              {auth.user.type.SALES_HISTORY === 1 ? <NavItem href="history" title="辅助管理" /> : null}
              {auth.user.type.SYS_MANAGER === 1 ? <NavItem href="system" title="系统管理" /> : null}
            </Nav>
            <div className="pull-right headerList">
              欢迎您，{auth.user.name} &nbsp;|&nbsp;
              <a href="" onClick={this.handleLogout}>安全退出</a>
            </div>
          </div>
          <div id="footer"> Copyright © 2016 All rights reserved. 前海云游版权所有 </div>
        </div>
      )
    } else {
      return null
    }
  }
})

export default App