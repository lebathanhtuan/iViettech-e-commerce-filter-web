export const ROUTES = {
  USER: {
    HOME: '/',
    PRODUCT_DETAIL: '/products/:id',
    LOGIN: '/login',
    REGISTER: '/register',
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: '/reset-password',
    // Các trang dưới đây cần đăng nhập
    CART: '/cart',
    CHECKOUT: '/checkout',
    CHECKOUT_SUCCESS: '/checkout/success/:code',
    PROFILE: '/profile',
  },
  ADMIN: {
    PRODUCT_LIST: '/admin/products',
    CREATE_PRODUCT: '/admin/products/create',
    UPDATE_PRODUCT: '/admin/products/:id/update',
    CHAT: '/admin/chat',
  },
}
