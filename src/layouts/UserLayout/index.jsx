import { useEffect } from 'react'
import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Badge, Button, Space } from 'antd'
import { ShoppingCartOutlined, UserOutlined } from '@ant-design/icons'

import { ROUTES } from '../../constants/routes'
import { logoutThunk } from '../../redux/thunks/auth.thunk'
import { getCartListThunk } from '../../redux/thunks/cart.thunk'
import { getFavoriteListThunk } from '../../redux/thunks/favorite.thunk'
import * as S from './styled'

function UserLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: user } = useSelector((state) => state.auth.userInfo)
  const { data: cartItems } = useSelector((state) => state.cart.cartList)

  const userId = user?.id

  // Có thông tin user (vừa đăng nhập / mở lại trang) -> lấy giỏ hàng + danh sách yêu thích
  useEffect(() => {
    if (userId) {
      dispatch(getCartListThunk())
      dispatch(getFavoriteListThunk())
    }
  }, [dispatch, userId])

  const handleLogout = async () => {
    await dispatch(logoutThunk())
    navigate(ROUTES.USER.HOME)
  }

  return (
    <S.Wrapper>
      <S.Header>
        <S.Logo to={ROUTES.USER.HOME}>MyShop</S.Logo>

        {user ? (
          // Đã đăng nhập
          <Space size="middle">
            <Link to={ROUTES.USER.CART}>
              {/* Số trên icon = số loại sản phẩm trong giỏ (không phải tổng quantity) */}
              <Badge count={cartItems.length} size="small">
                <ShoppingCartOutlined style={{ fontSize: 24 }} />
              </Badge>
            </Link>
            <Link to={ROUTES.USER.PROFILE}>
              <Space>
                <Avatar src={user.avatar} icon={<UserOutlined />} />
                <span>{user.name}</span>
              </Space>
            </Link>
            {user.role === 'admin' && (
              <Link to={ROUTES.ADMIN.PRODUCT_LIST}>
                <Button>Trang quản trị</Button>
              </Link>
            )}
            <Button onClick={handleLogout}>Đăng xuất</Button>
          </Space>
        ) : (
          // Chưa đăng nhập
          <Space>
            <Link to={ROUTES.USER.LOGIN}>
              <Button>Đăng nhập</Button>
            </Link>
            <Link to={ROUTES.USER.REGISTER}>
              <Button type="primary">Đăng ký</Button>
            </Link>
          </Space>
        )}
      </S.Header>

      <S.Content>
        <Outlet />
      </S.Content>

      <S.Footer>© 2026 MyShop - Bài tập thực hành React</S.Footer>
    </S.Wrapper>
  )
}

export default UserLayout
