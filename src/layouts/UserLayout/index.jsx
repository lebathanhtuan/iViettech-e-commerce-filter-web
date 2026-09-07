import { Outlet, Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Space } from 'antd'

import { ROUTES } from '../../constants/routes'
import { logoutThunk } from '../../redux/thunks/auth.thunk'
import * as S from './styled'

function UserLayout() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: user } = useSelector((state) => state.auth.userInfo)

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
          <Space>
            <span>Xin chào, {user.name}</span>
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
