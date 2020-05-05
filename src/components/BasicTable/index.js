import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import { sortTable } from '@/utils/utils';
import PropTypes from 'prop-types';
//HOC   High Order Component
const BasicHOC = (url) => (WrapperdComponent) => {
  return class extends PureComponent {
    constructor(props) {
      super(props);
      this.state = {
        formValues: {},
        sortArr: [],
        sortArrKey: [],
      };
    }

    getSearchParam = () => {
      const { sortArr } = this.state;
      // 注意子组件高阶组件的顺序会影响此处
      let params = this.child.queryParam();
      params = {
        ...params,
        sort: sortArr,
      };
      return params;
    };

    searchList = () => {
      const { dispatch } = this.props;
      const { formValues } = this.state;
      const values = this.getSearchParam();
      if (values.start > values.end) {
        message.warn('开始日期不能大于结束日期');
        return;
      }
      dispatch({
        type: url.urlSearch,
        payload: {
          page: 1,
          size: formValues.size,
          ...values,
        },
      });
    };

    handleTableChange = (pagination, filters, sorter) => {
      console.log(this.child)
      const { dispatch } = this.props;
      const { formValues } = this.state;
      const values = this.getSearchParam();
      if (values.start > values.end) {
        message.warn('开始日期不能大于结束日期');
        return;
      }
      this.child.setState({
        selectedRowKeys: [],
        selectedRows: []
      })
      dispatch({
        type: url.urlSearch,
        payload: {
          page: pagination.current,
          size: pagination.pageSize,
          ...values,
        },
      }).then(() => {
        this.setState({
          formValues: {
            page: pagination.current,
            size: pagination.pageSize,
          },
        });
      });
    };

    handleClickHeader = type => {
      const { sortArr, sortArrKey } = this.state;
      const { sortColumns } = this.child.state
      sortTable(type, sortColumns, sortArr, sortArrKey);
      this.setState({
        sortColumns,
        sortArr,
        sortArrKey,
      });
      this.searchList();
    };

    render() {
      const mapMethodToProps = {
        getSearchParam: this.getSearchParam,
        searchList: this.searchList,
        handleClickHeader: this.handleClickHeader,
        handleTableChange: this.handleTableChange,
      };
      return (
        <WrapperdComponent
          {...this.props}
          {...this.state}
          {...mapMethodToProps}
          ref={node => this.child = node}
        />
      );
    }
  };
};
export default BasicHOC
