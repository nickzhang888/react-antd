import React from 'react';
import {
  Card,
  Table,
  Row,
  Col,
  Form,
  Modal,
  Menu,
  Drawer,
  DatePicker,
  Select,
  Button,
  Input,
  Spin,
  message,
  Icon,
} from 'antd';
import data from './data.js';
import moment from 'moment';
import _ from 'lodash';
import styles from '../index.less';
import { connect } from 'dva';
import Highlighter from 'react-highlight-words';

const FormItem = Form.Item;
const SubMenu = Menu.SubMenu;

@Form.create()
@connect(({ loading, bigData }) => ({
  ...bigData,
}))
class bigData extends React.Component {
  state = {
    dataSource2: [],
    openKeys: [],
    count: 0,
    searchData: data,
    startValue: moment(new Date()),
    endValue: moment(new Date()),
    searchText: '',
    visible: false,
  };

  componentDidMount() {
    this.setState({
      dataSource: data,
    });
  }

  handleSearch = () => {
    let text = document.getElementById('input').value.toLowerCase();
    let searchData = data.filter(item => {
      return JSON.stringify(item.title).toLowerCase().includes(text);
    });
    // let search_Data = searchData.map(item => {
    //     item.title= item.title.split(text).join(`<span style={{color:'#ff8b14'}}>${text}</span>`)
    //     return item
    // })
    // var reg =new RegExp(text,"g"); //定义正则
    // let search_Data=searchData.map(item=>{
    //   item.title=item.title.replace(reg, <span className={styles.keyword}>{text}</span>)
    //   return item
    // })
      //   searchData.map(item=>{
      //      return   <Highlighter
      //                   highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
      //                   searchWords={[this.state.searchText]}
      //                   autoEscape
      //                   textToHighlight={text.toString()}
      //       />
      //  })
      // data.forEach(item => {
      //   item['render'] = text => (
      //     <Highlighter
      //       highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
      //       searchWords={[this.state.searchText]}
      //       autoEscape={true}
      //       textToHighlight={text.toString()}
      //     />
      //   );
      // });
    this.setState({
      searchText: text,
      searchData,
    });
  };

  searchWord = e => {
    //data来自外部的引入文件
    let text = e.currentTarget.value;
    if (!text) {
      this.setState({
        searchData: data,
      });
    }
  };

