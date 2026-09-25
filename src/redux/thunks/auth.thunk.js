import { createAsyncThunk } from '@reduxjs/toolkit'

import * as authService from '../../services/authService'

// Lấy message lỗi từ response của backend, không có thì dùng message mặc định
const getErrorMessage = (error) => error.response?.data?.message || 'Có lỗi xảy ra'

// Đăng nhập: lưu token vào localStorage, trả về thông tin user
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authService.login(data)

      localStorage.setItem('accessToken', result.accessToken)
      localStorage.setItem('refreshToken', result.refreshToken)

      return result.user
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Đăng ký tài khoản
export const registerThunk = createAsyncThunk(
  'auth/register',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authService.register(data)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Lấy thông tin user đang đăng nhập (gọi khi mở lại trang mà đã có token)
export const getMyProfileThunk = createAsyncThunk(
  'auth/getMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.getMyProfile()
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Đăng xuất: báo backend xóa refresh token, xóa token ở localStorage
export const logoutThunk = createAsyncThunk('auth/logout', async () => {
  try {
    await authService.logout()
  } finally {
    // Dù API lỗi hay không thì frontend vẫn xóa token
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
  }
})

// Cập nhật thông tin cá nhân - data: { name, phone }
export const updateMyProfileThunk = createAsyncThunk(
  'auth/updateMyProfile',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authService.updateMyProfile(data)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Đổi mật khẩu - data: { currentPassword, newPassword }
export const changePasswordThunk = createAsyncThunk(
  'auth/changePassword',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authService.changePassword(data)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Đổi avatar - data là FormData có field "avatar"
export const updateAvatarThunk = createAsyncThunk(
  'auth/updateAvatar',
  async (data, { rejectWithValue }) => {
    try {
      const result = await authService.updateAvatar(data)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)
