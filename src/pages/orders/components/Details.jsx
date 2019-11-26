import { Form, Badge, Modal, Descriptions } from 'antd';
import React from 'react';

const serverTypeText = ['上门喂猫', '上门遛狗'];
const payStatusMap = ['warning', 'success', 'processing', 'purple', 'default'];
const payStatusText = ['待支付', '已支付', '已申请退款', '已退款', '已取消'];
const serverStatusMap = ['success', 'processing', 'default'];
const serverStatusText = ['未服务', '进行中', '已结束'];

const CreateForm = props => {
  const { detailsModalVisible, handleDetailsModal, values } = props;

  const {
    orderNo = "",
    serverType = 0,
    address = "",
    serverDate = "",
    serverPeriod = "",
    totalMoney = "",
    payStatus = "-1",
    lovePetOfficerName = "",
    serverStatus = 0,
    remark = "",
    evaluationStatus = 0,
    evaluationContent = "",
  } = values || {};

  return (
    <Modal
      width={720}
      destroyOnClose
      title="订单详情"
      visible={detailsModalVisible}
      onOk={() => handleDetailsModal()}
      onCancel={() => handleDetailsModal()}
    >
      <Descriptions layout="vertical" bordered>
        <Descriptions.Item label="订单编号">{orderNo}</Descriptions.Item>
        <Descriptions.Item label="服务类别">{serverTypeText[serverType]}</Descriptions.Item>
        <Descriptions.Item label="服务地址">{address}</Descriptions.Item>
        <Descriptions.Item label="服务日期">{serverDate}</Descriptions.Item>
        <Descriptions.Item label="服务时间">{serverPeriod}</Descriptions.Item>
        <Descriptions.Item label="订单金额">{totalMoney}</Descriptions.Item>
        <Descriptions.Item label="支付状态">{payStatus == '-1' ? <Badge status="error" text="支付失败" /> : <Badge status={payStatusMap[payStatus]} text={payStatusText[payStatus]} />}</Descriptions.Item>
        <Descriptions.Item label="爱宠官">{lovePetOfficerName}</Descriptions.Item>
        <Descriptions.Item label="服务状态"><Badge status={serverStatusMap[serverStatus]} text={serverStatusText[serverStatus]} /></Descriptions.Item>
        <Descriptions.Item label="备注">{remark}</Descriptions.Item>
        <Descriptions.Item label="评价">{evaluationStatus == 1 ? evaluationContent : '未评价'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default Form.create()(CreateForm);
