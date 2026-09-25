import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Card, Button, Empty, message } from 'antd'
import { HeartFilled } from '@ant-design/icons'

import { deleteFavoriteThunk } from '../../../redux/thunks/favorite.thunk'
import { ROUTES } from '../../../constants/routes'
import * as S from '../styled'

function FavoriteList() {
  const dispatch = useDispatch()

  // Danh sách yêu thích đã được lấy ở UserLayout
  const { data: favorites } = useSelector((state) => state.favorite.favoriteList)

  const handleRemoveFavorite = async (productId) => {
    try {
      await dispatch(deleteFavoriteThunk(productId)).unwrap()
      message.success('Đã bỏ yêu thích')
    } catch (error) {
      message.error(error)
    }
  }

  if (favorites.length === 0) {
    return <Empty description="Chưa có sản phẩm yêu thích" />
  }

  return (
    <Row gutter={[16, 16]}>
      {favorites.map((product) => (
        <Col span={6} key={product.id}>
          <Card
            hoverable
            cover={
              <Link to={ROUTES.USER.PRODUCT_DETAIL.replace(':id', product.id)}>
                <img
                  alt={product.name}
                  src={product.image || 'https://placehold.co/300x300?text=Product'}
                  style={{ width: '100%' }}
                />
              </Link>
            }
            actions={[
              <Button
                key="remove"
                type="text"
                danger
                icon={<HeartFilled />}
                onClick={() => handleRemoveFavorite(product.id)}
              >
                Bỏ yêu thích
              </Button>,
            ]}
          >
            <S.ProductName>{product.name}</S.ProductName>
            <S.ProductPrice>{product.price.toLocaleString('vi-VN')} đ</S.ProductPrice>
          </Card>
        </Col>
      ))}
    </Row>
  )
}

export default FavoriteList
