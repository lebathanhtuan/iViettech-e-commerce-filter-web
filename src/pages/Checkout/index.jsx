import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Input, Button, Empty, message } from 'antd'

import { createOrderThunk } from '../../redux/thunks/order.thunk'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { data: user } = useSelector((state) => state.auth.userInfo)
  const { data: cartItems } = useSelector((state) => state.cart.cartList)
  const { loading } = useSelector((state) => state.order.createOrderData)

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  // Điền sẵn tên + số điện thoại của user đang đăng nhập
  useEffect(() => {
    if (user) {
      form.setFieldsValue({ fullName: user.name, phone: user.phone })
    }
  }, [user, form])

  const handleSubmit = async (values) => {
    try {
      // Chỉ gửi thông tin giao hàng lên server.
      // Thông tin thẻ là giả lập: chỉ cần qua được validate của form, không gửi đi đâu cả
      const result = await dispatch(
        createOrderThunk({
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
        })
      ).unwrap()

      navigate(ROUTES.USER.CHECKOUT_SUCCESS.replace(':code', result.code))
    } catch (error) {
      message.error(error)
    }
  }

  if (cartItems.length === 0) {
    return (
      <S.Box>
        <Empty description="Giỏ hàng đang trống, chưa thể thanh toán">
          <Button type="primary" onClick={() => navigate(ROUTES.USER.HOME)}>
            Tiếp tục mua sắm
          </Button>
        </Empty>
      </S.Box>
    )
  }

  return (
    <Form form={form} layout="vertical" onFinish={handleSubmit}>
      <Row gutter={24}>
        <Col span={14}>
          <S.Box>
            <S.SectionTitle>Thông tin giao hàng</S.SectionTitle>
            <Form.Item
              label="Họ tên người nhận"
              name="fullName"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input placeholder="Nhập họ tên" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="phone"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^0\d{9}$/, message: 'Số điện thoại gồm 10 số, bắt đầu bằng 0' },
              ]}
            >
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ nhận hàng"
              name="address"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input.TextArea rows={2} placeholder="Số nhà, đường, phường/xã, tỉnh/thành phố" />
            </Form.Item>
          </S.Box>

          <S.Box>
            <S.SectionTitle>Thông tin thanh toán</S.SectionTitle>
            <S.Note>Đây là form giả lập, bạn có thể nhập số thẻ bất kỳ gồm 16 chữ số.</S.Note>
            <Form.Item
              label="Tên chủ thẻ"
              name="cardName"
              rules={[{ required: true, message: 'Vui lòng nhập tên chủ thẻ' }]}
            >
              <Input placeholder="NGUYEN VAN A" />
            </Form.Item>
            <Form.Item
              label="Số thẻ"
              name="cardNumber"
              rules={[
                { required: true, message: 'Vui lòng nhập số thẻ' },
                { pattern: /^\d{16}$/, message: 'Số thẻ gồm 16 chữ số' },
              ]}
            >
              <Input placeholder="1234567812345678" maxLength={16} />
            </Form.Item>
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  label="Ngày hết hạn"
                  name="expiryDate"
                  rules={[
                    { required: true, message: 'Vui lòng nhập ngày hết hạn' },
                    { pattern: /^(0[1-9]|1[0-2])\/\d{2}$/, message: 'Định dạng MM/YY' },
                  ]}
                >
                  <Input placeholder="MM/YY" maxLength={5} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label="CVV"
                  name="cvv"
                  rules={[
                    { required: true, message: 'Vui lòng nhập CVV' },
                    { pattern: /^\d{3}$/, message: 'CVV gồm 3 chữ số' },
                  ]}
                >
                  <Input.Password placeholder="123" maxLength={3} />
                </Form.Item>
              </Col>
            </Row>
          </S.Box>
        </Col>

        <Col span={10}>
          <S.Box>
            <S.SectionTitle>Đơn hàng ({cartItems.length} sản phẩm)</S.SectionTitle>
            {cartItems.map((item) => (
              <S.OrderItem key={item.id}>
                <span>
                  {item.product.name} x {item.quantity}
                </span>
                <span>{(item.product.price * item.quantity).toLocaleString('vi-VN')} đ</span>
              </S.OrderItem>
            ))}
            <S.TotalPrice>
              <span>Tổng tiền</span>
              <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
            </S.TotalPrice>
            <Button type="primary" size="large" htmlType="submit" loading={loading} block>
              Đặt hàng
            </Button>
          </S.Box>
        </Col>
      </Row>
    </Form>
  )
}

export default Checkout
