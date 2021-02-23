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
  Progress,
  message,
  Icon,
  Tooltip
} from 'antd';
import { Select as ShineSelect } from 'shineout'
import moment from 'moment';
import { connect } from 'dva';
import xlsx from "xlsx"
import { generateTitle, sortTable, keepNdecimal, sheet2blob, openDownloadDialog } from '@/utils/utils';
import BasicTable from '@/components/BasicTable';
import { setLocale } from 'shineout'
import sumTable from "@/utils/sumTable"
import styles from "../index.less"
setLocale('zh-CN')
const { Option } = Select;
const FormItem = Form.Item;
const url = {
  urlSearch: 'dividend/queryListData',
};
const dateFormat = 'YYYY-MM-DD';
@Form.create()
@connect(({ dividend, loading }) => ({
  ...dividend,
  loading: loading.effects['dividend/queryListData'],
}))
@BasicTable(url)
class Dividend extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      sortArr: [],
      selectedRowKeys: [],
      selectedRows: [],
      rate: 0,
      sortColumns: [
        {
          columnKey: 'fundCode',
          order: '',
        },
        {
          columnKey: 'fundName',
          order: '',
        },
        {
          columnKey: 'fundType',
          order: '',
        },
        {
          columnKey: 'dividendDate',
          order: '',
        },
        {
          columnKey: 'bank',
          order: '',
        },
        {
          columnKey: 'balance',
          order: '',
        },
        {
          columnKey: 'payStatus',
          order: '',
        },
        {
          columnKey: 'payFailCause',
          order: '',
        },
      ]
    };
  }
  componentDidMount() {
    const { dispatch } = this.props;
    const params = this.queryParam();
    dispatch({
      type: 'dividend/getSelect',
      payload: {
      },
    });
    dispatch({
      type: 'dividend/queryListData',
      payload: {
        // ...params
      },
    });
    sumTable.mount(this.refBox)
  }

  componentWillUnmount() {
    sumTable.unMount()
  }
  shouldComponentUpdate() {
    sumTable.mount(this.refBox)
    return true
  }

  queryParam = () => {
    const { form } = this.props;
    const search = form.getFieldsValue();
    const params = {
      fundCode: search.fundCode,
      start: search.start ? moment(search.start).format(dateFormat) : (!search.start && !search.end ? undefined : "1900-01-01"),
      end: search.end ? moment(search.end).format(dateFormat) : (!search.start && !search.end ? undefined : "2099-12-31")
    };
    return params;
  };

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRowKeys,
      selectedRows,
      rate: 0
    })
  }

  batchSend = () => {
    const { dispatch, listData: { data } } = this.props
    const { selectedRowKeys, selectedRows, rate } = this.state
    if (selectedRowKeys.length == 0) {
      message.warn(`请选择要批量发送的数据!`)
      return;
    }
    dispatch({
      type: "dividend/sendService",
      payload: {
        nId: selectedRows[rate].nId
      }
    }).then(res => {
      if (res.httpStatus !== 200) {
        message.warn(res.msg)
      }
      let index = data.findIndex(item => item.nId == res.data.nId)
      if (index > -1) {
        data.splice(index, 1, res.data)
      }
      let key = selectedRowKeys.findIndex(item => item == selectedRows[rate].nId)
      selectedRowKeys.splice(key, 1)
      this.setState({
        rate: rate + 1
      })
      if (selectedRowKeys.length == 0) {
        message.success(`批量发送已完成,如有失败请关注!`)
        return;
      }
      this.batchSend()
    })
  }


  renderFooter = (columns, rowSelection) => {
    const { listData: { data } } = this.props
    columns.forEach(item => {
      if (item.fixed) {
        delete item.fixed
        item.render = ""
      }
    })
    const dataSource = [{ key: 1, balance: 34354545 }]
    const length = data.length
    return (
      length > 0 ?
        <Table
          dataSource={dataSource}
          rowSelection={rowSelection}
          columns={columns}
          scroll={{ x: "max-content" }}
          showHeader={false}
          pagination={false}
          className={styles.footerTable}
        />
        : ""
    )
  }

  downloadFile = () => {
    const { listData: { data } } = this.props
    let dataTable = []
    for (let i in data) {
      let obj = {
        '产品代码': data[i].fundCode,
        '产品名称': data[i].fundName,
        '产品类型': data[i].fundType,
        '红利日期': data[i].dividendDate,
        '开户行': data[i].bank,
        '金额': data[i].balance,
        '支付状态': data[i].payStatus,
        '支付失败原因': data[i].payFailCause == null ? "" : data[i].payFailCause,
      }
      dataTable.push(obj);
    }
    //生成表格
    var sheet = xlsx.utils.json_to_sheet(dataTable);
    var tmpdata = xlsx.utils.sheet_add_json(sheet, dataTable, { origin: "A2" });
    // tmpdata["F2"] = { t: "n",v:122.00}
    // 设置B2单元格样式
    tmpdata["B2"].s = { font: { sz: 14, bold: true, color: { rgb: "FFFFAA00" } }, fill: { bgColor: { indexed: 64 }, fgColor: { rgb: "FFFF00" } } };
    // tmpdata["F2"].t = 'n'
    // 设置每个单元格宽度
    tmpdata["!cols"] = [
      { wpx: 120 }, 
      { wpx: 120 }, 
      { wpx: 120 }, 
      { wpx: 120 }, 
      { wpx: 120 }, 
      { wpx: 140 }, 
      { wpx: 130 }, 
      { wpx: 150 },
    ];
    //给A1单元格赋值
    tmpdata["A1"] = {
      t: "s",
      v: '分红人员信息表'
    };
    // 设置A1标题字体样式
    tmpdata["A1"].s = {
      font: {
        name: '宋体',
        sz: 24,
        bold: true,
        underline: true,
        color: {
          rgb: "FFFFAA00"
        }
      },
      alignment: {
        horizontal: "center",
        vertical: "center",
        wrap_text: true
      },
      fill: {
        bgColor: {
          rgb: 'ffff00'
        }
      }
    };
    //["!merges"]这个属性是专门用来进行单元格合并的 
    tmpdata["!merges"] = [{ //如果不为空push 为空 = 赋值
      //合并单元格 index都从0开始
      s: { //s开始
        c: 0, //开始列
        r: 0 //开始行
      },
      e: { //e结束
        c: 7, //结束列
        r: 0 //结束行
      }
    }]
    console.log(tmpdata)
    const date = moment(new Date()).format("YYYYMMDD")
    const filename = `文件${date}`
    openDownloadDialog(sheet2blob(tmpdata), `${filename}.xlsx`);
  }

  render() {
    const {
      form: { getFieldDecorator },
      listData: { data, current, pageSize, total },
      loading,
      handleTableChange,
      searchList,
      handleClickHeader,
      sortArrKey,
      fundName
    } = this.props;
    const { selectedRowKeys, rate, selectedRows, sortColumns } = this.state
    const paginationProps = {
      current,
      pageSize,
      total,
      showTotal: total => `共${total}条数据`,
      pageSizeOptions: ['10', '30', '50'],
      showSizeChanger: true,
      // showQuickJumper: true,
    };
    const rowSelection = {
      onChange: this.onSelectChange,
      selectedRowKeys
    }
    const columns = [
      {
        title: generateTitle('产品代码', 'fundCode', sortArrKey, sortColumns, 0, () => handleClickHeader('fundCode')),
        dataIndex: 'fundCode',
        width: 200,
        render: (text, record) => <div style={{ color: record.payFailCause == null ? undefined : "#FD5D59" }}>{text}</div>
      },
      {
        title: generateTitle('产品名称', 'fundName', sortArrKey, sortColumns, 1, () => handleClickHeader('fundName')),
        dataIndex: 'fundName',
        width: 200,
        render: (text, record) => <div style={record.payFailCause == null ? undefined : { color: "#FD5D59" }}>{text}</div>
      },
      {
        title: generateTitle('产品类型', 'fundType', sortArrKey, sortColumns, 2, () => handleClickHeader('fundType')),
        dataIndex: 'fundType',
        width: 200,
        render: (text, record) => <div style={record.payFailCause == null ? undefined : { color: "#FD5D59" }}>{text}</div>
      },
      {
        title: generateTitle('红利日期', 'dividendDate', sortArrKey, sortColumns, 3, () => handleClickHeader('dividendDate')),
        dataIndex: 'dividendDate',
        width: 200,
        render: (text, record) => <div style={record.payFailCause == null ? undefined : { color: "#FD5D59" }}>{text}</div>
      },
      {
        title: generateTitle('开户行', 'bank', sortArrKey, sortColumns, 4, () => handleClickHeader('bank')),
        dataIndex: 'bank',
        width: 200,
        render: (text, record) => <div style={record.payFailCause == null ? undefined : { color: "#FD5D59" }}>{text}</div>
      },
      {
        title: generateTitle('金额', 'balance', sortArrKey, sortColumns, 5, () => handleClickHeader('balance')),
        dataIndex: 'balance',
        width: 200,
        render: (text, record) => <div style={{ color: record.payFailCause == null ? undefined : "#FD5D59", textAlign: "right" }}>{keepNdecimal(text, 2)}</div>
      },
      {
        title: generateTitle('支付状态', 'payStatus', sortArrKey, sortColumns, 6, () => handleClickHeader('payStatus')),
        dataIndex: 'payStatus',
        width: 200,
        render: (text, record) => <div style={record.payFailCause == null ? undefined : { color: "#FD5D59" }}>{text}</div>
      },
      {
        title: generateTitle('支付失败原因', 'payFailCause', sortArrKey, sortColumns, 7, () => handleClickHeader('payFailCause')),
        dataIndex: 'payFailCause',
        width: 200,
        render: (text, record) => <div style={record.payFailCause == null ? undefined : { color: "#FD5D59" }}>{text}</div>,
      },
      {
        title: "操作",
        dataIndex: "operate",
        fixed: "right",
        width: 200,
        render: (text, record) => <div>
          <Tooltip title="发送">
            <a className="iconfont icon-fasong"></a>
          </Tooltip> &ensp;
          <Tooltip title="撤销">
            <a className="iconfont icon-revoke"></a>
          </Tooltip>
        </div>
      }
    ];
    return (
      <Card bordered={false}>
        <Row>
          <Form layout="inline">
            <FormItem label="产品名称">
              {getFieldDecorator('fundCode', {})
                (
                  <ShineSelect
                    compressed
                    data={fundName}
                    keygen={"nId"}
                    multiple={true}
                    placeholder="请选择"
                    emptyAfterSelect={true}
                    renderItem={item => `${item.fundCode}:${item.fundName}`}
                    format="fundName"
                    onFilter={text => item => item.fundCode.toLowerCase().indexOf(text.toLowerCase()) >= 0 || item.fundName.indexOf(text) >= 0}
                    style={{ width: '14vw' }}
                  />
                )
              }
            </FormItem>
            <FormItem label="日期">
              {getFieldDecorator('start', {
                initialValue: moment(new Date(), dateFormat),
              })(
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="开始日期"
                />,
              )}{' '}
              -{' '}
              {getFieldDecorator('end', {
                initialValue: moment(new Date(), dateFormat),
              })(
                <DatePicker
                  // showTime
                  format="YYYY-MM-DD"
                  placeholder="结束日期"
                />,
              )}
            </FormItem>
            <FormItem>
              <Button icon="search" type="primary" onClick={() => searchList()}>
                查询
              </Button>
            </FormItem>
          </Form>
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Progress percent={Math.floor(rate / selectedRows.length * 100 * 100) / 100} />
        </Row>
        <Row style={{ marginTop: 10 }}>
          <Button type="primary" onClick={this.batchSend} >批量发送</Button>&ensp;
          <Button type="primary" ghost icon="download" onClick={this.downloadFile}>导出</Button>
        </Row>
        <div ref={node => this.refBox = node}>
          <Table
            rowKey={'nId'}
            dataSource={data}
            columns={columns}
            onChange={handleTableChange}
            pagination={paginationProps}
            loading={loading}
            scroll={{ y: ' calc(100vh - 400px)', x: "max-content" }}
            style={{ marginTop: 16 }}
            rowSelection={rowSelection}
            // rowClassName={(record, index) => record.payFailCause == null ? undefined : styles.failColor}
            footer={() => this.renderFooter(columns, rowSelection)}
          />
        </div>
      </Card>
    );
  }
}
export default Dividend;
