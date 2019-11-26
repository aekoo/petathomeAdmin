import {
  Badge,
  Button,
  Card,
  Col,
  Input,
  Form,
  Cascader,
  Table,
  Row,
  Select,
  Popconfirm,
  Popover,
  message,
} from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import Details from './components/Details';
import ChildTable from './components/ChildTable';
import cascaderData from '@/utils/cities';

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const sexType = ['未知', '男', '女'];
const serveType = ['铲屎官', '遛狗官', '铲屎官&遛狗官'];
const statusMap = ['warning', 'processing', 'success', 'error'];
const approvalStatusMap = ['未审核', '审核中', '已通过', '未通过'];

/* eslint react/no-multi-comp:0 */
@connect(({ employee, loading }) => ({
  employee,
  loading: loading.models.employee,
}))
class EmployeeList extends Component {
  state = {
    modalVisible: false,
    drawerVisible: false,
    selectedRows: [],
    formValues: {},
    record: {},
    childData: {},
    editStatus: '',
    status: '',
    editRemark: '',
    remark: '',
  };
  p = {
    pageNum: 1,
    pageSize: 10,
    total: 0, //总条数
  };

  columns = [
    {
      title: '提交日期',
      dataIndex: 'createTime',
      width: 200,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      width: 100,
    },
    {
      title: '性别',
      dataIndex: 'gender',
      render: val => sexType[val],
      width: 80,
    },
    {
      title: '地区',
      dataIndex: 'residentArea',
      width: 200,
      render: val => val || '-',
    },
    {
      title: '是否有养宠物',
      dataIndex: 'hasPet',
      width: 150,
    },
    {
      title: '类型',
      dataIndex: 'serve',
      width: 150,
      render: val => serveType[val],
    },
    {
      title: '接单数量',
      dataIndex: 'ordersNumber',
      width: 100,
      render: (text, record) =>
        (
          text > 0 ? <a onClick={() => this.handleDrawerVisible(true, record.orders)}>{text}</a> : text
        ) || '-',
    },
    {
      title: '待服务订单',
      dataIndex: 'pendingServiceNumber',
      width: 120,
      render: (text, record) => (
        text > 0 ? <a onClick={() => this.handleDrawerVisible(true, record.pendingServiceOrders)}>{text}</a> : text
      ) || '-',
    },
    {
      title: '审核状态',
      dataIndex: 'approvalStatus',
      width: 200,
      render: (text, record) => this.renderStatus(record),
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: (text, record) => this.renderRemark(record),
    },
    {
      title: '详细信息',
      dataIndex: 'desc',
      width: 100,
      align: 'center',
      render: (text, record) => (
        <a onClick={() => this.handleModalVisible(true, record)}>
          查看
        </a>
      ),
    },
  ];

  componentDidMount() {
    this.fetchListData();
  }
  fetchListData = values => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchEmployee',
      payload: values,
    });
  };
  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      const { cascader } = fieldsValue;
      const province = cascader[0];
      const city = cascader[1];
      const area = cascader[2];
      const values = {
        ...fieldsValue,
        province,
        city,
        area,
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

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      record: record || {},
    });
  };

  handleDrawerVisible = (flag, record) => {
    this.setState({
      drawerVisible: !!flag,
      record: record || {},
    });
  };

  // 修改审核状态
  editStatus = () => {
    const { dispatch } = this.props;
    const { editStatus, status } = this.state;
    dispatch({
      type: 'employee/updateReview',
      payload: { shitId: editStatus, status },
    });
    this.setState({ editStatus: '', status: '' });
  };
  // 编辑备注
  editRemark = () => {
    const { dispatch } = this.props;
    const { editRemark, remark } = this.state;
    dispatch({
      type: 'employee/updateRemark',
      payload: { shitId: editRemark, remark },
    });
    this.setState({ editRemark: '', remark: '' });
  };

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

  // 修改状态
  renderStatus(record) {
    const { editStatus } = this.state;
    const { shitId, approvalStatus } = record;
    return editStatus == shitId ? (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem>
              <Select
                style={{ width: '100%' }}
                defaultValue={approvalStatus}
                onChange={e => this.setState({ status: e })}
              >
                {approvalStatusMap.map((item, i) => (
                  <Option key={i} value={i}>
                    {item}
                  </Option>
                ))}
              </Select>
            </FormItem>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <Popconfirm title="确定修改吗?" onConfirm={() => this.editStatus()}>
              <Button type="primary">保存</Button>
            </Popconfirm>
          </Col>
          <Col md={8} sm={24}>
            <Button onClick={() => this.setState({ editStatus: '' })}>取消</Button>
          </Col>
        </Row>
      </Form>
    ) : (
        <Badge
          status={statusMap[approvalStatus]}
          text={approvalStatusMap[approvalStatus]}
          onClick={() => this.setState({ editStatus: shitId, status: approvalStatus })}
        />
      );
  }
  // 编辑备注
  renderRemark(record) {
    const { editRemark } = this.state;
    const { shitId, remark } = record;
    return (
      <Popover
        title="备注信息"
        trigger="click"
        placement="topRight"
        visible={editRemark == shitId}
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
                <Button onClick={() => this.setState({ editRemark: '' })}>取消</Button>
              </Col>
            </Row>
          </Form>
        }
      >
        <span onClick={() => this.setState({ editRemark: shitId, remark })}>
          {remark ? remark : <a>编辑</a>}
        </span>
      </Popover>
    );
  }

  // 搜索栏
  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('approvalStatus', { initialValue: '' })(
                <Select placeholder="请选择" style={{ width: '100%' }}>
                  <Option value="">全部</Option>
                  {approvalStatusMap.map((item, i) => (
                    <Option key={i} value={i}>
                      {item}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="地区">
              {getFieldDecorator('cascader', { initialValue: '' })(
                <Cascader options={cascaderData} placeholder="请选择" />,
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
    const {
      employee: {
        listData: { results },
      },
      loading,
    } = this.props;
    const { modalVisible, drawerVisible, record } = this.state;
    const parentMethods = {
      handleModalVisible: this.handleModalVisible,
      handleDrawerVisible: this.handleDrawerVisible,
      record,
    };
    // this.p.total = results ? results.recordSum : 10;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              rowKey={record => record.shitId}
              loading={loading}
              columns={this.columns}
              dataSource={results}
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
        {modalVisible ? <Details {...parentMethods} /> : null}
        {drawerVisible ? <ChildTable {...parentMethods} /> : null}
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(EmployeeList);
