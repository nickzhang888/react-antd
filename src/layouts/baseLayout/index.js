import React, { Fragment } from 'react';
import { Layout, Breadcrumb } from 'antd';
import { connect } from 'dva';
import { Route, Switch, Redirect } from 'dva/router'
import HeaderComponent from '../header';
import Draggable from '../draggable';
import NavLeft from '../NavLeft';
import router from 'umi/router';
import withRouter from 'umi/withRouter'
import storage from '@/utils/localStorage';
import { checkLogin } from '../init';
import { KeepAlive, AliveScope, withAliveScope, withActivation } from 'react-activation'
const { Header, Content, Footer, Sider } = Layout;

@withRouter
@connect(({ user }) => ({
  ...user,
}))
class BaseLayout extends React.Component {
  constructor() {
    super();
    this.state = {
      collapsed: false,
      initDone: false,
    };
  }

  componentDidMount() {
    // 检测是否登录
    const isLogin = checkLogin();
    const openKeys = JSON.parse(localStorage.getItem("openKeys"))
    if (!isLogin) {
      router.push('/login');
      localStorage.removeItem('openKeys')
    } else {
      router.push(openKeys ? openKeys[0] : "/")
    }
  }

  onCollapse = collapsed => {
    this.setState({ collapsed });
  };

  renderRoutes = (routes) => {
    // 添加缓存
    return routes.map((item, index) => {
      if (!item.routes) {
        return (
          <Route
            key={index}
            path={item.path}
            exact={item.exact}
          >
            <KeepAlive name={item.path} when={true}>
              {item.component && <item.component {...this.props} />}
            </KeepAlive>
          </Route>
        )
      }
      return this.renderRoutes(item.routes)
    })
  }

  render() {
    const { currLocale, children, route: { routes }, location: { pathname } } = this.props
    const title = storage.get("title")
    const homeName = currLocale === 'zh_CN' ? "首页" : 'home'
    return (
      <Layout style={{ minHeight: '100vh', overflow: "auto" }}>
        <Sider
          collapsible
          collapsed={this.state.collapsed}
          onCollapse={this.onCollapse}
        >
          <NavLeft currLocale={currLocale} pathname={pathname} />
        </Sider>
        <Layout>
          <Header style={{ padding: 0 }}>
            <HeaderComponent currLocale={currLocale} />
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '10px 0' }}>
              <Breadcrumb.Item>{storage.get("menuName") || homeName}</Breadcrumb.Item>
              <Breadcrumb.Item>
                {title === homeName ? undefined : title}
              </Breadcrumb.Item>
            </Breadcrumb>
            {/*不用hash路由的话,并且不加缓存的话,redirect到404就会生效 */}
            {/* <div style={{ background: '#fff' }}>{children}</div> */}
            <AliveScope>
              <Switch>
                {this.renderRoutes(routes)}
                <Redirect to="/404" />
              </Switch>
            </AliveScope>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Ant Design &copy;2019 Created by Ant User</Footer>
        </Layout>
        <Draggable />
      </Layout>
    );
  }
}
export default BaseLayout;
