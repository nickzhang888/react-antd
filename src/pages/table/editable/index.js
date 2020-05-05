import React, { Component, Fragment } from 'react';
import {
    Card,
    Table,
    Row,
    Col,
    Form,
    Modal,
    DatePicker,
    Select,
    Button,
    Input,
    Icon,
    Popconfirm
} from 'antd';
import { connect } from 'dva';
import BasicTable from '@/components/BasicTable';
const { Option } = Select;
const url = {
    urlSearch: 'editable/getEditableInfo',
};
@connect(({ editable, loading }) => {
    return {
        ...editable,
        loading: loading.effects['editable/getEditableInfo'],
    }
})
@Form.create()
@BasicTable(url)
class Editable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            moveKey: ''
        }
    }

    componentDidMount() {
        const { dispatch } = this.props
        dispatch({
            type: 'editable/getEditableInfo',
            payload: {

            },
        }).then(res => {
            if (res) {
                if (res.httpStatus == 200) {
                    this.setState({
                        dataSource: res.data.data
                    })
                }
            }
        })
    }
    queryParam = () => {
        const { form } = this.props;
        const search = form.getFieldsValue();
        const params = {
        };
        return params;
    }

    handleChange = (value, record, flag) => {
        const cityData = {
            zj: ['杭州', '宁波', '温州'],
            js: ['南京', '苏州', '无锡'],
            gd: ["中山市", "惠州市", "佛山市"]
        };
        const { form } = this.props
        if (flag) {
            // 加个[]就可以写变量了
            form.setFieldsValue({
                [`city${record.key}`]: ""
            })
            record.city = ""
        }

        for (var i in value) {
            record[i] = value[i];//这一句是必须的，不然状态无法更改
            if (flag) {
                // 添加一个存城市的数组
                record.cityArr = cityData[value[i]]
            }
            this.setState({
                dataSource: this.state.dataSource.map((item, key) => item.key == record.key ? { ...item, [i]: value[i] } : item)
            })
        }
    }


    handleMove = (record, index, flag) => {
        // console.log(record,index)
        let data = [...this.state.dataSource]
        data.splice(index, 1)
        flag === "up" ? data.splice(index - 1, 0, { ...record }) : data.splice(index + 1, 0, { ...record })
        this.setState({
            dataSource: data,
            // info:''
        })
    }

    render() {
        const { dataSource, moveKey } = this.state
        const {
            form: { getFieldDecorator },
            listData: { data, current, pageSize, total },
            loading,
            handleTableChange,
            searchList,
            handleClickHeader,
            sortArrKey,
            formValues
        } = this.props;
        const paginationProps = {
            current,
            pageSize,
            total,
            showTotal: total => `共${total}条数据`,
            pageSizeOptions: ['10', '30', '50'],
            showSizeChanger: true,
            showQuickJumper: true,
        };
        const columns = [
            {
                title: '姓名',
                dataIndex: 'name',
                filterDropdown: true,
                width: "18%",
                filterIcon: <Icon type="edit" />,
                render: (text, record) => <Input value={text} onChange={(e) => this.handleChange({ name: e.target.value }, record)} />,
            },
            {
                title: '年龄',
                dataIndex: 'age',
                filterDropdown: true,
                width: "18%",
                filterIcon: <Icon type="edit" />,
                render: (text, record) => <Input value={text} onChange={(e) => this.handleChange({ age: e.target.value }, record)} />,
            },
            {
                title: '省份',
                dataIndex: 'province',
                filterDropdown: true,
                width: "18%",
                filterIcon: <Icon type="edit" />,
                render: (text, record) => {
                    return getFieldDecorator(`province${record.key}`, {

                    })
                        (
                            <Select
                                style={{ width: "12vw" }}
                                onChange={(e) => this.handleChange({ province: e }, record, true)}
                                placeholder="请选择"

                            >
                                <Option value='js'>江苏</Option>
                                <Option value='zj'>浙江</Option>
                                <Option value='gd'>广东</Option>
                            </Select>
                        )
                }
            },
            {
                title: '城市',
                dataIndex: 'city',
                filterDropdown: true,
                width: "18%",
                filterIcon: <Icon type="edit" />,
                render: (text, record, index) => {
                    return getFieldDecorator(`city${record.key}`, {

                    })(
                        <Select
                            style={{ width: "12vw" }}
                            onChange={(e) => this.handleChange({ city: e }, record)}
                            placeholder="请选择"
                        >
                            {dataSource[index].cityArr.map(item => <Option key={item} value={item}>{item}</Option>)}

                        </Select>
                    )
                }
            },
            {
                title: '爱好',
                dataIndex: 'hobby',
                filterDropdown: true,
                width: "18%",
                filterIcon: <Icon type="edit" />,
                render: (text, record) => (
                    <Select
                        style={{ width: "12vw" }}
                        onChange={(e) => this.handleChange({ hobby: e }, record)}
                        placeholder="请选择"
                    >
                        <Option value='吃饭'>吃饭</Option>
                        <Option value='睡觉'>睡觉</Option>
                    </Select>
                )
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record, index) => {
                    const data = [...this.state.dataSource]
                    const rowIndex = data.findIndex(item => item.key == moveKey)
                    if (index == rowIndex) {
                        return (<span>
                            {/* {index ? <a> <Icon type={"arrow-up"} onClick={() => this.handleMove(record, index)} /></a> : <a></a>} */}
                            {/* {<a> <Icon type={index ? "arrow-up" : undefined} onClick={() => this.handleMove(record, index)} /></a>} */}
                            {<a> <Icon type="arrow-up" style={index ? undefined : { display: "none" }} onClick={() => this.handleMove(record, index, "up")} /></a>}
                            &ensp;
                            {<a> <Icon type="arrow-down" style={index == (formValues.size || 10) - 1 ? { display: "none" } : undefined} onClick={() => this.handleMove(record, index)} /></a>}
                        </span>)
                    }

                }
            }
        ]

        return (
            <Card>
                <Button type="primary" style={{ marginBottom: 10 }}>同步</Button>
                <Table
                    dataSource={dataSource}
                    pagination={paginationProps}
                    columns={columns}
                    loading={loading}
                    scroll={{ y: ' calc(100vh - 400px)' }}
                    onChange={handleTableChange}
                    onRow={record => {
                        return {
                            onMouseEnter: event => {
                                this.setState({
                                    moveKey: record.key,
                                })
                            }, // 鼠标移入行
                            onMouseLeave: event => {
                                this.setState({
                                    moveKey: "",
                                })
                            },
                        };
                    }}
                />
            </Card>
        );
    }
}

export default Editable;