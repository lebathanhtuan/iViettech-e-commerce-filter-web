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
 * Kết quả: { id, name, email, role, phone, avatar }
 */
export const register = async (data) => {
  const response = await api.post('/register', data)
  return response.data
}

/**
 * Lấy thông tin user đang đăng nhập (cần access token)
 * API: GET /profile
 * Kết quả: { id, name, email, role, phone, avatar }
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

/**
 * Cập nhật thông tin user đang đăng nhập
 * API: PATCH /profile - data: { name, phone }
 * Kết quả: { id, name, email, role, phone, avatar }
 */
export const updateMyProfile = async (data) => {
  const response = await api.patch('/profile', data)
  return response.data
}

/**
 * Đổi mật khẩu
 * API: PATCH /profile/password - data: { currentPassword, newPassword }
 */
export const changePassword = async (data) => {
  const response = await api.patch('/profile/password', data)
  return response.data
}

/**
 * Đổi avatar
 * API: PATCH /profile/avatar - data là FormData có field "avatar" (file)
 * Kết quả: thông tin user mới (avatar là link đầy đủ)
 */
export const updateAvatar = async (data) => {
  const response = await api.patch('/profile/avatar', data)
  return response.data
}

export const forgotPassword = async (data) => (await api.post('/forgot-password', data)).data
export const validateResetPasswordLink = async (token, signal) =>
  (await api.post('/reset-password/validate', { token }, { signal })).data
export const resetPassword = async (data) => (await api.post('/reset-password', data)).data
