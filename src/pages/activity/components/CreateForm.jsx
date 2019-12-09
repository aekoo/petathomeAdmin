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
      activityId: '',
    };
  }
  componentDidMount() {
    const { record, form } = this.props;

    if (record.activityId) {
      const { activityId, title, totalPrice, num, description, startDate, endDate } = record;
      this.setState({ activityId });
      form.setFieldsValue({ title, totalPrice, num, description, activityDate: startDate && endDate ? [moment(startDate, dateFormat), moment(endDate, dateFormat)] : [] });
    }
  }

  // 确定
  okHandle = () => {
    const { form, handleAdd } = this.props;
    const { activityId = '', } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      const rangeValue = fieldsValue['activityDate'];
      let params = {
        ...fieldsValue,
        activityId,
        startDate: rangeValue[0].format('YYYY-MM-DD'),
        endDate: rangeValue[1].format('YYYY-MM-DD')
      };

      handleAdd(params);
    });
  };
  disabledDate = (current) => {
    // Can not select days before today and today
    return current && current < moment().endOf('day');
  }

  render() {
    const { record, form, handleModalVisible } = this.props;

    return (
      <Modal
        destroyOnClose
        title={`${record.activityId ? '编辑' : '添加'}活动`}
        visible={true}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="活动标题">
          {form.getFieldDecorator('title', {
            rules: [{ required: true, message: '请输入活动标题！' }],
          })(<Input placeholder="请输入活动标题" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="活动时间">
          {form.getFieldDecorator('activityDate', {
            rules: [{ type: 'array', required: true, message: '请选择活动时间！' }],
          })(<RangePicker format={dateFormat} disabledDate={this.disabledDate} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="活动价格">
          {form.getFieldDecorator('totalPrice', {
            rules: [{ required: true, pattern: /^(\d+|\d+\.\d{1,2})$/, message: '请输入数字,最多两位小数' }],
          })(<Input placeholder="请输入数字,最多两位小数" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="限制数量">
          {form.getFieldDecorator('num', {
            initialValue: 4,
            rules: [{ required: true, pattern: /^\d$/, message: '请输入数字' }],
          })(<Input placeholder="请输入宠物数量" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="活动说明">
          {form.getFieldDecorator('description', {
            rules: [{ required: true, message: '请输入活动说明！' }],
          })(<TextArea placeholder="请输入" rows={8} />)}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
