import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Row, Col, Button, Empty } from 'antd'

import { getProductDetail } from '../../services/productService'
import * as S from './styled'

function ProductDetail() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)

  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductDetail(id)
      setProduct(data || null)
    }
    fetchProduct()
  }, [id])

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
