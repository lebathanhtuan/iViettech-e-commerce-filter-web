import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Alert, Button, Form, Input, Result, Spin } from 'antd'
import { resetPasswordThunk } from '../../redux/thunks/auth.thunk'
import { validateResetPasswordLink } from '../../services/authService'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function ResetPassword() {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  // Fragment không bị gửi đến server frontend; gửi token tới API qua body POST.
  const token = new URLSearchParams(location.hash.slice(1)).get('token') || ''
  const hasToken = /^[a-f0-9]{64}$/.test(token)
  const { loading } = useSelector((state) => state.auth.resetPasswordData)
  const [validation, setValidation] = useState({ token: null, valid: false })
  const [retry, setRetry] = useState(0)
  const [completed, setCompleted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!hasToken || completed) return
    const controller = new AbortController()
    validateResetPasswordLink(token, controller.signal).then(() => {
      setValidation({ token, valid: true })
    }).catch((error) => {
      if (controller.signal.aborted) return
      setValidation({ token, valid: false, invalid: error.response?.data?.code === 'INVALID_RESET_LINK',
        message: error.response?.data?.message || 'Không kiểm tra được link. Vui lòng thử lại.' })
    })
    return () => controller.abort()
  }, [token, hasToken, completed, retry])

  const handleSubmit = async (values) => {
    setError(null)
    try {
      await dispatch(resetPasswordThunk({ token, newPassword: values.newPassword, confirmPassword: values.confirmPassword })).unwrap()
      setCompleted(true)
      navigate(ROUTES.USER.RESET_PASSWORD, { replace: true }) // Xóa token khỏi URL sau khi dùng.
    } catch (error) {
      if (error.code === 'INVALID_RESET_LINK') setValidation({ token, valid: false, invalid: true, message: error.message })
      else setError(error.message)
    }
  }

  let content
  if (completed) {
    content = <Result status="success" title="Đặt lại mật khẩu thành công"
      subTitle="Bạn có thể đăng nhập bằng mật khẩu mới. Các phiên đăng nhập cũ đã hết hiệu lực."
      extra={<Link to={ROUTES.USER.LOGIN}><Button type="primary">Đăng nhập</Button></Link>} />
  } else if (!hasToken || (validation.token === token && validation.invalid)) {
    content = <Result status="warning" title="Link không còn hiệu lực"
      subTitle={validation.message || 'Link đặt lại mật khẩu bị thiếu, không hợp lệ, đã hết hạn hoặc đã được sử dụng.'}
      extra={<Link to={ROUTES.USER.FORGOT_PASSWORD}><Button type="primary">Yêu cầu link mới</Button></Link>} />
  } else if (validation.token !== token) {
    content = <div style={{ textAlign: 'center', padding: 32 }}><Spin /><p style={{ marginTop: 16 }}>Đang kiểm tra link...</p></div>
  } else if (!validation.valid) {
    content = <Result status="warning" title="Chưa kiểm tra được link" subTitle={validation.message}
      extra={<Button onClick={() => {
        setValidation({ token: null, valid: false })
        setRetry((value) => value + 1)
      }}>Thử lại</Button>} />
  } else {
    content = <>
      <S.Title>Đặt lại mật khẩu</S.Title>
      <S.Description>Nhập mật khẩu mới cho tài khoản của bạn. Link chỉ sử dụng được một lần.</S.Description>
      {error && <Alert type="error" showIcon title={error} style={{ marginBottom: 16 }} />}
      <Form layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Mật khẩu mới" name="newPassword" rules={[
          { required: true, whitespace: true, message: 'Vui lòng nhập mật khẩu mới' },
          { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
          { validator: (_, value) => !value || new TextEncoder().encode(value).length <= 72
            ? Promise.resolve() : Promise.reject(new Error('Mật khẩu tối đa 72 byte UTF-8')) },
        ]}>
          <Input.Password autoComplete="new-password" placeholder="Ít nhất 8 ký tự" maxLength={72} />
        </Form.Item>
        <Form.Item label="Xác nhận mật khẩu mới" name="confirmPassword" dependencies={['newPassword']} rules={[
          { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
          ({ getFieldValue }) => ({ validator: (_, value) => !value || getFieldValue('newPassword') === value
            ? Promise.resolve() : Promise.reject(new Error('Mật khẩu xác nhận không khớp')) }),
        ]}>
          <Input.Password autoComplete="new-password" placeholder="Nhập lại mật khẩu mới" maxLength={72} />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>Đặt lại mật khẩu</Button>
      </Form>
    </>
  }

  return <S.Wrapper><S.FormCard>{content}
    {!completed && <S.BottomText><Link to={ROUTES.USER.LOGIN}>Quay lại đăng nhập</Link></S.BottomText>}
  </S.FormCard></S.Wrapper>
}

export default ResetPassword
