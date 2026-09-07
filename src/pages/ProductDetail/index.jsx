import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Row, Col, Button, Empty, Spin } from 'antd'

import { getProductDetailThunk } from '../../redux/thunks/product.thunk'
import * as S from './styled'

function ProductDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()

  const { data: product, loading } = useSelector((state) => state.product.productDetail)

  useEffect(() => {
    dispatch(getProductDetailThunk(id))
  }, [dispatch, id])

  if (loading) {
    return <Spin style={{ display: 'block', margin: '48px auto' }} />
  }

  if (!product) {
    return <Empty description="Không tìm thấy sản phẩm" />
  }

  return (
    <S.Wrapper>
      <Row gutter={32}>
        <Col span={10}>
          <S.ProductImage
            alt={product.name}
            src={product.image || 'https://placehold.co/500x500?text=Product'}
          />
        </Col>

        <Col span={14}>
          <S.ProductName>{product.name}</S.ProductName>
          <S.ProductPrice>
            {product.price?.toLocaleString('vi-VN')} đ
          </S.ProductPrice>
          <S.ProductDescription>
            {product.description || 'Chưa có mô tả cho sản phẩm này.'}
          </S.ProductDescription>
          <Button type="primary" size="large">
            Thêm vào giỏ hàng
          </Button>
        </Col>
      </Row>
    </S.Wrapper>
  )
}

export default ProductDetail
