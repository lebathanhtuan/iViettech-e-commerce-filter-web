import { Link } from 'react-router-dom'
import { Form, Input, Button } from 'antd'

import { register } from '../../services/authService'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function Register() {
  const handleSubmit = async (values) => {
    await register({
      fullName: values.fullName,
      email: values.email,
      password: values.password,
    })
    // TODO: Học viên tự implement - xử lý kết quả đăng ký
    // (thông báo thành công, chuyển sang trang login...)
  }

  return (
    <S.Wrapper>
      <S.FormCard>
        <S.Title>Đăng ký</S.Title>

        <Form layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Họ và tên"
            name="fullName"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
          >
            <Input placeholder="Nhập họ và tên" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không đúng định dạng' },
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Đăng ký
          </Button>
        </Form>

        <S.BottomText>
          Đã có tài khoản? <Link to={ROUTES.USER.LOGIN}>Đăng nhập</Link>
        </S.BottomText>
      </S.FormCard>
    </S.Wrapper>
  )
}

export default Register
