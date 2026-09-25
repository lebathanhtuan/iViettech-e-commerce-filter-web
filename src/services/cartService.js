import api from './api'

// Tất cả API giỏ hàng đều cần đăng nhập (interceptor tự gắn access token)

/**
 * Lấy giỏ hàng của user đang đăng nhập
 * API: GET /cart
 * Kết quả: [{ id, quantity, product: { id, name, price, image, ... } }]
 */
export const getCartList = async () => {
  const response = await api.get('/cart')
  return response.data
}

/**
 * Thêm sản phẩm vào giỏ
 * API: POST /cart - data: { productId, quantity }
 * Sản phẩm đã có trong giỏ thì backend tự cộng dồn quantity
 */
export const addToCart = async (data) => {
  const response = await api.post('/cart', data)
  return response.data
}

/**
 * Đổi số lượng 1 sản phẩm trong giỏ
 * API: PATCH /cart/:id - data: { quantity }
 */
export const updateCartItem = async (id, data) => {
  const response = await api.patch(`/cart/${id}`, data)
  return response.data
}

/**
 * Xóa 1 sản phẩm khỏi giỏ
 * API: DELETE /cart/:id
 */
export const deleteCartItem = async (id) => {
  const response = await api.delete(`/cart/${id}`)
  return response.data
}
