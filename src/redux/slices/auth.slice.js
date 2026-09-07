import { createSlice } from '@reduxjs/toolkit'

import {
  loginThunk,
  registerThunk,
  getMyProfileThunk,
  logoutThunk,
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
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
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
  },
})

export default authSlice.reducer
