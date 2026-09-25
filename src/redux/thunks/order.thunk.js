import { createAsyncThunk } from '@reduxjs/toolkit'

import * as orderService from '../../services/orderService'

const getErrorMessage = (error) => error.response?.data?.message || 'Có lỗi xảy ra'

// Đặt hàng - data: { fullName, phone, address }
export const createOrderThunk = createAsyncThunk(
  'order/createOrder',
  async (data, { rejectWithValue }) => {
    try {
      const result = await orderService.createOrder(data)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Lịch sử đơn hàng
export const getOrderListThunk = createAsyncThunk(
  'order/getOrderList',
  async (_, { rejectWithValue }) => {
    try {
      const result = await orderService.getOrderList()
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Chi tiết 1 đơn hàng theo mã đơn (dùng ở trang đặt hàng thành công)
export const getOrderDetailThunk = createAsyncThunk(
  'order/getOrderDetail',
  async (code, { rejectWithValue }) => {
    try {
      const result = await orderService.getOrderDetail(code)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)
