import { createAsyncThunk } from '@reduxjs/toolkit'

import * as reviewService from '../../services/reviewService'

const getErrorMessage = (error) => error.response?.data?.message || 'Có lỗi xảy ra'

// Lấy danh sách đánh giá của 1 sản phẩm
export const getReviewListThunk = createAsyncThunk(
  'review/getReviewList',
  async (productId, { rejectWithValue }) => {
    try {
      const result = await reviewService.getReviewList(productId)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Viết đánh giá - payload: { productId, data: { rating, comment } }
// Thành công thì lấy lại danh sách đánh giá mới nhất
export const createReviewThunk = createAsyncThunk(
  'review/createReview',
  async ({ productId, data }, { dispatch, rejectWithValue }) => {
    try {
      const result = await reviewService.createReview(productId, data)
      dispatch(getReviewListThunk(productId))
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)
