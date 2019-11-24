import { Form, Input, Modal, Select, message } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;
const { Option } = Select;

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      kindId: '',
    };
  }
  componentDidMount() {
    const { record, form } = this.props;
    if (record) {
      const { kindId, petName, sort } = record;
      this.setState({ kindId });
      form.setFieldsValue({ petName, sort });
    }
  }

  // 确定
  okHandle = () => {
    const { form, handleAdd } = this.props;
    const { kindId = '' } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params = {
        ...fieldsValue,
        kindId,
      };
      handleAdd(params);
    });
  };

  render() {
    const { record, form, handleModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title={`${record.kindId ? '编辑' : '添加'}宠物品种`}
        visible={true}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="宠物类型">
          {form.getFieldDecorator('petType', {
            initialValue: '0',
          })(
            <Select style={{ width: '100%' }}>
              <Option value="0">猫咪</Option>
              <Option value="1">狗狗</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="品种名称">
          {form.getFieldDecorator('petName', {
            rules: [{ required: true, message: '请输入品种名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="排序位置">
          {form.getFieldDecorator('sort', {
            rules: [{ required: true, pattern: /^[0-9]+$/, message: '请输入正确的排序值！' }],
          })(<Input placeholder="请输入数字" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
