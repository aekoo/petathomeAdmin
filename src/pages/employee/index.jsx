import { Badge, Button, Card, Col, Form, Cascader, Table, Row, Select, message, } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import styles from './style.less';
import cascaderData from '@/utils/cities'

const FormItem = Form.Item;
const { Option } = Select;

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
    selectedRows: [],
    formValues: {},
  };
  p = {
    pageNum: 1,
    pageSize: 10,
    total: 0,//总条数
  }

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
      render: val => val || '-',
    },
    {
      title: '待服务订单',
      dataIndex: 'pendingServiceNumber',
      width: 120,
      render: val => val || '-',
    },
    {
      title: '审核状态',
      dataIndex: 'approvalStatus',
      width: 100,
      render: val => <Badge status={statusMap[val]} text={approvalStatusMap[val]} />
    },
    {
      title: '备注',
      dataIndex: 'remark',
      render: val => val || '-',
    },
    {
      title: '详细信息',
      dataIndex: 'desc',
      width: 100,
      align: 'center',
      render: () => <a>查看</a>,
    },
  ];

  componentDidMount() {
    this.fetchListData();
  }
  fetchListData = (values) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'employee/fetchEmployee',
      payload: values,
    });
  }
  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      console.log(fieldsValue);
      const { cascader } = fieldsValue
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

  renderForm() {
    const {
      form: { getFieldDecorator },
    } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48, }}        >
          <Col md={8} sm={24}>
            <FormItem label="审核状态">
              {getFieldDecorator('approvalStatus', { initialValue: '' })(
                <Select placeholder="请选择" style={{ width: '100%', }}>
                  <Option value="">全部</Option>
                  {approvalStatusMap.map((item, i) => <Option key={i} value={i}>{item}</Option>)}
                </Select>
              )}
            </FormItem>
          </Col>
          <Col md={8} sm={24}>
            <FormItem label="地区">
              {getFieldDecorator('cascader', { initialValue: '' })(
                <Cascader options={cascaderData} placeholder="请选择" />
              )}
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
    const { employee: { listData: { results } }, loading, } = this.props;
    // this.p.total = results ? results.recordSum : 10;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <Table
              rowKey={record => record.realName}
              loading={loading}
              columns={this.columns}
              dataSource={results}
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
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(EmployeeList);
