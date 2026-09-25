import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, Avatar, Upload, message } from 'antd'
import { UploadOutlined, UserOutlined } from '@ant-design/icons'

import { updateMyProfileThunk, updateAvatarThunk } from '../../../redux/thunks/auth.thunk'
import * as S from '../styled'

function ProfileInfo() {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { data: user } = useSelector((state) => state.auth.userInfo)
  const { loading } = useSelector((state) => state.auth.updateProfileData)
  const { loading: avatarLoading } = useSelector((state) => state.auth.updateAvatarData)

  // Có thông tin user thì điền sẵn vào form
  useEffect(() => {
    if (user) {
      form.setFieldsValue({ name: user.name, email: user.email, phone: user.phone })
    }
  }, [user, form])

  const handleSubmit = async (values) => {
    try {
      await dispatch(updateMyProfileThunk({ name: values.name, phone: values.phone })).unwrap()
      message.success('Cập nhật thông tin thành công')
    } catch (error) {
      message.error(error)
    }
  }

  // Chọn ảnh xong là upload luôn, không cần bấm lưu
  const handleUploadAvatar = async (file) => {
    // Key "avatar" phải khớp với upload.single('avatar') ở backend
    const formData = new FormData()
    formData.append('avatar', file)

    try {
      await dispatch(updateAvatarThunk(formData)).unwrap()
      message.success('Đổi avatar thành công')
    } catch (error) {
      message.error(error)
    }
  }

  return (
    <S.FormWrapper>
      <S.AvatarBox>
        <Avatar size={96} src={user?.avatar} icon={<UserOutlined />} />
        <Upload
          accept="image/jpeg,image/png,image/webp"
          showUploadList={false}
          // Tự gọi API upload, return false để antd Upload không tự gửi request
          beforeUpload={(file) => {
            handleUploadAvatar(file)
            return false
          }}
        >
          <Button icon={<UploadOutlined />} loading={avatarLoading}>
            Đổi avatar
          </Button>
        </Upload>
      </S.AvatarBox>

      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Email" name="email">
          <Input disabled />
        </Form.Item>
        <Form.Item
          label="Họ và tên"
          name="name"
          rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
        >
          <Input placeholder="Nhập họ và tên" />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ pattern: /^0\d{9}$/, message: 'Số điện thoại gồm 10 số, bắt đầu bằng 0' }]}
        >
          <Input placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Lưu thay đổi
        </Button>
      </Form>
    </S.FormWrapper>
  )
}

export default ProfileInfo
