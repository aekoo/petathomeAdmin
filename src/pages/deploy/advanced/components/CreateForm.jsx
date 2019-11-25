import { Form, Input, Modal, Select, message } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;
const { Option } = Select;

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      serverId: '',
    };
  }
  componentDidMount() {
    const { record, form } = this.props;
    if (record) {
      const { serverId, serverName, showPrice } = record;
      this.setState({ serverId });
      form.setFieldsValue({ serverName, showPrice });
    }
  }

  // 确定
  okHandle = () => {
    const { form, handleAdd } = this.props;
    const { serverId = '' } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params = {
        ...fieldsValue,
        serverId,
      };
      handleAdd(params);
    });
  };

  render() {
    const { record, form, handleModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title={`${record.serverId ? '编辑' : '添加'}高级服务`}
        visible={true}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="服务类型">
          {form.getFieldDecorator('serverType', {
            initialValue: '0',
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">上门喂猫</Option>
              <Option value="1">上门遛狗</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="服务名称">
          {form.getFieldDecorator('serverName', {
            rules: [{ required: true, message: '请输入品种名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="价格">
          {form.getFieldDecorator('showPrice', {
            rules: [{ required: true, pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请输入正确价格！' }],
          })(<Input placeholder="请输入数字,最多两位小数" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
