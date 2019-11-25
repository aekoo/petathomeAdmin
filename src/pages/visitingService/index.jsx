import { Row, Col, Card, Form, Table, Icon, Switch, message } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

/* eslint react/no-multi-comp:0 */
@connect(({ deploy, loading }) => ({
  dictData: deploy.dictData,
  loading: loading.models.deploy,
}))
class VisitingService extends Component {
  columns = [
    {
      title: '',
      dataIndex: 'type',
      width: 300,
      render: val => (
        <img
          style={{ width: 160, height: 80 }}
          src={require(`@/assets/image/feed-${val == 1 ? 'dog' : 'cat'}.png`)}
        />
      ),
    },
    {
      title: '服务类型',
      dataIndex: 'dictName',
      width: 200,
      render: (text, record) =>
        record.dictType == 3 ? (
          <a href="#" onClick={() => this.childrenTable(record)}>
            {text}
          </a>
        ) : (
          text
        ),
    },
    {
      title: '是否启用',
      dataIndex: 'display',
      render: (text, record) => (
        <Switch
          checkedChildren={<Icon type="check" />}
          unCheckedChildren={<Icon type="close" />}
          checked={!!text}
          // onChange={() => this.displayFunc(record)}
        />
      ),
    },
  ];

  componentDidMount() {
    this.fetchListData();
  }
  // 查询列表
  fetchListData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deploy/fetchDict',
      payload: { dictType: 4 },
    });
  };

  render() {
    const {
      dictData: { results },
      loading,
    } = this.props;

    let recordList = [];
    if (results && results.recordList) {
      recordList = results.recordList;
    } else {
      recordList = results;
    }
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Table
            rowKey={record => record.textId}
            loading={loading}
            columns={this.columns}
            dataSource={recordList}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(VisitingService);
