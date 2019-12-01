import { Form, Input, Modal, Select, Icon, Upload, message } from 'antd';
import React, { Component } from 'react';
import UploadUrl from '@/services/upload';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      bannerId: '',
      imageUrl: '',
      file: '',
    };
  }
  componentDidMount() {
    const { record, form } = this.props;
    if (record) {
      const { bannerId, image, position, link, remark, display } = record;
      this.setState({ bannerId, imageUrl: image });
      // form.setFieldsValue({ image, link, remark, display });
      form.setFieldsValue({ image, position, link, remark });
    }
  }

  //上传
  uploadChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      let res = info.file.response || {};
      let { results = {}, desc, code = '' } = res;
      if (!!code) {
        message[code === 1 ? 'success' : 'error'](desc);
        if (code === 1) {
          let { imageUrl } = results;
          this.setState({ imageUrl, loading: false });
        } else {
          this.setState({ loading: false });
        }
      } else {
        this.setState({ loading: false });
      }
    }
  };

  // 确定
  okHandle = () => {
    const { form, handleAdd } = this.props;
    const { bannerId = '', imageUrl = '' } = this.state;

    if (!imageUrl) return message.warn('请上传Banner！');
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params = {
        ...fieldsValue,
        bannerId,
        image: imageUrl,
      };
      handleAdd(params);
    });
  };

  render() {
    const { record, form, handleModalVisible } = this.props;
    let { imageUrl } = this.state;

    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Modal
        destroyOnClose
        title={`${record.bannerId ? '编辑' : '添加'}Banner`}
        visible={true}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="图片">
          {form.getFieldDecorator('image', {
            rules: [{ required: true, message: '请输上传banner图片！' }],
          })(
            <Upload
              name="file" // 参数名
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={UploadUrl}
              data={{ type: 2 }} // 其他参数
              onChange={this.uploadChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="icon" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="展示位置">
          {form.getFieldDecorator('position', {
            initialValue: 'top',
          })(
            <Select style={{ width: '100%' }}>
              <Option value="top">顶部</Option>
              <Option value="bottom">底部</Option>
            </Select>,
          )}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="链接">
          {form.getFieldDecorator('link', {
            rules: [{ required: true, message: '请输入链接地址！' }],
          })(<TextArea placeholder="请输入" rows={4} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
          {form.getFieldDecorator('remark', {
            rules: [{ required: true, message: '请输入通知消息内容！' }],
          })(<TextArea placeholder="请输入" rows={4} />)}
        </FormItem>
        {/* <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="立即启用">
          {form.getFieldDecorator('display', { initialValue: 0 })(
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />,
          )}
        </FormItem> */}
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
