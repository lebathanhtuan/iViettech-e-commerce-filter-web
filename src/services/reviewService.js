import api from './api'

/**
 * Danh sách đánh giá của 1 sản phẩm (không cần đăng nhập)
 * API: GET /products/:productId/reviews
 * Kết quả: [{ id, rating, comment, createdAt, user: { id, name, avatar } }]
 */
export const getReviewList = async (productId) => {
  const response = await api.get(`/products/${productId}/reviews`)
  return response.data
}

/**
 * Viết đánh giá (cần đăng nhập)
 * API: POST /products/:productId/reviews - data: { rating, comment }
 */
export const createReview = async (productId, data) => {
  const response = await api.post(`/products/${productId}/reviews`, data)
  return response.data
}
