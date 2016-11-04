import React from 'react'
import { Link } from 'react-router'
import { Select, Option } from 'bfd-ui/lib/Select'
import { DateRange } from 'bfd-ui/lib/DatePicker'
import Button from 'bfd-ui/lib/Button'
import DataTable from 'bfd-ui/lib/DataTable'
import message from 'bfd-ui/lib/message'
import './index.less'

export default React.createClass({

  getInitialState() {
    let date = new Date().valueOf()-24*3600*1000
    return {
      selectCategory: "",
      selectProduct: "",
      date: 'day',
      max: date,
      start: date,
      end: date,
      column: [
        {
        title:'排名',
        key:'rowNum'
      }, {
        title: '商品简称',
        key: 'spShortName'
      }, {
        title: '合计销量',
        key: 'rlSaleNum'
      }, {
        title: '合计销售额（元）',
        key: 'rlSaleAmt'
      }
      ],
      tableUrl: 'history/table.json?startDate='+date+'&endDate='+date                              //      /history/queryHistorySingleSales
    }
  },

  handleSelectCategory(selectCategory) {
    this.setState({selectCategory})
  },

  handleSelectProduct(selectProduct) {
    this.setState({selectProduct})
  },

  handleSelectDateRange(start, end) {
    this.setState({start: start, end: end})
  },

  handleSelectDate(date) {
    if (date === "day") {
      this.setState({
        start: new Date().valueOf()-24*3600*1000,
        end: new Date().valueOf()-24*3600*1000,
        date
      })
      return
    }
    if (date === "week") {
      this.setState({
        start: new Date().valueOf()-7*24*3600*1000,
        end: new Date().valueOf()-24*3600*1000,
        date
      })
      return
    }
    if (date === "month") {
      let thisDate = new Date()
      let newDate = new Date(thisDate.valueOf()-thisDate.getDate()* 24 * 60 * 60 * 1000 )
      let thisDay = thisDate.getDate()
      let newDay = newDate.getDate()
      let retDay = new Date(thisDate.setMonth((thisDate.getMonth()-1)))
      let start
      if (thisDay > newDay) {
        start = newDate.valueOf()
      } else {
        start = retDay.valueOf()
      }
      this.setState({
        start: start,
        end: new Date().valueOf()-24*3600*1000,
        date
      })
    }
  },

  handleClickResize() {
    let date = new Date().valueOf()-24*3600*1000
    this.setState({
      selectCategory: "",
      selectProduct: "",
      date: 'day',
      start: date,
      end: date,
      tableUrl: 'history/table.json?startDate='+date+'&endDate='+date
    })
  },

  //   查询
  handleClick() {
    //      /history/queryHistorySingle
    if (!this.state.start) {
      message.danger('起始时间不可为空！')
      return
    }
    if (!this.state.end) {
      message.danger('结束时间不可为空！')
      return
    }
    this.setState({
      tableUrl: 'history/table.json?startDate='+this.state.start+'&endDate='+this.state.end+'&topCate='+this.state.selectCategory+'&proSupplier='+this.state.selectProduct
    })
  },

  onPageChange() {},

  render() {

    //  /common/queryTopCategory
    const renderCategory = item => <Option value={item.spcId}>{item.spcName}</Option>

    //   /common/queryProductSuppliers
    const renderProduct = item => <Option value={item.spsCode}>{item.spsName}</Option>

    return (
      <div className="function-single">
        <div className="link">
          <Link to={'/history'}>辅助管理</ Link> > <span>单品历史销量排行</span>
        </div>
        <div className="firstSelect">
          <div className="inlineBlock">
            <div className="inlineBlock">
              <span>商品分类：</span>
              <Select url="nav.json" render={renderCategory} value={this.state.selectCategory}
                      defaultOption={<Option value="">全部</Option>} onChange={this.handleSelectCategory}/>
            </div>
            <div className="inlineBlock">
              <span>供应商：</span>
              <Select url="history/product.json" render={renderProduct} value={this.state.selectProduct}
                      defaultOption={<Option value="">全部</Option>} onChange={this.handleSelectProduct}/>
            </div>
          </div>
          <div className="inlineBlock">
            <div className="inlineBlock">
              <span>选择时间：</span>
              <DateRange
                onSelect={this.handleSelectDateRange}
                max={this.state.max}
                start={this.state.start}
                end={this.state.end}
                />
            </div>
            <div className="inlineBlock">
              <Select onChange={this.handleSelectDate} value={this.state.date}>
                <Option value="day">近一天</Option>
                <Option value="week">近一周</Option>
                <Option value="month">近一月</Option>
              </Select>
            </div>
          </div>
          <div className="inlineBlock">
            <Button type="primary" onClick={this.handleClick}>查询</Button>
            <Button type="primary" onClick={this.handleClickResize}>重置</Button>
          </div>
        </div>
        <div className="tableContainer">
          <DataTable
            url={this.state.tableUrl}
            onPageChange={this.onPageChange}
            showPage="true"
            column={this.state.column}
            howRow={10} >
          </DataTable>
        </div>
      </div>
    )
  }
})