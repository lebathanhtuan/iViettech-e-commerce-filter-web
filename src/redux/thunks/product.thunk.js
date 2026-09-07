import { createAsyncThunk } from '@reduxjs/toolkit'

import * as productService from '../../services/productService'

const getErrorMessage = (error) => error.response?.data?.message || 'Có lỗi xảy ra'

// ===== USER =====

// Lấy danh sách sản phẩm cho trang user
// params: { keyword, categoryId, sort, page, limit, more }
// more = true: đang bấm "Xem thêm" -> nối tiếp vào danh sách cũ thay vì thay mới
export const getProductListThunk = createAsyncThunk(
  'product/getProductList',
  async (params, { rejectWithValue }) => {
    try {
      const { more, ...queryParams } = params
      const result = await productService.getProductList(queryParams)
      return { ...result, more: more }
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Lấy chi tiết 1 sản phẩm
export const getProductDetailThunk = createAsyncThunk(
  'product/getProductDetail',
  async (id, { rejectWithValue }) => {
    try {
      const result = await productService.getProductDetail(id)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// ===== ADMIN =====

// Lấy danh sách sản phẩm cho trang admin
// params: { keyword, categoryId, sort, page, limit }
export const getAdminProductListThunk = createAsyncThunk(
  'product/getAdminProductList',
  async (params, { rejectWithValue }) => {
    try {
      const result = await productService.getAdminProductList(params)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Tạo sản phẩm - data: { name, price, categoryId, image, description }
export const createProductThunk = createAsyncThunk(
  'product/createProduct',
  async (data, { rejectWithValue }) => {
    try {
      const result = await productService.createProduct(data)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Cập nhật sản phẩm - payload: { id, data }
export const updateProductThunk = createAsyncThunk(
  'product/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const result = await productService.updateProduct(id, data)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// Xóa sản phẩm theo id
export const deleteProductThunk = createAsyncThunk(
  'product/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productService.deleteProduct(id)
      return id
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)
