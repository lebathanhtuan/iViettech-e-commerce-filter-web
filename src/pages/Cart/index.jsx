import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Table, InputNumber, Button, Popconfirm, Empty, message } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

import { updateCartItemThunk, deleteCartItemThunk } from '../../redux/thunks/cart.thunk'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function Cart() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Giỏ hàng đã được lấy ở UserLayout, ở đây chỉ cần đọc từ store
  const { data: cartItems, loading } = useSelector((state) => state.cart.cartList)

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  )

  const handleChangeQuantity = async (cartItem, value) => {
    // Xóa trống ô nhập thì value = null -> bỏ qua
    if (!value) return

    try {
      await dispatch(updateCartItemThunk({ id: cartItem.id, quantity: value })).unwrap()
    } catch (error) {
      message.error(error)
    }
  }

  const handleDeleteCartItem = async (id) => {
    try {
      await dispatch(deleteCartItemThunk(id)).unwrap()
      message.success('Đã xóa sản phẩm khỏi giỏ hàng')
    } catch (error) {
      message.error(error)
    }
  }

  const columns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'product',
      render: (product) => (
        <Link to={ROUTES.USER.PRODUCT_DETAIL.replace(':id', product.id)}>
          <S.ProductInfo>
            <S.ProductImage
              alt={product.name}
              src={product.image || 'https://placehold.co/60x60?text=P'}
            />
            <span>{product.name}</span>
          </S.ProductInfo>
        </Link>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'product',
      render: (product) => `${product.price.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      render: (quantity, cartItem) => (
        <InputNumber
          min={1}
          value={quantity}
          onChange={(value) => handleChangeQuantity(cartItem, value)}
        />
      ),
    },
    {
      title: 'Thành tiền',
      render: (_, cartItem) =>
        `${(cartItem.product.price * cartItem.quantity).toLocaleString('vi-VN')} đ`,
    },
    {
      title: '',
      render: (_, cartItem) => (
        <Popconfirm
          title="Xóa sản phẩm khỏi giỏ hàng?"
          okText="Xóa"
          cancelText="Hủy"
          onConfirm={() => handleDeleteCartItem(cartItem.id)}
        >
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ]

  if (cartItems.length === 0 && !loading) {
    return (
      <S.Wrapper>
        <Empty description="Giỏ hàng đang trống">
          <Button type="primary" onClick={() => navigate(ROUTES.USER.HOME)}>
            Tiếp tục mua sắm
          </Button>
        </Empty>
      </S.Wrapper>
    )
  }

  return (
    <S.Wrapper>
      <S.PageTitle>Giỏ hàng</S.PageTitle>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={cartItems}
        loading={loading}
        pagination={false}
      />

      <S.Summary>
        <S.TotalPrice>
          Tổng tiền: <span>{totalPrice.toLocaleString('vi-VN')} đ</span>
        </S.TotalPrice>
        <Button type="primary" size="large" onClick={() => navigate(ROUTES.USER.CHECKOUT)}>
          Tiến hành thanh toán
        </Button>
      </S.Summary>
    </S.Wrapper>
  )
}

export default Cart
