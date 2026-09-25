import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, message } from 'antd'

import { changePasswordThunk } from '../../../redux/thunks/auth.thunk'
import * as S from '../styled'

function ChangePassword() {
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { loading } = useSelector((state) => state.auth.changePasswordData)

  const handleSubmit = async (values) => {
    try {
      await dispatch(
        changePasswordThunk({
          currentPassword: values.currentPassword,
          newPassword: values.newPassword,
        })
      ).unwrap()
      message.success('Đổi mật khẩu thành công')
      form.resetFields()
    } catch (error) {
      message.error(error)
    }
  }

  return (
    <S.FormWrapper>
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Mật khẩu hiện tại"
          name="currentPassword"
          rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
        >
          <Input.Password placeholder="Nhập mật khẩu hiện tại" />
        </Form.Item>
        <Form.Item
          label="Mật khẩu mới"
          name="newPassword"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu mới' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
          ]}
        >
          <Input.Password placeholder="Nhập mật khẩu mới" />
        </Form.Item>
        <Form.Item
          label="Xác nhận mật khẩu mới"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve()
                }
                return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
              },
            }),
          ]}
        >
          <Input.Password placeholder="Nhập lại mật khẩu mới" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading}>
          Đổi mật khẩu
        </Button>
      </Form>
    </S.FormWrapper>
  )
}

export default ChangePassword
