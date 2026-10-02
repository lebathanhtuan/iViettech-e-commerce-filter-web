import { createSlice } from '@reduxjs/toolkit'

import {
  loginThunk,
  registerThunk,
  getMyProfileThunk,
  logoutThunk,
  updateMyProfileThunk,
  changePasswordThunk,
  updateAvatarThunk,
  forgotPasswordThunk,
  resetPasswordThunk,
} from '../thunks/auth.thunk'

const initialState = {
  // Thông tin user đang đăng nhập (null = chưa đăng nhập)
  userInfo: {
    data: null,
    loading: false,
    error: null,
  },
  loginData: {
    loading: false,
    error: null,
  },
  registerData: {
    loading: false,
    error: null,
  },
  updateProfileData: {
    loading: false,
    error: null,
  },
  changePasswordData: {
    loading: false,
    error: null,
  },
  updateAvatarData: {
    loading: false,
    error: null,
  },
  forgotPasswordData: { loading: false, error: null },
  resetPasswordData: { loading: false, error: null },
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(forgotPasswordThunk.pending, (state) => {
      state.forgotPasswordData = { loading: true, error: null }
    })
    builder.addCase(forgotPasswordThunk.fulfilled, (state) => {
      state.forgotPasswordData.loading = false
    })
    builder.addCase(forgotPasswordThunk.rejected, (state, action) => {
      state.forgotPasswordData = { loading: false, error: action.payload }
    })
    builder.addCase(resetPasswordThunk.pending, (state) => {
      state.resetPasswordData = { loading: true, error: null }
    })
    builder.addCase(resetPasswordThunk.fulfilled, (state) => {
      state.resetPasswordData.loading = false
      state.userInfo.data = null
    })
    builder.addCase(resetPasswordThunk.rejected, (state, action) => {
      state.resetPasswordData = { loading: false, error: action.payload?.message }
    })
    // Login
    builder.addCase(loginThunk.pending, (state) => {
      state.loginData.loading = true
      state.loginData.error = null
    })
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.loginData.loading = false
      state.userInfo.data = action.payload
    })
    builder.addCase(loginThunk.rejected, (state, action) => {
      state.loginData.loading = false
      state.loginData.error = action.payload
    })

    // Register
    builder.addCase(registerThunk.pending, (state) => {
      state.registerData.loading = true
      state.registerData.error = null
    })
    builder.addCase(registerThunk.fulfilled, (state) => {
      state.registerData.loading = false
    })
    builder.addCase(registerThunk.rejected, (state, action) => {
      state.registerData.loading = false
      state.registerData.error = action.payload
    })

    // Get my profile
    builder.addCase(getMyProfileThunk.pending, (state) => {
      state.userInfo.loading = true
      state.userInfo.error = null
    })
    builder.addCase(getMyProfileThunk.fulfilled, (state, action) => {
      state.userInfo.loading = false
      state.userInfo.data = action.payload
    })
    builder.addCase(getMyProfileThunk.rejected, (state, action) => {
      state.userInfo.loading = false
      state.userInfo.error = action.payload
    })

    // Logout
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.userInfo.data = null
    })

    // Update profile: thành công thì thay thông tin user bằng dữ liệu mới backend trả về
    builder.addCase(updateMyProfileThunk.pending, (state) => {
      state.updateProfileData.loading = true
      state.updateProfileData.error = null
    })
    builder.addCase(updateMyProfileThunk.fulfilled, (state, action) => {
      state.updateProfileData.loading = false
      state.userInfo.data = action.payload
    })
    builder.addCase(updateMyProfileThunk.rejected, (state, action) => {
      state.updateProfileData.loading = false
      state.updateProfileData.error = action.payload
    })

    // Change password
    builder.addCase(changePasswordThunk.pending, (state) => {
      state.changePasswordData.loading = true
      state.changePasswordData.error = null
    })
    builder.addCase(changePasswordThunk.fulfilled, (state) => {
      state.changePasswordData.loading = false
    })
    builder.addCase(changePasswordThunk.rejected, (state, action) => {
      state.changePasswordData.loading = false
      state.changePasswordData.error = action.payload
    })

    // Update avatar
    builder.addCase(updateAvatarThunk.pending, (state) => {
      state.updateAvatarData.loading = true
      state.updateAvatarData.error = null
    })
    builder.addCase(updateAvatarThunk.fulfilled, (state, action) => {
      state.updateAvatarData.loading = false
      state.userInfo.data = action.payload
    })
    builder.addCase(updateAvatarThunk.rejected, (state, action) => {
      state.updateAvatarData.loading = false
      state.updateAvatarData.error = action.payload
    })
  },
})

export default authSlice.reducer
