import React, { Component } from 'react';
import { Button, Form, Input, Modal, Switch, Icon, Upload } from 'antd';
import UploadUrl from '@/services/upload';

const FormItem = Form.Item;
const { TextArea } = Input;

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class CreateForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      imageUrl: '',
    };
  }

  okHandle = () => {
    const { form, handleAdd } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  //上传logo
  uploadChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const { modalVisible, form, handleModalVisible } = this.props;
    const { imageUrl } = this.state;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <Modal
        destroyOnClose
        title="添加通知消息"
        visible={modalVisible}
        onOk={this.okHandle}
        onCancel={() => handleModalVisible()}
      >
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="Icon">
          {form.getFieldDecorator('icon')(
            <Upload
              name="icon"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action={UploadUrl}
              data={{ type: 2 }}
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
          })(<Input placeholder="请输入" />)}
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="立即启用">
          {form.getFieldDecorator('display', { initialValue: 0 })(
            <Switch
              checkedChildren={<Icon type="check" />}
              unCheckedChildren={<Icon type="close" />}
            />,
          )}
        </FormItem>
      </Modal>
    );
  }
}

export default Form.create()(CreateForm);
