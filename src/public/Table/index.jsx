import  'bfd-bootstrap'
import  './index.less'
import  React, { PropTypes } from 'react'
import  Fetch from 'bfd-ui/lib/Fetch'
import Paging from 'bfd-ui/lib/Paging'
import { Checkbox } from 'bfd-ui/lib/Checkbox'

const Rows = React.createClass({

  getInitialState() {
    return {
      activeIndex: ""
    }
  },

  handleCheckboxChange(row) {
    row.isSelect = !row.isSelect
    this.setState({
      t: +new Date
    })

    let selectRow = []
    this.props.rows.map((item, j) => {
      if(item.isSelect) {
        selectRow.push(item)
      }
    })

    this.props.onSelect(row.isSelect, row, selectRow)
  },

  //   处理tr点击事件
  handleClickTr(item, j) {
    this.setState({activeIndex: j})
    this.props.onClickTr(item, j)
  },

  componentWillReceiveProps() {
    //   改变activeIndex的初始值
    const activeIndex = ""
    this.setState({activeIndex})
  },

  componentDidMount() {

  },

  render() {
    const rows = this.props.rows
    const column = this.props.column
    const currentPage = this.props.currentPage
    const pageSize = this.props.pageSize
    return (
      <tbody>
      {
        rows.length > 0 ?
          rows.map((item, j) => {
            let isSelect = item.isSelect || false
            let isDisabled = item.disabled || false

            //   添加样式
            let style = {}
            if(this.props.onclick) {
              style = {
                cursor: 'pointer'
              }
            }
            //    给选中tr添加active类
            // debugger
            let isActive = this.state.activeIndex === j
            let active = isActive ? 'active' : null

            let checkboxTd = null
            /*let checkboxTd = this.props.onSelect
              ? <td><Checkbox disabled={isDisabled} checked={isSelect} onChange={this.handleCheckboxChange.bind(this, item)}></Checkbox></td>
              : null*/
            return (
              <tr ref={j} className={active} key={j} style={style} onClick={this.handleClickTr.bind(this, item, j)}>
                {checkboxTd}
                {
                  column.map((columns,i) => {
                    for (let col in columns) {
                      //序号
                      if (columns[col] === 'sequence') {
                        return <td key = { String( i ) + j } > { (( currentPage-1) * pageSize ) + ( j + 1 ) }</td>
                      }
                      //操作
                      if (columns[col] == 'operation') {
                        return <td key = { String( i ) + j }> { columns['render'] ( item, this ) } </td>
                      }
                      //正常非字段编辑列
                      if (columns[col] !== 'operation' && columns[col] !== 'sequence' && col == 'key') {
                        if (typeof columns['render'] === 'function') {
                          return <td key = { String( i ) + j }> { columns['render'] ( item[columns[col]],item ) } </td>
                        }else if (columns['formatter'] === 'function') {
                          this.handleAddStyleTr(item[columns[col]], item, j)
                        } else {
                          return <td key = { String( i ) + j }>{ item[columns[col]] }</td>
                        }
                      }
                    }
                  })
                }
              </tr>
            )
          }) : <tr><td colSpan="9"><div className="align-center" ref="nothingData" ></div>暂无数据!</td></tr>
      }
      </tbody>
    )
  }
})

