import React, { PropTypes } from 'react'
import ReactDOM from 'react-dom'
import { Nav, NavItem } from 'bfd/Nav'
import xhr from 'bfd-ui/lib/xhr'
import List from '../List'
import auth from 'public/auth'
import env from '../../../env'

const ALL_PATH = (env.basePath + '/forecast/list/all').replace(/\/\//, '/')
const CATE_PATH = (env.basePath + '/forecast/list').replace(/\/\//, '/')

export default React.createClass({

  getInitialState() {
    return {
      data: [],
      isShow: true
    }
  },

  componentDidMount() {    //  在初始化渲染执行之后立刻调用一次，仅客户端有效（服务器端不会调用）
    xhr({
      type: 'get',
      url: 'nav.json',    //    /common/queryTopCategory
      success: this.handleSuccess
    })
    //setTimeout(() => {
    //  this.setNavHeight()
    //},300)

    this.handleResize()
    window.addEventListener("resize", this.handleResize, false)
  },

  componentWillUnmount() {   //   在组件从 DOM 中移除的时候立刻被调用
    this.clearUp()
  },

  // 在组件的更新已经同步到 DOM 中之后立刻被调用。该方法不会在初始化渲染的时候调用。 使用该方法可以在组件更新之后操作 DOM 元素。
  componentDidUpdate() {
    //setTimeout(() => {
    //  this.setNavHeight()
    //},300)
  },

  setNavHeight() {
    let ul = ReactDOM.findDOMNode(this.refs.ul)
    let wap = document.getElementById("wrapper")
    ul ? ul.style.height = wap.clientHeight-56-30+'px' : null
  },

  clearUp() {
    window.removeEventListener('resize', this.handleResize, false)
  },

  handleResize() {
    let isShow = Number(window.innerWidth) < 960
    this.setState({isShow: !isShow})
  },

  handleClickShow() {
    let isShow = this.state.isShow
    this.setState({isShow: !isShow})
  },

  handleSuccess(data) {
    this.setState({data})
  },

  hasPermission() {

    if (auth.user.type.SALES_FORECAST_ALL !== 1  && this.props.location.pathname === ALL_PATH) {
      return false
    }

    if (auth.user.type.SALES_FORECAST_CATE !== 1  && this.props.location.pathname.search('list') !== -1 && this.props.location.pathname !== ALL_PATH) {
      return false
    }
    return true
  },

  render() {
    let show
    let marginLeft
    let spanClass
    let id, name
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

    if (auth.user.type.SALES_FORECAST_ALL === 1) {
      id = 'all'
      name = '全部分类(TOP20)'
    } else if (auth.user.type.SALES_FORECAST_CATE === 1) {
      if (this.state.data.length > 0) {
        id = this.state.data[0].spcId
        name = this.state.data[0].spcName + '(TOP10)'
      }
    }

    if (!this.props.children) {
      Children = <List id={id} name={name}/>
    }

    if (!this.hasPermission()) {
      Children = <div>您无权访问该页面</div>
    }

    const menuTwo = auth.user.type.SALES_FORECAST_ALL !== 1 && auth.user.type.SALES_FORECAST_CATE !== 1

    if (auth.user.type.SALES_FORECAST === 1 && !menuTwo) {
      return (
        <div className="body">
          <button className="btn btn-primary isShow" style={{left: marginLeft}} onClick={this.handleClickShow}>
            <span className={spanClass}></span>
          </button>
          <div className="sidebar leftNav" style={style}>
            <Nav ref="ul" href={env.basePath} className={active}>
              {
                auth.user.type.SALES_FORECAST_ALL === 1 ? <NavItem href="forecast/list/all" title="全部分类(TOP20)"/> : null
              }
              {
                auth.user.type.SALES_FORECAST_CATE === 1 ?
                  this.state.data.map(
                    (item, i) => <NavItem query={{name: item.spcName+'(TOP10)'}} title={item.spcName+'(TOP10)'} key={i} href={'forecast/list/'+item.spcId}/>
                  ) : null
              }
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