  renderMenu = data => {
    let menu = data.map(item => {
      if (item.children) {
        return (
          <SubMenu title={item.title} key={item.key} popupClassName={`${styles.keyword}`}>
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item title={item.title} key={`${item.key}-${this.state.count}`}>
            {item.title}
          </Menu.Item>
        );
      }
    });
    return menu;
  };

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
    var newArr = [];
    for (let i = 0; i < data.length; i++) {
      newArr.push(data[i].key);
    }
    if (newArr.indexOf(latestOpenKey) === -1) {
      this.setState({ openKeys });
    } else {
      this.setState({
        openKeys: latestOpenKey ? [latestOpenKey] : [],
        count: this.state.count + 1,
      });
    }
  };

  handleMenu = item => {
    this.setState({
      currentKey: item.keyPath,
    });
  };
  search = () => {
    const { dispatch } = this.props;
    // dispatch({
    //   type: 'bigData/fetch',
    //   payload: {},
    // });
  };

  renderForm() {
    return (
      <Form layout="inline">
        <FormItem label="查询日期">
          <DatePicker
            disabledDate={this.disabledStartDate}
            // showTime
            format="YYYY-MM-DD"
            placeholder="开始日期"
            value={this.state.startValue}
            onChange={this.onStartChange}
          />{' '}
          -{' '}
          <DatePicker
            disabledDate={this.disabledEndDate}
            // showTime
            format="YYYY-MM-DD "
            placeholder="结束日期"
            value={this.state.endValue}
            onChange={this.onEndChange}
          />
        </FormItem>
        <FormItem>
          <Button type="primary" icon="search" onClick={this.search}>
            查询
          </Button>
        </FormItem>
      </Form>
    );
  }
  disabledStartDate = startValue => {
    const endValue = this.state.endValue;
    if (!startValue || !endValue) {
      return false;
    }
    return startValue.valueOf() > endValue.valueOf();
  };

  disabledEndDate = endValue => {
    const startValue = this.state.startValue;
    if (!endValue || !startValue) {
      return false;
    }
    return endValue.valueOf() < startValue.valueOf();
  };

  onStartChange = value => {
    this.setState({
      startValue: value,
    });
  };

  onEndChange = value => {
    this.setState({
      endValue: value,
    });
  };

  handleChildrenNode = data => {
    data = _.cloneDeep(data);
    for (let i = 0; i < data.length; i++) {
      if (data[i].upId !== null) {
        for (let j = 0; j < data.length; j++) {
          // 如果此数据的rowId与其他数据的upId相同
          if (data[j].rowId == data[i].upId) {
            if (!data[j].children) {
              data[j].children = [];
            }
            data[j].children.push(data[i]);
            break;
          }
        }
      }
    }
    let filterData = data.filter(item => {
      // return item.rowId == `${this.state.currentKey[1]}`
      return item.rowId == `94001`;
    });
    return filterData;
  };

  showDetail = (text, record, date) => {
    let detail;
    record.list.find(item => {
      if (item.date == date) {
        detail = item;
      }
    });
    this.setState({
      visible: true,
      detailList: detail.detailList,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };
  render() {
    const { list } = this.props;

    let filterData = list.filter(item => {
      // return item.rowId == `${this.state.currentKey[1]}`
      return item.rowId == `94001`;
    });

    let columns = [
      {
        title: '产品名称',
        key: 'name',
        dataIndex: 'name',
        // width: 240,
        // fixed: "left"
      },
    ];
    for (let i = 0; i < filterData.length; i++) {
      let filter = filterData[i].list;
      filter.map(item => {
        let column = {
          title: item.date,
          // width:130,
          render: (text, record) => {
            let position;
            record.list.find(item1 => {
              if (item1.date == item.date) {
                position = item1.position;
              }
            });
            return (
              <a
                style={!record.children ? { color: 'ff8b14' } : { color: '#000' }}
                onClick={!record.children ? () => this.showDetail(text, record, item.date) : null}
              >
                {position}
              </a>
            );
          },
        };
        columns.push(column);
      });
    }

    return (
      <Card bordered={false}>
        <Row gutter={24}>
          <Col span={5}>
            <div style={{ display: 'flex' }}>
              <Input
                prefix={<Icon type="search" />}
                placeholder="提示文字"
                id="input"
                onPressEnter={this.handleSearch}
                onChange={this.searchWord}
              />
              <Button type="primary" style={{ marginLeft: 10 }} onClick={this.handleSearch}>
                查找
              </Button>
            </div>
            <Row style={{ marginTop: 10 }}>
              <Menu
                // theme="dark"
                onClick={this.handleMenu}
                onOpenChange={this.onOpenChange}
                mode="inline"
                openKeys={this.state.openKeys}
                
              >
                {this.renderMenu(this.state.searchData)}
              </Menu>
            </Row>
          </Col>
          <Col span={19}>
            {this.renderForm()}
            <div style={{ marginTop: 10 }}>
              <Table
                defaultExpandAllRows={true}
                columns={columns}
                dataSource={this.handleChildrenNode(list)}
                rowKey={record => `${record.rowId}`}
                pagination={false}
                scroll={{ x: columns.length * 150 }}
              />
              <Drawer
                title="交易明细"
                placement="right"
                width={'40%'}
                onClose={this.onClose}
                visible={this.state.visible}
              >
                <Table
                  dataSource={this.state.detailList}
                  columns={[
                    {
                      title: '证券代码',
                      dataIndex: 'code',
                    },
                    {
                      title: '证券名称',
                      dataIndex: 'name',
                    },
                    {
                      title: '交易方式',
                      dataIndex: 'method',
                    },
                    {
                      title: '交易金额',
                      dataIndex: 'balance',
                    },
                  ]}
                />
              </Drawer>
            </div>
          </Col>
        </Row>
      </Card>
    );
  }
}
export default bigData
