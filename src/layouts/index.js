import React, { Component, Fragment } from 'react'
import BaseLayout from './baseLayout';
import { LocaleProvider } from 'antd';
import { connect } from 'dva';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import en_US from 'antd/lib/locale-provider/en_US';
import { init } from './init';

@connect(({ global }) => ({
  ...global
}))
class Index extends Component {
  constructor() {
    super();
    this.state = {
      initDone: false,
    }
  }

  componentDidMount() {
    const { dispatch, currLocale } = this.props;
    init();
    // 更改国际化
    dispatch({
      type: 'global/changeLocale',
      payload: currLocale,
    });
  }

  /**
   * 初始intl国际化和antd组件国际化
   */
  renderBody = () => {
    const { location: { pathname }, children, currLocale, localeLoad } = this.props;
    if (pathname === '/login') {
      return localeLoad && <Fragment>
        {children}
      </Fragment>;
    }
    return (
      localeLoad && (<LocaleProvider locale={currLocale === 'zh_CN' ? zh_CN : en_US}>
        <BaseLayout {...this.props} />
      </LocaleProvider>)
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderBody()}
      </Fragment>
    )
  }
}

export default Index;
