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
    serverDuration = "",
    keyChose = "",
    petIds = "",
    petNames = "",
    totalMoney = "",
    payStatus = "-1",
    lovePetOfficerName = "",
    serverStatus = 0,
    serverItemList = [],
    remark = "",
    evaluationStatus = 0,
    evaluationContent = "",
  } = values || {};

  const petNumber = petIds.split(',').length;
  const advancedServerList = [];
  serverItemList.map(item => advancedServerList.push(`${item.serverName} x${item.num}`));

  return (
    <Modal
      width={720}
      destroyOnClose
      title="订单详情"
      footer={false}
      visible={detailsModalVisible}
      onOk={() => handleDetailsModal()}
      onCancel={() => handleDetailsModal()}
    >
      <Descriptions bordered>
        <Descriptions.Item label="订单编号" span={2}>{orderNo}</Descriptions.Item>
        <Descriptions.Item label="服务类别">{serverTypeText[serverType]}</Descriptions.Item>
        <Descriptions.Item label="服务地址" span={3}>{address}</Descriptions.Item>
        <Descriptions.Item label="服务日期" span={3}>{serverDate.replace(/\,/g, '、')}</Descriptions.Item>
        <Descriptions.Item label="钥匙交接" span={3}>{keyChose}</Descriptions.Item>
        <Descriptions.Item label="宠物数量" span={3}>{petNumber}</Descriptions.Item>

        {serverType == 0 ? <Descriptions.Item label="高级服务" span={3}>{advancedServerList.join('、')}</Descriptions.Item> : null}
        {serverType == 1 ? <Descriptions.Item label="服务时间" span={3}>{serverPeriod}</Descriptions.Item> : null}
        {serverType == 1 ? <Descriptions.Item label="服务时长" span={3}>{serverDuration}</Descriptions.Item> : null}

        <Descriptions.Item label="订单金额" span={2}>{totalMoney}</Descriptions.Item>
        <Descriptions.Item label="支付状态" span={2}>{payStatus == '-1' ? <Badge status="error" text="支付失败" /> : <Badge status={payStatusMap[payStatus]} text={payStatusText[payStatus]} />}</Descriptions.Item>
        <Descriptions.Item label="爱宠官" span={2}>{lovePetOfficerName}</Descriptions.Item>
        <Descriptions.Item label="服务状态" span={2}><Badge status={serverStatusMap[serverStatus]} text={serverStatusText[serverStatus]} /></Descriptions.Item>
        <Descriptions.Item label="宠物" span={3}>{petNames}</Descriptions.Item>
        <Descriptions.Item label="备注" span={3}>{remark}</Descriptions.Item>
        <Descriptions.Item label="评价" span={3}>{evaluationStatus == 1 ? evaluationContent : '未评价'}</Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default Form.create()(CreateForm);
