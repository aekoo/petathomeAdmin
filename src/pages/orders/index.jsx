import { Badge, Button, Card, Col, Form, Input, Table, Row, Select, message, } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import moment from 'moment';
import StandardTable from '../../components/StandardTable';
import CreateForm from './components/CreateForm';
import UpdateForm from './components/UpdateForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const serverType = ['上门喂猫', '上门遛狗'];
const payStatusMap = ['Warning', 'success', 'processing', 'purple', 'default'];
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
    modalVisible: false,
    updateModalVisible: false,
    selectedRows: [],
    formValues: {},
    stepFormValues: {},
  };
  p = {
    pageNum: 1,
    pageSize: 10,
    total: 0,//总条数
  }

  columns = [
    {
      title: '订单号',
      key: 'orderNo',
      dataIndex: 'orderNo',
      render: val => <a>{val}</a>,
    },
    {
      title: '服务类别',
      key: 'serverType',
      dataIndex: 'serverType',
      render: val => serverType[val],
    },
    {
      title: '服务时间',
      key: 'serverPeriod',
      dataIndex: 'serverPeriod',
    },
    {
      title: '备注',
      key: 'remark',
      dataIndex: 'remark',
      render: val => val ? val : <a>编辑</a>,
    },
    {
      title: '服务日期',
      key: 'serverDate',
      dataIndex: 'serverDate',
    },
    {
      title: '服务地址',
      key: 'address',
      dataIndex: 'address',
    },
    {
      title: '爱宠官',
      key: 'lovePetOfficerName',
      dataIndex: 'lovePetOfficerName',
      render: val => val ? val : <a>未分配</a>,
    },
    {
      title: '订单金额',
      key: 'totalMoney',
      dataIndex: 'totalMoney',
      render: val => `${val} 元`,
    },
    {
      title: '支付状态',
      key: 'payStatus',
      dataIndex: 'payStatus',
      render: val => {
        return val == '-1' ? <Badge status='error' text="支付失败" /> : <Badge status={payStatusMap[val]} text={payStatus[val]} />;
      }
    },
    {
      title: '服务状态',
      key: 'serverStatus',
      dataIndex: 'serverStatus',
      render(val) {
        return <Badge status={serverStatusMap[val]} text={serverStatus[val]} />;
      },
    },
    {
      title: '评价',
      key: 'evaluationStatus',
      dataIndex: 'evaluationStatus',
      render: val => val == 1 ? <a>未分配</a> : '未评价',
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/fetch',
    });
  }
  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'orders/fetch',
        payload: values,
      });
    });
  };
  // 重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'orders/fetch',
      payload: {},
    });
  };


  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };


  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleUpdateModalVisible = (flag, record) => {
    this.setState({
      updateModalVisible: !!flag,
      stepFormValues: record || {},
    });
  };

  handleAdd = fields => {
    const { dispatch } = this.props;
    dispatch({
      type: 'orders/add',
      payload: {
        desc: fields.desc,
      },
    });
    message.success('添加成功');
    this.handleModalVisible();
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

  // 切换页码
  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
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

    dispatch({
      type: 'orders/fetch',
      payload: params,
    });
  };

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48, }}        >
          <Col md={8} sm={24}>
            <FormItem label="服务类型">
              {getFieldDecorator('serverType', { initialValue: '' })(
                <Select placeholder="请选择" style={{ width: '100%', }}>
                  <Option value="">全部</Option>
                  <Option value="0">上门喂猫</Option>
                  <Option value="1">上门遛狗</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="订单状态">
              {getFieldDecorator('orderStatus', { initialValue: '' })(
                <Select placeholder="请选择" style={{ width: '100%', }}>
                  <Option value="">全部</Option>
                  <Option value="-1">支付失败</Option>
                  <Option value="0">待支付</Option>
                  <Option value="1">已支付</Option>
                  <Option value="2">已申请退款</Option>
                  <Option value="3">已退款</Option>
                  <Option value="4">已取消</Option>
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="爱宠官">
              {getFieldDecorator('lovePetOfficerName')(<Input placeholder="请输入" />)}
            </FormItem>
          </Col>
        </Row>
        <div style={{ overflow: 'hidden', }}        >
          <div style={{ float: 'right', marginBottom: 24, }}>
            <Button type="primary" htmlType="submit">查询</Button>
            <Button style={{ marginLeft: 8, }} onClick={this.handleFormReset}>重置</Button>
          </div>
        </div>
      </Form>
    );
  }

  render() {
    const { orders: { data: { results } }, loading, } = this.props;
    this.p.total = results ? results.recordSum : 10;
    const { recordList = [] } = results || {};
    const { selectedRows, modalVisible, updateModalVisible, stepFormValues } = this.state;
    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
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
            {/* <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div> */}
            {/* <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={results}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
              pagination={{
                showQuickJumper: true,
                showSizeChanger: true,
                pageSize: this.p.pageSize || 1,
                total: this.p.total,
                showTotal: (t) => <div>共{t}条</div>
              }}
            /> */}
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
                showTotal: (t) => <div>共{t}条</div>
              }}
            />
          </div>
        </Card>
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
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
