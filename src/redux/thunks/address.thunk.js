import { createAsyncThunk } from '@reduxjs/toolkit'
import * as addressService from '../../services/addressService'

const getErrorMessage = (error) => error.response?.data?.message || 'Không thể tải hoặc lưu địa chỉ'

export const getAddressListThunk = createAsyncThunk('address/getList', async (_, { rejectWithValue }) => {
  try {
    return await addressService.getAddresses()
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

// Sau mỗi thao tác, lấy lại danh sách để cập nhật cả địa chỉ mặc định.
const createMutation = (name, operation) => createAsyncThunk(name, async (data, { dispatch, rejectWithValue }) => {
  try {
    const result = await operation(data)
    await dispatch(getAddressListThunk())
    return result
  } catch (error) {
    return rejectWithValue(getErrorMessage(error))
  }
})

export const createAddressThunk = createMutation('address/create', addressService.createAddress)
export const updateAddressThunk = createMutation('address/update', addressService.updateAddress)
export const deleteAddressThunk = createMutation('address/delete', addressService.deleteAddress)
export const setDefaultAddressThunk = createMutation('address/setDefault', addressService.setDefaultAddress)
