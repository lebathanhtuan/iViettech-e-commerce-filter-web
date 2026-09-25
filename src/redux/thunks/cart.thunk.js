import { createAsyncThunk } from '@reduxjs/toolkit'

import * as cartService from '../../services/cartService'

const getErrorMessage = (error) => error.response?.data?.message || 'Có lỗi xảy ra'

// Lấy giỏ hàng của user đang đăng nhập
export const getCartListThunk = createAsyncThunk(
  'cart/getCartList',
  async (_, { rejectWithValue }) => {
    try {
      const result = await cartService.getCartList()
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Các thunk thêm / sửa / xóa dưới đây: làm xong thì gọi lại getCartListThunk
// để lấy giỏ hàng mới nhất từ server (đơn giản, không phải tự cập nhật state)

// Thêm vào giỏ - data: { productId, quantity }
export const addToCartThunk = createAsyncThunk(
  'cart/addToCart',
  async (data, { dispatch, rejectWithValue }) => {
    try {
      const result = await cartService.addToCart(data)
      dispatch(getCartListThunk())
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Đổi số lượng - payload: { id, quantity }
export const updateCartItemThunk = createAsyncThunk(
  'cart/updateCartItem',
  async ({ id, quantity }, { dispatch, rejectWithValue }) => {
    try {
      const result = await cartService.updateCartItem(id, { quantity })
      dispatch(getCartListThunk())
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Xóa 1 sản phẩm khỏi giỏ theo id của cart item
export const deleteCartItemThunk = createAsyncThunk(
  'cart/deleteCartItem',
  async (id, { dispatch, rejectWithValue }) => {
    try {
      const result = await cartService.deleteCartItem(id)
      dispatch(getCartListThunk())
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)
