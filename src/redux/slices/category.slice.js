import { createSlice } from '@reduxjs/toolkit'

import { getCategoryListThunk } from '../thunks/category.thunk'

const initialState = {
  categoryList: {
    data: [],
    loading: false,
    error: null,
  },
}

const categorySlice = createSlice({
  name: 'category',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getCategoryListThunk.pending, (state) => {
      state.categoryList.loading = true
      state.categoryList.error = null
    })
    builder.addCase(getCategoryListThunk.fulfilled, (state, action) => {
      state.categoryList.loading = false
      state.categoryList.data = action.payload
    })
    builder.addCase(getCategoryListThunk.rejected, (state, action) => {
      state.categoryList.loading = false
      state.categoryList.error = action.payload
    })
  },
})

export default categorySlice.reducer
