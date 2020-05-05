import React, { Component } from 'react';
import { Avatar, Dropdown, Menu, Icon, Select, Row, Col, Carousel } from 'antd';
import { connect } from 'dva';
import intl from 'react-intl-universal';
import styles from './index.less';
import theme from '@/components/theme';
const Option = Select.Option;
@connect(({ user }) => ({
  ...user,
}))
class Header extends Component {
  constructor() {
    super();
    this.state = {
      themeSkin: 'white',
    };
  }
  componentDidMount() {
    const { themeSkin } = this.state;
    const tmpTheme = localStorage.getItem('theme') || themeSkin;
    this.changeTheme(tmpTheme);
  }

  // 退出登录
  logout = () => {
    const { dispatch } = this.props
    dispatch({
      type: 'user/logout',
    });
  };

  // 切换语言
  onLocaleChange = value => {
    const { dispatch } = this.props
    dispatch({
      type: 'global/changeLocale',
      payload: value,
    });
  };

  changeTheme = val => {
    window.less.modifyVars(theme[val]).then(() => {
      console.log('success', val);
      localStorage.setItem('theme', val);
    }).catch(error => {
      console.log(error);
    });
  };

  render() {
    const { currLocale, user } = this.props;
    const logout = intl.get('user.logout')
    const menu = (
      <Menu>
        <Menu.Item>
          <span onClick={this.logout}>
            <Icon type="logout" />
            <span style={{ marginLeft: '10px' }}>{logout}</span>
          </span>
        </Menu.Item>
      </Menu>
    );
    const skin = (
      <Menu onClick={e => this.changeTheme(e.key)}>
        <Menu.Item key="white">白色</Menu.Item>
        <Menu.Item key="black">黑色</Menu.Item>
      </Menu>
    );
    return (
      <Row>
        <Col span={2} style={{ paddingLeft: 20 }}>
          <h3> <Icon style={{ color: "#ff8b14" }} type="notification" theme="filled" /> [公 告] </h3>
        </Col>
        <Col span={11} className={styles.main}>
          <Carousel dotPosition={"left"} autoplay dots={false}>
            <h3>2014第十届南京奥林匹克运动会</h3>
            <h3>2019第十五届南京信息交流会</h3>
            <h3>2020第十六届南京信息交流会</h3>
          </Carousel>
        </Col>
        <Col span={11} className={styles.header}>
          <Dropdown overlay={menu} placement="bottomCenter">
            <div className={styles.headerButton}>
              <Avatar icon="user" />
              <span className={styles.headerUser}>{user.data ? user.data.name : undefined}</span>
            </div>
          </Dropdown>
          <Dropdown overlay={skin} placement="bottomCenter">
            <div className={styles.headerButton}>
              <Avatar icon="skin" />
            </div>
          </Dropdown>
          <div className={styles.headerButton}>
            <Select defaultValue={currLocale} style={{ width: 100 }} onChange={this.onLocaleChange}>
              <Option value="zh_CN">中文</Option>
              <Option value="en_US">English</Option>
            </Select>
          </div>
        </Col>
      </Row>
    );
  }
}

export default Header;
