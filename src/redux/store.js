import { configureStore } from '@reduxjs/toolkit'

import authReducer from './slices/auth.slice'
import categoryReducer from './slices/category.slice'
import productReducer from './slices/product.slice'
import cartReducer from './slices/cart.slice'
import orderReducer from './slices/order.slice'
import reviewReducer from './slices/review.slice'
import favoriteReducer from './slices/favorite.slice'
import chatReducer from './slices/chat.slice'

// Store tổng của toàn app, mỗi slice quản lý 1 phần state
// Dùng trong component: useSelector((state) => state.product.productList)
const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    review: reviewReducer,
    favorite: favoriteReducer,
    chat: chatReducer,
  },
})

export default store
