import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, InputNumber, Select, Button, Space, message } from 'antd'

import { createProductThunk } from '../../../redux/thunks/product.thunk'
import { getCategoryListThunk } from '../../../redux/thunks/category.thunk'
import { ROUTES } from '../../../constants/routes'
import * as S from './styled'

function CreateProduct() {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { data: categories } = useSelector((state) => state.category.categoryList)
  const { loading } = useSelector((state) => state.product.createProductData)

  // Lấy danh sách category cho ô select
  useEffect(() => {
    dispatch(getCategoryListThunk())
  }, [dispatch])

  const handleSubmit = async (values) => {
    // values có dạng: { name, price, categoryId, image, description }
    try {
      await dispatch(createProductThunk(values)).unwrap()
      message.success('Tạo sản phẩm thành công')
      navigate(ROUTES.ADMIN.PRODUCT_LIST)
    } catch (error) {
      message.error(error)
    }
  }

  return (
    <div>
      <S.PageTitle>Thêm sản phẩm</S.PageTitle>

      <S.FormWrapper>
        <Form layout="vertical" onFinish={handleSubmit}>
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

          <Form.Item label="Link ảnh" name="image">
            <Input placeholder="https://..." />
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Space>
            <Button onClick={() => navigate(ROUTES.ADMIN.PRODUCT_LIST)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo sản phẩm
            </Button>
          </Space>
        </Form>
      </S.FormWrapper>
    </div>
  )
}

export default CreateProduct
