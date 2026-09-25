import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Result, Button, Spin } from 'antd'

import { getOrderDetailThunk } from '../../redux/thunks/order.thunk'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function CheckoutSuccess() {
  const { code } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: order, loading } = useSelector((state) => state.order.orderDetail)

  // Lấy lại đơn hàng theo mã đơn trên URL -> F5 trang vẫn hiển thị được
  useEffect(() => {
    dispatch(getOrderDetailThunk(code))
  }, [dispatch, code])

  if (loading) {
    return <Spin style={{ display: 'block', margin: '48px auto' }} />
  }

  return (
    <S.Wrapper>
      <Result
        status="success"
        title="Đặt hàng thành công!"
        subTitle={
          order && (
            <>
              <p>Mã đơn hàng: {order.code}</p>
              <p>Tổng tiền: {order.totalPrice.toLocaleString('vi-VN')} đ</p>
              <p>
                Giao đến: {order.fullName} - {order.phone} - {order.address}
              </p>
            </>
          )
        }
        extra={[
          <Button key="home" type="primary" onClick={() => navigate(ROUTES.USER.HOME)}>
            Tiếp tục mua sắm
          </Button>,
          <Button key="orders" onClick={() => navigate(`${ROUTES.USER.PROFILE}?tab=orders`)}>
            Xem lịch sử đơn hàng
          </Button>,
        ]}
      />
    </S.Wrapper>
  )
}

export default CheckoutSuccess
