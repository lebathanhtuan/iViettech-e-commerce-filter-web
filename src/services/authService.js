import api from './api'

/**
 * Đăng nhập
 * API: POST /login - data: { email, password }
 * Kết quả: { accessToken, refreshToken, user: { id, name, email, role } }
 */
export const login = async (data) => {
  const response = await api.post('/login', data)
  return response.data
}

/**
 * Đăng ký tài khoản
 * API: POST /register - data: { fullName, email, password }
 * Kết quả: { id, name, email, role }
 */
export const register = async (data) => {
  const response = await api.post('/register', data)
  return response.data
}

/**
 * Lấy thông tin user đang đăng nhập (cần access token)
 * API: GET /profile
 * Kết quả: { id, name, email, role }
 */
export const getMyProfile = async () => {
  const response = await api.get('/profile')
  return response.data
}

/**
 * Đăng xuất (cần access token) - backend sẽ xóa refresh token trong DB
 * API: POST /logout
 */
export const logout = async () => {
  const response = await api.post('/logout')
  return response.data
}
