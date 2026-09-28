import axios from 'axios'

// Instance axios dùng chung cho toàn bộ project
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptor request: tự động gắn access token vào header trước khi gửi request
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken')
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Dùng refresh token để xin access token mới rồi lưu lại vào localStorage
// Dùng chung cho interceptor bên dưới và socket.io (services/socket.js)
export const refreshAccessToken = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  const response = await api.post('/refresh-token', { refreshToken })
  const newAccessToken = response.data.accessToken

  localStorage.setItem('accessToken', newAccessToken)
  return newAccessToken
}

// Interceptor response: nếu access token hết hạn (401) thì dùng refresh token
// để xin access token mới, rồi gọi lại request ban đầu
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    const refreshToken = localStorage.getItem('refreshToken')

    const isUnauthorized = error.response?.status === 401
    const isRefreshRequest = originalRequest.url === '/refresh-token'

    // _retry: đánh dấu request này đã thử refresh 1 lần, tránh lặp vô hạn
    if (isUnauthorized && refreshToken && !isRefreshRequest && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const newAccessToken = await refreshAccessToken()
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`

        return api(originalRequest)
      } catch {
        // Refresh token cũng hết hạn -> xóa token và về trang login
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
        window.location.href = '/login'
      }
    }

    return Promise.reject(error)
  }
)

export default api
