import { Form, Input, Modal, message } from 'antd';
import React, { Component } from 'react';

const FormItem = Form.Item;

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      dictId: '',
    };
  }
  componentDidMount() {
    const { record, form } = this.props;
    if (record) {
      const { dictId, dictName, dictValue } = record;
      this.setState({ dictId });
      form.setFieldsValue({ dictName, dictValue });
    }
  }

  // 确定
  okHandle = () => {
    const { form, handleAdd } = this.props;
    const { dictId = '' } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params = {
        ...fieldsValue,
        dictId,
      };
      handleAdd(params);
    });
  };

  render() {
    const { record, form, handleModalVisible } = this.props;
    return (
      <Modal
        destroyOnClose
        title={`${record.dictId ? '编辑' : '添加'}Dict`}
        visible={true}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Dict类型">
          {form.getFieldDecorator('dictType', {
            initialValue: 1,
          })(<Input placeholder="请输入" disabled />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Dict名称">
          {form.getFieldDecorator('dictName', {
            rules: [{ required: true, message: '请输入Dict名称！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Dict值">
          {form.getFieldDecorator('dictValue', {
            rules: [{ required: true, message: '请输入Dict值！' }],
          })(<Input placeholder="请输入" />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
