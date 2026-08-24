import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Input, Checkbox, Select, Button, Row, Col, Card, Empty } from 'antd'

import { getProductList, getCategoryList } from '../../services/productService'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../constants/mockData'
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
  // Dữ liệu mẫu để xem trước giao diện, khi có API sẽ được thay bằng dữ liệu thật
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [total, setTotal] = useState(MOCK_PRODUCTS.length)
  const [categories, setCategories] = useState(MOCK_CATEGORIES)

  // Các state điều khiển việc search / filter / sort / phân trang
  const [keyword, setKeyword] = useState('')
  const [categoryIds, setCategoryIds] = useState([])
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)

  // Lấy danh sách category để render checkbox filter
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategoryList()
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  // Lấy danh sách sản phẩm mỗi khi keyword / filter / sort / page thay đổi
  useEffect(() => {
    const fetchProducts = async () => {
      const result = await getProductList({
        keyword,
        categoryIds,
        sort,
        page,
        limit: PAGE_SIZE,
      })
      if (!result) return
      setTotal(result.total)
      if (page === 1) {
        // Trang đầu: thay mới danh sách
        setProducts(result.data)
      } else {
        // Bấm "Xem thêm": nối tiếp vào danh sách cũ
        setProducts((prev) => [...prev, ...result.data])
      }
    }
    fetchProducts()
  }, [keyword, categoryIds, sort, page])

  const handleSearch = (value) => {
    setKeyword(value)
    setPage(1)
  }

  const handleChangeCategories = (values) => {
    setCategoryIds(values)
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
          <Checkbox.Group
            value={categoryIds}
            onChange={handleChangeCategories}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
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

        {products.length === 0 ? (
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
            <Button onClick={handleShowMore}>Xem thêm</Button>
          </S.ShowMoreWrapper>
        )}
      </Col>
    </Row>
  )
}

export default ProductList
