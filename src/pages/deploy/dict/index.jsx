import { Button, Card, Divider, Form, Table, Icon, Popconfirm, message } from 'antd';
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
class DictList extends Component {
  state = {
    modalVisible: false,
    record: {},
  };

  columns = [
    { title: 'Dict ID', dataIndex: 'dictId' },
    { title: '字典名称', dataIndex: 'dictName' },
    { title: '字典值', dataIndex: 'dictValue' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '更新时间', dataIndex: 'updateTime' },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (text, record) => (
        <span>
          <a href="#" onClick={() => this.handleModalVisible(true, record)}>
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除？"
            okType="danger"
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
    dispatch({ type: 'deploy/fetchDict' });
  };
  // 添加-编辑
  editFunc = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deploy/editDict',
      payload: params,
    });
    this.handleModalVisible();
  };
  // 删除
  deleteFunc = record => {
    const { dispatch } = this.props;
    const { dictId } = record;
    dispatch({
      type: 'deploy/deleteDict',
      payload: { dictId },
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
        dictData: { results },
      },
      loading,
    } = this.props;
    const { modalVisible, record } = this.state;

    let recordList = [];
    if (results && results.recordList) {
      recordList = results.recordList;
    } else {
      recordList = results;
    }
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

export default Form.create()(DictList);
