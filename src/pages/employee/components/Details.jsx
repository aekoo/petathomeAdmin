import { Row, Col, Form, Modal, Descriptions, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const sexType = ['未知', '男', '女'];
const serveType = ['铲屎官', '遛狗官', '铲屎官&遛狗官'];
const educationArray = ['其他', '中专', '大专', '本科', '研究生', '博士'];
const statusMap = ['warning', 'processing', 'success', 'error'];
const approvalStatusMap = ['未审核', '审核中', '已通过', '未通过'];

@connect(({ employee }) => ({
  employee,
}))
class Details extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.fetchDetail();
  }
  fetchDetail = () => {
    const { dispatch, record } = this.props;
    dispatch({
      type: 'employee/fetchEmployeeDetail',
      payload: { shitId: record.shitId },
    });
  };
  render() {
    const {
      handleModalVisible,
      employee: {
        detail: { results },
      },
    } = this.props;
    const {
      shitId = '',
      realName = '',
      gender = '',
      age = '',
      residentArea = '',
      createTime = '',
      updateTime = '',
      hasPet = '',
      approvalStatus = '',
      canServerTime = '',
      education = '',
      serve = '',
      vaccination = '',
      wechatNo = '',
      workingStatus = '',
    } = results || {};

    return (
      <Modal
        width={720}
        destroyOnClose
        title="爱宠官详细信息"
        visible={true}
        onOk={() => handleModalVisible()}
        onCancel={() => handleModalVisible()}
      >
        <Descriptions size="small" bordered>
          <Descriptions.Item label="ID" span={3}>{shitId}</Descriptions.Item>
          <Descriptions.Item label="姓名" span={3}>{realName}</Descriptions.Item>
          <Descriptions.Item label="微信号" span={3}>{wechatNo}</Descriptions.Item>
          <Descriptions.Item label="性别" span={3}>{sexType[gender]}</Descriptions.Item>
          <Descriptions.Item label="年龄" span={3}>{age}</Descriptions.Item>

          <Descriptions.Item label="地区" span={3}>{residentArea}</Descriptions.Item>
          <Descriptions.Item label="学历" span={3}>{educationArray[education]}</Descriptions.Item>
          <Descriptions.Item label="工作状况" span={3}>{workingStatus}</Descriptions.Item>
          <Descriptions.Item label="类型" span={3}>{serveType[serve]}</Descriptions.Item>
          <Descriptions.Item label="是否有养宠物" span={3}>{hasPet}</Descriptions.Item>

          <Descriptions.Item label="是否接种狂犬" span={3}>{vaccination}</Descriptions.Item>
          <Descriptions.Item label="可服务时间" span={3}>{canServerTime}</Descriptions.Item>
          <Descriptions.Item label="创建时间" span={3}>{createTime}</Descriptions.Item>
          <Descriptions.Item label="更新时间" span={3}>{updateTime}</Descriptions.Item>
          <Descriptions.Item label="审核状态" span={3}>
            {approvalStatusMap[approvalStatus]}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
    );
  }
}

export default Form.create()(Details);
