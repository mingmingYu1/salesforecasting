import React,{ PropTypes } from 'react'
import Fetch from 'bfd-ui/lib/Fetch'
import Button from 'bfd-ui/lib/Button'
import echarts from 'echarts'
import Echarts from 'public/Echarts'
import message from 'bfd-ui/lib/message'
import './index.less'

const Compare = React.createClass({

  getChildContext() {
    return {
      parentCompare: this
    }
  },

  getInitialState() {
    console.log(111)
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
      echartsConnect: true,
      chartUrl: 'chartDay.json?spIds='+param.spIds,    //    queryDailySalesComp
      chartData: {legendData: [], xAxisData: [], realSaleData: [], forecastSaleData: []}
    }
  },

  componentDidMount() {
    echarts.connect("group2")
  },

  handleChartSuccess(chartData) {
    if (!chartData || !chartData.xAxisData) {
      message.danger('暂无数据！')
      this.setState({
        chartData: {legendData: [], xAxisData: [], realSaleData: [], forecastSaleData: []}
      })
    } else {
      this.setState({chartData})
    }
  },

  handleDay() {
    //    queryDailySalesComp
    this.setState({activeIndex: 0})
  },

  handleWeek() {
    //   queryWeeklySalesComp
    this.setState({activeIndex: 1})
  },

  handleMonth() {
    //  queryMonthlySalesComp
    this.setState({activeIndex: 2})
  },

  getData() {
    let {chartData} = this.state
    let xAxisData = chartData.xAxisData
    let legendData = chartData.legendData
    let forecastSaleData = chartData.forecastSaleData
    let realSaleData = chartData.forecastSaleData
    let data = [], selected = {}, seriesForecast = [], seriesReal = [], chartDataObj

    legendData.map((item, i) => {
      if (i < 10) {
        selected[item] = true
      } else {
        selected[item] = false
      }
      data.push(item)
    })

    forecastSaleData.map((item, i) => {
      let seriesData = {name: legendData[i], type:'line', symbolSize: 8, data: item}
      seriesForecast.push(seriesData)
    })

    realSaleData.map((item, i) => {
      let seriesData = {name: data[i], type:'line', symbolSize: 8, data: item}
      seriesReal.push(seriesData)
    })

    chartDataObj = {
      xAxisData: xAxisData,
      data: data,
      seriesForecast: seriesForecast,
      seriesReal: seriesReal,
      selected: selected
    }

    return chartDataObj
  },

  getForecastOption() {

    let chartDataObj = this.getData()

    const  option = {
      title: {},
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data: chartDataObj.data,
        right: '3%',
        selected: chartDataObj.selected
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
        top: 300,
        //startValue : startValue,
        start: 20,
        end : 100
      },{
        type: 'inside',
        xAxisIndex: [0],
        start: 20,
        // startValue : startValue,
        end : 100
      }],
      grid: {
        show: true,
        borderColor: '#f5f5f5',
        left: '2%',
        right: '3%',
        top: 40,
        bottom: 20,
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
        data : chartDataObj.xAxisData
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
        name: '预测销量',
        nameTextStyle: {
          color: '#333'
        },
        min: 0
      }],
      series : chartDataObj.seriesForecast
    }

    return option
  },

  getRealSaleOption() {
    let chartDataObj = this.getData()

    const  option = {
      title: {},
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data: chartDataObj.data,
        right: '3%',
        top: -30,
        selected: chartDataObj.selected
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
        //startValue : startValue,
        start: 20,
        end : 100
      },{
        type: 'inside',
        xAxisIndex: [0],
        start: 20,
        // startValue : startValue,
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
        data : chartDataObj.xAxisData
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
        name: '实际销量',
        nameTextStyle: {
          color: '#333'
        },
        min: 0
      }],
      series : chartDataObj.seriesForecast
    }

    return option
  },

  render() {

    let dayActive, weekActive, monthActive
    let activeIndex = this.state.activeIndex
    if (activeIndex === 0) {
      dayActive = 'active'
    } else if (activeIndex === 1) {
      weekActive = 'active'
    } else if (activeIndex === 2) {
      monthActive = 'active'
    }

    return (
      <div className="function-compare">
        <div className="tabTitle">
          <Button className={dayActive} type="primary" onClick={this.handleDay}>日销售量预测</Button>
          <Button className={weekActive} type="primary" onClick={this.handleWeek}>周销售量预测</Button>
          <Button className={monthActive} type="primary" onClick={this.handleMonth}>月销售量预测</Button>
        </div>
        <div className="charts">
          <Fetch url={this.state.chartUrl}  onSuccess={this.handleChartSuccess}/>
          <Echarts option={this.getForecastOption()} style={{height: '300px', width: '100%'}} />
          <Echarts option={this.getRealSaleOption()} style={{height: '320px', width: '100%'}} />
        </div>
      </div>
    )
  }
})

Compare.childContextTypes = {
  parentCompare: PropTypes.instanceOf(Compare)
}

export default Compare