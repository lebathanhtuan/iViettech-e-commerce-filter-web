import api from './api'

// Tất cả API yêu thích đều cần đăng nhập

/**
 * Danh sách sản phẩm yêu thích
 * API: GET /favorites
 * Kết quả: mảng sản phẩm [{ id, name, price, image, ... }]
 */
export const getFavoriteList = async () => {
  const response = await api.get('/favorites')
  return response.data
}

/**
 * Thêm sản phẩm vào yêu thích
 * API: POST /favorites - data: { productId }
 */
export const addFavorite = async (productId) => {
  const response = await api.post('/favorites', { productId })
  return response.data
}

/**
 * Bỏ yêu thích
 * API: DELETE /favorites/:productId
 */
export const deleteFavorite = async (productId) => {
  const response = await api.delete(`/favorites/${productId}`)
  return response.data
}