export default React.createClass({

  items: [],

  propTypes: {
    data: PropTypes.array,
    url: PropTypes.string,
    customProp({ data, url }) {
      if (data && url) {
        return new Error('data属性和url属性不能同时使用！')
      }
    }
  },

  getInitialState: function () {
    return {
      order: '',
      url: this.props.url || '',
      isSelectAll: false,
      items: {
        totalList: [],
        totalPageNum: 0,
        refresh: false
      },
      currentPage: this.props.currentPage || 1
    }
  },

  componentWillMount() {
    if(this.props.data) {
      this.setState({
        items: {
          totalList: this.props.data.totalList || [],
          totalPageNum: this.props.data.totalPageNum || 0,
          refresh: false
        }
      })
    }
  },

  onChange: function (params, currentPage) {
    //if( this.props.url ) {
    //  let url_ = this.props.url
    //  if(url_.indexOf('?') > -1 ) {
    //    url_ += '&' + params
    //  }else {
    //    url_ += '?' + params
    //  }
    //  this.setState( { currentPage: currentPage,url: url_  } )
    //}
  },

  onPageChange(page){
    if(this.props.onPageChange){
      this.props.onPageChange( page )
    }
    this.setState({currentPage: page })
  },

  orderClick:function(column, i){
    if(column.order ) {
      if(this.refs[i].getAttribute('order') == null ) {
        this.refs[i].className = 'sorting_asc'
        this.refs[i].setAttribute('order','asc')
        this.setState({order: '&key=' + column['key'] + '&sort=asc'})
        return
      }
      if(this.refs[i].getAttribute('order') == 'asc' ) {
        this.refs[i].className = 'sorting_desc'
        this.refs[i].setAttribute('order', 'desc')
        this.setState({order: '&key=' + column['key'] + '&sort=desc'})
        return
      }
      if(this.refs[i].getAttribute('order') == 'desc' ) {
        this.refs[i].className = 'sorting_asc'
        this.refs[i].setAttribute('order', 'asc')
        this.setState({order:'&key=' + column['key'] + '&sort=asc'})
        return
      }
    }
  },

  handleSuccess: function ( data ) {
    this.setState({ items: data } )
  },

  refresh: function () {
    this.setState({refresh: true })
  },

  handleCheckboxAllChange() {
    const isAll = !this.state.isSelectAll
    this.setState({
      isSelectAll: isAll
    })

    let changeRows = []
    const rows = this.state.items.totalList
    rows.map((item, j) => {
      if(item.isSelect !== isAll && !item.disabled) {
        item.isSelect = isAll
        changeRows.push(item)
      }
    })

    const selectAllFn = this.props.onCheckboxSelect

    selectAllFn && selectAllFn(isAll ? rows : [])
  },

  handleCheckboxChange(checked, row, rows) {
    const selectFn = this.props.onCheckboxSelect
    selectFn && selectFn(rows)
    if(!checked) {
      this.setState({
        isSelectAll: false
      })
    }
  },

  //   表格tr点击
  handleClickTr(row, j) {
    const clickFn = this.props.onTrClick
    clickFn && clickFn(row, j)
  },

  getRowsValue(key, rows) {

  },

  render: function () {
    const self = this
    let column = this.props.column
    let totalPageNum = 0,
      currentPage = parseInt(this.state.currentPage),
      url = this.props.url,

    //新增自动分页功能 
      pageSize = this.props.howRow ? parseInt(this.props.howRow) : 1

    //如果是传入url查询数据就附带参数查询
    if (url && url !== '') {
      if( url.indexOf('?') < 0 ) {
        url += '?pageSize=' + pageSize + '&currentPage=' + this.state.currentPage
      }
      if( url.indexOf('pageSize') < 0 && url.indexOf('currentPage') < 0 && url.indexOf('?') > -1 ) {
        url += '&pageSize=' + pageSize + '&currentPage=' + this.state.currentPage
      }
    }

    //   判断是否添加tr的点击事件
    let onclick = this.props.onTrClick

    const checkboxTh = this.props.onCheckboxSelect
      ? <th><Checkbox checked={this.state.isSelectAll} onChange={this.handleCheckboxAllChange}></Checkbox></th>
      : null
    return (
      <div>
        {url != "" ? <Fetch url={url} onSuccess={this.handleSuccess} ></Fetch> : null}

        <table className = "table" >
          <thead>
          <tr>
            {checkboxTh}
            {
              column.map (( head_column, i ) => {
                const style = head_column.width ? {width: head_column.width} : {}
                return <th
                  key={head_column['title']}
                  ref={i}
                  style={style}
                  onClick={self.orderClick.bind( self, head_column, i)}
                  title = {head_column['order'] === true ? head_column['title'] + '排序' : ''} className = { head_column['order'] === true ? 'sorting' : '' } >{ head_column['title']}</th>
              })
            }
          </tr>
          </thead>

          <Rows
            rows={this.state.items.totalList}
            onSelect={this.handleCheckboxChange}
            column={this.props.column}
            currentPage={currentPage}
            pageSize={pageSize}
            onClickTr={this.handleClickTr}
            onclick={onclick}
            >
          </Rows>
        </table>

        {
          this.state.items.totalList.length > 0
            ? this.props.showPage == 'true'
            ? <Paging
            currentPage={this.state.items.currentPage}
            totalPageNum={this.state.items.totalPageNum}
            pageSize={this.props.howRow}
            onPageChange={this.onPageChange}
            onChange={this.onChange}
            >
          </Paging>
            : ''
            : ''}

      </div>
    )
  }
})
