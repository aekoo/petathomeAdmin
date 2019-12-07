import { Row, Col, Button, Card, Divider, Form, Table, Icon, Popconfirm, Switch, Select, message, } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import Link from 'umi/link';
import CreateForm from './components/CreateForm';
import styles from './style.less';

const statusType = ['未开始', '进行中', "已结束"];

/* eslint react/no-multi-comp:0 */
@connect(({ deploy, loading }) => ({
  deploy,
  loading: loading.models.deploy,
}))
class ActivityList extends Component {
  state = {
    modalVisible: false,
    record: {},
  };

  columns = [
    {
      title: '活动ID', dataIndex: 'link', width: 300,
      render: val => <Link to={`/sales/orders`}>1000001</Link>
    },
    { title: '创建时间', dataIndex: 'link', width: 300 },
    { title: '价格', dataIndex: 'link', width: 300 },
    { title: '说明', dataIndex: 'link', width: 300 },
    { title: '开始时间', dataIndex: 'link', width: 300 },
    { title: '结束时间', dataIndex: 'link', width: 300 },
    { title: '状态', dataIndex: 'link', width: 300 },
    { title: '数量限制', dataIndex: 'link', width: 300 },
    { title: '订单数', dataIndex: 'link', width: 300 },
    {
      title: '图片',
      dataIndex: 'image',
      width: 200,
      render: val => <img style={{ width: 160, height: 80 }} src={val} />,
    },
    { title: '链接', dataIndex: 'link', width: 300 },
    {
      title: '是否启用',
      dataIndex: 'display',
      width: 130,
      render: (text, record) => (
        <Switch
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={!!text}
          onChange={() => this.displayFunc(record)}
        />
      ),
    },
    { title: '备注', dataIndex: 'remark', width: 300 },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除？"
            okType="danger"
            onConfirm={() => this.deleteFunc(record)}
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
          >
            <a>删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.fetchListData();
  }
  // 查询列表
  fetchListData = () => {
    const { dispatch } = this.props;
    dispatch({ type: 'deploy/fetchBanner' });
  };
  // 添加-编辑
  editFunc = params => {
    const { dispatch } = this.props;
    console.log(params);

    dispatch({
      type: 'deploy/editBanner',
      payload: params,
    });
    this.handleModalVisible();
  };
  // 删除
  deleteFunc = record => {
    const { dispatch } = this.props;
    const { bannerId } = record;
    dispatch({
      type: 'deploy/deleteBanner',
      payload: { bannerId },
    });
  };
  // 开启-关闭
  displayFunc = record => {
    const { dispatch } = this.props;
    const { bannerId, display } = record;
    dispatch({
      type: 'deploy/displayBanner',
      payload: { bannerId, display: display ? 0 : 1 },
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      record: record || {},
    });
  };

  render() {
    const {
      deploy: {
        listData: { results },
      },
      loading,
    } = this.props;
    const { modalVisible, record } = this.state;

    const { recordList = [] } = results || {};
    const parentMethods = {
      handleAdd: this.editFunc,
      handleModalVisible: this.handleModalVisible,
      record,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加
              </Button>
            </div>
            <Table
              scroll={{ x: 1300 }}
              rowKey={record => record.bannerId}
              loading={loading}
              columns={this.columns}
              dataSource={recordList}
            />
          </div>
        </Card>
        {modalVisible ? <CreateForm {...parentMethods} /> : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ActivityList);
