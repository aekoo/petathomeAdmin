import {
  Row,
  Col,
  Button,
  Card,
  Divider,
  Form,
  Table,
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

const typeMap = ['上门喂猫', '上门遛狗'];
const goodsMap = ['可选数量'];

/* eslint react/no-multi-comp:0 */
@connect(({ goods, loading }) => ({
  goods,
  loading: loading.models.goods,
}))
class GoodsList extends Component {
  state = {
    modalVisible: false,
    classification: 0,
    record: {},
  };

  columns1 = [
    { title: '商品ID', dataIndex: 'goodsId', width: 200 },
    { title: '商品名称', dataIndex: 'goodsName', width: 200 },
    {
      title: '分类', dataIndex: 'classification', width: 200,
      render: text => typeMap[text],
    },
    {
      title: '商品类型', dataIndex: 'goodsType', width: 200,
      render: text => goodsMap[text],
    },
    {
      title: '价格', dataIndex: 'showPrice', width: 200,
      render: text => `${text} 元`,
    },
    {
      title: '是否启用',
      dataIndex: 'shelf',
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
    { title: '创建时间', dataIndex: 'createTime', width: 200 },
    { title: '更新时间', dataIndex: 'updateTime', width: 200 },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleModalVisible(true, record)}>
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除？"
            okType="danger"
            onConfirm={() => this.deleteFunc(record)}
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
          >
            <a >删除</a>
          </Popconfirm>
        </span>
      ),
    },
  ];

  columns2 = [
    { title: '商品ID', dataIndex: 'goodsId', width: 200 },
    { title: '商品名称', dataIndex: 'goodsName', width: 200 },
    {
      title: '分类', dataIndex: 'classification', width: 200,
      render: text => typeMap[text],
    },
    {
      title: '商品类型', dataIndex: 'goodsType', width: 200,
      render: text => goodsMap[text],
    },
    {
      title: '服务时长', dataIndex: 'serverDurationVal', width: 200,
      render: text => text ? `${text} 分钟` : '--',
    },
    {
      title: '价格', dataIndex: 'showPrice', width: 200,
      render: text => `${text} 元`,
    },
    {
      title: '是否启用',
      dataIndex: 'shelf',
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
    { title: '创建时间', dataIndex: 'createTime', width: 200 },
    { title: '更新时间', dataIndex: 'updateTime', width: 200 },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (text, record) => (
        <span>
          <a onClick={() => this.handleModalVisible(true, record)}>
            编辑
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="确定要删除？"
            okType="danger"
            onConfirm={() => this.deleteFunc(record)}
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
          >
            <a >删除</a>
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
    dispatch({ type: 'goods/gainGoods' });
  };
  // 添加-编辑
  editFunc = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'goods/editGoods',
      payload: params,
    });
    this.handleModalVisible();
  };
  // 删除
  deleteFunc = record => {
    const { dispatch } = this.props;
    const { goodsId } = record;
    dispatch({
      type: 'goods/deleteGoods',
      payload: { goodsId },
    });
  };
  // 开启-关闭
  displayFunc = record => {
    const { dispatch } = this.props;
    const { goodsId, shelf } = record;
    dispatch({
      type: 'goods/displayGoods',
      payload: { goodsId, shelf: shelf ? 0 : 1 },
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      record: record || {},
    });
  };

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'goods/searchChange',
        payload: fieldsValue,
      });
      this.setState({ classification: fieldsValue.classification });
      this.fetchListData();
    });
  };
  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'goods/searchChange',
      payload: { classification: 0, goodsType: 0 },
    });
    this.fetchListData();
  };
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="分类">
              {getFieldDecorator('classification', {
                initialValue: '0',
              })(
                <Select style={{ width: '100%' }}>
                  <Option value="0">上门喂猫</Option>
                  <Option value="1">上门遛狗</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="商品类型">
              {getFieldDecorator('goodsType', {
                initialValue: '0',
              })(
                <Select style={{ width: '100%' }}>
                  <Option value="0">可选数量</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <span className={styles.submitButtons}>
              <Button type="primary" htmlType="submit">
                查询
              </Button>
              <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
                重置
              </Button>
            </span>
          </Col>
        </Row>
      </Form>
    );
  }
  render() {
    const { goods: { listData }, loading, } = this.props;
    const { modalVisible, classification, record } = this.state;

    const parentMethods = {
      handleAdd: this.editFunc,
      handleModalVisible: this.handleModalVisible,
      record,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                添加
              </Button>
            </div>
            <Table
              rowKey={record => record.goodsId}
              loading={loading}
              columns={classification == 0 ? this.columns1 : this.columns2}
              dataSource={listData}
            />
          </div>
        </Card>
        {modalVisible ? <CreateForm {...parentMethods} /> : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(GoodsList);
