import { Table, Input, Card, Button, Checkbox, Form, message, InputNumber, Select, Modal } from 'antd';
import React from 'react';
import { connect } from "dva"
import ExportJsonExcel from 'js-export-excel';
import { generateTitle, sortTable } from "@/utils/utils"
const FormItem = Form.Item
const Option = Select.Option

@Form.create()
@connect(({ loading, batchTable }) => ({
  ...batchTable,
  loading: loading.models.batchTable
}))
class BatchTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      formValues: {},
      addData: [],
      // 传给后端
      sortArr: [],
      //前端判断位置用
      sortArrKey: [],
      sortColumns: [
        {
          columnKey: "name",
          order: ""
        },
        {
          columnKey: "age",
          order: ""
        },
        {
          columnKey: "sex",
          order: ""
        },
        {
          columnKey: "mobile",
          order: ""
        },
        {
          columnKey: "address",
          order: ""
        },
        {
          columnKey: "passed",
          order: ""
        }
      ],
      count: 0,
    };
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch({
      type: "batchTable/fetch",
      payload: {
      }
    })
    //   var sortColumn=[]
    //   columns.map(item=>{
    //       sortColumn.push({
    //        columnKey: item.dataIndex,
    //        order:""
    //   })
    // })
    // let sortColumns= sortColumn.filter(item=>item.columnKey!=="operation")
    // this.setState({
    //   sortColumns
    // })
    //   console.info(this.state.sortColumns)
  }

  handleTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues, sortArr } = this.state;
    const params = {
      page: pagination.current,
      size: pagination.pageSize,

    };
    dispatch({
      type: 'batchTable/fetch',
      payload: {
        ...params,
        sort: sortArr
      },
    }).then(() => {
      this.setState({
        formValues: params
      })
    })
  };

  deleteItem = key => {
    const addData = [...this.state.addData];
    this.setState({ addData: addData.filter(item => item.key !== key) });
  };
  // 新增
  handleAdd = () => {
    const { count, addData } = this.state;
    const newData = {
      key: count,
      name: ``,
      age: ``,
      sex: "",
      address: ``,
      mobile: "",
      passed: false
    };
    this.setState({
      addData: [...addData, newData],
      count: count + 1,
    });
  };
  // 修改
  handleEdit = (record, flag) => {
    let editData = []
    editData.push(record)
    editData.forEach((item, index) => {
      item["key"] = index
    })

    this.setState({
      flag,
      visible: true,
      addData: editData,
      count: editData[editData.length - 1].key + 1
    })
  }

  handleOk = () => {
    const { form: { getFieldsValue, validateFields }, dispatch } = this.props;
    const { addData, flag } = this.state
    if (addData.length == 0) {
      message.warn("请插入数据")
      return
    }
    // 这个id只能用于修改一条时
    const id = addData[0].id

    let data = [];
    let length = addData[addData.length - 1].key + 1
    for (let i = 0; i < length; i++) {
      if (getFieldsValue([`name ${i}`])[`name ${i}`] == undefined) {
        continue;
      }
      data.push(getFieldsValue([`name ${i}`, `age ${i}`, `sex ${i}`, `mobile ${i}`, `address ${i}`, `passed ${i}`]))
    }

    let newData = [];
    data.forEach(item => {
      let obj = {}
      for (let key in item) {
        obj[key.split(" ")[0]] = item[key]
      }
      newData.push(obj)
    })
    console.info(newData)
    validateFields((err, fieldsValue) => {
      if (err) return;
      // 发送请求
      flag == "edit" ? message.success("修改成功") : message.success("新增成功")
      dispatch({
        type: flag == "edit" ? "batchTable/updateList" : "batchTable/addList",
        payload: { ...newData[0], id }
      })
      this.setState({
        addData: [],
        visible: false,
        flag: ""
      })
    });
  }


  handleClickHeader = (column) => {
    const { dispatch } = this.props
    const { sortColumns, sortArr, sortArrKey } = this.state
    sortTable(column, sortColumns, sortArr, sortArrKey)
    this.setState({
      sortColumns,
      sortArr,
      sortArrKey
    })
    dispatch({
      type: "batchTable/fetch",
      payload: {
        sort: sortArr
      }
    })
  }

  downloadExcel = () => {
    const { listData: { data } } = this.props
    var option = {};
    let dataTable = [];
    // \t可以使数字不用使用科学计数法
    if (data) {
      for (let i in data) {
        let obj = {
          '姓名': data[i].name,
          '年龄': data[i].age,
          '性别': data[i].sex,
          '手机号码': `\t${data[i].mobile}`,
          '住址': data[i].address,
        }
        dataTable.push(obj);
      }
    }
    option.fileName = '个人信息'
    option.datas = [
      {
        sheetData: dataTable,
        sheetName: '个人信息',
        sheetFilter: ['姓名', '年龄', '性别', "手机号码", "住址"],
        sheetHeader: ['姓名', '年龄', '性别', "手机号码", "住址"],
        columnWidths: [8, 8, 8, 8, 8]
      }
    ];

    var toExcel = new ExportJsonExcel(option);
    toExcel.saveExcel();
  }

  handleDelete = (key) => {
    const { dispatch } = this.props
    Modal.confirm({
      title: '确认删除吗?',
      // content: 'Some descriptions',
      onOk() {
        dispatch({
          type: "batchTable/deleteList",
          payload: key
        })
        message.success("删除成功")
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  render() {
    const { form: { getFieldDecorator }, listData: { data, current, pageSize, total }, loading } = this.props
    const { addData, sortColumns, sortArr, sortArrKey, flag } = this.state;
    const paginationProps = {
      current,
      pageSize,
      total,
      pageSizeOptions: ["10", "30", "50"],
      showSizeChanger: true,
      showTotal: total => `共${total}条数据`,
      // showQuickJumper: true,
    }
    const columns = [
      {
        title: generateTitle("姓名", "name", sortArrKey, sortColumns, 0, () => this.handleClickHeader("name")),
        dataIndex: 'name',
        width: "14%",
      },
      {
        title: generateTitle("年龄", "age", sortArrKey, sortColumns, 1, () => this.handleClickHeader("age")),
        dataIndex: 'age',
        width: "14%",
      },
      {
        title: generateTitle("性别", "sex", sortArrKey, sortColumns, 2, () => this.handleClickHeader("sex")),
        dataIndex: 'sex',
        width: "14%",
      },
      {
        title: generateTitle("手机号码", "mobile", sortArrKey, sortColumns, 3, () => this.handleClickHeader("mobile")),
        dataIndex: 'mobile',
        width: "15%",
      },
      {
        title: generateTitle("地址", "address", sortArrKey, sortColumns, 4, () => this.handleClickHeader("address")),
        dataIndex: 'address',
        width: "14%",
      },
      {
        title: generateTitle("是否合格", "passed", sortArrKey, sortColumns, 5, () => this.handleClickHeader("passed")),
        dataIndex: 'passed',
        width: "14%",
        render: (text) => <Checkbox checked={text}></Checkbox>
      },
      {
        title: '操作',
        dataIndex: 'operation',
        width: "14%",
        render: (text, record) => <div>
          <a href="javascript:;" onClick={() => this.handleEdit(record, "edit")}>修改</a>&ensp;
          <a href="javascript:;" onClick={() => this.handleDelete(record.id)}>删除</a>
        </div>
      },
    ]
    // 外面包裹FormItem,可以起到校验提示的效果
    const innerColumns = [
      {
        title: "姓名",
        dataIndex: 'name',
        width: "15%",
        render: (text, record, index) => {
          return <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`name ${record.key}`, {
              initialValue: flag == "edit" ? `${addData[index].name}` : "",
              rules: [{ required: true, message: '请输入姓名' }],
            })
              (<Input style={{ width: "100%" }} />)
            }
          </FormItem>
        }
      },
      {
        title: "年龄",
        dataIndex: 'age',
        width: "13%",
        render: (text, record, index) => {
          return <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`age ${record.key}`, {
              initialValue: flag == "edit" ? `${addData[index].age}` : "",
              rules: [{ required: true, message: '请输入年龄' }],
            })
              (<InputNumber min={0} />)
            }
          </FormItem>
        }
      },
      {
        title: "性别",
        dataIndex: 'sex',
        width: "12%",
        render: (text, record, index) => {
          return <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`sex ${record.key}`, {
              initialValue: flag == "edit" ? `${addData[index].sex}` : "",
              rules: [{ required: true, message: '请选择性别' }],
            })
              (<Select style={{ width: "100%" }}>
                <Option key="1" value="男">男</Option>
                <Option key="2" value="女">女</Option>
              </Select>)
            }
          </FormItem>
        }
      },
      {
        title: "手机号码",
        dataIndex: 'mobile',
        width: "15%",
        render: (text, record, index) => {
          return <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`mobile ${record.key}`, {
              initialValue: flag == "edit" ? `${addData[index].mobile}` : "",
              rules: [
                {
                  required: true,
                  message: '请输入手机号码',
                  pattern: /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
                }
              ],
            })
              (<Input />)
            }
          </FormItem>
        }
      },
      {
        title: "住址",
        dataIndex: 'address',
        width: "15%",
        render: (text, record, index) => {
          return <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`address ${record.key}`, {
              initialValue: flag == "edit" ? `${addData[index].address}` : "",
              rules: [{ required: true, message: '请选择地址' }],
            })
              (<Select style={{ width: "100%" }}>
                <Option key="1" value="南京市">南京市</Option>
                <Option key="2" value="北京市">北京市</Option>
                <Option key="3" value="上海市">上海市</Option>
              </Select>
              )
            }
          </FormItem>
        }
      },
      {
        title: "是否合格",
        dataIndex: 'passed',
        width: "13%",
        render: (text, record, index) => {
          return <FormItem style={{ margin: 0 }}>
            {getFieldDecorator(`passed ${record.key}`, {
              valuePropName: "checked",
              initialValue: flag == "edit" ? addData[index].passed : false,
              rules: [{ required: true, message: '请勾选' }],
            })
              (<Checkbox />)
            }
          </FormItem>
        }
      },
      {
        title: '操作',
        dataIndex: 'operation',
        render: (text, record) => <a href="javascript:;" onClick={() => this.deleteItem(record.key)}>删除</a>
      },
    ];

    return (
      <Card bordered={false}>
        <Button onClick={() => this.setState({ visible: true })} icon="plus" type="primary" style={{ marginBottom: 16 }}>
          新增
        </Button>&nbsp;&nbsp;
        <Button onClick={this.downloadExcel} type="primary" ghost icon="download">
          导出
        </Button>
        <Table
          dataSource={data}
          columns={columns}
          scroll={{ y: "calc(100vh - 400px)" }}
          rowKey={"id"}
          loading={loading}
          pagination={paginationProps}
          onChange={this.handleTableChange}
        />
        <Modal
          width="70vw"
          destroyOnClose
          title={flag == "edit" ? "修改" : "新增"}
          style={{ top: 24 }}
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({
              visible: false,
              flag: "",
              addData: []
            })
          }}
        >
          <Button onClick={this.handleAdd} type="primary" ghost icon="plus" style={{ marginBottom: 16 }}>
            新增
          </Button>
          <Table
            dataSource={addData}
            columns={innerColumns}
            scroll={{ y: "calc(100vh - 380px)" }}
            size="middle"
          />
        </Modal>
      </Card>
    );
  }
}
export default BatchTable