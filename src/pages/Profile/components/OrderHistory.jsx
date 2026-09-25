import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table } from 'antd'

import { getOrderListThunk } from '../../../redux/thunks/order.thunk'
import * as S from '../styled'

// Bảng con: danh sách sản phẩm trong 1 đơn hàng
const itemColumns = [
  {
    title: 'Sản phẩm',
    dataIndex: 'product',
    render: (product) =>
      // Sản phẩm đã bị admin xóa thì product = null
      product ? (
        <S.ProductInfo>
          <S.ProductImage
            alt={product.name}
            src={product.image || 'https://placehold.co/48x48?text=P'}
          />
          <span>{product.name}</span>
        </S.ProductInfo>
      ) : (
        <i>Sản phẩm đã bị xóa</i>
      ),
  },
  {
    title: 'Đơn giá',
    dataIndex: 'price',
    render: (price) => `${price.toLocaleString('vi-VN')} đ`,
  },
  {
    title: 'Số lượng',
    dataIndex: 'quantity',
  },
  {
    title: 'Thành tiền',
    render: (_, item) => `${(item.price * item.quantity).toLocaleString('vi-VN')} đ`,
  },
]

const orderColumns = [
  {
    title: 'Mã đơn',
    dataIndex: 'code',
  },
  {
    title: 'Ngày đặt',
    dataIndex: 'createdAt',
    render: (createdAt) => new Date(createdAt).toLocaleString('vi-VN'),
  },
  {
    title: 'Người nhận',
    render: (_, order) => `${order.fullName} - ${order.phone}`,
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'totalPrice',
    render: (totalPrice) => <b>{totalPrice.toLocaleString('vi-VN')} đ</b>,
  },
]

function OrderHistory() {
  const dispatch = useDispatch()

  const { data: orders, loading } = useSelector((state) => state.order.orderList)

  useEffect(() => {
    dispatch(getOrderListThunk())
  }, [dispatch])

  return (
    <Table
      rowKey="id"
      columns={orderColumns}
      dataSource={orders}
      loading={loading}
      locale={{ emptyText: 'Bạn chưa có đơn hàng nào' }}
      // Bấm dấu + ở đầu dòng để xem sản phẩm trong đơn
      expandable={{
        expandedRowRender: (order) => (
          <Table
            rowKey="id"
            columns={itemColumns}
            dataSource={order.items}
            pagination={false}
            size="small"
          />
        ),
      }}
    />
  )
}

export default OrderHistory
