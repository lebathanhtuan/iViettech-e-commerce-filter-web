import { Outlet, Link, Navigate, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Menu, Button } from 'antd'
import { AppstoreOutlined, LogoutOutlined, MessageOutlined } from '@ant-design/icons'

import { ROUTES } from '../../constants/routes'
import { logoutThunk } from '../../redux/thunks/auth.thunk'
import * as S from './styled'

const menuItems = [
  {
    key: ROUTES.ADMIN.PRODUCT_LIST,
    icon: <AppstoreOutlined />,
    label: <Link to={ROUTES.ADMIN.PRODUCT_LIST}>Quản lý sản phẩm</Link>,
  },
  {
    key: ROUTES.ADMIN.CHAT,
    icon: <MessageOutlined />,
    label: <Link to={ROUTES.ADMIN.CHAT}>Chat với khách hàng</Link>,
  },
]

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch()

  const { data: user } = useSelector((state) => state.auth.userInfo)
  const accessToken = localStorage.getItem('accessToken')

  // Chưa đăng nhập -> về trang login
  if (!accessToken) {
    return <Navigate to={ROUTES.USER.LOGIN} replace />
  }

  // Đã có thông tin user nhưng không phải admin -> về trang chủ
  if (user && user.role !== 'admin') {
    return <Navigate to={ROUTES.USER.HOME} replace />
  }

  const handleLogout = async () => {
    await dispatch(logoutThunk())
    navigate(ROUTES.USER.LOGIN)
  }

  return (
    <S.Wrapper>
      <S.Sidebar>
        <S.Logo>MyShop Admin</S.Logo>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </S.Sidebar>

      <S.Main>
        <S.Header>
          <span>Xin chào, {user?.name}</span>
          <Button icon={<LogoutOutlined />} onClick={handleLogout}>
            Đăng xuất
          </Button>
        </S.Header>

        <S.Content>
          <Outlet />
        </S.Content>
      </S.Main>
    </S.Wrapper>
  )
}

export default AdminLayout
