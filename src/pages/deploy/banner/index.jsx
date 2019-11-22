import { Row, Col, Button, Card, Divider, Form, Table, Icon, Popconfirm, Switch, Select, message, } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ deploy, loading }) => ({
  deploy,
  loading: loading.models.deploy,
}))
class BannerList extends Component {
  state = {
    modalVisible: false,
    record: {}
  };

  columns = [
    {
      title: '图片', dataIndex: 'image', width: 200,
      render: val => <img style={{ width: 160, height: 80 }} src={val} />,
    },
    { title: '链接', dataIndex: 'link', width: 300, },
    {
      title: '是否启用', dataIndex: 'display', width: 130,
      render: (text, record) => (
        <Switch
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={!!text}
          onChange={() => this.displayFunc(record)}
        />
      ),
    },
    { title: '备注', dataIndex: 'remark', width: 300, },
    {
      title: '操作', dataIndex: 'action', width: 200, align: 'center',
      render: (text, record) => (
        <span>
          <a href="#" onClick={() => this.editClickEvent(record)}>编辑</a>
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
    dispatch({ type: 'deploy/fetchBanner' });
  };
  // 添加-编辑
  editFunc = params => {
    const { dispatch } = this.props;
    console.log(params);

    dispatch({
      type: 'deploy/editBanner',
      payload: params,
    });
    this.handleModalVisible(false);
  };
  // 删除
  deleteFunc = record => {
    const { dispatch } = this.props;
    const { bannerId } = record;
    dispatch({
      type: 'deploy/deleteBanner',
      payload: { bannerId },
    });
  };
  // 开启-关闭
  displayFunc = record => {
    const { dispatch } = this.props;
    const { bannerId, display } = record;
    dispatch({
      type: 'deploy/displayBanner',
      payload: { bannerId, display: display ? 0 : 1 },
    });
  };


  addClickEvent = () => {
    this.handleModalVisible(true);
  };
  editClickEvent = record => {
    this.setState({ record });//保存编辑的id
    this.handleModalVisible(true);
  };
  handleModalVisible = flag => {
    if (flag) {
      this.setState({ modalVisible: !!flag });
    } else {
      this.setState({ modalVisible: !!flag, record: {} });//清除编辑的id
    }
  };


  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'deploy/positionChange',
        payload: fieldsValue.position,
      });
      this.fetchListData();
    });
  };
  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'deploy/positionChange',
      payload: 'top',
    });
    this.fetchListData();
  };
  renderForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48, }}>
          <Col md={8} sm={24}>
            <FormItem label="展示位置">
              {getFieldDecorator('position', {
                initialValue: 'top'
              })(
                <Select style={{ width: '100%' }}>
                  <Option value="top">顶部</Option>
                  <Option value="buttom">底部</Option>
                </Select>
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
    const { deploy: { listData: { results }, }, loading, } = this.props;
    const { modalVisible, record } = this.state;

    const { recordList = [] } = results || {};
    const parentMethods = {
      handleAdd: this.editFunc,
      handleModalVisible: this.handleModalVisible,
      record
    };
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.addClickEvent()}>
                添加
              </Button>
            </div>
            <Table
              rowKey={record => record.bannerId}
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

export default Form.create()(BannerList);
