import React from 'react'
import Fetch from 'bfd-ui/lib/Fetch'
import DataTable from 'bfd-ui/lib/DataTable'
import Button from 'bfd-ui/lib/Button'
import Icon from 'bfd-ui/lib/Icon'
import { Tabs, TabList, Tab, TabPanel } from 'bfd-ui/lib/Tabs'
import Echarts from 'public/Echarts'
import './index.less'

export default React.createClass({

  getInitialState() {
    //     获得传递过来的参数
    const query = window.location.search.substring(1)
    const values= query.split("&")
    const param = {}
    for(let i = 0; i < values.length; i++) {
      let pos = values[i].indexOf('=')
      if (pos == -1) continue
      let paramName = values[i].substring(0, pos)
      param[paramName] = values[i].substring(pos+1)
    }
    return {
      param: param,
      activeIndex: 0,
      aActive: true,
      data: {},
      chartData: {
        xAxisData: [],
        realSaleData: [],
        forecastSaleData: []
      },
      column: [
        {
        title:'序号',
        key:'rowNum',
        render: (text, item) => {
          if (!item.rlSaleNum) {
            return <span className="colorRed">{text}</span>
          }
          return text
        }
      }, {
        title: '时间',
        key: 'statDate',
        render: (text, item) => {
          if (!item.rlSaleNum) {
            return <span className="colorRed">{text}</span>
          }
          return text
        }
      }, {
        title: '历史销量',
        key: 'rlSaleNum',
        render: (text, item) => {
          if (!text) {
            return <span className="colorRed">-</span>
          }
          return text
        }
      }, {
        title: '预测销量',
        key: 'spForecastSaleNum',
        render: (text, item) => {
          if (!item.rlSaleNum) {
            return <span className="colorRed">{text}</span>
          }
          return text
        }
      }, {
        title: '预测区间',
        key: 'spForecastSaleRange',
        render: (text, item) => {
          if (!item.rlSaleNum) {
            return <span className="colorRed">{text}</span>
          }
          return text
        }
      }
      ],
      tableUrl: 'detail/listTableDay.json?spId='+String(param.spId),      //    /product/queryDailySalesForecastTable
      chartUrl: 'detail/listChartDay.json?spId='+String(param.spId)       //    /product/queryDailySalesForecastChart
    }
  },

  handleSuccess(data) {
    this.setState({data})
  },

  handleDay() {
    this.setState({
      activeIndex: 0,
      tableUrl: 'detail/listTableDay.json?spId='+String(this.state.param.spId),
      chartUrl: 'detail/listChartDay.json?spId='+String(this.state.param.spId)
    })
  },

  handleWeek() {
    this.setState({
      activeIndex: 1,
      //   /product/queryWeeklySalesForecastTable
      tableUrl: 'detail/listTableWeek.json?spId='+String(this.state.param.spId),
      //    /product/queryWeeklySalesForecastChart
      chartUrl: 'detail/listChartWeek.json?spId='+String(this.state.param.spId)
    })
  },

  handleMonth() {
    console.log('月')
    //   /product/queryMonthlySalesForecastChart
    //   /product/queryMonthlySalesForecastTable
    this.setState({activeIndex: 2})
  },

  handleChart(e) {
    e.preventDefault()
    this.setState({aActive: true})
  },

  handleTable(e) {
    e.preventDefault()
    this.setState({aActive: false})
  },

  handleChartSuccess(chartData) {
    this.setState({chartData})
  },

  getOption: function() {

    const  option = {
      title: {
      },
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:['实际销量','预测销量'],
        right: '3%'
      },
      dataZoom : [{
        type: 'slider',
        xAxisIndex: [0],
        backgroundColor: '#fff',
        borderColor: '#00bcd4',
        fillerColor: '#e0f7fa',
        handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        },
        textStyle: {
          color: '#00bcd4'
        },
        start : 80,
        end : 100
      },{
        type: 'inside',
        xAxisIndex: [0],
        start : 70,
        end : 100
      }],
      grid: {
        show: true,
        borderColor: '#f5f5f5',
        left: '2%',
        right: '3%',
        top: 40,
        bottom: 60,
        containLabel: true
      },
      xAxis : [{
        type : 'category',
        boundaryGap : false,
        splitLine: {
            show: true,
            lineStyle: {
              color: "#f5f5f5"
            }
          },
        axisLabel: {
            textStyle: {
              color: '#333'
            }
          },
        axisLine: {
            lineStyle: {
              color: "#f5f5f5"
            }
          },
        axisTick: {
            show: false
          },
        data : this.state.chartData.xAxisData
      }],
      yAxis : [{
        type : 'value',
        scale: true,
        splitLine: {
            lineStyle: {
              color: "#f5f5f5"
            }
          },
        axisLabel: {
            textStyle: {
              color: '#333'
            }
          },
        axisLine: {
            lineStyle: {
              color: "#f5f5f5"
            }
          },
        axisTick: {
            show: false
          },
        name: '销量',
        nameTextStyle: {
            color: '#333'
          },
        min: 0
      }],
      series : [
        {
          name:'实际销量',
          type:'line',
          symbolSize: 8,
          smooth: true,
          itemStyle: {
            normal: {
              color: '#98d8f5'
            }
          },
          areaStyle: {
            normal: {
              color: '#caedfd'
            }
          },
          data: this.state.chartData.realSaleData
        },
        {
          name:'预测销量',
          type:'line',
          smooth: true,
          symbolSize: 8,
          itemStyle: {
            normal: {
              color: '#ffa689'
            }
          },
          areaStyle: {
            normal: {
              color: '#ffdcd0'
            }
          },
          data: this.state.chartData.forecastSaleData
        }
      ]
    };

    return option
  },

  onPageChange() {},

  render() {
    let url = 'detail/detailList.json?spId='+String(this.state.param.spId)  //   /product/queryProductById
    let dataList = this.state.data
    let dayActive, weekActive, monthActive
    let activeIndex = this.state.activeIndex
    if (activeIndex === 0) {
      dayActive = 'active'
    } else if (activeIndex === 1) {
      weekActive = 'active'
    } else if (activeIndex === 2) {
      monthActive = 'active'
    }
    let chartActive, tableActive
    let styleChart = {
      display: 'block'
    }
    let styleTable = {
      display: 'none'
    }
    if (this.state.aActive) {
      chartActive = 'active'
      styleChart = {
        display: 'block'
      }
      styleTable = {
        display: 'none'
      }
    } else {
      tableActive = 'active'
      styleChart = {
        display: 'none'
      }
      styleTable = {
        display: 'block'
      }
    }
    return (
      <div className="function-detail">
        <div className="detail-list"><span>基本信息</span></div>
        <Fetch url={url}  onSuccess={this.handleSuccess}>
          {dataList ?
            <div className="list">
              <div>
            <span>
              <span className="labelName">商品编号</span><span className="value">{dataList.spId}</span>
            </span>
            <span>
              <span className="labelName">商品简称</span><span className="value">{dataList.spShortName}</span>
            </span>
              </div>
              <div>
            <span>
              <span className="labelName">所属分类</span><span className="value">{dataList.spcName}</span>
            </span>
            <span>
              <span className="labelName">原产地简称</span><span className="value"> {dataList.sppName}</span>
            </span>
              </div>
              <div>
            <span>
              <span className="labelName">品牌名称</span><span className="value">{dataList.sbName}</span>
            </span>
            <span>
              <span className="labelName">供应商名称</span><span className="value">{dataList.spsName}</span>
            </span>
              </div>
              <div>
            <span>
              <span className="labelName">增值税率（%）</span><span className="value">{dataList.spcVatRate}</span>
            </span>
            <span>
              <span className="labelName">消费税率（%）</span><span className="value">{dataList.spcConsRate}</span>
            </span>
              </div>
              <div>
            <span>
              <span className="labelName">商品库存</span><span className="value">{dataList.spStockNumber}</span>
            </span>
            <span>
              <span className="labelName">零售价（元）</span><span className="value"> {dataList.spRetailPrice}</span>
            </span>
              </div>
            </div> : null
          }
        </Fetch>
        <div className="marginTop" style={{marginBottom: 20}}>
          <div className="tabTitle">
            <div className="pull-left">
              <Button className={dayActive} type="primary" onClick={this.handleDay}>日销售量预测</Button>
              <Button className={weekActive} type="primary" onClick={this.handleWeek}>周销售量预测</Button>
              <Button className={monthActive} type="primary" onClick={this.handleMonth}>月销售量预测</Button>
            </div>
            <div className="pull-right">
              <a className={chartActive} href="javascript: void(0)" onClick={this.handleChart}><Icon type="area-chart"/></a>
              <a className={tableActive} href="javascript: void(0)" onClick={this.handleTable}><Icon type="list"/></a>
            </div>
          </div>
          <div>
            <div className="tabList" style={styleChart}>
              <Fetch url={this.state.chartUrl}  onSuccess={this.handleChartSuccess}>
                <div>
                  <Echarts option={this.getOption()} style={{height: '400px', width: '100%'}}  className='' />
                </div>
              </Fetch>
            </div>
            <div className="tabList" style={styleTable}>
              <div className="tableContainer" style={{marginBottom: 30}}>
                <DataTable url={this.state.tableUrl} onPageChange={this.onPageChange}  showPage="true"  column={this.state.column}
                           howRow={10} />
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})