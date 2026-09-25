import { Navigate, Outlet } from 'react-router-dom'

import { ROUTES } from '../../constants/routes'

// Bọc các trang cần đăng nhập (giỏ hàng, checkout, profile...)
// Chưa có token -> chuyển về trang login, có rồi -> render trang con qua <Outlet />
function PrivateLayout() {
  const accessToken = localStorage.getItem('accessToken')

  if (!accessToken) {
    return <Navigate to={ROUTES.USER.LOGIN} replace />
  }

  return <Outlet />
}

export default PrivateLayout
