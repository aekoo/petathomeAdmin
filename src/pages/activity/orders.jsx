import { Badge, Button, Card, Col, Divider, Form, Input, Icon, Table, Row, Rate, Select, Popover, Popconfirm, message, } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import Details from './components/Details';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const serverType = ['上门喂猫', '上门遛狗'];
const payStatusMap = ['warning', 'success', 'processing', 'purple', 'default'];
const payStatus = ['待支付', '已支付', '已申请退款', '已退款', '已取消'];

/* eslint react/no-multi-comp:0 */
@connect(({ activity, loading }) => ({
  orderData: activity.orderData.results,
  loading: loading.models.activity,
}))
class ActivityOrder extends Component {
  state = {
    detailsModalVisible: false,
    formValues: {},
    editOrderNo: '',
    remark: '',
    record: {},
  };

  columns = [
    {
      title: '订单号', dataIndex: 'orderNo', width: 260, ellipsis: true,
      // render: (val, record) => <a onClick={() => this.handleDetailsModal(true, record)}>{val}</a>,
    },
    { title: '用户ID', dataIndex: 'userId', width: 260, ellipsis: true, },
    {
      title: '服务类别', dataIndex: 'serverType', width: 100,
      render: val => serverType[val],
    },
    { title: '服务地址', dataIndex: 'address', width: 260, ellipsis: true, },
    {
      title: '订单金额', dataIndex: 'totalMoney', width: 100,
      render: text => `${text} 元`
    },
    { title: '宠物数量', dataIndex: 'petNumber', width: 100, },
    { title: '钥匙交接', dataIndex: 'keyHandover', width: 150, },
    {
      title: '订单状态', dataIndex: 'payStatus', width: 100,
      render: text => <Badge status={payStatusMap[text]} text={payStatus[text]} />
    },
    {
      title: '备注', dataIndex: 'remark', width: 200, ellipsis: true,
      render: (text, record) => this.renderRemark(record),
    },
    { title: '下单时间', dataIndex: 'createTime', width: 200, },
    {
      title: '操作', dataIndex: 'action', width: 100, fixed: 'right',
      render: (val, record) => (
        <span>
          {record.payStatus == '1' ? (
            <>
              <Popconfirm
                title="确定退款吗?"
                icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                okType="danger"
                onConfirm={() => this.confirmRefund(record.orderNo)}
              >
                <Button type="danger" ghost style={{ marginLeft: 16 }}>退款</Button>
              </Popconfirm>
            </>
          ) : null}
        </span>
      ),
    },
  ];

  componentDidMount() {
    this.fetchListData();
  }
  fetchListData = params => {
    const { dispatch, location: { query = {} }, } = this.props;
    params = { ...params, activityId: query.activityId }
    dispatch({
      type: 'activity/fetchActivityOrders',
      payload: params,
    });
  };

  // 查询
  handleSearch = e => {
    if (e) { e.preventDefault(); }
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


  // 确认退款
  confirmRefund = orderNo => {
    const { dispatch } = this.props;
    dispatch({
      type: 'activity/activityOrdersRefund',
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
      type: 'activity/editActivityOrdersRemark',
      payload: { orderNo: editOrderNo, remark },
      callback: response => {
        this.handleSearch();
      },
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

  render() {
    const { orderData, loading, } = this.props;
    const { detailsModalVisible, record, } = this.state;
    console.log(orderData);

    const detailsMethods = {
      handleDetailsModal: this.handleDetailsModal,
    };
    return (
      <PageHeaderWrapper title="活动订单">
        <Card bordered={false}>
          <div className={styles.tableList}>
            {/* <div className={styles.tableListForm}>{this.renderForm()}</div> */}
            <Table
              scroll={{ x: 1300 }}
              rowKey={record => record.orderNo}
              loading={loading}
              columns={this.columns}
              dataSource={orderData}
            />
          </div>
        </Card>
        {detailsModalVisible ? (
          <Details {...detailsMethods} detailsModalVisible={detailsModalVisible} values={record} />
        ) : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ActivityOrder);
