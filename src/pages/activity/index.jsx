import { Row, Col, Button, Card, Divider, Form, Table, Icon, Popconfirm, Badge, } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import moment from 'moment';
import { connect } from 'dva';
import Link from 'umi/link';
import CreateForm from './components/CreateForm';
import styles from './style.less';

const statusMap = ['default', 'success', 'processing'];
const statusType = ['未开始', '进行中', "已结束"];

/* eslint react/no-multi-comp:0 */
@connect(({ activity, loading }) => ({
  activity,
  loading: loading.models.activity,
}))
class ActivityList extends Component {
  state = {
    modalVisible: false,
    record: {},
  };

  columns = [
    {
      title: '活动ID', dataIndex: 'activityId', width: 300,
      render: text => <Link to={`/activity/orders?activityId=${text}`}>{text}</Link>
    },
    { title: '创建时间', dataIndex: 'createTime', width: 200 },
    { title: '活动标题', dataIndex: 'title', width: 200 },
    {
      title: '价格', dataIndex: 'totalPrice', width: 100,
      render: text => `${text} 元`
    },
    { title: '说明', dataIndex: 'description', width: 300, ellipsis: true, },
    {
      title: '开始时间', dataIndex: 'startDate', width: 200,
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '结束时间', dataIndex: 'endDate', width: 200,
      render: text => moment(text).format('YYYY-MM-DD HH:mm:ss')
    },
    {
      title: '状态', dataIndex: 'status', width: 100,
      render: text => <Badge status={statusMap[text]} text={statusType[text]} />
    },
    { title: '数量限制', dataIndex: 'num', width: 100 },
    { title: '订单数', dataIndex: 'totalOrderNum', width: 100 },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleModalVisible(true, record)}>编辑</a>
          {
            record.totalOrderNum < 1 ?
              <>
                <Divider type="vertical" />
                <Popconfirm
                  title="确定要删除？"
                  okType="danger"
                  onConfirm={() => this.deleteFunc(record)}
                  icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                >
                  <a>删除</a>
                </Popconfirm>
              </>
              : null
          }
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
    dispatch({ type: 'activity/fetchActivity' });
  };
  // 添加-编辑
  editFunc = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/editActivity',
      payload: params,
    });
    this.handleModalVisible();
  };
  // 删除
  deleteFunc = record => {
    const { dispatch } = this.props;
    const { activityId } = record;
    dispatch({
      type: 'activity/deleteActivity',
      payload: { activityId },
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
      activity: {
        listData: { results },
      },
      loading,
    } = this.props;
    const { modalVisible, record } = this.state;

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
              rowKey={record => record.activityId}
              loading={loading}
              columns={this.columns}
              dataSource={results}
            />
          </div>
        </Card>
        {modalVisible ? <CreateForm {...parentMethods} /> : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ActivityList);
