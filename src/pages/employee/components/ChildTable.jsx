import { Row, Col, Badge, Form, Drawer, Table } from 'antd';
import React, { Component } from 'react';

const serverType = ['上门喂猫', '上门遛狗'];
const payStatusMap = ['warning', 'success', 'processing', 'purple', 'default'];
const payStatus = ['待支付', '已支付', '已申请退款', '已退款', '已取消'];
const serverStatusMap = ['success', 'processing', 'default'];
const serverStatus = ['未服务', '进行中', '已结束'];

class ChildTable extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  columns = [
    { title: '订单号', key: 'orderNo', dataIndex: 'orderNo', },
    { title: '服务类别', key: 'serverType', dataIndex: 'serverType', render: val => serverType[val], },
    { title: '服务日期', key: 'serverDate', dataIndex: 'serverDate', },
    { title: '服务时间', key: 'serverPeriod', dataIndex: 'serverPeriod', },
    { title: '服务地址', key: 'address', dataIndex: 'address', },
    { title: '订单金额', key: 'tradeMoney', dataIndex: 'tradeMoney', render: val => `${(val / 100).toFixed(2)} 元`, },
    {
      title: '支付状态', key: 'payStatus', dataIndex: 'payStatus',
      render: val => {
        return val == '-1' ? (
          <Badge status="error" text="支付失败" />
        ) : (
            <Badge status={payStatusMap[val]} text={payStatus[val]} />
          );
      },
    },
    {
      title: '服务状态', key: 'serverStatus', dataIndex: 'serverStatus',
      render(val) {
        return <Badge status={serverStatusMap[val]} text={serverStatus[val]} />;
      },
    },
    { title: '备注', key: 'remark', dataIndex: 'remark', },
    {
      title: '评价', key: 'evaluationStatus', dataIndex: 'evaluationStatus',
      render: (text, record) => (text == 1 ? record.evaluationContent : '未评价'),
    },
  ];
  render() {
    const { handleDrawerVisible, record: data } = this.props;

    return (
      <Drawer
        title={`Ta的订单`}
        width="70%"
        closable={false}
        onClose={() => handleDrawerVisible()}
        visible={true}
      >
        <Table
          rowKey={record => record.orderNo}
          columns={this.columns}
          dataSource={data}
          pagination={false}
        />
      </Drawer>
    );
  }
}

export default Form.create()(ChildTable);
