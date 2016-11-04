import React from 'react'
import { Link } from 'react-router'
import Table from 'public/Table'
import message from 'bfd-ui/lib/message'
import DataTable from 'bfd-ui/lib/DataTable'
import env from '../../../env'
import './index.less'

const DETAIL = (env.basePath + '/detail').replace(/\/\//, '/')
const COMPARE = (env.basePath + '/compare').replace(/\/\//, '/')

export default React.createClass({

  getInitialState() {
    return {
      column: [{
        title: '排行',
        key: 'rowNum',
        render: (text, item) => {
          if (Number(item.rlSaleRate) < 0) {
            return <span className="colorRed">{text}</span>
          }
          return text
        }
      },{
        title: '商品简称',
        key: 'spShortName',
        render: (text, item) => {
          if (Number(item.rlSaleRate) < 0) {
            return <span className="colorRed">{text}</span>
          }
          return text
        }
      },{
        title: '实际销量',
        key: 'rlSaleNum',
        render: (text, item) => {
          if (Number(item.rlSaleRate) < 0) {
            return <span className="colorRed">{text}</span>
          }
          return text
        }
      },{
        title: '环比(%)',
        key: 'rlSaleRate',
        render: (text, item) => {
          if (Number(text) < 0) {
            return <span className="colorRed">{text}</span>
          }
          return text
        }
      },{
        title: '操作',
        /**
         * @param item  当前数据对象
         * @param component 当前
         * @returns {XML}  返回dom对象
         */
        render:(item, component)=> {
          return (
            <span>
              <a href='javascript:void(0)' onClick = {this.handleDetailClick.bind(this, item)}>详情</a>&nbsp;&nbsp;
              <a href='javascript:void(0)' onClick = {this.handleComparedClick.bind(this, item)}>统计</a>
            </span>
          )
        },
        key: 'operation'//注：operation 指定为操作选项和数据库内字段毫无关联，其他key 都必须与数据库内一致
      }],
      tableUrl: '',
      spIds: ''
    }
  },

  handleDetailClick(item, e) {
    e.stopPropagation()
    window.open(DETAIL+"?spId="+item.spId)
  },

  handleComparedClick(item, e) {
    e.stopPropagation()
    let spIds = this.state.spIds
    if (!spIds) {
      message.danger('您未选中任何一个商品！')
      return
    }
    window.open(COMPARE+"?spIds="+spIds)
  },

  //handleTrClick(item) {
  //  window.open(DETAIL+"?spId="+item.spId)
  //},

  handleCheckboxSelect(selectedRows) {
    let spIdArr = []
    selectedRows.map((item, i) => {
      spIdArr.push(Number(item.spId))
    })
    let spIds = spIdArr.join(',')
    this.setState({spIds})
  },

  componentDidMount() {

  },

  render() {
    let tableUrl = this.state.tableUrl

    if (this.props.params && this.props.params.id !== "all") {
      tableUrl = 'top10.json?spcId='+String(this.props.params.id)
    } else if (this.props.params && this.props.params.id === "all") {
      tableUrl = 'all.json'
    }

    if (this.props.id && this.props.id !== 'all') {
      tableUrl = 'top10.json?spcId='+String(this.props.id)
    } else if (this.props.id && this.props.id === 'all') {
      tableUrl = 'all.json'                       //  /forecast/queryAllTop20  全部商品接口
    }

    let name = this.props.location && this.props.location.query.name ? this.props.location.query.name : this.props.name  || '全部分类(TOP20)'
    return (
      <div className="function-list">
        <div className="link">
          <Link to={'/forecast'}>销量预测 </ Link> > <span>{name}</span>
        </div>
        <div className="tableContainer tableIop">
          <DataTable
            url={tableUrl}
            showPage="false"
            column= {this.state.column}
            onCheckboxSelect={this.handleCheckboxSelect}
            />
        </div>
      </div>
    )
  }
})