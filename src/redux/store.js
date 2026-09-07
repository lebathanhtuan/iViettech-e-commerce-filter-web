import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/auth.slice'
import categoryReducer from './slices/category.slice'
import productReducer from './slices/product.slice'

// Store tổng của toàn app, mỗi slice quản lý 1 phần state
// Dùng trong component: useSelector((state) => state.product.productList)
const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
  },
})

export default store
