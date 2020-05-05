import React, { Component } from 'react';
import { Row, Col, Card, Tabs, Divider } from 'antd'
import { connect } from 'dva'
import ReactEcharts from 'echarts-for-react';
// 引入 ECharts 主模块
import echarts from 'echarts/lib/echarts'
// 引入饼图和折线图
import 'echarts/lib/chart/bar'
// 引入提示框和标题组件
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
const TabPane = Tabs.TabPane
@connect(({ bar, loading }) => ({
    ...bar,
    loading: loading.models.bar,
}))
class Bar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeKey: "0"
        }
    }

    componentWillMount() {
        const { dispatch } = this.props
        dispatch({
            type: "bar/search",

        })
        echarts.registerTheme('my_theme', {
            // backgroundColor: "#666"
        })
    }

    getOption = () => ({
        color: ['#46B273', '#DA9754', '#BD464E'],
        // 鼠标移到柱状图时的提示信息
        tooltip: {
            trigger: 'item',    //触发类型，默认（'item'）数据触发，可选为：'item' | 'axis' 
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            position: 'top',
            formatter: function (datas) {
                // console.log(datas);
                let res = `${datas.seriesName} ${datas.value}`
                return res
            }
        },
        legend: {
            data: ['警告', '一般错误', '严重错误'],
            icon: 'rect',    //图标的形状为长方形
            bottom: '10%',   //图标的位置
            left: '32%',
            itemWidth: 20, //图标的宽
            itemHeight: 8,  //图标的高
            itemGap: 25,   //底部图标之间的间距
            textStyle: {
                color: '#ccc'  //底部图标的文本颜色
            }
        },
        grid: {
            top: '15%',
            left: '5%',
            right: '5%',
            bottom: '25%',  //整个柱状图距离底部的距离
            containLabel: true,
        },
        xAxis: [
            {
                type: 'category',
                data: [],
                lineStyle: {
                    type: 'dashed'
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                // min:0,
                // minInterval :1,
                // boundaryGap : [ 0, 0.1 ],
                axisLabel: {
                    textStyle: {
                        color: '#999', //设置y轴字体的字体色
                    }
                },

                splitLine: {
                    show: true,
                    lineStyle: {
                        type: 'dashed',  //分割线设为虚线
                        color: '#4B4B4B'  //分割线的颜色
                    }
                }
            }
        ],

        series: this.props.data[4].map(element => {
            return {
                name: element.name,
                type: 'bar',
                data: [element.count],
                barWidth: 28, //柱状图宽度
                barGap: '200%', //柱子之间的距离
            }
        })
    })

    handleChange = (activeKey) => {
        if (activeKey) {
            this.setState({
                activeKey
            })
        }
    }

    onclick = {
        'click': this.clickEchartsPie.bind(this)
    }

    clickEchartsPie(e, getRawIndex) {
        if (e) {
            this.setState({
                activeKey: e.seriesIndex + ""
            })
        }
    }

    render() {
        const { data } = this.props
        const { activeKey } = this.state
        const tabs = ["警告", "一般错误", "严重错误"]
        return (
            <Card
                title="数据统计"
                bordered={false}
                extra={<a>更多</a>}
            >
                <Row gutter={16}>
                    <Col span={9} >
                        <ReactEcharts
                            option={this.getOption()}
                            notMerge={true}
                            lazyUpdate={true}
                            onEvents={this.onclick}
                            theme="my_theme"
                        />
                    </Col>
                    <Col span={14}>
                        <Tabs
                            activeKey={activeKey}
                            onChange={this.handleChange}
                        >
                            {tabs.map((each, index) => {
                                return <TabPane tab={each} key={index}>
                                    <Col span={11} >
                                        {data[index + 1].slice(0, 5).map(item => {
                                            return <li key={item.id} style={{ paddingTop: 10 }} dangerouslySetInnerHTML={{ __html: `${item.id}. ${item.cMonsimp}` }}></li>
                                        })}
                                    </Col>
                                    <Col span={2}>
                                        <Divider style={{ height: '180px', width: '2px', marginTop: '10px', background: '#4b4b4b' }} type="vertical" />
                                    </Col>
                                    <Col span={11} >
                                        {data[index + 1].slice(5).map(item => {
                                            return <li key={item.id} style={{ paddingTop: 10 }} dangerouslySetInnerHTML={{ __html: `${item.id}. ${item.cMonsimp}` }}></li>
                                        })}
                                    </Col>
                                </TabPane>
                            })}
                        </Tabs>
                    </Col>
                </Row>
            </Card>
        );
    }
}

export default Bar;