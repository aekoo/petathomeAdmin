import { Avatar, Card, Form, Table, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Link from 'umi/link';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const sexType = ['未知', '男', '女'];

/* eslint react/no-multi-comp:0 */
@connect(({ customer, loading }) => ({
  customer,
  loading: loading.models.customer,
}))
class CustomerList extends Component {
  state = {
    selectedRows: [],
    formValues: {},
  };
  p = {
    pageNum: 1,
    pageSize: 10,
    total: 0, //总条数
  };

  columns = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 280,
      render: val => <a>{val}</a>,
    },
    {
      title: '头像',
      dataIndex: 'avatar',
      render: val => <Avatar size={64} icon="user" src={val} />,
      width: 100,
    },
    {
      title: '昵称',
      dataIndex: 'nickName',
      width: 200,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: val => sexType[val],
      width: 80,
    },
    {
      title: '年龄',
      dataIndex: 'age',
      width: 80,
      render: val => val || '-',
    },
    {
      title: '生日',
      dataIndex: 'birthday',
      width: 200,
      render: val => val || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: 200,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 200,
    },
    {
      title: '宠物信息',
      dataIndex: 'pet',
      width: 100,
      align: 'center',
      render: (text, record) => <Link to={`/pet?userId=${record.userId}`}>查看</Link>,
    },
  ];

  componentDidMount() {
    this.fetchListData();
  }
  fetchListData = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'customer/fetchCustomer',
      payload: values,
    });
  };

  // 切换页码
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { formValues } = this.state;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    this.fetchListData(params);
  };

  render() {
    const {
      customer: {
        listData: { results },
      },
      loading,
    } = this.props;
    this.p.total = results ? results.recordSum : 10;
    const { recordList = [] } = results || {};
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Table
            rowKey={record => record.userId}
            loading={loading}
            columns={this.columns}
            dataSource={recordList}
            onChange={this.handleStandardTableChange}
            pagination={{
              showQuickJumper: true,
              showSizeChanger: true,
              pageSize: this.p.pageSize || 1,
              total: this.p.total,
              showTotal: t => <div>共{t}条</div>,
            }}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(CustomerList);
