import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Input, Radio, Select, Button, Row, Col, Card, Empty } from 'antd'

import { getProductListThunk } from '../../redux/thunks/product.thunk'
import { getCategoryListThunk } from '../../redux/thunks/category.thunk'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

const PAGE_SIZE = 8

const sortOptions = [
  { value: '', label: 'Mặc định' },
  { value: 'name_asc', label: 'Tên: A → Z' },
  { value: 'name_desc', label: 'Tên: Z → A' },
  { value: 'price_asc', label: 'Giá: Thấp → Cao' },
  { value: 'price_desc', label: 'Giá: Cao → Thấp' },
]

function ProductList() {
  const dispatch = useDispatch()

  // Lấy dữ liệu từ redux store
  const { data: products, total, loading } = useSelector((state) => state.product.productList)
  const { data: categories } = useSelector((state) => state.category.categoryList)

  // Các state điều khiển việc search / filter / sort / phân trang
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)

  // Lấy danh sách category để render radio filter
  useEffect(() => {
    dispatch(getCategoryListThunk())
  }, [dispatch])

  // Lấy danh sách sản phẩm mỗi khi keyword / filter / sort / page thay đổi
  useEffect(() => {
    dispatch(
      getProductListThunk({
        keyword,
        categoryId,
        sort,
        page,
        limit: PAGE_SIZE,
        more: page > 1, // trang > 1 nghĩa là đang bấm "Xem thêm" -> nối tiếp danh sách
      })
    )
  }, [dispatch, keyword, categoryId, sort, page])

  const handleSearch = (value) => {
    setKeyword(value)
    setPage(1)
  }

  const handleChangeCategory = (e) => {
    setCategoryId(e.target.value)
    setPage(1)
  }

  const handleChangeSort = (value) => {
    setSort(value)
    setPage(1)
  }

  const handleShowMore = () => {
    setPage(page + 1)
  }

  return (
    <Row gutter={24}>
      {/* Cột trái: bộ lọc */}
      <Col span={6}>
        <S.FilterBox>
          <S.FilterTitle>Danh mục</S.FilterTitle>
          <Radio.Group
            value={categoryId}
            onChange={handleChangeCategory}
            options={[
              { label: 'Tất cả', value: '' },
              ...categories.map((category) => ({
                label: category.name,
                value: category.id,
              })),
            ]}
            style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
          />
        </S.FilterBox>
      </Col>

      {/* Cột phải: danh sách sản phẩm */}
      <Col span={18}>
        <S.Toolbar>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            onSearch={handleSearch}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            value={sort}
            onChange={handleChangeSort}
            options={sortOptions}
            style={{ width: 200 }}
          />
        </S.Toolbar>

        {products.length === 0 && !loading ? (
          <Empty description="Chưa có sản phẩm nào" />
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col span={6} key={product.id}>
                <Link to={ROUTES.USER.PRODUCT_DETAIL.replace(':id', product.id)}>
                  <Card
                    hoverable
                    cover={
                      <img
                        alt={product.name}
                        src={product.image || 'https://placehold.co/300x300?text=Product'}
                      />
                    }
                  >
                    <S.ProductName>{product.name}</S.ProductName>
                    <S.ProductPrice>
                      {product.price?.toLocaleString('vi-VN')} đ
                    </S.ProductPrice>
                  </Card>
                </Link>
              </Col>
            ))}
          </Row>
        )}

        {/* Chỉ hiện nút "Xem thêm" khi còn sản phẩm chưa load hết */}
        {products.length < total && (
          <S.ShowMoreWrapper>
            <Button onClick={handleShowMore} loading={loading}>
              Xem thêm
            </Button>
          </S.ShowMoreWrapper>
        )}
      </Col>
    </Row>
  )
}

export default ProductList
