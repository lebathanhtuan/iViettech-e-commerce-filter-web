import { createSlice } from '@reduxjs/toolkit'

import {
  getProductListThunk,
  getProductDetailThunk,
  getAdminProductListThunk,
  createProductThunk,
  updateProductThunk,
  deleteProductThunk,
} from '../thunks/product.thunk'

const initialState = {
  // Danh sách sản phẩm (dùng chung cho trang user và trang admin)
  productList: {
    data: [],
    // meta: thông tin phân trang do API trả về
    meta: {
      page: 1,
      limit: 0,
      total: 0,
      totalPages: 0,
    },
    loading: false,
    error: null,
  },
  // Chi tiết 1 sản phẩm
  productDetail: {
    data: null,
    loading: false,
    error: null,
  },
  createProductData: {
    loading: false,
    error: null,
  },
  updateProductData: {
    loading: false,
    error: null,
  },
  deleteProductData: {
    loading: false,
    error: null,
  },
}

const productSlice = createSlice({
  name: 'product',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Get product list (user)
    builder.addCase(getProductListThunk.pending, (state) => {
      state.productList.loading = true
      state.productList.error = null
    })
    builder.addCase(getProductListThunk.fulfilled, (state, action) => {
      const { data, meta, more } = action.payload
      state.productList.loading = false
      state.productList.meta = meta
      // more = true (bấm "Xem thêm"): nối tiếp vào danh sách cũ, ngược lại thay mới
      state.productList.data = more ? [...state.productList.data, ...data] : data
    })
    builder.addCase(getProductListThunk.rejected, (state, action) => {
      state.productList.loading = false
      state.productList.error = action.payload
    })

    // Get product detail
    builder.addCase(getProductDetailThunk.pending, (state) => {
      state.productDetail.loading = true
      state.productDetail.error = null
    })
    builder.addCase(getProductDetailThunk.fulfilled, (state, action) => {
      state.productDetail.loading = false
      state.productDetail.data = action.payload
    })
    builder.addCase(getProductDetailThunk.rejected, (state, action) => {
      state.productDetail.loading = false
      state.productDetail.error = action.payload
      state.productDetail.data = null
    })

    // Get product list (admin)
    builder.addCase(getAdminProductListThunk.pending, (state) => {
      state.productList.loading = true
      state.productList.error = null
    })
    builder.addCase(getAdminProductListThunk.fulfilled, (state, action) => {
      state.productList.loading = false
      state.productList.data = action.payload.data
      state.productList.meta = action.payload.meta
    })
    builder.addCase(getAdminProductListThunk.rejected, (state, action) => {
      state.productList.loading = false
      state.productList.error = action.payload
    })

    // Create product
    builder.addCase(createProductThunk.pending, (state) => {
      state.createProductData.loading = true
      state.createProductData.error = null
    })
    builder.addCase(createProductThunk.fulfilled, (state) => {
      state.createProductData.loading = false
    })
    builder.addCase(createProductThunk.rejected, (state, action) => {
      state.createProductData.loading = false
      state.createProductData.error = action.payload
    })

    // Update product
    builder.addCase(updateProductThunk.pending, (state) => {
      state.updateProductData.loading = true
      state.updateProductData.error = null
    })
    builder.addCase(updateProductThunk.fulfilled, (state) => {
      state.updateProductData.loading = false
    })
    builder.addCase(updateProductThunk.rejected, (state, action) => {
      state.updateProductData.loading = false
      state.updateProductData.error = action.payload
    })

    // Delete product
    builder.addCase(deleteProductThunk.pending, (state) => {
      state.deleteProductData.loading = true
      state.deleteProductData.error = null
    })
    builder.addCase(deleteProductThunk.fulfilled, (state) => {
      state.deleteProductData.loading = false
    })
    builder.addCase(deleteProductThunk.rejected, (state, action) => {
      state.deleteProductData.loading = false
      state.deleteProductData.error = action.payload
    })
  },
})

export default productSlice.reducer
