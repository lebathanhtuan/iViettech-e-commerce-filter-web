import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Table, Input, Select, Button, Space, Popconfirm, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'

import {
  getProductList,
  getCategoryList,
  deleteProduct,
} from '../../../services/productService'
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '../../../constants/mockData'
import { ROUTES } from '../../../constants/routes'
import * as S from './styled'

const PAGE_SIZE = 10

function AdminProductList() {
  const navigate = useNavigate()

  // Dữ liệu mẫu để xem trước giao diện, khi có API sẽ được thay bằng dữ liệu thật
  const [products, setProducts] = useState(MOCK_PRODUCTS)
  const [total, setTotal] = useState(MOCK_PRODUCTS.length)
  const [categories, setCategories] = useState(MOCK_CATEGORIES)

  // Các state điều khiển việc search / filter / sort / phân trang
  const [keyword, setKeyword] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [sort, setSort] = useState('')
  const [page, setPage] = useState(1)

  // Lấy danh sách category cho filter
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
        categoryId,
        sort,
        page,
        limit: PAGE_SIZE,
      })
      if (!result) return
      setProducts(result.data)
      setTotal(result.total)
    }
    fetchProducts()
  }, [keyword, categoryId, sort, page])

  const handleSearch = (value) => {
    setKeyword(value)
    setPage(1)
  }

  const handleChangeCategory = (value) => {
    // Khi bấm nút clear của Select thì value là undefined => coi như "tất cả"
    setCategoryId(value || '')
    setPage(1)
  }

  // Xử lý khi đổi trang hoặc bấm sort trên cột của Table
  const handleTableChange = (pagination, _filters, sorter) => {
    setPage(pagination.current)
    if (sorter.order) {
      const order = sorter.order === 'ascend' ? 'asc' : 'desc'
      setSort(`${sorter.field}_${order}`)
    } else {
      setSort('')
    }
  }

  const handleDeleteProduct = async (id) => {
    await deleteProduct(id)
    message.success('Xóa sản phẩm thành công')
    // Gọi lại API để lấy danh sách mới nhất
    const result = await getProductList({
      keyword,
      categoryId,
      sort,
      page,
      limit: PAGE_SIZE,
    })
    if (!result) return
    setProducts(result.data)
    setTotal(result.total)
  }

  const columns = [
    {
      title: 'Ảnh',
      dataIndex: 'image',
      render: (image, product) => (
        <S.ProductImage
          alt={product.name}
          src={image || 'https://placehold.co/60x60?text=P'}
        />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryName',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      sorter: true,
      render: (price) => `${price?.toLocaleString('vi-VN')} đ`,
    },
    {
      title: 'Hành động',
      render: (_, product) => (
        <Space>
          <Button
            size="small"
            onClick={() =>
              navigate(ROUTES.ADMIN.UPDATE_PRODUCT.replace(':id', product.id))
            }
          >
            Sửa
          </Button>
          <Popconfirm
            title="Xóa sản phẩm"
            description={`Bạn có chắc muốn xóa "${product.name}"?`}
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => handleDeleteProduct(product.id)}
          >
            <Button size="small" danger>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div>
      <S.PageTitle>Quản lý sản phẩm</S.PageTitle>

      <S.Toolbar>
        <Space>
          <Input.Search
            placeholder="Tìm kiếm sản phẩm..."
            onSearch={handleSearch}
            style={{ width: 300 }}
            allowClear
          />
          <Select
            placeholder="Lọc theo danh mục"
            value={categoryId || undefined}
            onChange={handleChangeCategory}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
            style={{ minWidth: 250 }}
            allowClear
          />
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate(ROUTES.ADMIN.CREATE_PRODUCT)}
        >
          Thêm sản phẩm
        </Button>
      </S.Toolbar>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={products}
        onChange={handleTableChange}
        pagination={{
          current: page,
          pageSize: PAGE_SIZE,
          total: total,
        }}
      />
    </div>
  )
}

export default AdminProductList
