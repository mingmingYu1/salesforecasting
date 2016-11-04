import React, { PropTypes }from 'react'
import { Link } from 'react-router'
import Fetch from 'bfd-ui/lib/Fetch'
import DataTable from 'bfd-ui/lib/DataTable'
import { Select, Option } from 'bfd-ui/lib/Select'
import Icon from 'bfd-ui/lib/Icon'
import Button from 'bfd-ui/lib/Button'
import echarts from 'echarts';
import Echarts from 'public/Echarts'
import './index.less'

const Sales = React.createClass({

  contextTypes:{
    index: PropTypes.object
  },

  getChildContext() {
    return {
      parent: this
    }
  },

  getInitialState() {
    return {
      echartsConnect: true,
      aActive: true,
      selectDate: '1',
      selectCategory: '',
      selectProduct: '',
      chartData: {
        xAxisData: [],
        saleNumData: [],
        saleNumAccumData: [],
        saleAmtData: [],
        saleAmtAccumData: []
      },
      column: [
        {
          title:'序号',
          key:'rowNum'
        },{
          title:'时间',
          key:'rlStatDate'
        },{
          title:'累计销量',
          key:'rlSaleNumAccum'
        },{
          title:'当期销量',
          key:'rlSaleNum'
        },{
          title:'累计销售额',
          key:'rlSaleAmtAccum'
        },{
          title:'当期销售额',
          key:'rlSaleAmt'
        }
      ],
      chartUrl: 'history/chart.json?dateDim=1',   //   /history/queryHistorySalesChart
      tableUrl: 'history/salesTable.json?dateDim=1'    //   /history/queryHistorySalesTable
    }
  },

  componentDidMount() {
    echarts.connect("group1")
  },

  handleSelectDate(selectDate) {
    this.setState({selectDate})
  },

  handleSelectCategory(selectCategory) {
    this.setState({selectCategory})
  },

  handleSelectProduct(selectProduct) {
    this.setState({selectProduct})
  },

  handleClick() {
    this.setState({
      chartUrl: 'history/chart.json?dateDim='+this.state.selectDate+'&topCate='+this.state.selectCategory+'&proSupplier='+this.state.selectProduct,
      tableUrl: 'history/salesTable.json?dateDim='+this.state.selectDate+'&topCate='+this.state.selectCategory+'&proSupplier='+this.state.selectProduct
    })
  },

  handleClickResize() {
    this.setState({
      selectDate: '1',
      selectCategory: '',
      selectProduct: '',
      chartUrl: 'history/chart.json?dateDim=1',
      tableUrl: 'history/salesTable.json?dateDim=1'
    })
  },

  handleSuccess(chartData) {
    this.setState({chartData})
  },

  handleChart(e) {
    e.preventDefault()
    this.setState({aActive: true})
   // this.context.index.setNavHeight()
  },

  handleTable(e) {
    e.preventDefault()
    this.setState({aActive: false})
    // this.context.index.setNavHeight()
  },

  onPageChange() {},

  getOptionLine: function() {

    const  option = {
      title: {
      },
      tooltip : {
        trigger: 'axis',
        formatter: function (params) {
          let res = params[0].name
          const arr = []
          params.map((item, i) => {
            if (params[i].seriesName === "当期销量" || params[i].seriesName === "累计销量") {
              arr.push(i)
            }
          })
          arr.map((item) => {
            res += '<br/><span class="echartsIcon" style="background-color:'+params[item].color+'"></span>'+ params[item].seriesName+": "+params[item].value
          })

          return res
        }
      },
      legend: {
        data:[
          {name: '当期销量'},
          {name: '累计销量'},
          {name: '当期金额'},
          {name: '累计金额'}
        ],
        right: '3%',
        selected: {
          '当期销量': false,
          '累计销量': true,
          '当期金额': false,
          '累计金额': true
        }
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
      series : [{
        name:'当期销量',
        type:'line',
        symbolSize: 8,
        itemStyle: {
          normal: {
            color: '#FF8056'
          }
        },
        data: this.state.chartData.saleNumData
        },{
        name:'累计销量',
        type:'line',
        symbolSize: 8,
        itemStyle: {
            normal: {
              color: '#64DBFB'
            }
          },
        data: this.state.chartData.saleNumAccumData
      },{
        name:'累计金额',
        type:'bar',
        itemStyle: {
          normal: {
            color: '#64DBFB'
          }
        },
        data:[]
      },{
        name:'当期金额',
        type:'bar',
        itemStyle: {
          normal: {
            color: '#FF8056'
          }
        },
        data:[]
      }]
    }

    return option
  },

  getOptionBar: function() {

    const  option = {
      title: {
      },
      tooltip : {
        trigger: 'axis'
      },
      legend: {
        data:[
          {name: '当期金额'},
          {name: '累计金额'}
        ],
        top: -30,
        selected: {
          '当期金额': false,
          '累计金额': true
        }
      },
      dataZoom : [{
        type: 'slider',
        xAxisIndex: [0],
        backgroundColor: '#fff',
        borderColor: '#00bcd4',
        fillerColor: '#e0f7fa',
        handleIcon: 'M4.9,17.8c0-1.4,4.5-10.5,5.5-12.4c0-0.1,0.6-1.1,0.9-1.1c0.4,0,0.9,1,0.9,1.1c1.1,2.2,5.4,11,5.4,12.4v17.8c0,1.5-0.6,2.1-1.3,2.1H6.1c-0.7,0-1.3-0.6-1.3-2.1V17.8z',
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
        name: '金额',
        nameTextStyle: {
          color: '#333'
        },
        min: 0
      }],
      series : [{
          name:'当期金额',
          type:'bar',
          itemStyle: {
            normal: {
              color: '#FF8056'
            }
          },
          data: this.state.chartData.saleAmtData
        },{
          name:'累计金额',
          type:'bar',
          itemStyle: {
            normal: {
              color: '#64DBFB'
            }
          },
          data: this.state.chartData.saleAmtAccumData
        }]
    }

    return option
  },

  render() {
    //   /common/queryDateDim
    const renderDate = item => <Option value={item.dictValue}>{item.dictText}</Option>

    //  /common/queryTopCategory
    const renderCategory = item => <Option value={item.spcId}>{item.spcName}</Option>

    //   /common/queryProductSuppliers
    const renderProduct = item => <Option value={item.spsCode}>{item.spsName}</Option>

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
      <div className="function-sales">
        <div className="link">
          <Link to={'/history'}>辅助管理</ Link> > <span>历史销量统计查询</span>
        </div>
        <div className="firstSelect">
          <div className="inlineBlock">
            <span>时间跨度：</span>
            <Select url="history/date.json" render={renderDate}
                    value={this.state.selectDate} onChange={this.handleSelectDate}/>
          </div>
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
          <div className="inlineBlock">
            <Button type="primary" onClick={this.handleClick}>查询</Button>
            <Button type="primary" onClick={this.handleClickResize}>重置</Button>
          </div>
        </div>
        <div className="over">
          <div className="pull-right aBtn">
            <a className={chartActive} href="javascript: void(0)" onClick={this.handleChart}><Icon type="area-chart"/></a>
            <a style={{marginLeft: 10}} className={tableActive} href="javascript: void(0)" onClick={this.handleTable}><Icon type="list"/></a>
          </div>
        </div>
        <div style={{marginTop: 10}}>
          <div style={styleChart} className="chartContainer">
            <Fetch url={this.state.chartUrl} onSuccess={this.handleSuccess}>
              <div>
                <Echarts option={this.getOptionLine()} style={{height: '300px', width: '100%'}} />
              </div>
              <div>
                <Echarts option={this.getOptionBar()} style={{height: '300px', width: '100%'}} />
              </div>
            </Fetch>
          </div>
          <div className="tableContainer" style={styleTable}>
            <DataTable
              url={this.state.tableUrl}
              onPageChange={this.onPageChange}
              showPage="true"
              column={this.state.column}
              howRow={10} >
            </DataTable>
          </div>
        </div>
      </div>
    )
  }
})

Sales.childContextTypes = {
  parent: PropTypes.instanceOf(Sales)
}

export default Sales