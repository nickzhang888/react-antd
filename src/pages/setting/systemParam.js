import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form, Col, Input, Checkbox, DatePicker, Select, Button, Card,message} from 'antd';
import { connect } from "dva"
import moment from "moment"
const FormItem = Form.Item
const Option = Select.Option
@Form.create({
    onValuesChange({ dispatch }, changeValues, allValues) {
        dispatch({
            type: "systemParam/modifyParam",
            payload: changeValues
        })
    }
})
@connect(({ systemParam }) => ({
    ...systemParam
}))
class systemParam extends Component {
    static defaultProps = {
        list: [],
    };
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    saveEdit = (params) => {
        const { editList, dispatch } = this.props
        if (editList.length === 0) {
            message.warn("无任何修改记录!")
            return
        }
        dispatch({
            type: "systemParam/saveEdit",
            payload: editList
        })
        message.success("保存成功")
    }

    render() {
        const { list, editList } = this.props
        const { form: { getFieldDecorator } } = this.props
        const formItemLayout = {
            labelCol: {
                xxl: { span: 5 },
                xl: { span: 6 },
                sm: { span: 5 },
                xs: { span: 24 }
            },
            wrapperCol: {
                xxl: { span: 18 },
                xl: { span: 15 },
                sm: { span: 16 },
                xs: { span: 24 }
            }
        }
        /* modify:1 可修改 modify:0 不可修改 type:0  输入框 type:1  勾选框 type:2  单选下拉框 
          type:3  多选下拉框  type:4  日期选择框 */
        return (
            <Card bordered={false}>
                <Button onClick={this.saveEdit}>保存</Button>
                <Form style={{ height: "calc(100vh - 380px)", overflowY: "auto", marginTop: 20 }} >
                    {list && list.map(item => (
                        <Col key={item.id} span={12} >
                            <FormItem label={item.describe}  {...formItemLayout}>
                                {
                                    item.type == 0 ? (
                                        <div>
                                            {getFieldDecorator(`${item.key}`, {
                                                initialValue: item.value,
                                                rules: [
                                                    {
                                                        required: item.isRequired == "1" ? true : false,

                                                    },
                                                ]
                                            })(
                                                <Input disabled={item.modify == "0" ? true : false} />
                                            )}
                                        </div>
                                    ) : item.type == 1 ? (
                                        <div>
                                            {getFieldDecorator(`${item.key}`, {
                                                initialValue: item.value == "1" ? true : false,
                                                valuePropName: "checked",
                                                // rules: [
                                                //   {
                                                //     required: item.isRequired == "0" ? true : false,
                                                //     message: `${item.describe}必须勾选`,
                                                //   },
                                                // ]
                                            })(
                                                <Checkbox disabled={item.modify == "0" ? true : false} />

                                            )}
                                        </div>
                                    ) : item.type == 2 ? (
                                        <div>
                                            {getFieldDecorator(`${item.key}`, {
                                                initialValue: item.value,
                                                rules: [
                                                    {
                                                        required: item.isRequired == "1" ? true : false,
                                                        message: `${item.describe}必填`
                                                    },
                                                ]
                                            })(
                                                <Select
                                                    showSearch
                                                    getPopupContainer={trigger => trigger.parentNode}
                                                    disabled={item.modify == "0" ? true : false}
                                                >
                                                    <Option key="请选择" value="请选择">请选择</Option>
                                                    {item.valueBound && item.valueBound.map(item => (
                                                        <Option key={item} value={item}>
                                                            {item}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            )}
                                        </div>
                                    ) : item.type == 3 ? (
                                        <div>
                                            {getFieldDecorator(`${item.key}`, {
                                                initialValue: item.value,
                                                rules: [
                                                    {
                                                        required: item.isRequired == "1" ? true : false,
                                                        message: `${item.describe}必填`
                                                    },
                                                ]
                                            })(
                                                <Select
                                                    mode="multiple"
                                                    showSearch
                                                    allowClear
                                                    getPopupContainer={trigger => trigger.parentNode}
                                                    disabled={item.modify == "0" ? true : false}
                                                >
                                                    {item.valueBound && item.valueBound.map(item => {
                                                        return <Option key={item} value={item}>
                                                            {item}
                                                        </Option>
                                                    })
                                                    }
                                                </Select>
                                            )}
                                        </div>
                                    ) : (
                                                        <div>
                                                            {getFieldDecorator(`${item.key}`, {
                                                                initialValue: item.value && moment(item.value),
                                                                rules: [
                                                                    {
                                                                        required: item.isRequired == "1" ? true : false,
                                                                        message: `${item.describe}必填`
                                                                    },
                                                                ]
                                                            })(
                                                                <DatePicker
                                                                    format="YYYY-MM-DD"
                                                                    style={{ width: "100%" }}
                                                                    disabled={item.modify == "0" ? true : false}
                                                                />
                                                            )}
                                                        </div>
                                                    )
                                }
                            </FormItem>
                        </Col>
                    ))}
                </Form>
            </Card>
        );
    }
}
systemParam.propTypes = {
    list: PropTypes.array,
}
systemParam.defaultProps = {
    list:[],
}

export default systemParam;