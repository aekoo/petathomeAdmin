import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Table,
  Row,
  Icon,
  Popconfirm,
  Select,
  Switch,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

/* eslint react/no-multi-comp:0 */
@connect(({ deploy, loading }) => ({
  deploy,
  loading: loading.models.deploy,
}))
class NoticeList extends Component {
  state = {
    modalVisible: false,
  };
  p = {
    pageNum: 1,
    pageSize: 10,
    total: 0, //总条数
  };

  columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      width: 200,
      render: val => <img src={val} />,
    },
    {
      title: '内容',
      dataIndex: 'textContent',
      width: 500,
    },
    {
      title: '链接',
      dataIndex: 'link',
      width: 300,
    },
    {
      title: '是否启用',
      dataIndex: 'display',
      width: 100,
      render: (text, record) => (
        <Switch
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={!!text}
          onChange={() => this.displayNotice(record)}
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
          <a>编辑</a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除？"
            onConfirm={() => this.deleteNotice(record)}
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
  fetchListData = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deploy/fetchNotice',
      payload: values,
    });
  };
  // 添加-编辑通知
  editNotice = params => {
    const { dispatch } = this.props;
    console.log(params);

    dispatch({
      type: 'deploy/editNotice',
      payload: params,
    });
    this.handleModalVisible(false);
  };
  // 删除通知
  deleteNotice = record => {
    const { dispatch } = this.props;
    const { textId } = record;
    dispatch({
      type: 'deploy/deleteNotice',
      payload: { textId },
    });
  };
  // 开启-关闭通知
  displayNotice = record => {
    const { dispatch } = this.props;
    const { textId } = record;
    dispatch({
      type: 'deploy/displayNotice',
      payload: { textId },
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  render() {
    const {
      deploy: {
        noticeData: { results = [] },
      },
      loading,
    } = this.props;
    const { modalVisible } = this.state;
    const parentMethods = {
      handleAdd: this.editNotice,
      handleModalVisible: this.handleModalVisible,
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
              dataSource={results}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(NoticeList);
