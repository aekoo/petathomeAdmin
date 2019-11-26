import { Row, Col, Button, Card, Divider, Form, Table, Icon, Select, Popconfirm, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import CreateForm from './components/CreateForm';
import styles from './style.less';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ deploy, loading }) => ({
  dictType: deploy.dictType,
  dictData: deploy.dictData,
  dictSelData: deploy.dictSelData,
  loading: loading.models.deploy,
}))
class DictList extends Component {
  state = {
    modalVisible: false,
    record: {},
  };

  columns = [
    { title: 'Dict ID', dataIndex: 'dictId', width: 300 },
    {
      title: 'Dict 名称', dataIndex: 'dictName', width: 200,
      render: (text, record) => record.dictType == 3 ? <a  onClick={() => this.childrenTable(record)}>{text}</a> : text
    },
    { title: 'Dict 值', dataIndex: 'dictValue' },
    { title: '创建时间', dataIndex: 'createTime' },
    { title: '更新时间', dataIndex: 'updateTime' },
    {
      title: '操作',
      dataIndex: 'action',
      width: 200,
      align: 'center',
      render: (text, record) => (
        <span>
          <a  onClick={() => this.handleModalVisible(true, record)}>编辑</a>
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

  //查询子表
  childrenTable = record => {
    const { dispatch, form } = this.props;
    const { dictId } = record;
    form.setFieldsValue({ dictType: dictId });
    dispatch({
      type: 'deploy/dictTypeChange',
      payload: dictId,
    });
    this.fetchListData();
  }

  // 查询
  handleSearch = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      dispatch({
        type: 'deploy/dictTypeChange',
        payload: fieldsValue.dictType,
      });
      this.fetchListData();
    });
  };
  // 重置
  handleFormReset = () => {
    const { dispatch, form } = this.props;
    form.resetFields();
    dispatch({
      type: 'deploy/dictTypeChange',
      payload: '3',
    });
    this.fetchListData();
  };
  renderForm() {
    const { form: { getFieldDecorator }, dictSelData = [] } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          <Col md={8} sm={24}>
            <FormItem label="配置类型">
              {getFieldDecorator('dictType', {
                initialValue: '3',
              })(
                <Select style={{ width: '100%' }}>
                  {
                    dictSelData.map(item => <Option key={item.dictId} value={item.dictValue}>{item.dictName}</Option>)
                  }
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
    const { dictType, dictData: { results }, dictSelData, loading, } = this.props;
    const { modalVisible, record } = this.state;

    let recordList = [];
    if (dictType == 3) {
      recordList = dictSelData;
    } else if (results && results.recordList) {
      recordList = results.recordList;
    } else {
      recordList = results;
    }
    const parentMethods = {
      handleAdd: this.editFunc,
      handleModalVisible: this.handleModalVisible,
      dictSelData: dictSelData,
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
              rowKey={record => record.dictId}
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
