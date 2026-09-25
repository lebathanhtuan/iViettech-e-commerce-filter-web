import { createSlice } from '@reduxjs/toolkit'

import { getReviewListThunk, createReviewThunk } from '../thunks/review.thunk'

const initialState = {
  // Danh sách đánh giá của sản phẩm đang xem
  reviewList: {
    data: [],
    loading: false,
    error: null,
  },
  createReviewData: {
    loading: false,
    error: null,
  },
}

const reviewSlice = createSlice({
  name: 'review',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get review list
    builder.addCase(getReviewListThunk.pending, (state) => {
      state.reviewList.loading = true
      state.reviewList.error = null
    })
    builder.addCase(getReviewListThunk.fulfilled, (state, action) => {
      state.reviewList.loading = false
      state.reviewList.data = action.payload
    })
    builder.addCase(getReviewListThunk.rejected, (state, action) => {
      state.reviewList.loading = false
      state.reviewList.error = action.payload
    })

    // Create review
    builder.addCase(createReviewThunk.pending, (state) => {
      state.createReviewData.loading = true
      state.createReviewData.error = null
    })
    builder.addCase(createReviewThunk.fulfilled, (state) => {
      state.createReviewData.loading = false
    })
    builder.addCase(createReviewThunk.rejected, (state, action) => {
      state.createReviewData.loading = false
      state.createReviewData.error = action.payload
    })
  },
})

export default reviewSlice.reducer
