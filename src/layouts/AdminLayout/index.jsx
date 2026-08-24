import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom'
import { Menu, Button } from 'antd'
import { AppstoreOutlined, LogoutOutlined } from '@ant-design/icons'

import { ROUTES } from '../../constants/routes'
import * as S from './styled'

const menuItems = [
  {
    key: ROUTES.ADMIN.PRODUCT_LIST,
    icon: <AppstoreOutlined />,
    label: <Link to={ROUTES.ADMIN.PRODUCT_LIST}>Quản lý sản phẩm</Link>,
  },
]

function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    // TODO: Học viên tự implement - xóa thông tin đăng nhập (nếu có) rồi chuyển về trang login
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
          <span>Xin chào, Admin</span>
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
