import { Link } from 'react-router-dom'
import { Form, Input, Button } from 'antd'

import { login } from '../../services/authService'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function Login() {
  const handleSubmit = async (values) => {
    await login(values)
    // TODO: Học viên tự implement - xử lý kết quả đăng nhập
    // (lưu token, thông báo thành công, chuyển trang...)
  }

  return (
    <S.Wrapper>
      <S.FormCard>
        <S.Title>Đăng nhập</S.Title>

        <Form layout="vertical" onFinish={handleSubmit}>
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
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password placeholder="Nhập mật khẩu" />
          </Form.Item>

          <Button type="primary" htmlType="submit" block>
            Đăng nhập
          </Button>
        </Form>

        <S.BottomText>
          Chưa có tài khoản? <Link to={ROUTES.USER.REGISTER}>Đăng ký ngay</Link>
        </S.BottomText>
      </S.FormCard>
    </S.Wrapper>
  )
}

export default Login
