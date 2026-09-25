import api from './api'

/**
 * Đặt hàng từ giỏ hàng hiện tại (backend tự lấy sản phẩm trong giỏ và xóa giỏ sau khi đặt)
 * API: POST /orders - data: { fullName, phone, address }
 * Kết quả: { id, code, totalPrice } - code là mã đơn hàng 8 ký tự, vd: "K7Q2M9XA"
 */
export const createOrder = async (data) => {
  const response = await api.post('/orders', data)
  return response.data
}

/**
 * Lịch sử đơn hàng của user đang đăng nhập
 * API: GET /orders
 * Kết quả: [{ id, code, fullName, phone, address, totalPrice, createdAt, items: [{ id, price, quantity, product }] }]
 */
export const getOrderList = async () => {
  const response = await api.get('/orders')
  return response.data
}

/**
 * Chi tiết 1 đơn hàng theo mã đơn
 * API: GET /orders/:code
 */
export const getOrderDetail = async (code) => {
  const response = await api.get(`/orders/${code}`)
  return response.data
}
