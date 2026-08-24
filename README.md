# Bài tập: E-commerce Product Filter

Project bài tập React mô phỏng một trang thương mại điện tử đơn giản. UI đã được dựng sẵn, nhiệm vụ của học viên là **implement các hàm gọi API** trong thư mục `src/services/`.

## Cách chạy

```bash
npm install
npm run dev
```

## Công nghệ sử dụng

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Ant Design](https://ant.design/) - thư viện UI component
- [react-router-dom](https://reactrouter.com/) - routing
- [axios](https://axios-http.com/) - gọi API
- [styled-components](https://styled-components.com/) - viết CSS trong JS

## Các trang

| Đường dẫn | Trang | Chức năng |
| --- | --- | --- |
| `/login` | Đăng nhập | Form đăng nhập |
| `/register` | Đăng ký | Form đăng ký |
| `/` | Danh sách sản phẩm | Search, filter theo category (checkbox), sort theo tên/giá, phân trang kiểu "Xem thêm" |
| `/products/:id` | Chi tiết sản phẩm | Hiển thị thông tin 1 sản phẩm |
| `/admin/products` | Admin - Quản lý sản phẩm | Search, filter theo category, sort theo tên/giá, phân trang kiểu pagination |

## Cấu trúc thư mục

```
src/
├── App.jsx                # Khai báo routes
├── layouts/
│   ├── UserLayout/        # Header + Footer cho trang user
│   └── AdminLayout/       # Sidebar + Header cho trang admin
├── pages/
│   ├── Login/
│   ├── Register/
│   ├── ProductList/
│   ├── ProductDetail/
│   └── admin/
│       └── ProductList/
└── services/              # ⭐ NƠI HỌC VIÊN LÀM BÀI TẬP
    ├── api.js             # Axios instance dùng chung
    ├── authService.js     # login, register
    └── productService.js  # getProductList, getProductDetail, getCategoryList
```

> Mỗi page là 1 thư mục gồm `index.jsx` (component) và `styled.jsx` (styled-components), được import theo kiểu `import * as S from './styled'`.

## Bài tập: Các API cần implement

Tất cả các hàm dưới đây đang để trống (có comment `TODO`), học viên tự hoàn thiện:

| Hàm | File | API |
| --- | --- | --- |
| `getProductList(params)` | `services/productService.js` | `GET /products` — dùng chung cho user và admin |
| `getProductDetail(id)` | `services/productService.js` | `GET /products/:id` |
| `getCategoryList()` | `services/productService.js` | `GET /categories` |
| `login(data)` | `services/authService.js` | `POST /login` |
| `register(data)` | `services/authService.js` | `POST /register` |

### Lưu ý về `getProductList`

Hàm nhận vào object `params`:

```js
{
  keyword: '',        // từ khóa tìm kiếm theo tên
  categoryIds: [],    // mảng id category cần lọc
  sort: '',           // 'name_asc' | 'name_desc' | 'price_asc' | 'price_desc'
  page: 1,            // trang hiện tại
  limit: 8,           // số sản phẩm mỗi trang
}
```

Và cần trả về kết quả dạng:

```js
{
  data: [...],  // danh sách sản phẩm của trang hiện tại
  total: 100,   // tổng số sản phẩm (để tính phân trang / nút "Xem thêm")
}
```

Ngoài ra học viên cũng tự xử lý kết quả sau khi gọi API ở các chỗ có `TODO` trong `pages/Login`, `pages/Register` và nút Đăng xuất trong `layouts/AdminLayout`.
