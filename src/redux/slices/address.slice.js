import { createSlice } from '@reduxjs/toolkit'
import { loginThunk, logoutThunk, resetPasswordThunk } from '../thunks/auth.thunk'
import { getAddressListThunk, createAddressThunk, updateAddressThunk, deleteAddressThunk, setDefaultAddressThunk } from '../thunks/address.thunk'

const initialState = {
  addressList: { data: [], loading: false, error: null, requestId: null },
  mutation: { loading: false },
}

const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAddressListThunk.pending, (state, action) => {
      state.addressList.loading = true
      state.addressList.error = null
      state.addressList.requestId = action.meta.requestId
    })
    builder.addCase(getAddressListThunk.fulfilled, (state, action) => {
      if (state.addressList.requestId !== action.meta.requestId) return
      state.addressList.loading = false
      state.addressList.data = action.payload
    })
    builder.addCase(getAddressListThunk.rejected, (state, action) => {
      if (state.addressList.requestId !== action.meta.requestId) return
      state.addressList.loading = false
      state.addressList.error = action.payload
    })
    builder.addCase(loginThunk.fulfilled, () => initialState)
    builder.addCase(logoutThunk.fulfilled, () => initialState)
    builder.addCase(resetPasswordThunk.fulfilled, () => initialState)
    for (const thunk of [createAddressThunk, updateAddressThunk, deleteAddressThunk, setDefaultAddressThunk]) {
      builder.addCase(thunk.pending, (state) => { state.mutation.loading = true })
      builder.addCase(thunk.fulfilled, (state) => { state.mutation.loading = false })
      builder.addCase(thunk.rejected, (state) => { state.mutation.loading = false })
    }
  },
})

export default addressSlice.reducer
