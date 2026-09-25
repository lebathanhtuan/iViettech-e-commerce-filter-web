import { createSlice } from '@reduxjs/toolkit'

import {
  createOrderThunk,
  getOrderListThunk,
  getOrderDetailThunk,
} from '../thunks/order.thunk'

const initialState = {
  // Lịch sử đơn hàng
  orderList: {
    data: [],
    loading: false,
    error: null,
  },
  orderDetail: {
    data: null,
    loading: false,
    error: null,
  },
  createOrderData: {
    loading: false,
    error: null,
  },
}

const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create order
    builder.addCase(createOrderThunk.pending, (state) => {
      state.createOrderData.loading = true
      state.createOrderData.error = null
    })
    builder.addCase(createOrderThunk.fulfilled, (state) => {
      state.createOrderData.loading = false
    })
    builder.addCase(createOrderThunk.rejected, (state, action) => {
      state.createOrderData.loading = false
      state.createOrderData.error = action.payload
    })

    // Get order list
    builder.addCase(getOrderListThunk.pending, (state) => {
      state.orderList.loading = true
      state.orderList.error = null
    })
    builder.addCase(getOrderListThunk.fulfilled, (state, action) => {
      state.orderList.loading = false
      state.orderList.data = action.payload
    })
    builder.addCase(getOrderListThunk.rejected, (state, action) => {
      state.orderList.loading = false
      state.orderList.error = action.payload
    })

    // Get order detail
    builder.addCase(getOrderDetailThunk.pending, (state) => {
      state.orderDetail.loading = true
      state.orderDetail.error = null
    })
    builder.addCase(getOrderDetailThunk.fulfilled, (state, action) => {
      state.orderDetail.loading = false
      state.orderDetail.data = action.payload
    })
    builder.addCase(getOrderDetailThunk.rejected, (state, action) => {
      state.orderDetail.loading = false
      state.orderDetail.error = action.payload
      state.orderDetail.data = null
    })
  },
})

export default orderSlice.reducer
