import { Form, Input, Modal, DatePicker, message } from 'antd';
import React, { Component } from 'react';
import moment from 'moment';

const FormItem = Form.Item;
const { TextArea } = Input;
const { RangePicker } = DatePicker;
const dateFormat = 'YYYY/MM/DD';

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      bannerId: '',
      file: '',
    };
  }
  componentDidMount() {
    const { record, form } = this.props;
    if (record) {
      const { bannerId, image, position, link, remark } = record;
      this.setState({ bannerId, image });
      form.setFieldsValue({ image, position, link, remark });
    }
  }

  // 确定
  okHandle = () => {
    const { form, handleAdd } = this.props;
    const { bannerId = '', } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params = {
        ...fieldsValue,
        bannerId,
      };
      handleAdd(params);
    });
  };

  render() {
    const { record, form, handleModalVisible } = this.props;

    return (
      <Modal
        destroyOnClose
        title={`${record.bannerId ? '编辑' : '添加'}活动`}
        visible={true}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="活动时间">
          {form.getFieldDecorator('remark', {
            rules: [{ required: true, message: '请输入通知消息内容！' }],
          })(<RangePicker defaultValue={[moment('2015/01/01', dateFormat), moment('2015/01/01', dateFormat)]} format={dateFormat} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="活动价格">
          {form.getFieldDecorator('position', {
            rules: [{ required: true, message: '请输入活动价格！' }],
          })(<Input placeholder="请输入活动价格" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="活动说明">
          {form.getFieldDecorator('link', {
            rules: [{ required: true, message: '请输入活动说明！' }],
          })(<TextArea placeholder="请输入" rows={4} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
