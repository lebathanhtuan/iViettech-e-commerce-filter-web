import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Button, message } from 'antd'

import { loginThunk } from '../../redux/thunks/auth.thunk'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { loading } = useSelector((state) => state.auth.loginData)

  const handleSubmit = async (values) => {
    try {
      // unwrap(): thunk thành công thì trả về payload, thất bại thì throw lỗi
      const user = await dispatch(loginThunk(values)).unwrap()
      message.success('Đăng nhập thành công')

      // Admin -> vào thẳng trang quản lý sản phẩm, user -> về trang chủ
      if (user.role === 'admin') {
        navigate(ROUTES.ADMIN.PRODUCT_LIST)
      } else {
        navigate(ROUTES.USER.HOME)
      }
    } catch (error) {
      message.error(error)
    }
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

          <Button type="primary" htmlType="submit" loading={loading} block>
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
