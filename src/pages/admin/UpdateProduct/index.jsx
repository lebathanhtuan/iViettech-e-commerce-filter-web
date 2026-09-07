import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, InputNumber, Select, Button, Space, Upload, message } from 'antd'
import { UploadOutlined } from '@ant-design/icons'

import {
  getProductDetailThunk,
  updateProductThunk,
} from '../../../redux/thunks/product.thunk'
import { getCategoryListThunk } from '../../../redux/thunks/category.thunk'
import { ROUTES } from '../../../constants/routes'
import * as S from './styled'

function UpdateProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [form] = Form.useForm()

  const { data: categories } = useSelector((state) => state.category.categoryList)
  const { data: product } = useSelector((state) => state.product.productDetail)
  const { loading } = useSelector((state) => state.product.updateProductData)

  // Lấy danh sách category cho ô select + thông tin sản phẩm hiện tại
  useEffect(() => {
    dispatch(getCategoryListThunk())
    dispatch(getProductDetailThunk(id))
  }, [dispatch, id])

  // Khi có dữ liệu sản phẩm thì điền sẵn vào form
  useEffect(() => {
    if (product && product.id === Number(id)) {
      form.setFieldsValue({
        name: product.name,
        price: product.price,
        categoryId: product.categoryId,
        description: product.description,
        // Ảnh cũ hiển thị trong Upload dưới dạng 1 item có url (không có originFileObj)
        image: product.image ? [{ uid: '-1', name: 'Ảnh hiện tại', url: product.image }] : [],
      })
    }
  }, [product, id, form])

  const handleSubmit = async (values) => {
    // values có dạng: { name, price, categoryId, description, image: [fileList] }
    const formData = new FormData()
    formData.append('name', values.name)
    formData.append('price', values.price)
    formData.append('categoryId', values.categoryId)
    formData.append('description', values.description || '')

    // Chỉ gửi ảnh khi người dùng chọn file mới (có originFileObj)
    // Ảnh cũ chỉ có url -> không gửi -> backend giữ ảnh cũ
    if (values.image?.[0]?.originFileObj) {
      formData.append('image', values.image[0].originFileObj)
    }

    try {
      await dispatch(updateProductThunk({ id: id, data: formData })).unwrap()
      message.success('Cập nhật sản phẩm thành công')
      navigate(ROUTES.ADMIN.PRODUCT_LIST)
    } catch (error) {
      message.error(error)
    }
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

          {/* valuePropName + getValueFromEvent: để Form lưu fileList của Upload */}
          <Form.Item
            label="Ảnh sản phẩm"
            name="image"
            valuePropName="fileList"
            getValueFromEvent={(e) => e.fileList}
          >
            <Upload
              listType="picture"
              maxCount={1}
              accept="image/jpeg,image/png,image/webp"
              beforeUpload={() => false} // Không tự upload, chỉ giữ file lại để gửi cùng form
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh mới</Button>
            </Upload>
          </Form.Item>

          <Form.Item label="Mô tả" name="description">
            <Input.TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Space>
            <Button onClick={() => navigate(ROUTES.ADMIN.PRODUCT_LIST)}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit" loading={loading}>
              Cập nhật
            </Button>
          </Space>
        </Form>
      </S.FormWrapper>
    </div>
  )
}

export default UpdateProduct
