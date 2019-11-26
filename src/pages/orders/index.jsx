import {
  Badge,
  Button,
  Card,
  Col,
  Form,
  Input,
  Icon,
  Table,
  Row,
  Rate,
  Select,
  Popover,
  Popconfirm,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from '../../components/StandardTable';
import Details from './components/Details';
import Allocation from './components/Allocation';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const serverType = ['上门喂猫', '上门遛狗'];
const payStatusMap = ['warning', 'success', 'processing', 'purple', 'default'];
const payStatus = ['待支付', '已支付', '已申请退款', '已退款', '已取消'];
const serverStatusMap = ['success', 'processing', 'default'];
const serverStatus = ['未服务', '进行中', '已结束'];

/* eslint react/no-multi-comp:0 */
@connect(({ orders, loading }) => ({
  orders,
  loading: loading.models.orders,
}))
class OrderList extends Component {
  state = {
    detailsModalVisible: false,
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
    editOrderNo: '',
    remark: '',
    record: {},
  };
  p = {
    pageNum: 1,
    pageSize: 10,
    total: 0, //总条数
  };

  columns = [
    { title: '订单号', key: 'orderNo', dataIndex: 'orderNo', render: (val, record) => <a onClick={() => this.handleDetailsModal(true, record)}>{val}</a>, },
    { title: '服务类别', key: 'serverType', dataIndex: 'serverType', render: val => serverType[val], },
    { title: '服务地址', key: 'address', dataIndex: 'address', },
    { title: '服务日期', key: 'serverDate', dataIndex: 'serverDate', },
    { title: '服务时间', key: 'serverPeriod', dataIndex: 'serverPeriod', },
    { title: '订单金额', key: 'totalMoney', dataIndex: 'totalMoney', render: text => `${text} 元`, },
    {
      title: '支付状态', key: 'payStatus', dataIndex: 'payStatus',
      render: text => text == '-1' ? <Badge status="error" text="支付失败" /> : <Badge status={payStatusMap[text]} text={payStatus[text]} />

    },
    {
      title: '爱宠官', key: 'lovePetOfficerName', dataIndex: 'lovePetOfficerName',
      render: (text, record) => text ? text : <a onClick={() => this.handleModalVisible(true, record)}>未分配</a>,
    },
    {
      title: '服务状态', key: 'serverStatus', dataIndex: 'serverStatus',
      render: (text) => <Badge status={serverStatusMap[text]} text={serverStatus[text]} />
    },
    {
      title: '备注', key: 'remark', dataIndex: 'remark',
      render: (text, record) => this.renderRemark(record),
    },
    {
      title: '评价', key: 'evaluationStatus', dataIndex: 'evaluationStatus',
      render: (text, record) =>
        text == 1 ? (
          <Popover
            title="评价信息"
            trigger="click"
            placement="topRight"
            content={
              <div>
                <Rate disabled defaultValue={2} />
                <TextArea rows={4} disabled value={record.evaluationContent} />
              </div>
            }
          >
            <a>已评价</a>
          </Popover>
        ) : (
            '未评价'
          ),
    },
    {
      title: '操作', dataIndex: 'action',
      render: (val, record) =>
        record.payStatus == '2' ? (
          <Popconfirm
            title="确定退款吗?"
            icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
            okType="danger"
            onConfirm={() => this.confirmRefund(record.orderNo)}
          >
            <Button type="danger" ghost style={{ marginLeft: 16 }}>
              退款
            </Button>
          </Popconfirm>
        ) : null,
    },
  ];

  componentDidMount() {
    this.fetchListData();
  }
  fetchListData = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetch',
      payload: params,
    });
  };
  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      this.fetchListData(values);
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    this.fetchListData();
  };

  handleDetailsModal = (flag, record) => {
    this.setState({
      detailsModalVisible: !!flag,
      record: record || {},
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      record: record || {},
    });
  };
  // 分配爱宠官
  handleAdd = params => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/distribution',
      payload: params,
    });
    this.handleModalVisible();
  };


  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleUpdate = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/update',
      payload: {
        name: fields.name,
        desc: fields.desc,
        key: fields.key,
      },
    });
    message.success('配置成功');
    this.handleUpdateModalVisible();
  };

  // 确认退款
  confirmRefund = orderNo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/confirmRefund',
      payload: { orderNo },
    });
  };
  // 编辑备注
  editRemark = () => {
    const { dispatch } = this.props;
    const { editOrderNo, remark } = this.state;
    dispatch({
      type: 'orders/editRemark',
      payload: { orderNo: editOrderNo, remark },
    });
    this.setState({ editOrderNo: '', remark: '' });
  };
  // 编辑备注
  renderRemark(record) {
    const { editOrderNo } = this.state;
    const { orderNo, remark } = record;
    return (
      <Popover
        title="备注信息"
        trigger="click"
        placement="topRight"
        visible={editOrderNo == orderNo}
        content={
          <Form layout="inline">
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={8} sm={24}>
                <FormItem>
                  <TextArea
                    rows={3}
                    placeholder="请输入备注信息"
                    defaultValue={remark}
                    onChange={e => this.setState({ remark: e.target.value })}
                    style={{ width: 260 }}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
              <Col md={6} sm={24}>
                <Button type="primary" onClick={() => this.editRemark()}>
                  保存
                </Button>
              </Col>
              <Col md={6} sm={24}>
                <Button onClick={() => this.setState({ editOrderNo: '' })}>取消</Button>
              </Col>
            </Row>
          </Form>
        }
      >
        <span onClick={() => this.setState({ editOrderNo: orderNo, remark })}>
          {remark ? remark : <a>编辑</a>}
        </span>
      </Popover>
    );
  }

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="服务类型">
              {getFieldDecorator('serverType', { initialValue: '' })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="0">上门喂猫</Option>
                  <Option value="1">上门遛狗</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus', { initialValue: '' })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  <Option value="-1">支付失败</Option>
                  <Option value="0">待支付</Option>
                  <Option value="1">已支付</Option>
                  <Option value="2">已申请退款</Option>
                  <Option value="3">已退款</Option>
                  <Option value="4">已取消</Option>
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="爱宠官">
              {getFieldDecorator('lovePetOfficerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden' }}>
          <div style={{ float: 'right', marginBottom: 24 }}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>
              重置
            </Button>
          </div>
        </div>
      </Form>
    );
  }

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
      orders: {
        listData: { results },
      },
      loading,
    } = this.props;
    this.p.total = results ? results.recordSum : 10;
    const { recordList = [] } = results || {};
    const { detailsModalVisible, modalVisible, updateModalVisible, stepFormValues, record } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };
    const detailsMethods = {
      handleDetailsModal: this.handleDetailsModal,
    };
    const updateMethods = {
      handleUpdateModalVisible: this.handleUpdateModalVisible,
      handleUpdate: this.handleUpdate,
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              rowKey={record => record.orderNo}
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
          </div>
        </Card>
        {detailsModalVisible ? (
          <Details {...detailsMethods} detailsModalVisible={detailsModalVisible} values={record} />
        ) : null}
        {modalVisible ? (
          <Allocation {...parentMethods} modalVisible={modalVisible} values={record} />
        ) : null}
        {stepFormValues && Object.keys(stepFormValues).length ? (
          <UpdateForm
            {...updateMethods}
            updateModalVisible={updateModalVisible}
            values={stepFormValues}
          />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(OrderList);
