import { Routes, Route } from 'react-router-dom'

import { ROUTES } from './constants/routes'
import UserLayout from './layouts/UserLayout'
import AdminLayout from './layouts/AdminLayout'

import Login from './pages/Login'
import Register from './pages/Register'
import ProductList from './pages/ProductList'
import ProductDetail from './pages/ProductDetail'
import AdminProductList from './pages/admin/ProductList'
import AdminCreateProduct from './pages/admin/CreateProduct'
import AdminUpdateProduct from './pages/admin/UpdateProduct'

function App() {
  return (
    <Routes>
      {/* Các trang dành cho user */}
      <Route element={<UserLayout />}>
        <Route path={ROUTES.USER.HOME} element={<ProductList />} />
        <Route path={ROUTES.USER.PRODUCT_DETAIL} element={<ProductDetail />} />
        <Route path={ROUTES.USER.LOGIN} element={<Login />} />
        <Route path={ROUTES.USER.REGISTER} element={<Register />} />
      </Route>

      {/* Các trang dành cho admin */}
      <Route element={<AdminLayout />}>
        <Route path={ROUTES.ADMIN.PRODUCT_LIST} element={<AdminProductList />} />
        <Route path={ROUTES.ADMIN.CREATE_PRODUCT} element={<AdminCreateProduct />} />
        <Route path={ROUTES.ADMIN.UPDATE_PRODUCT} element={<AdminUpdateProduct />} />
      </Route>
    </Routes>
  )
}

export default App
