import { Outlet, Link } from 'react-router-dom'
import { Button, Space } from 'antd'

import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function UserLayout() {
  return (
    <S.Wrapper>
      <S.Header>
        <S.Logo to={ROUTES.USER.HOME}>MyShop</S.Logo>
        <Space>
          <Link to={ROUTES.USER.LOGIN}>
            <Button>Đăng nhập</Button>
          </Link>
          <Link to={ROUTES.USER.REGISTER}>
            <Button type="primary">Đăng ký</Button>
          </Link>
        </Space>
      </S.Header>

      <S.Content>
        <Outlet />
      </S.Content>

      <S.Footer>© 2026 MyShop - Bài tập thực hành React</S.Footer>
    </S.Wrapper>
  )
}

export default UserLayout
