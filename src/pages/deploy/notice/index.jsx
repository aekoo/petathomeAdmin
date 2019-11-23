import { Button, Card, Divider, Form, Table, Icon, Popconfirm, Switch, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import styles from './style.less';

/* eslint react/no-multi-comp:0 */
@connect(({ deploy, loading }) => ({
  deploy,
  loading: loading.models.deploy,
}))
class NoticeList extends Component {
  state = {
    modalVisible: false,
    record: {},
  };

  columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      width: 200,
      render: val => <img style={{ width: 40, height: 40 }} src={val} />,
    },
    { title: '内容', dataIndex: 'textContent', width: 500 },
    { title: '链接', dataIndex: 'link', width: 300 },
    {
      title: '是否启用',
      dataIndex: 'display',
      width: 100,
      render: (text, record) => (
        <Switch
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={!!text}
          onChange={() => this.displayFunc(record)}
        />
      ),
    },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (text, record) => (
        <span>
          <a href="#" onClick={() => this.editClickEvent(record)}>
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除？"
            onConfirm={() => this.deleteFunc(record)}
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
          >
            <a href="#">删除</a>
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
    dispatch({ type: 'deploy/fetchNotice' });
  };
  // 添加-编辑通知
  editFunc = params => {
    const { dispatch } = this.props;
    console.log(params);

    dispatch({
      type: 'deploy/editNotice',
      payload: params,
    });
    this.handleModalVisible(false);
  };
  // 删除通知
  deleteFunc = record => {
    const { dispatch } = this.props;
    const { textId } = record;
    dispatch({
      type: 'deploy/deleteNotice',
      payload: { textId },
    });
  };
  // 开启-关闭通知
  displayFunc = record => {
    const { dispatch } = this.props;
    const { textId, display } = record;
    dispatch({
      type: 'deploy/displayNotice',
      payload: { textId, display: display ? 0 : 1 },
    });
  };

  addClickEvent = () => {
    this.handleModalVisible(true);
  };
  editClickEvent = record => {
    this.setState({ record }); //当前行的所有数据
    this.handleModalVisible(true);
  };
  handleModalVisible = flag => {
    if (flag) {
      this.setState({ modalVisible: !!flag });
    } else {
      this.setState({ modalVisible: !!flag, record: {} }); //清除编辑的id
    }
  };

  render() {
    const {
      deploy: {
        listData: { results },
      },
      loading,
    } = this.props;
    let recordList = [];
    if (results && results.recordList) {
      recordList = results.recordList;
    } else {
      recordList = results;
    }
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
              <Button icon="plus" type="primary" onClick={() => this.addClickEvent()}>
                添加
              </Button>
            </div>
            <Table
              rowKey={record => record.textId}
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

export default Form.create()(NoticeList);
