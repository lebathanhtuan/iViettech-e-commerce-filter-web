import { createAsyncThunk } from '@reduxjs/toolkit'

import * as favoriteService from '../../services/favoriteService'

const getErrorMessage = (error) => error.response?.data?.message || 'Có lỗi xảy ra'

// Lấy danh sách sản phẩm yêu thích
export const getFavoriteListThunk = createAsyncThunk(
  'favorite/getFavoriteList',
  async (_, { rejectWithValue }) => {
    try {
      const result = await favoriteService.getFavoriteList()
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Thêm / bỏ yêu thích: làm xong thì lấy lại danh sách mới nhất
export const addFavoriteThunk = createAsyncThunk(
  'favorite/addFavorite',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const result = await favoriteService.addFavorite(productId)
      dispatch(getFavoriteListThunk())
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

export const deleteFavoriteThunk = createAsyncThunk(
  'favorite/deleteFavorite',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      const result = await favoriteService.deleteFavorite(productId)
      dispatch(getFavoriteListThunk())
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)
