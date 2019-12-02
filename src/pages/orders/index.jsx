import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
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

  columns = [
    {
      title: '订单号', key: 'orderNo', dataIndex: 'orderNo', width: 100, ellipsis: true,
      render: (val, record) => <a onClick={() => this.handleDetailsModal(true, record)}>{val}</a>,
    },
    {
      title: '服务类别', key: 'serverType', dataIndex: 'serverType', width: 100,
      render: val => serverType[val],
    },
    { title: '服务地址', key: 'address', dataIndex: 'address', width: 260, ellipsis: true, },
    {
      title: '服务日期', key: 'serverDate', dataIndex: 'serverDate', width: 150,
      render: (text) => {
        let serverDate = text.split(',');
        let len = serverDate.length;
        return (<span>{len > 1 ? `${serverDate[0]} 等${len}天` : serverDate[0]}</span>)
      }
    },
    // { title: '服务时间', key: 'serverPeriod', dataIndex: 'serverPeriod', },
    // { title: '服务时长', key: 'serverDuration', dataIndex: 'serverDuration', },
    // { title: '宠物数量', key: 'petNumber', dataIndex: 'petNumber', },
    // { title: '宠物', key: 'petIds', dataIndex: 'petIds', },
    // { title: '高级服务', key: 'petIds', dataIndex: 'petIds', },
    // { title: '钥匙交接', key: 'keyHandover', dataIndex: 'keyHandover', },
    {
      title: '订单金额', key: 'totalMoney', dataIndex: 'totalMoney', width: 100,
      render: text => `${text} 元`
    },
    {
      title: '支付状态', key: 'payStatus', dataIndex: 'payStatus', width: 100,
      render: text =>
        text == '-1' ? (
          <Badge status="error" text="支付失败" />
        ) : (
            <Badge status={payStatusMap[text]} text={payStatus[text]} />
          ),
    },
    {
      title: '爱宠官', key: 'lovePetOfficerName', dataIndex: 'lovePetOfficerName', width: 100,
      render: (text, record) =>
        text ? text : <a onClick={() => this.handleModalVisible(true, record)}>未分配</a>,
    },
    {
      title: '服务状态', key: 'serverStatus', dataIndex: 'serverStatus', width: 100,
      render: text => <Badge status={serverStatusMap[text]} text={serverStatus[text]} />,
    },
    {
      title: '备注', key: 'remark', dataIndex: 'remark', width: 100, ellipsis: true,
      render: (text, record) => this.renderRemark(record),
    },
    {
      title: '评价', key: 'evaluationStatus', dataIndex: 'evaluationStatus', width: 100,
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
    { title: '下单时间', key: 'createTime', dataIndex: 'createTime', width: 200, },
    {
      title: '操作', dataIndex: 'action', width: 100, fixed: 'right',
      render: (val, record) => (
        <span>
          {/* <a onClick={() => this.handleDetailsModal(true, record)}>详情</a> */}
          {record.payStatus == '2' ? (
            <>
              {/* <Divider type="vertical" /> */}
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
            </>
          ) : null}
        </span>
      ),
    },
  ];

  componentDidMount() {
    const {
      form,
      location: { query = {} },
    } = this.props;
    if (query.lovePetOfficerName) {
      form.setFieldsValue({ lovePetOfficerName: query.lovePetOfficerName });
      this.handleSearch();
    } else {
      this.fetchListData();
    }
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
    if (e) {
      e.preventDefault();
    }
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      this.setState({ formValues: fieldsValue });
      this.fetchListData(fieldsValue);
    });
  };
  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({ formValues: {} });
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
      callback: response => {
        this.handleSearch();
      },
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
    const { current, pageSize } = pagination;
    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: parseInt(current),
      pageSize: parseInt(pageSize),
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
    const { recordList = [] } = results || {};
    const {
      detailsModalVisible,
      modalVisible,
      updateModalVisible,
      stepFormValues,
      record,
    } = this.state;
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
              scroll={{ x: 1300 }}
              rowKey={record => record.orderNo}
              loading={loading}
              columns={this.columns}
              dataSource={recordList}
              onChange={this.handleStandardTableChange}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                current: (results && results.currentPage) || 1,
                pageSize: (results && results.pageSize) || 10,
                total: (results && results.recordSum) || 0,
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
