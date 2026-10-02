import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Form, Input, Button, Empty, Select, Alert, message } from 'antd'

import { createOrderThunk } from '../../redux/thunks/order.thunk'
import { getAddressListThunk } from '../../redux/thunks/address.thunk'
import { getCartListThunk } from '../../redux/thunks/cart.thunk'
import AddressFields from '../../components/AddressFields'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function Checkout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [addressesReady, setAddressesReady] = useState(false)

  const { data: user } = useSelector((state) => state.auth.userInfo)
  const { data: cartItems } = useSelector((state) => state.cart.cartList)
  const { loading } = useSelector((state) => state.order.createOrderData)
  const { data: addresses, loading: addressLoading, error: addressError } = useSelector((state) => state.address.addressList)
  const userId = user?.id
  const selectedId = Form.useWatch('addressId', form) || 'manual'
  const selectedAddress = addresses.find((address) => address.id === selectedId)

  // Mở checkout: chọn và điền địa chỉ mặc định. Không ghi đè sau khi user đã chọn/nhập.
  useEffect(() => {
    if (!userId) return
    let active = true
    dispatch(getAddressListThunk()).unwrap().then((list) => {
      if (!active) return
      const defaultAddress = list.find((address) => address.isDefault)
      if (defaultAddress) form.setFieldsValue({ ...defaultAddress, addressId: defaultAddress.id })
    }).catch(() => {
      // Vẫn cho phép nhập địa chỉ mới khi Sổ địa chỉ tạm không tải được.
    }).finally(() => { if (active) setAddressesReady(true) })
    return () => { active = false }
  }, [dispatch, form, userId])

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  // Điền sẵn tên + số điện thoại của user đang đăng nhập
  useEffect(() => {
    if (user && !form.getFieldValue('fullName') && !form.isFieldsTouched()) {
      form.setFieldsValue({ fullName: user.name, phone: user.phone })
    }
  }, [user, form])

  const handleSubmit = async (values) => {
    try {
      // Chỉ gửi thông tin giao hàng lên server.
      // Thông tin thẻ là giả lập: chỉ cần qua được validate của form, không gửi đi đâu cả
      const result = await dispatch(
        createOrderThunk(selectedId !== 'manual' ? { addressId: selectedId } : {
          fullName: values.fullName,
          phone: values.phone,
          provinceCode: values.provinceCode,
          wardCode: values.wardCode,
          addressLine: values.addressLine,
        })
      ).unwrap()

      dispatch(getCartListThunk())
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
    <Form form={form} layout="vertical" onFinish={handleSubmit} initialValues={{ addressId: 'manual' }}>
      <Row gutter={24}>
        <Col xs={24} md={14}>
          <S.Box>
            <S.SectionTitle>Thông tin giao hàng</S.SectionTitle>
            {addressError && <Alert type="warning" showIcon title="Không tải được Sổ địa chỉ. Bạn có thể nhập địa chỉ mới để tiếp tục."
              description={addressError} style={{ marginBottom: 16 }} />}
            <Form.Item label="Chọn địa chỉ giao hàng" name="addressId">
              <Select loading={addressLoading} disabled={!addressesReady}
                options={[
                  ...addresses.map((address) => ({ value: address.id,
                    label: `${address.isDefault ? '[Mặc định] ' : ''}${address.label || address.fullName} - ${address.fullAddress}` })),
                  { value: 'manual', label: 'Nhập địa chỉ khác' },
                ]}
                onChange={(id) => {
                  const address = addresses.find((item) => item.id === id)
                  form.setFieldsValue(address || { fullName: user?.name, phone: user?.phone,
                    provinceCode: undefined, wardCode: undefined, addressLine: undefined })
                }} />
            </Form.Item>
            {selectedAddress ? (
              <div style={{ marginBottom: 16 }}>
                <p><strong>{selectedAddress.fullName}</strong> - {selectedAddress.phone}</p>
                <p>{selectedAddress.fullAddress}</p>
              </div>
            ) : <AddressFields form={form} disabled={!addressesReady} />}
            <Link to={`${ROUTES.USER.PROFILE}?tab=addresses`}>Quản lý Sổ địa chỉ</Link>
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

        <Col xs={24} md={10}>
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
            <Button type="primary" size="large" htmlType="submit" loading={loading} disabled={!addressesReady} block>
              Đặt hàng
            </Button>
          </S.Box>
        </Col>
      </Row>
    </Form>
  )
}

export default Checkout
