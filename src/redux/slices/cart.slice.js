import { createSlice } from '@reduxjs/toolkit'

import { getCartListThunk, addToCartThunk } from '../thunks/cart.thunk'
import { createOrderThunk } from '../thunks/order.thunk'
import { logoutThunk } from '../thunks/auth.thunk'

const initialState = {
  // Danh sách sản phẩm trong giỏ: [{ id, quantity, product }]
  cartList: {
    data: [],
    loading: false,
    error: null,
  },
  addToCartData: {
    loading: false,
    error: null,
  },
}

const cartSlice = createSlice({
  name: 'cart',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get cart list
    builder.addCase(getCartListThunk.pending, (state) => {
      state.cartList.loading = true
      state.cartList.error = null
    })
    builder.addCase(getCartListThunk.fulfilled, (state, action) => {
      state.cartList.loading = false
      state.cartList.data = action.payload
    })
    builder.addCase(getCartListThunk.rejected, (state, action) => {
      state.cartList.loading = false
      state.cartList.error = action.payload
    })

    // Add to cart
    builder.addCase(addToCartThunk.pending, (state) => {
      state.addToCartData.loading = true
      state.addToCartData.error = null
    })
    builder.addCase(addToCartThunk.fulfilled, (state) => {
      state.addToCartData.loading = false
    })
    builder.addCase(addToCartThunk.rejected, (state, action) => {
      state.addToCartData.loading = false
      state.addToCartData.error = action.payload
    })

    // Đặt hàng thành công thì backend đã xóa giỏ -> frontend cũng làm rỗng giỏ
    builder.addCase(createOrderThunk.fulfilled, (state) => {
      state.cartList.data = []
    })

    // Đăng xuất thì xóa giỏ hàng của user cũ
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.cartList.data = []
    })
  },
})

export default cartSlice.reducer
