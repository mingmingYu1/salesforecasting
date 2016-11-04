import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Nav, NavItem } from 'bfd/Nav'
import Dept from '../Dept'
import Role from '../Role'
import User from '../User'
import env from '../../../env'
import auth from 'public/auth'
import './index.less'


const DEPT_PATH = (env.basePath + '/system/dept').replace(/\/\//, '/')
const ROLE_PATH = (env.basePath + '/system/role').replace(/\/\//, '/')
const USER_PATH = (env.basePath + '/system/user').replace(/\/\//, '/')

export default React.createClass({

  getInitialState() {
    return {
      isShow: true
    }
  },

  componentDidMount() {    //  在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）

    this.handleResize()
   // this.setNavHeight()
    window.addEventListener("resize", this.handleResize, false)
  },

  // 在组件的更新已经同步到 DOM 中之后立刻被调用。该方法不会在初始化渲染的时候调用。 使用该方法可以在组件更新之后操作 DOM 元素。
  componentDidUpdate() {
   // this.setNavHeight()
  },

  componentWillUnmount() {     //   在组件从 DOM 中移除的时候立刻被调用
    this.clearUp()
  },

  clearUp() {
    window.removeEventListener('resize', this.handleResize, false)
  },

  setNavHeight() {
    setTimeout(() => {
      let ul = ReactDOM.findDOMNode(this.refs.ul)
      let wap = document.getElementById("wrapper")
      ul ? ul.style.height = wap.clientHeight-56-30+'px' : null
    },300)
  },

  handleResize() {
    let isShow = Number(window.innerWidth) < 960
    this.setState({isShow: !isShow})
  },

  handleClickShow() {
    let isShow = this.state.isShow
    this.setState({isShow: !isShow})
  },

  //  权限控制
  hasPermission() {

    if (auth.user.type.DEPT_MANAGER !== 1  && this.props.location.pathname === DEPT_PATH) {
      return false
    }

    if (auth.user.type.ROLE_MANAGER !== 1  && this.props.location.pathname === ROLE_PATH) {
      return false
    }

    if (auth.user.type.USER_MANAGER !== 1  && this.props.location.pathname === USER_PATH) {
      return false
    }

    return true
  },

  render() {
    let show
    let marginLeft
    let spanClass
    if (this.state.isShow) {
      show = 'block'
      marginLeft = 220
      spanClass = 'glyphicon glyphicon-chevron-left'
    } else {
      show = 'none'
      marginLeft = 0
      spanClass = 'glyphicon glyphicon-chevron-right'
    }
    let style = {display: show};
    let Children = this.props.children
    const active = this.props.children ? null : 'init'

    if (!this.props.children) {
      if (auth.user.type.DEPT_MANAGER === 1) {
        Children = <Dept />
      } else if (auth.user.type.ROLE_MANAGER === 1) {
        Children = <Role />
      } else {
        Children = <User />
      }
    }

    if (!this.hasPermission()) {
      Children = <div>您无权访问该页面</div>
    }

    //    二级菜单都没有权限
    const menuTwo = auth.user.type.USER_MANAGER !== 1 && auth.user.type.ROLE_MANAGER !== 1 && auth.user.type.DEPT_MANAGER !== 1

    if (auth.user.type.SYS_MANAGER === 1 && !menuTwo) {
      return (
        <div className="body">
          <button className="btn btn-primary isShow" style={{left: marginLeft}} onClick={this.handleClickShow}>
            <span className={spanClass}></span>
          </button>
          <div className="sidebar leftNav" style={style}>
            <Nav ref="ul" href={env.basePath} className={active}>
              {auth.user.type.DEPT_MANAGER === 1 ? <NavItem href="system/dept" title="部门管理" /> : null}
              {auth.user.type.ROLE_MANAGER === 1 ? <NavItem href="system/role" title="角色管理" /> : null}
              {auth.user.type.USER_MANAGER === 1 ? <NavItem href="system/user" title="用户管理" /> : null}
            </Nav>
          </div>
          <div className="content" style={{marginLeft: marginLeft}}>
            { Children }
          </div>
        </div>
      )
    } else {
      return (
        <div>您无权访问该页面</div>
      )
    }

  }

})
