import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Nav, NavItem } from 'bfd/Nav'
import Sales from '../Sales'
import Single from '../Single'
import auth from 'public/auth'
import env from '../../../env'

const SALES_PATH = (env.basePath + '/history/sales').replace(/\/\//, '/')
const SINGLE_PATH = (env.basePath + '/history/single').replace(/\/\//, '/')

const Index = React.createClass({

  getChildContext() {
    return {
      index: this
    }
  },

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

  componentWillUnmount() {
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
    },100)
  },

  handleResize() {
    let isShow = Number(window.innerWidth) < 960
    this.setState({isShow: !isShow})
  },

  handleClickShow() {
    let isShow = this.state.isShow
    this.setState({isShow: !isShow})
  },

  hasPermission() {

    if (auth.user.type.SALES_HISTORY_COUNT !== 1  && this.props.location.pathname === SALES_PATH) {
      return false
    }

    if (auth.user.type.SALES_HISTORY_SINGLE !== 1  && this.props.location.pathname === SINGLE_PATH) {
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

    if (!this.props.children) {
      if (auth.user.type.SALES_HISTORY_COUNT === 1) {
        Children = <Sales />
      } else if (auth.user.type.SALES_HISTORY_SINGLE === 1) {
        Children = <Single />
      }

    }

    if (!this.hasPermission()) {
      Children = <div>您无权访问该页面</div>
    }

    const active = this.props.children ? null : 'init'

    //    二级菜单都没有权限
    const menuTwo = auth.user.type.SALES_HISTORY_COUNT !== 1 && auth.user.type.SALES_HISTORY_SINGLE !== 1

    if (auth.user.type.SALES_HISTORY === 1 && !menuTwo) {
      return (
        <div className="body">
          <button className="btn btn-primary isShow" style={{left: marginLeft}} onClick={this.handleClickShow}>
            <span className={spanClass}></span>
          </button>
          <div className="sidebar leftNav" style={style}>
            <Nav ref="ul" href={env.basePath} className={active}>
              {auth.user.type.SALES_HISTORY_COUNT === 1 ? <NavItem href="history/sales" title="历史销量统计查询" /> : null}
              {auth.user.type.SALES_HISTORY_SINGLE === 1 ? <NavItem href="history/single" title="单品历史销量排行" /> : null}
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

Index.childContextTypes = {
  index: PropTypes.instanceOf(Index)
}

export default Index