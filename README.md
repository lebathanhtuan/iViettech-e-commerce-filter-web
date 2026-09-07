# Bài tập: E-commerce Product Filter

Project React mô phỏng một trang thương mại điện tử đơn giản: xem / tìm kiếm / lọc sản phẩm cho user và CRUD sản phẩm cho admin. Backend nằm ở project `e-commerce-filter-api`.

## Cách chạy

```bash
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:3000
npm run dev
```

Tài khoản admin mẫu: `admin@example.com` / `123456`. Tài khoản đăng ký mới luôn có role `user`.

## Công nghệ sử dụng

- [React](https://react.dev/) + [Vite](https://vite.dev/)
- [Ant Design](https://ant.design/) - thư viện UI component
- [react-router-dom](https://reactrouter.com/) - routing
- [axios](https://axios-http.com/) - gọi API (interceptor gắn token + tự refresh token)
- [Redux Toolkit](https://redux-toolkit.js.org/) + [react-redux](https://react-redux.js.org/) - quản lý state
- [styled-components](https://styled-components.com/) - viết CSS trong JS

## Các trang

| Đường dẫn | Trang | Chức năng |
| --- | --- | --- |
| `/login` | Đăng nhập | Admin -> chuyển tới `/admin/products`, user -> về `/` |
| `/register` | Đăng ký | Đăng ký xong chuyển sang `/login` |
| `/` | Danh sách sản phẩm | Search, filter theo category (radio), sort theo tên/giá, phân trang kiểu "Xem thêm" |
| `/products/:id` | Chi tiết sản phẩm | Hiển thị thông tin 1 sản phẩm |
| `/admin/products` | Admin - Quản lý sản phẩm | Search, filter, sort, pagination, xóa sản phẩm |
| `/admin/products/create` | Admin - Thêm sản phẩm | Form tạo sản phẩm |
| `/admin/products/:id/update` | Admin - Cập nhật sản phẩm | Form sửa sản phẩm |

`AdminLayout` kiểm tra: chưa đăng nhập -> về `/login`; đăng nhập nhưng role không phải `admin` -> về `/`.

## Luồng xác thực

1. Đăng nhập thành công -> lưu `accessToken`, `refreshToken` vào `localStorage`, lưu `user` vào redux (`state.auth.userInfo`).
2. `services/api.js` có 2 interceptor:
   - request: tự gắn `Authorization: Bearer <accessToken>`
   - response: gặp `401` -> gọi `POST /refresh-token` lấy access token mới rồi gọi lại request cũ; refresh cũng lỗi -> xóa token, về `/login`
3. Mở lại trang: `App.jsx` thấy có `accessToken` -> gọi `GET /profile` để lấy lại thông tin user.
4. Đăng xuất: gọi `POST /logout` rồi xóa token trong `localStorage`.

## Cấu trúc thư mục

```
src/
├── App.jsx                # Khai báo routes + lấy lại profile khi mở trang
├── main.jsx               # Provider (redux) + BrowserRouter
├── constants/routes.js
├── layouts/
│   ├── UserLayout/        # Header + Footer cho trang user
│   └── AdminLayout/       # Sidebar + Header cho admin, kiểm tra đăng nhập + role
├── pages/
│   ├── Login/
│   ├── Register/
│   ├── ProductList/
│   ├── ProductDetail/
│   └── admin/
│       ├── ProductList/
│       ├── CreateProduct/
│       └── UpdateProduct/
├── redux/
│   ├── store.js           # configureStore, gom các slice
│   ├── slices/            # state + reducer cho từng phần
│   │   ├── auth.slice.js
│   │   ├── category.slice.js
│   │   └── product.slice.js
│   └── thunks/            # createAsyncThunk gọi API
│       ├── auth.thunk.js
│       ├── category.thunk.js
│       └── product.thunk.js
└── services/              # Hàm gọi API bằng axios
    ├── api.js             # Axios instance + interceptor
    ├── authService.js     # login, register, getMyProfile, logout
    └── productService.js  # getProductList, getAdminProductList, CRUD product, getCategoryList
```

> Mỗi page là 1 thư mục gồm `index.jsx` (component) và `styled.jsx` (styled-components), được import theo kiểu `import * as S from './styled'`.

## Cách dùng redux trong component

```js
const dispatch = useDispatch()
const { data: products, total, loading } = useSelector((state) => state.product.productList)

useEffect(() => {
  dispatch(getProductListThunk({ keyword, categoryId, sort, page, limit: 8 }))
}, [dispatch, keyword, categoryId, sort, page])

// Với thao tác cần biết kết quả ngay (tạo / sửa / xóa / đăng nhập) dùng unwrap():
try {
  await dispatch(createProductThunk(values)).unwrap()
  message.success('Tạo sản phẩm thành công')
} catch (error) {
  message.error(error) // error là message từ backend
}
```
