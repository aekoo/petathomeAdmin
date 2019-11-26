import { Form, Input, Modal, Icon, Upload, message } from 'antd';
import React, { Component } from 'react';
import UploadUrl from '@/services/upload';

const FormItem = Form.Item;
const { TextArea } = Input;

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      textId: '',
      imageUrl: '',
      file: '',
    };
  }
  componentDidMount() {
    const { record, form } = this.props;
    if (record) {
      const { textId, icon, link, textContent, display } = record;
      this.setState({ textId, imageUrl: icon });
      // form.setFieldsValue({ icon, link, textContent, display });
      form.setFieldsValue({ icon, link, textContent });
    }
  }

  //上传logo
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
    const { textId = '', imageUrl = '' } = this.state;

    if (!imageUrl) return message.warn('请上传Icon！');
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      let params = {
        ...fieldsValue,
        textId,
        icon: imageUrl,
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
        title={`${record.textId ? '编辑' : '添加'}通知消息`}
        visible={true}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Icon">
          {form.getFieldDecorator('icon', {
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
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="内容">
          {form.getFieldDecorator('textContent', {
            rules: [{ required: true, message: '请输入通知消息内容！' }],
          })(<TextArea placeholder="请输入" rows={4} />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="链接">
          {form.getFieldDecorator('link', {
            rules: [{ required: true, message: '请输入链接地址！' }],
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
