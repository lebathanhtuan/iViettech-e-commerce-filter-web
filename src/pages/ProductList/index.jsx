import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
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
  // meta chứa thông tin phân trang: { page, limit, total, totalPages }
  const { data: products, meta, loading } = useSelector((state) => state.product.productList)
  const { data: categories } = useSelector((state) => state.category.categoryList)

  // Các filter được lưu trên URL, vd: /?keyword=mac&categoryId=1&sort=price_asc
  // -> F5 hoặc gửi link cho người khác vẫn giữ nguyên bộ lọc
  const [searchParams, setSearchParams] = useSearchParams()
  const keyword = searchParams.get('keyword') || ''
  // category.id là số, còn giá trị trên URL là chuỗi -> đổi sang số để Radio so sánh đúng
  const categoryId = Number(searchParams.get('categoryId')) || ''
  const sort = searchParams.get('sort') || ''

  // Lấy danh sách category để render radio filter
  useEffect(() => {
    dispatch(getCategoryListThunk())
  }, [dispatch])

  // Mỗi khi filter trên URL thay đổi -> lấy lại danh sách từ trang 1
  useEffect(() => {
    dispatch(getProductListThunk({ keyword, categoryId, sort, page: 1, limit: PAGE_SIZE }))
  }, [dispatch, keyword, categoryId, sort])

  // Cập nhật 1 filter lên URL (giữ nguyên các filter khác), giá trị rỗng thì xóa khỏi URL
  const updateFilter = (key, value) => {
    const newSearchParams = new URLSearchParams(searchParams)
    if (value) {
      newSearchParams.set(key, value)
    } else {
      newSearchParams.delete(key)
    }
    setSearchParams(newSearchParams)
  }

  const handleSearch = (value) => {
    updateFilter('keyword', value.trim())
  }

  const handleChangeCategory = (e) => {
    updateFilter('categoryId', e.target.value)
  }

  const handleChangeSort = (value) => {
    updateFilter('sort', value)
  }

  // "Xem thêm": lấy trang tiếp theo (meta.page + 1) và nối tiếp vào danh sách cũ
  const handleShowMore = () => {
    dispatch(
      getProductListThunk({
        keyword,
        categoryId,
        sort,
        page: meta.page + 1,
        limit: PAGE_SIZE,
        more: true,
      })
    )
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
            defaultValue={keyword}
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

        {/* Chỉ hiện nút "Xem thêm" khi trang hiện tại chưa phải trang cuối */}
        {meta.page < meta.totalPages && (
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
