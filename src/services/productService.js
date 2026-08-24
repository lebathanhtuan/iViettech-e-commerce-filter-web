// eslint-disable-next-line no-unused-vars
import api from './api'

/**
 * [BÀI TẬP] Lấy danh sách sản phẩm (dùng chung cho cả trang user và admin)
 *
 * API: GET /products
 * params gồm:
 *  - keyword: từ khóa tìm kiếm theo tên
 *  - categoryId: id của category cần lọc (rỗng = tất cả)
 *  - sort: 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'
 *  - page: trang hiện tại
 *  - limit: số sản phẩm mỗi trang
 *
 * Kết quả cần trả về dạng: { data: [...danh sách sản phẩm], total: tổng số sản phẩm }
 */
// eslint-disable-next-line no-unused-vars
export const getProductList = async (params) => {
  // TODO: Học viên tự implement - gọi API lấy danh sách sản phẩm
}

/**
 * [BÀI TẬP] Lấy chi tiết 1 sản phẩm theo id
 *
 * API: GET /products/:id
 * Kết quả cần trả về: object sản phẩm { id, name, price, image, description, ... }
 */
// eslint-disable-next-line no-unused-vars
export const getProductDetail = async (id) => {
  // TODO: Học viên tự implement - gọi API lấy chi tiết sản phẩm
}

/**
 * [BÀI TẬP] Lấy danh sách category (dùng để render radio filter)
 *
 * API: GET /categories
 * Kết quả cần trả về: mảng category [{ id, name }, ...]
 */
export const getCategoryList = async () => {
  // TODO: Học viên tự implement - gọi API lấy danh sách category
}

/**
 * [BÀI TẬP] Tạo mới 1 sản phẩm
 *
 * API: POST /products
 * body: { name, price, categoryId }
 * Kết quả cần trả về: object sản phẩm vừa tạo
 */
// eslint-disable-next-line no-unused-vars
export const createProduct = async (data) => {
  // TODO: Học viên tự implement - gọi API tạo sản phẩm
}

/**
 * [BÀI TẬP] Cập nhật 1 sản phẩm theo id
 *
 * API: PATCH /products/:id
 * body: { name, price, categoryId }
 * Kết quả cần trả về: object sản phẩm sau khi cập nhật
 */
// eslint-disable-next-line no-unused-vars
export const updateProduct = async (id, data) => {
  // TODO: Học viên tự implement - gọi API cập nhật sản phẩm
}

/**
 * [BÀI TẬP] Xóa 1 sản phẩm theo id
 *
 * API: DELETE /products/:id
 */
// eslint-disable-next-line no-unused-vars
export const deleteProduct = async (id) => {
  // TODO: Học viên tự implement - gọi API xóa sản phẩm
}
