import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, Form, Input, Result, Space } from 'antd'
import { forgotPasswordThunk } from '../../redux/thunks/auth.thunk'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function ForgotPassword() {
  const dispatch = useDispatch()
  const { loading } = useSelector((state) => state.auth.forgotPasswordData)
  const [sentEmail, setSentEmail] = useState(null)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState(0)
  const cooldownActive = countdown > 0

  useEffect(() => {
    if (!cooldownActive) return
    const interval = setInterval(() => setCountdown((value) => Math.max(0, value - 1)), 1000)
    return () => clearInterval(interval)
  }, [cooldownActive])

  const handleSubmit = async ({ email }) => {
    setError(null)
    try {
      const result = await dispatch(forgotPasswordThunk({ email: email.trim() })).unwrap()
      setSentEmail(email.trim())
      setCountdown(result.resendAfter)
    } catch (error) { setError(error) }
  }

  return (
    <S.Wrapper>
      <S.FormCard>
        {error && <Alert type="error" title={error} showIcon style={{ marginBottom: 16 }} />}
        {sentEmail ? (
          <Result status="success" title="Yêu cầu đã được ghi nhận"
            subTitle={`Nếu ${sentEmail} thuộc một tài khoản, bạn sẽ nhận được link đặt lại mật khẩu có hiệu lực 15 phút. Kiểm tra cả hộp thư rác.`}
            extra={<Space orientation="vertical" style={{ width: '100%' }}>
              <Button type="primary" loading={loading} disabled={cooldownActive} onClick={() => handleSubmit({ email: sentEmail })}>
                {cooldownActive ? `Gửi lại sau ${countdown}s` : 'Gửi lại email'}
              </Button>
              <Button type="link" onClick={() => { setSentEmail(null); setError(null) }}>Nhập email khác</Button>
            </Space>} />
        ) : (
          <>
            <S.Title>Quên mật khẩu</S.Title>
            <S.Description>Nhập email đã đăng ký. Chúng mình sẽ gửi link để bạn đặt mật khẩu mới.</S.Description>
            <Form layout="vertical" onFinish={handleSubmit}>
              <Form.Item label="Email" name="email" rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không đúng định dạng' }, { max: 255 },
              ]}>
                <Input type="email" autoComplete="email" placeholder="Nhập email đã đăng ký" maxLength={255} />
              </Form.Item>
              <Button type="primary" htmlType="submit" block loading={loading} disabled={cooldownActive}>
                {cooldownActive ? `Gửi lại sau ${countdown}s` : 'Gửi link đặt lại mật khẩu'}
              </Button>
            </Form>
          </>
        )}
        <S.BottomText><Link to={ROUTES.USER.LOGIN}>Quay lại đăng nhập</Link></S.BottomText>
      </S.FormCard>
    </S.Wrapper>
  )
}

export default ForgotPassword
