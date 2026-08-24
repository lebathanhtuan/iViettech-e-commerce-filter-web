import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Form, Input, InputNumber, Select, Button, Space, message } from 'antd'

import {
  getProductDetail,
  updateProduct,
  getCategoryList,
} from '../../../services/productService'
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../../../constants/mockData'
import { ROUTES } from '../../../constants/routes'
import * as S from './styled'

function UpdateProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  // Dữ liệu mẫu để xem trước giao diện, khi có API sẽ được thay bằng dữ liệu thật
  const [categories, setCategories] = useState(MOCK_CATEGORIES)

  // Lấy danh sách category cho ô select
  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getCategoryList()
      if (data) setCategories(data)
    }
    fetchCategories()
  }, [])

  // Lấy thông tin sản phẩm hiện tại rồi điền sẵn vào form
  useEffect(() => {
    const fetchProduct = async () => {
      const data = await getProductDetail(id)
      // Khi chưa có API thì tạm lấy từ dữ liệu mẫu để xem giao diện
      const product =
        data || MOCK_PRODUCTS.find((item) => item.id === Number(id))
      if (!product) return
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
      })
    }
    fetchProduct()
  }, [id, form])

  const handleSubmit = async (values) => {
    // values có dạng: { name, price, categoryId }
    await updateProduct(id, values)
    message.success('Cập nhật sản phẩm thành công')
    navigate(ROUTES.ADMIN.PRODUCT_LIST)
  }

  return (
    <div>
      <S.PageTitle>Cập nhật sản phẩm</S.PageTitle>

      <S.FormWrapper>
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Tên sản phẩm"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            label="Giá"
            name="price"
            rules={[{ required: true, message: 'Vui lòng nhập giá sản phẩm' }]}
          >
            <InputNumber
              placeholder="Nhập giá sản phẩm"
              min={0}
              step={1000}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            />
          </Form.Item>

          <Form.Item
            label="Danh mục"
            name="categoryId"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select
              placeholder="Chọn danh mục"
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </Form.Item>

          <Space>
            <Button onClick={() => navigate(ROUTES.ADMIN.PRODUCT_LIST)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Cập nhật
            </Button>
          </Space>
        </Form>
      </S.FormWrapper>
    </div>
  )
}

export default UpdateProduct
