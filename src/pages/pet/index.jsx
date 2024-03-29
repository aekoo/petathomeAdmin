import { Avatar, Badge, Card, Form, Table, Modal } from 'antd';
import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';

const sexMap = ['default', 'processing', 'error'];
const sexType = ['未知', '弟弟', '妹妹'];
const typeArray = ['猫', '狗'];
const whether = ['否', '是'];

/* eslint react/no-multi-comp:0 */
@connect(({ pet, loading }) => ({
  pet,
  loading: loading.models.pet,
}))
class PetList extends Component {
  state = { modalVisible: false };

  componentDidMount() {
    this.fetchListData();
    this.gainPetKindData();
  }
  // 查询列表
  fetchListData = () => {
    const {
      dispatch,
      location: { query = {} },
    } = this.props;
    dispatch({
      type: 'pet/fetchPet',
      payload: query,
    });
  };
  gainPetKindData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'pet/gainPetKind',
      payload: { petType: 0 },
    });
  };

  handleModalVisible = (flag, record) => {
    this.setState({
      modalVisible: !!flag,
      peview: record || '',
    });
  };

  render() {
    const {
      pet: { listData, petKindList },
      loading,
    } = this.props;
    const { modalVisible, peview } = this.state;

    let kinds = {};
    petKindList.map(item => {
      let { kindId, petName } = item;
      kinds[kindId] = petName;
    });

    let columns = [
      { title: '宠物ID', dataIndex: 'petId', width: 180 },
      {
        title: '头像',
        dataIndex: 'avatar',
        width: 100,
        render: val =>
          val ? (
            <Avatar
              size="large"
              icon="user"
              src={val}
              onClick={() => this.handleModalVisible(true, val)}
            />
          ) : (
            '无'
          ),
      },
      { title: '昵称', dataIndex: 'nickName', width: 180 },
      { title: '生日', dataIndex: 'birthday', width: 150 },
      {
        title: '性别',
        dataIndex: 'gender',
        width: 80,
        render: text => <Badge status={sexMap[text]} text={sexType[text]} />,
      },
      {
        title: '种类',
        dataIndex: 'type',
        width: 100,
        render: text => typeArray[text],
      },
      {
        title: '品种',
        dataIndex: 'kindId',
        width: 200,
        render: text => kinds[text],
      },
      {
        title: '免疫',
        dataIndex: 'immunology',
        width: 80,
        render: text => whether[text],
      },
      {
        title: '绝育',
        dataIndex: 'sterilization',
        width: 80,
        render: text => whether[text],
      },
      {
        title: '照片',
        dataIndex: 'photo',
        width: 400,
        render: val => {
          const photoList = val ? val.split(',') : [];
          return val ? (
            <div>
              {photoList.map(item => (
                <img
                  style={{ width: 60, height: 60, marginRight: 5 }}
                  src={item}
                  onClick={() => this.handleModalVisible(true, item)}
                />
              ))}
            </div>
          ) : (
            '-'
          );
        },
      },
    ];

    return (
      <PageHeaderWrapper title="宠物列表">
        <Card bordered={false}>
          <Table
            scroll={{ x: 1300 }}
            rowKey={record => record.petId}
            loading={loading}
            columns={columns}
            dataSource={listData}
          />
        </Card>
        <Modal
          destroyOnClose
          title=""
          visible={modalVisible}
          footer={null}
          onCancel={() => this.handleModalVisible()}
        >
          <img style={{ width: 450 }} src={peview} />
        </Modal>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(PetList);
