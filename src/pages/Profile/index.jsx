import { useSearchParams } from 'react-router-dom'
import { Tabs } from 'antd'

import ProfileInfo from './components/ProfileInfo'
import ChangePassword from './components/ChangePassword'
import OrderHistory from './components/OrderHistory'
import FavoriteList from './components/FavoriteList'
import AddressBook from './components/AddressBook'
import * as S from './styled'

const tabItems = [
  { key: 'info', label: 'Thông tin cá nhân', children: <ProfileInfo /> },
  { key: 'addresses', label: 'Sổ địa chỉ', children: <AddressBook /> },
  { key: 'password', label: 'Đổi mật khẩu', children: <ChangePassword /> },
  { key: 'orders', label: 'Lịch sử đơn hàng', children: <OrderHistory /> },
  { key: 'favorites', label: 'Sản phẩm yêu thích', children: <FavoriteList /> },
]

function Profile() {
  // Tab đang mở được lưu trên URL (vd: /profile?tab=orders) để có thể link thẳng tới từng tab
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'info'

  return (
    <S.Wrapper>
      <S.PageTitle>Tài khoản của tôi</S.PageTitle>
      <Tabs
        tabPlacement="start"
        activeKey={activeTab}
        onChange={(key) => setSearchParams({ tab: key })}
        items={tabItems}
        destroyOnHidden // Chỉ render tab đang mở -> mỗi lần mở tab mới gọi API của tab đó
      />
    </S.Wrapper>
  )
}

export default Profile
