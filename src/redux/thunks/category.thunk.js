import { createAsyncThunk } from '@reduxjs/toolkit'

import * as productService from '../../services/productService'

export const getCategoryListThunk = createAsyncThunk(
  'category/getCategoryList',
  async (_, { rejectWithValue }) => {
    try {
      const result = await productService.getCategoryList()
      return result
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }
)
