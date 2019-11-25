import { Form, Input, Modal, Select, message } from 'antd';
import React, { Component } from 'react';
import { connect } from 'dva';

const FormItem = Form.Item;
const { Option } = Select;

/* eslint react/no-multi-comp:0 */
@connect(({ deploy, loading }) => ({
  deploy,
  loading: loading.models.deploy,
}))
class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      showServerDuration: false,
      goodsId: '',
    };
  }
  componentDidMount() {
    this.fetchListData();
    const { record, form } = this.props;
    if (record.goodsId) {
      const { goodsId, classification, serverDuration, goodsType, goodsName, showPrice } = record;
      this.setState({ goodsId, showServerDuration: !!classification });
      setTimeout(() => {
        form.setFieldsValue({ classification, serverDuration, goodsType, goodsName, showPrice })
      }, 100);
    }
  }

  // 查询服务时长 list
  fetchListData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'deploy/fetchDict',
      payload: { dictType: 2 },
    });
  };

  // 确定
  okHandle = () => {
    const { form, handleAdd } = this.props;
    const { goodsId = '' } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params = {
        ...fieldsValue,
        goodsId,
      };
      handleAdd(params);
    });
  };

  handleSelectChange = value => {
    this.setState({ showServerDuration: !!value })
  }


  render() {
    const { deploy: { dictData: { results }, }, record, form, handleModalVisible } = this.props;
    const { showServerDuration } = this.state;
    return (
      <Modal
        destroyOnClose
        title={`${record.goodsId ? '编辑' : '添加'}高级服务`}
        visible={true}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="服务类型">
          {form.getFieldDecorator('classification', {
            initialValue: 0, rules: [{ required: true, message: '请选择服务类型！' }],
          })(
            <Select style={{ width: '100%' }} onChange={this.handleSelectChange}>
              <Option value={0}>上门喂猫</Option>
              <Option value={1}>上门遛狗</Option>
            </Select>,
          )}
        </FormItem>
        {
          showServerDuration ?
            <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="服务时长">
              {form.getFieldDecorator('serverDuration', {
                initialValue: '30', rules: [{ required: true, message: '请选择服务时长！' }],
              })(
                <Select style={{ width: '100%' }}>
                  {results.map(item => (
                    <Option key={item.dictId} value={item.dictValue}>
                      {item.dictName}
                    </Option>
                  ))}
                </Select>,
              )}
            </FormItem>
            : null
        }
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品类型">
          {form.getFieldDecorator('goodsType', {
            initialValue: 0, rules: [{ required: true, message: '请选择商品类型！' }],
          })(
            <Select style={{ width: '100%' }}>
              <Option value={0}>可选数量</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="商品名称">
          {form.getFieldDecorator('goodsName', {
            rules: [{ required: true, message: '请输入商品名称！' }],
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
