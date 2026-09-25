import { createSlice } from '@reduxjs/toolkit'

import { getFavoriteListThunk } from '../thunks/favorite.thunk'
import { logoutThunk } from '../thunks/auth.thunk'

const initialState = {
  // Danh sách sản phẩm yêu thích: [{ id, name, price, image, ... }]
  favoriteList: {
    data: [],
    loading: false,
    error: null,
  },
}

const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getFavoriteListThunk.pending, (state) => {
      state.favoriteList.loading = true
      state.favoriteList.error = null
    })
    builder.addCase(getFavoriteListThunk.fulfilled, (state, action) => {
      state.favoriteList.loading = false
      state.favoriteList.data = action.payload
    })
    builder.addCase(getFavoriteListThunk.rejected, (state, action) => {
      state.favoriteList.loading = false
      state.favoriteList.error = action.payload
    })

    // Đăng xuất thì xóa danh sách yêu thích của user cũ
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.favoriteList.data = []
    })
  },
})

export default favoriteSlice.reducer
