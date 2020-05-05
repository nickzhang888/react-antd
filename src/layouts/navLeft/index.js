import React from 'react';
import { Menu, Icon } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import withRouter from 'umi/withRouter'
import menu from './menu.js';
import storage from '@/utils/localStorage';
import styles from './index.less';

const SubMenu = Menu.SubMenu;
@connect(({ user }) => ({
  ...user,
}))
@withRouter
class NavLeft extends React.Component {
  constructor() {
    super();
    this.state = {
      openKeys: [],
    };
  }

  componentDidMount() {
    window.addEventListener("beforeunload", this.beforeunload)
    window.addEventListener("hashchange", this.hashchange)
    const openKeys = JSON.parse(storage.get("openKeys"))
    this.setState({
      openKeys: openKeys || ["/"]
    });
  }

  componentWillUnmount() {
    window.removeEventListener("beforeunload", this.beforeunload)
    window.removeEventListener("hashchange", this.hashchange)

  }

  hashchange = (value) => {
    
  }


  beforeunload = e => {
    const { openKeys } = this.state
    storage.add('openKeys', openKeys)
    // let confirmationMessage = '你确定离开此页面吗?';
    // (e || window.event).returnValue = confirmationMessage;
    // return confirmationMessage;
  }
  // 菜单点击
  handleClick = ({ item, key, keyPath }) => {
    if (key == this.state.openKeys[0]) {
      return false;
    }
    // 事件派发，自动调用reducer，通过reducer保存到store对象中
    const { dispatch } = this.props;
    dispatch({
      type: 'user/switchMenu',
      payload: {
        menuName: item.props.parentMenu.subMenuTitle ? item.props.parentMenu.subMenuTitle.innerText : "",
        title: item.props.title,
      },
    });
    this.setState({
      openKeys: keyPath,
    });
    storage.add('openKeys', keyPath)
  };

  jumplink = selectedKeys => {
    // 命令式路由
    router.push(selectedKeys);
  };
  // 菜单渲染
  renderMenu = data => {
    const { currLocale } = this.props
    return data.map(item => {
      const title = currLocale === 'zh_CN' ? item.title : item.enTitle
      if (item.children) {
        return (
          <SubMenu
            title={<span><Icon type={item.icon} /><span>{title}</span></span>}
            key={item.key}
          >
            {this.renderMenu(item.children)}
          </SubMenu>
        );
      }
      return (
        <Menu.Item
          key={item.key}
          title={title}
          onClick={() => {
            this.jumplink(item.key);
          }}
        >
          {item.icon && <Icon type={item.icon} />}
          <span>{title}</span>
        </Menu.Item>
      );
    });
  };

  homeClick = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/switchMenu',
      payload: {
        menuName: "",
        title: "",
      },
    });
    this.setState({
      openKeys: ["/"]
    });
  };

  onOpenChange = openKeys => {
    const latestOpenKey = openKeys.find(key => !this.state.openKeys.includes(key));
    this.setState({
      openKeys: [latestOpenKey]
    });
  };

  render() {
    const { openKeys } = this.state
    const { pathname }=this.props
    const defaultOpenKeys = JSON.parse(storage.get("openKeys"))
    //声明式路由
    return (
      <div>
        <Link to="/" onClick={this.homeClick}>
          <div className={styles.logo}>
            <img src={require('@/assets/logo.svg')} alt="" />
            {/* <h1 className={styles.title}></h1> */}
          </div>
        </Link>
        <Menu
          theme={"dark"}
          mode="inline"
          openKeys={openKeys}
          onClick={this.handleClick}
          onOpenChange={this.onOpenChange}
          selectedKeys={defaultOpenKeys ? [defaultOpenKeys[0]] : ["/"]}
          // selectedKeys={pathname}
        >
          {this.renderMenu(menu)}
        </Menu>
      </div>
    );
  }
}
export default NavLeft;
