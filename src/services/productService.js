import api from './api'

/**
 * Lấy danh sách sản phẩm (dùng chung cho cả trang user và admin)
 *
 * API: GET /products
 * params gồm:
 *  - keyword: từ khóa tìm kiếm theo tên
 *  - categoryId: id của category cần lọc (rỗng = tất cả)
 *  - sort: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'
 *  - page: trang hiện tại
 *  - limit: số sản phẩm mỗi trang
 *
 * Kết quả trả về dạng: { data: [...danh sách sản phẩm], total: tổng số sản phẩm }
 */
export const getProductList = async (params) => {
  const response = await api.get('/products', { params })
  return response.data
}

/**
 * Lấy chi tiết 1 sản phẩm theo id
 *
 * API: GET /products/:id
 * Kết quả trả về: object sản phẩm { id, name, price, image, description, ... }
 */
export const getProductDetail = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

/**
 * Lấy danh sách category (dùng để render radio filter)
 *
 * API: GET /categories
 * Kết quả trả về: mảng category [{ id, name }, ...]
 */
export const getCategoryList = async () => {
  const response = await api.get('/categories')
  return response.data
}

/**
 * Tạo mới 1 sản phẩm
 *
 * API: POST /products
 * body: { name, price, categoryId }
 * Kết quả trả về: object sản phẩm vừa tạo
 */
export const createProduct = async (data) => {
  const response = await api.post('/products', data)
  return response.data
}

/**
 * Cập nhật 1 sản phẩm theo id
 *
 * API: PATCH /products/:id
 * body: { name, price, categoryId }
 * Kết quả trả về: object sản phẩm sau khi cập nhật
 */
export const updateProduct = async (id, data) => {
  const response = await api.patch(`/products/${id}`, data)
  return response.data
}

/**
 * Xóa 1 sản phẩm theo id
 *
 * API: DELETE /products/:id
 */
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}
