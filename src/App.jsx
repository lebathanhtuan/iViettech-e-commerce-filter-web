import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import { useDispatch } from 'react-redux'

import { ROUTES } from './constants/routes'
import { getMyProfileThunk } from './redux/thunks/auth.thunk'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'
import PrivateLayout from './layouts/PrivateLayout'

import Login from './pages/Login'
import Register from './pages/Register'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Profile from './pages/Profile'
import AdminProductList from './pages/admin/ProductList'
import AdminCreateProduct from './pages/admin/CreateProduct'
import AdminUpdateProduct from './pages/admin/UpdateProduct'

function App() {
  const dispatch = useDispatch()

  // Khi mở lại trang: nếu đã có token trong localStorage thì lấy lại thông tin user
  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken')
    if (accessToken) {
      dispatch(getMyProfileThunk())
    }
  }, [dispatch])

  return (
    <Routes>
      {/* Các trang dành cho user */}
      <Route element={<UserLayout />}>
        <Route path={ROUTES.USER.HOME} element={<ProductList />} />
        <Route path={ROUTES.USER.PRODUCT_DETAIL} element={<ProductDetail />} />
        <Route path={ROUTES.USER.LOGIN} element={<Login />} />
        <Route path={ROUTES.USER.REGISTER} element={<Register />} />

        {/* Các trang cần đăng nhập */}
        <Route element={<PrivateLayout />}>
          <Route path={ROUTES.USER.CART} element={<Cart />} />
          <Route path={ROUTES.USER.CHECKOUT} element={<Checkout />} />
          <Route path={ROUTES.USER.CHECKOUT_SUCCESS} element={<CheckoutSuccess />} />
          <Route path={ROUTES.USER.PROFILE} element={<Profile />} />
        </Route>
      </Route>

      {/* Các trang dành cho admin (AdminLayout sẽ kiểm tra đăng nhập + role) */}
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.ADMIN.PRODUCT_LIST} element={<AdminProductList />} />
        <Route path={ROUTES.ADMIN.CREATE_PRODUCT} element={<AdminCreateProduct />} />
        <Route path={ROUTES.ADMIN.UPDATE_PRODUCT} element={<AdminUpdateProduct />} />
      </Route>
    </Routes>
  )
}

export default App
