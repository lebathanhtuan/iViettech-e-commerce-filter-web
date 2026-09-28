# Bài tập: E-commerce Product Filter

Project React mô phỏng một trang thương mại điện tử đơn giản: xem / tìm kiếm / lọc sản phẩm, giỏ hàng, đặt hàng, đánh giá, yêu thích, trang tài khoản cho user và CRUD sản phẩm cho admin. Backend nằm ở project `e-commerce-filter-api`.

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
- [react-quill-new](https://github.com/VaguelySerious/react-quill) - WYSIWYG editor (Quill 2) cho mô tả sản phẩm, bản fork của `react-quill` hỗ trợ React 19

## Các trang

| Đường dẫn | Trang | Chức năng |
| --- | --- | --- |
| `/login` | Đăng nhập | Admin -> chuyển tới `/admin/products`, user -> về `/` |
| `/register` | Đăng ký | Đăng ký xong chuyển sang `/login` |
| `/` | Danh sách sản phẩm | Search, filter theo category (radio), sort theo tên/giá, phân trang kiểu "Xem thêm". Filter lưu trên URL |
| `/products/:id` | Chi tiết sản phẩm | Thêm vào giỏ, yêu thích, bình luận + đánh giá sao (mỗi user 1 lần), mô tả dạng HTML |
| `/cart` 🔒 | Giỏ hàng | Đổi số lượng, xóa sản phẩm, tổng tiền |
| `/checkout` 🔒 | Thanh toán | Form thông tin giao hàng + thông tin thẻ (giả lập, chỉ cần qua validate) |
| `/checkout/success/:code` 🔒 | Đặt hàng thành công | Hiển thị mã đơn (8 ký tự, vd `K7Q2M9XA`), tổng tiền, địa chỉ giao |
| `/profile` 🔒 | Tài khoản của tôi | 4 tab: thông tin + avatar, đổi mật khẩu, lịch sử đơn hàng, sản phẩm yêu thích (`?tab=orders`...) |
| `/admin/products` | Admin - Quản lý sản phẩm | Search, filter, sort, pagination, xóa sản phẩm |
| `/admin/products/create` | Admin - Thêm sản phẩm | Form tạo sản phẩm, upload ảnh, mô tả bằng Quill editor |
| `/admin/products/:id/update` | Admin - Cập nhật sản phẩm | Form sửa sản phẩm, đổi ảnh (không chọn thì giữ ảnh cũ), mô tả bằng Quill editor |
| `/admin/chat` | Admin - Chat với khách hàng | Danh sách cuộc trò chuyện + trả lời khách realtime (socket.io) |

User đã đăng nhập có nút chat nổi ở góc phải (`components/ChatBox`) để nhắn với shop. Hướng dẫn setup chat và email đơn hàng nằm ở `docs/` của project backend: `chat-socket-io.md`, `order-email-nodemailer.md`.

🔒 = cần đăng nhập. Các route này được bọc trong `layouts/PrivateLayout` (chưa có token -> về `/login`).

`AdminLayout` kiểm tra: chưa đăng nhập -> về `/login`; đăng nhập nhưng role không phải `admin` -> về `/`.

## Lưu filter lên URL (trang danh sách sản phẩm)

Dùng `useSearchParams` của react-router thay cho `useState`, vd: `/?keyword=mac&categoryId=1&sort=price_asc`. F5 hoặc gửi link cho người khác vẫn giữ nguyên bộ lọc.

```js
const [searchParams, setSearchParams] = useSearchParams()
const keyword = searchParams.get('keyword') || ''

const updateFilter = (key, value) => {
  const newSearchParams = new URLSearchParams(searchParams)
  if (value) newSearchParams.set(key, value)
  else newSearchParams.delete(key)
  setSearchParams(newSearchParams)
}
```

Filter đổi -> `useEffect` gọi lại API từ trang 1. Nút "Xem thêm" gọi trang `meta.page + 1` với `more: true` để nối tiếp danh sách.

## Giỏ hàng, yêu thích

- Giỏ hàng lưu ở DB (bảng `cart_items`), mỗi user 1 giỏ. Chưa đăng nhập mà bấm "Thêm vào giỏ hàng" / "Yêu thích" -> chuyển sang `/login`.
- Thêm sản phẩm đã có trong giỏ -> backend tự cộng dồn `quantity` (không tạo dòng mới).
- `UserLayout` lấy giỏ hàng + danh sách yêu thích mỗi khi có user (đăng nhập / mở lại trang). Icon giỏ hàng hiển thị số loại sản phẩm trong giỏ (không phải tổng quantity).
- Các thunk thêm / sửa / xóa làm xong sẽ `dispatch(getCartListThunk())` để lấy lại dữ liệu mới nhất, không phải tự sửa state.
- Đặt hàng: `POST /orders` chỉ gửi thông tin giao hàng. Backend tự lấy sản phẩm trong giỏ, tính tổng tiền, tạo đơn và xóa giỏ.

## Mô tả sản phẩm dạng HTML (Quill + dangerouslySetInnerHTML)

- Admin nhập mô tả bằng `components/QuillEditor` (toolbar đơn giản: tiêu đề, đậm / nghiêng / gạch chân, danh sách, link). Component nhận `value` + `onChange` nên đặt thẳng trong `<Form.Item name="description">`, giá trị là chuỗi HTML.
- Trang chi tiết hiển thị bằng `dangerouslySetInnerHTML={{ __html: product.description }}`. Chỉ dùng cho dữ liệu tin cậy (admin nhập). Bình luận của user thì hiển thị text bình thường để tránh XSS.
- Quill 2 lưu dấu cách thành `&nbsp;` nên khi hiển thị cần `replaceAll('&nbsp;', ' ')` để chữ tự xuống dòng.

## Luồng xác thực

1. Đăng nhập thành công -> lưu `accessToken`, `refreshToken` vào `localStorage`, lưu `user` vào redux (`state.auth.userInfo`).
2. `services/api.js` có 2 interceptor:
   - request: tự gắn `Authorization: Bearer <accessToken>`
   - response: gặp `401` -> gọi `POST /refresh-token` lấy access token mới rồi gọi lại request cũ; refresh cũng lỗi -> xóa token, về `/login`
3. Mở lại trang: `App.jsx` thấy có `accessToken` -> gọi `GET /profile` để lấy lại thông tin user.
4. Đăng xuất: gọi `POST /logout` rồi xóa token trong `localStorage`.

## Upload ảnh sản phẩm (FormData)

Form tạo / sửa sản phẩm dùng antd `Upload` với `beforeUpload={() => false}` để chỉ giữ file lại, không tự upload. Khi submit, gom dữ liệu vào `FormData` rồi gửi bằng axios:

```js
const formData = new FormData()
formData.append('name', values.name)
formData.append('price', values.price)
formData.append('categoryId', values.categoryId)
formData.append('description', values.description || '')
// key "image" phải khớp upload.single('image') ở backend
if (values.image?.[0]?.originFileObj) {
  formData.append('image', values.image[0].originFileObj)
}
await dispatch(createProductThunk(formData)).unwrap()
```

Không cần tự set `Content-Type: multipart/form-data`, axios tự thêm kèm `boundary`. Backend trả về `image` là link đầy đủ (`http://localhost:3000/uploads/...`) nên FE chỉ cần hiển thị.

## Cấu trúc thư mục

```
src/
├── App.jsx                # Khai báo routes + lấy lại profile khi mở trang
├── main.jsx               # Provider (redux) + BrowserRouter
├── constants/routes.js
├── components/
│   └── QuillEditor/       # WYSIWYG editor cho mô tả sản phẩm
├── layouts/
│   ├── UserLayout/        # Header + Footer cho trang user
│   ├── AdminLayout/       # Sidebar + Header cho admin, kiểm tra đăng nhập + role
│   └── PrivateLayout/     # Bọc các trang cần đăng nhập (chưa có token -> /login)
├── pages/
│   ├── Login/
│   ├── Register/
│   ├── ProductList/
│   ├── ProductDetail/
│   ├── Cart/
│   ├── Checkout/
│   ├── CheckoutSuccess/
│   ├── Profile/           # index.jsx (Tabs) + components/ cho từng tab
│   └── admin/
│       ├── ProductList/
│       ├── CreateProduct/
│       └── UpdateProduct/
├── redux/
│   ├── store.js           # configureStore, gom các slice
│   ├── slices/            # state + reducer cho từng phần
│   │   ├── auth.slice.js
│   │   ├── category.slice.js
│   │   ├── product.slice.js
│   │   ├── cart.slice.js
│   │   ├── order.slice.js
│   │   ├── review.slice.js
│   │   └── favorite.slice.js
│   └── thunks/            # createAsyncThunk gọi API (tên file giống slices)
└── services/              # Hàm gọi API bằng axios
    ├── api.js             # Axios instance + interceptor
    ├── authService.js     # login, register, logout, profile, đổi mật khẩu, đổi avatar
    ├── productService.js  # getProductList, getAdminProductList, CRUD product, getCategoryList
    ├── cartService.js
    ├── orderService.js
    ├── reviewService.js
    └── favoriteService.js
```

> Mỗi page là 1 thư mục gồm `index.jsx` (component) và `styled.jsx` (styled-components), được import theo kiểu `import * as S from './styled'`.

## Cách dùng redux trong component

```js
const dispatch = useDispatch()
// API danh sách trả về { data, meta } -> meta là { page, limit, total, totalPages }
const { data: products, meta, loading } = useSelector((state) => state.product.productList)

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
