import api from './api'

/**
 * Lấy danh sách sản phẩm cho trang USER (không cần đăng nhập)
 *
 * API: GET /products
 * params gồm:
 *  - keyword: từ khóa tìm kiếm theo tên
 *  - categoryId: id của category cần lọc (rỗng = tất cả)
 *  - sort: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'
 *  - page: trang hiện tại
 *  - limit: số sản phẩm mỗi trang
 *
 * Kết quả trả về dạng:
 *  {
 *    data: [...danh sách sản phẩm của trang hiện tại],
 *    meta: { page, limit, total, totalPages } // thông tin phân trang
 *  }
 */
export const getProductList = async (params) => {
  const response = await api.get('/products', { params })
  return response.data
}

/**
 * Lấy chi tiết 1 sản phẩm theo id
 *
 * API: GET /products/:id
 * Kết quả trả về: object sản phẩm { id, name, price, image, description, categoryId, categoryName }
 */
export const getProductDetail = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

/**
 * Lấy danh sách category (dùng để render radio filter / select)
 *
 * API: GET /categories
 * Kết quả trả về: mảng category [{ id, name }, ...]
 */
export const getCategoryList = async () => {
  const response = await api.get('/categories')
  return response.data
}

// ===== Các API dưới đây dành cho ADMIN (cần access token + role admin) =====

/**
 * Lấy danh sách sản phẩm cho trang ADMIN
 *
 * API: GET /admin/products - params giống getProductList
 * Kết quả trả về dạng: { data: [...], meta: { page, limit, total, totalPages } }
 */
export const getAdminProductList = async (params) => {
  const response = await api.get('/admin/products', { params })
  return response.data
}

/**
 * Tạo mới 1 sản phẩm
 *
 * API: POST /admin/products
 * data là FormData gồm: name, price, categoryId, description, image (file)
 * Gửi FormData thì axios tự set Content-Type: multipart/form-data, không cần set tay
 */
export const createProduct = async (data) => {
  const response = await api.post('/admin/products', data)
  return response.data
}

/**
 * Cập nhật 1 sản phẩm theo id
 *
 * API: PATCH /admin/products/:id
 * data là FormData giống createProduct, không gửi image thì backend giữ ảnh cũ
 */
export const updateProduct = async (id, data) => {
  const response = await api.patch(`/admin/products/${id}`, data)
  return response.data
}

/**
 * Xóa 1 sản phẩm theo id
 *
 * API: DELETE /admin/products/:id
 */
export const deleteProduct = async (id) => {
  const response = await api.delete(`/admin/products/${id}`)
  return response.data
}
