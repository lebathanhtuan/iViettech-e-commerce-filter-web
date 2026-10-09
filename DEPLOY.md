# Hướng dẫn deploy E-commerce (FE + BE + DB)

| Thành phần | Repo | Nền tảng |
| --- | --- | --- |
| Database (PostgreSQL) + lưu ảnh upload | — | **Supabase** (Database + Storage) |
| Backend (Express 5 + Sequelize + socket.io) | `iViettech-e-commerce-filter-api` | **Vercel** |
| Frontend (React + Vite) | `iViettech-e-commerce-filter-web` | **Vercel** |

> Giao diện trong tài liệu này được đối chiếu với **Supabase Dashboard** và **Vercel Dashboard** bản **tháng 10/2026**.
> Hai dashboard này cập nhật liên tục. Nếu tên nút hơi khác thì tìm nút có ý nghĩa tương tự.

---

## Mục lục

0. [Tổng quan và thứ tự thực hiện](#0-tổng-quan-và-thứ-tự-thực-hiện)
1. [Chuẩn bị code (bắt buộc)](#1-chuẩn-bị-code-bắt-buộc)
2. [Supabase: tạo Database và Storage](#2-supabase-tạo-database-và-storage)
3. [Vercel: deploy Backend](#3-vercel-deploy-backend)
4. [Vercel: deploy Frontend](#4-vercel-deploy-frontend)
5. [Nối FE và BE: cập nhật CLIENT_URL](#5-nối-fe-và-be-cập-nhật-client_url)
6. [Kiểm tra sau khi deploy](#6-kiểm-tra-sau-khi-deploy)
7. [Lỗi thường gặp](#7-lỗi-thường-gặp)
8. [Phụ lục: giới hạn gói Free, cập nhật code về sau](#8-phụ-lục)

---

## 0. Tổng quan và thứ tự thực hiện

```
Trình duyệt ──► FE (Vercel, https://<web>.vercel.app)
                  │  axios + socket.io-client (VITE_API_URL)
                  ▼
                BE (Vercel Function, https://<api>.vercel.app)
                  │  Sequelize (DATABASE_URL)        │  supabase-js (SUPABASE_SECRET_KEY)
                  ▼                                  ▼
          Supabase Postgres (Transaction pooler)   Supabase Storage (bucket "uploads")
```

Thứ tự **bắt buộc** (bước sau cần giá trị của bước trước):

1. Sửa code BE/FE cho chạy được trên Vercel → push lên GitHub.
2. Tạo DB trên Supabase → lấy **connection string**, **Project URL**, **Secret key**.
3. Deploy BE → lấy domain BE.
4. Deploy FE (dùng domain BE) → lấy domain FE.
5. Quay lại BE, điền `CLIENT_URL` = domain FE → **Redeploy** BE.

### Cần chuẩn bị

- Tài khoản **GitHub** đang sở hữu 2 repo FE và BE.
  - Gói Vercel Hobby (miễn phí) **không** deploy được repo **private** thuộc một **GitHub Organization**. Repo cá nhân (public hoặc private) thì được.
- Node.js 20+ ở máy local (để cài package và test trước khi push).
- (Tuỳ chọn) Gmail có bật xác minh 2 bước và tạo **App password**, dùng để gửi email đơn hàng / quên mật khẩu. Xem `docs/password-reset.md` trong repo BE.

---

## 1. Chuẩn bị code (bắt buộc)

> ✅ Các thay đổi trong mục này **đã được làm sẵn** trên nhánh **`deploy/vercel-supabase`** của cả 2 repo.
> Chỉ cần làm [1.3. Đưa nhánh deploy vào `master`](#13-đưa-nhánh-deploy-vào-master). Phần 1.1, 1.2 giữ lại để hiểu đã sửa gì và vì sao.

Code cũ (trên `master`) chạy tốt ở local nhưng **sẽ lỗi trên Vercel** vì 4 lý do:

| Vấn đề | Vì sao lỗi trên Vercel | Cách sửa |
| --- | --- | --- |
| Upload ảnh bằng `multer.diskStorage` vào thư mục `uploads/` | Vercel Function có **ổ đĩa chỉ đọc**. `fs.mkdirSync('uploads')` làm sập server ngay khi khởi động. `express.static` cũng bị Vercel bỏ qua. | Upload lên **Supabase Storage** |
| Sequelize tự `require('pg')` lúc chạy | Vercel đóng gói code không thấy `pg` → lỗi `Please install pg package manually` | Truyền `dialectModule: pg` |
| Kết nối DB bằng `DB_HOST/DB_USER/...` | Supabase cần SSL + dùng pooler cho serverless | Thêm hỗ trợ `DATABASE_URL` + SSL |
| Gửi email kiểu "không await" | Vercel có thể dừng function ngay sau khi trả response → mail không được gửi | Bọc bằng `waitUntil()` |

Ngoài ra:
- FE dùng `BrowserRouter` → cần `vercel.json` để F5 ở `/products/1` không bị 404.
- socket.io trên Vercel chỉ chạy được bằng **WebSocket** (không dùng long-polling) → FE phải đặt `transports: ['websocket']`.

### 1.1. Backend (repo `e-commerce-api`)

#### Bước 1: Cài thêm package

```bash
cd e-commerce-api
npm install @supabase/supabase-js @vercel/functions
```

> `pg` đã có sẵn trong `dependencies`. Đừng chuyển nó sang `devDependencies`.

#### Bước 2: Sửa `config/db.js`

Thay toàn bộ nội dung bằng:

```js
import pg from 'pg'
import { Sequelize } from 'sequelize'

const options = {
  dialect: 'postgres',
  // Truyền thẳng thư viện pg: Vercel đóng gói code không tự thấy pg nếu Sequelize require động
  dialectModule: pg,
  logging: false,
  define: {
    freezeTableName: true,
  },
}

// Deploy (Supabase): dùng 1 chuỗi DATABASE_URL, bắt buộc SSL
// Local: vẫn dùng DB_NAME / DB_USER / ... như cũ
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL, {
      ...options,
      dialectOptions: {
        ssl: { require: true, rejectUnauthorized: false },
      },
      // Serverless: mỗi instance chỉ giữ ít kết nối, pooler của Supabase lo phần còn lại
      pool: { max: 3, min: 0, idle: 10000 },
    })
  : new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
      ...options,
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
    })

await sequelize.authenticate()

export default sequelize
```

#### Bước 3: Tạo file `utils/storage.js`

```js
import path from 'node:path'
import { randomUUID } from 'node:crypto'
import { createClient } from '@supabase/supabase-js'

let supabase

// Tạo client lần đầu dùng tới (thiếu biến môi trường thì chỉ lỗi lúc upload, server vẫn chạy)
function getSupabase() {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SECRET_KEY) {
    const error = new Error('Chưa cấu hình SUPABASE_URL / SUPABASE_SECRET_KEY')
    error.status = 500
    throw error
  }

  supabase ??= createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SECRET_KEY, {
    auth: { persistSession: false },
  })
  return supabase
}

// Upload file (từ multer.memoryStorage) lên Supabase Storage, trả về URL public đầy đủ
// Ví dụ: https://<ref>.supabase.co/storage/v1/object/public/uploads/image/image-<uuid>.jpg
export async function uploadImage(file) {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads'
  const extension = path.extname(file.originalname).toLowerCase()
  const filePath = `${file.fieldname}/${file.fieldname}-${randomUUID()}${extension}`

  const storage = getSupabase().storage.from(bucket)
  const { error } = await storage.upload(filePath, file.buffer, {
    contentType: file.mimetype,
  })
  if (error) {
    throw error
  }

  return storage.getPublicUrl(filePath).data.publicUrl
}
```

#### Bước 4: Sửa `middlewares/upload.middleware.js`

Đổi `diskStorage` thành `memoryStorage` (file nằm trong RAM ở `req.file.buffer`) và giảm giới hạn còn **4 MB** (Vercel giới hạn body request 4,5 MB):

```js
import path from 'node:path'
import multer from 'multer'

// Vercel không cho ghi file ra ổ đĩa -> giữ file trong RAM (req.file.buffer)
// rồi controller upload tiếp lên Supabase Storage (utils/storage.js)
const storage = multer.memoryStorage()

// Chỉ cho phép upload ảnh
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp']
const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp']

const upload = multer({
  storage: storage,
  // Tối đa 4 MB / file (Vercel giới hạn cả request 4.5 MB)
  limits: {
    fileSize: 4 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase()
    const isValidMimeType = allowedMimeTypes.includes(file.mimetype)
    const isValidExtension = allowedExtensions.includes(extension)

    if (isValidMimeType && isValidExtension) {
      return cb(null, true)
    }

    const error = new Error('Chỉ cho phép upload file JPG, PNG hoặc WEBP')
    error.status = 400
    cb(error)
  },
})

export default upload
```

Trong `middlewares/error.middleware.js` đổi message cho khớp:

```js
return res.status(400).json({ message: 'File vượt quá giới hạn 4 MB' })
```

#### Bước 5: Sửa các controller có upload

`controllers/product.controller.js`:

```js
import { uploadImage } from '../utils/storage.js'   // thêm dòng import này

// createProduct
const image = req.file ? await uploadImage(req.file) : null

// updateProduct
if (req.file) {
  updateData.image = await uploadImage(req.file)
}
```

`controllers/auth.controller.js` (hàm `updateAvatar`):

```js
import { uploadImage } from '../utils/storage.js'   // thêm dòng import này

const result = await user.update({ avatar: await uploadImage(req.file) })
```

> DB giờ lưu URL đầy đủ (`https://...supabase.co/...`). Hàm `getImageUrl` trong `utils/format.js` đã giữ nguyên link bắt đầu bằng `http` nên **không cần sửa**.

#### Bước 6: Bọc việc gửi email bằng `waitUntil`

`controllers/order.controller.js`:

```js
import { waitUntil } from '@vercel/functions'

// thay dòng: sendOrderConfirmationEmail(newOrder.id)
waitUntil(sendOrderConfirmationEmail(newOrder.id))
```

`controllers/password-reset.controller.js`:

```js
import { waitUntil } from '@vercel/functions'

// thay: sendPasswordResetEmail(user, token).catch(async (error) => { ... })
waitUntil(
  sendPasswordResetEmail(user, token).catch(async (error) => {
    // ... giữ nguyên nội dung catch cũ
  })
)
```

> `waitUntil` bảo Vercel "chờ promise này xong rồi mới tắt function". Ở local nó không làm gì thêm, code chạy như cũ.

#### Bước 7: Tạo file `vercel.json` ở thư mục gốc repo BE

Mặc định Vercel chạy function ở Mỹ (`iad1`). DB đặt ở Singapore thì function cũng nên ở Singapore, nếu không mỗi query mất thêm ~200 ms:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "regions": ["sin1"]
}
```

> `app.js` **giữ nguyên**. Vercel tự nhận file `app.js` ở thư mục gốc là app Express. Lệnh `server.listen(PORT)` được Vercel "bắt lại", `PORT` chỉ có tác dụng ở local.

#### Bước 8: Cập nhật `.env.example`

Thêm vào cuối file (để người khác biết cần biến gì):

```bash
# ===== Khi deploy (Supabase) =====
# Có DATABASE_URL thì bỏ qua DB_NAME / DB_USER / DB_PASSWORD / DB_HOST / DB_PORT
DATABASE_URL=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
SUPABASE_STORAGE_BUCKET=uploads
```

#### Bước 9: Test local

```bash
npm run dev          # server phải chạy bình thường như trước
```

> Từ giờ upload ảnh ở local cũng đi lên Supabase Storage. Muốn test upload ở local thì điền thêm `SUPABASE_URL`, `SUPABASE_SECRET_KEY` vào `.env` local (lấy ở bước 2.6). Chưa điền thì API upload trả lỗi `Chưa cấu hình SUPABASE_URL / SUPABASE_SECRET_KEY`, các API khác vẫn chạy bình thường.

### 1.2. Frontend (repo `e-commerce-web`)

#### Bước 1: Tạo file `vercel.json` ở thư mục gốc repo FE

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Không có file này thì truy cập thẳng `https://<web>.vercel.app/products/1` hoặc nhấn F5 sẽ bị **404**.

#### Bước 2: Sửa `src/services/socket.js`

Thêm `transports: ['websocket']` khi tạo kết nối:

```js
socket = io(import.meta.env.VITE_API_URL, {
  // Vercel chỉ hỗ trợ WebSocket, không hỗ trợ HTTP long-polling của socket.io
  transports: ['websocket'],
  auth: (callback) => callback({ token: localStorage.getItem('accessToken') }),
})
```

#### Bước 3: Test build

```bash
cd e-commerce-web
npm run build        # phải build thành công (cảnh báo "chunks larger than 500 kB" không sao)
```

### 1.3. Đưa nhánh deploy vào `master`

Vercel lấy nhánh **`master`** làm **Production**. Code ở nhánh khác chỉ được deploy thành bản **Preview**. Vì vậy phải đưa nhánh `deploy/vercel-supabase` vào `master` **trước khi** import vào Vercel.

Làm cho **từng repo** (BE và FE):

1. Push nhánh lên GitHub:

   ```bash
   git push -u origin deploy/vercel-supabase
   ```

2. Mở repo trên GitHub → thanh vàng **Compare & pull request** → bấm vào.
   (Hoặc tab **Pull requests** → **New pull request** → `base: master` ← `compare: deploy/vercel-supabase`.)
3. Bấm **Create pull request** → xem lại thay đổi → **Merge pull request** → **Confirm merge**.

> Muốn thử trước mà chưa merge: vẫn import repo vào Vercel như mục 3, 4. Sau đó push nhánh `deploy/vercel-supabase` lên, Vercel tự tạo bản **Preview** với URL riêng để test.

---

## 2. Supabase: tạo Database và Storage

### 2.1. Đăng ký tài khoản

1. Mở **https://supabase.com/dashboard/sign-up**.
2. Màn hình **Get started** → bấm **Continue with GitHub** (nhanh nhất).
   Hoặc nhập **Email**, **Password** → bấm **Sign up** → mở email, bấm link xác nhận.
3. Đăng nhập xong sẽ vào trang tạo Organization (nếu chưa có).

### 2.2. Tạo Organization

Màn hình **Create a new organization**:

| Trường | Điền |
| --- | --- |
| **Name** | Tên tuỳ ý, ví dụ `iviettech` |
| **Type** | `Personal` (hoặc `Educational`) |
| **Plan** | `Free - $0/month` |

Bấm **Create organization**.

### 2.3. Tạo Project

Sau khi tạo Organization, Supabase chuyển sang màn hình **Create a new project** (nếu không, ở trang Organization bấm **New project**).

1. **Organization**: giữ organization vừa tạo.
2. **Project name**: ví dụ `e-commerce`.
3. **Database password**:
   - Bấm link **Generate a password** để sinh mật khẩu mạnh.
   - Bấm **icon copy** bên phải ô mật khẩu → **dán ngay vào chỗ an toàn** (Notes, password manager).
   - ⚠️ Supabase **không hiển thị lại** mật khẩu này. Quên thì phải reset (xem mục 7).
   - Mật khẩu nên **chỉ gồm chữ và số**. Nếu có ký tự đặc biệt (`@ # / ? %`…) thì phải mã hoá khi ghép vào URL (xem 2.5).
4. **Region**: mở dropdown, chọn **Southeast Asia (Singapore)** (nằm ở nhóm *Specific regions*).
   Nếu chỉ thấy nhóm *General regions* thì chọn **Asia-Pacific**.
5. Phần **Security** (3 ô checkbox):

   | Checkbox | Chọn | Lý do |
   | --- | --- | --- |
   | **Enable Data API** | ✅ Bật (mặc định) | Không ảnh hưởng BE. Để bật thì sau này dùng thêm supabase-js được |
   | **Automatically expose new tables** | ⬜ **Bỏ chọn** | BE kết nối thẳng Postgres, không cần public bảng ra REST API. Bỏ chọn để bảng `users` (có hash mật khẩu) không bị lộ qua Data API |
   | **Enable automatic RLS** | ✅ **Bật** | Tự bật Row Level Security cho mọi bảng mới. BE vẫn đọc/ghi bình thường (xem ghi chú dưới) |

6. Nếu thấy **Advanced Configuration** → giữ mặc định **Postgres**.
7. Bấm **Create new project**.
8. Chờ 1–2 phút đến khi project chuyển sang trạng thái sẵn sàng (trang **Project Overview** hiện đầy đủ).

> **RLS có làm BE không truy cập được không?** Không. BE đăng nhập bằng user `postgres`, là **chủ (owner)** các bảng → bỏ qua RLS. RLS chỉ chặn truy cập qua Data API bằng publishable key, đúng thứ chúng ta muốn chặn.

### 2.4. Tạo bảng và dữ liệu mẫu

Có 2 cách, chọn **1** trong 2:

- **Cách A (nhanh, khuyên dùng)**: chạy `npm run db:seed` từ máy local. Cần connection string nên làm theo [2.5](#25-lấy-connection-string-database_url) trước, rồi xem [2.5.1](#251-đồng-bộ-database-bằng-script-cách-a).
- **Cách B (thủ công)**: copy từng file SQL vào **SQL Editor** của Supabase, làm theo hướng dẫn ngay bên dưới.

#### Cách B: dùng SQL Editor

Chạy **lần lượt 2 file** trong thư mục `database/` của repo BE: `schema.sql` (cấu trúc) → `seed.sql` (dữ liệu mẫu).

**File 1: `schema.sql`**

1. Sidebar trái → bấm **SQL Editor**.
2. Bấm nút **+** (tooltip *Create a new query*) → chọn **Create a new snippet**.
3. Mở file `database/schema.sql` trên máy → copy **toàn bộ** → dán vào editor.
4. Bấm **Run** (góc dưới phải editor) hoặc `Cmd + Enter` (macOS) / `Ctrl + Enter` (Windows).
5. Nếu hiện hộp thoại **Potential issue detected** với nội dung *"This query creates a table without enabling Row Level Security"* → bấm **Run and enable RLS**.
   (Nếu đã bật *Enable automatic RLS* ở 2.3 thì hộp thoại này thường không hiện.)
6. Khung **Results** bên dưới báo `Success. No rows returned` là được.

**File 2: `seed.sql`**: làm lại bước 2 → 4 với file `database/seed.sql`.

- Hộp thoại **Potential issue detected** báo *"This query includes destructive operations"* (do lệnh `TRUNCATE`) → DB đang trống nên bấm **Run query**.
- ⚠️ Về sau **không chạy lại** `seed.sql` trên DB thật: nó xoá sạch dữ liệu.

**Kiểm tra RLS cho tất cả bảng**: tạo snippet mới, chạy:

```sql
ALTER TABLE users       ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories  ENABLE ROW LEVEL SECURITY;
ALTER TABLE products    ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items  ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders      ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews     ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites   ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages    ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses   ENABLE ROW LEVEL SECURITY;

SELECT tablename, rowsecurity FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
```

Kết quả: 10 bảng, cột `rowsecurity` đều là `true`.

**Xem dữ liệu**: sidebar → **Table Editor** → schema `public` → bấm bảng `products`, thấy danh sách sản phẩm mẫu là thành công.

> Sidebar → **Advisors** → **Security Advisor** có thể báo *RLS Enabled No Policy* (mức INFO). Với project này đó là **cố ý** (chặn toàn bộ truy cập qua Data API), bỏ qua được.

> **Cách khác (dùng terminal)**: có `psql` thì chạy `psql "<DATABASE_URL lấy ở 2.5>" -f database/schema.sql`, rồi tương tự với `database/seed.sql`.

### 2.5. Lấy Connection string (DATABASE_URL)

1. Ở header phía trên của project, bấm nút **Connect** (hoặc gõ phím `O` rồi `C`).
2. Panel **Connect to your project** mở ra bên phải → bấm thẻ **Direct** (*Connection string*).
3. **Connection Method** → chọn **Transaction pooler** (*Ideal for stateless applications like serverless functions*).
4. Bật công tắc **Use IPv4 connection** (nếu có).
   - Vercel **không hỗ trợ IPv6**. *Direct connection* (`db.<ref>.supabase.co`) chỉ có IPv6 → **không dùng được** trên Vercel.
5. **Type**: chọn **URI**.
6. Copy chuỗi hiện ra, dạng:

   ```
   postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

7. Thay `[YOUR-PASSWORD]` (**xoá cả dấu `[` `]`**) bằng mật khẩu đã lưu ở 2.3.
   - Mật khẩu có ký tự đặc biệt thì mã hoá: `@` → `%40`, `#` → `%23`, `/` → `%2F`, `?` → `%3F`, `%` → `%25`.
   - Hoặc bấm **Reset database password** ngay trong panel, tạo mật khẩu mới chỉ gồm chữ + số.

Kiểm tra chuỗi đúng:
- Port là **6543**.
- User có dạng **`postgres.<project-ref>`** (có dấu chấm và mã project), **không phải** chỉ `postgres`.

Lưu chuỗi này lại, đây là `DATABASE_URL`.

#### 2.5.1. Đồng bộ database bằng script (Cách A)

Repo BE có sẵn 2 lệnh:

| Lệnh | Chạy | Khi nào dùng |
| --- | --- | --- |
| `npm run db:sync` | `schema.sql` → bật RLS cho mọi bảng | Khi `schema.sql` có thêm bảng / index mới. **An toàn**, chạy lại nhiều lần không mất dữ liệu |
| `npm run db:seed` | `schema.sql` + `seed.sql` + bật RLS | **Chỉ lần đầu** (DB trống). ⚠️ Xoá hết dữ liệu cũ, phải gõ `yes` để xác nhận |

Các bước:

1. Mở file `.env` **ở máy local** của repo BE, thêm dòng (dán chuỗi ở 2.5, đã thay mật khẩu):

   ```bash
   SUPABASE_DB_URL=postgresql://postgres.abcdefghijklmnop:matkhau@aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres
   ```

   > Dùng tên `SUPABASE_DB_URL`, **không** đặt `DATABASE_URL` ở `.env` local: có `DATABASE_URL` thì `npm run dev` sẽ kết nối thẳng vào DB thật trên Supabase.

2. Lần đầu tạo DB:

   ```bash
   cd e-commerce-api
   npm run db:seed
   ```

   Script in ra database sắp chạy (`Database : aws-1-ap-southeast-1.pooler.supabase.com:6543/postgres`) → kiểm tra đúng rồi gõ `yes` → Enter.

3. Kết quả đúng:

   ```
   ✔ schema.sql (…ms)
   ✔ seed.sql (…ms)
   ✔ Bật Row Level Security cho các bảng
   ┌─────────┬───────────────┬──────┐
   │ (index) │ table         │ rls  │
   │ 0       │ 'addresses'   │ true │
   …  (10 bảng, cột rls đều true)
   Đồng bộ database xong.
   ```

4. Vào Supabase → **Table Editor** → bảng `products` để xem dữ liệu.

> Mỗi file SQL chạy trong 1 transaction: nếu lỗi giữa chừng, file đó được hoàn tác hết, không để DB "nửa vời".
> Gặp lỗi kết nối thì script in kèm **Gợi ý** cách sửa. Xem thêm mục 7.

### 2.6. Lấy Project URL và Secret key (cho upload ảnh)

**Project URL**

1. Sidebar → **Project Settings** (biểu tượng bánh răng, cuối sidebar).
2. Mục **Data API** → thẻ **API URL** → copy. Dạng: `https://abcdefghijklmnop.supabase.co`.
   (Cũng có thể lấy ở trang **Project Overview**, nút **Copy** → *Project URL*.)

Đây là `SUPABASE_URL`.

**Secret key**

1. **Project Settings** → **API Keys**.
2. Chọn tab **Publishable and secret API keys**.
   - Nếu chưa có key nào → bấm **Create API keys** → **Create keys**.
3. Phần **Secret keys** → bấm **icon con mắt** (*Reveal API key*) → bấm **icon copy**. Key có dạng `sb_secret_...`.

Đây là `SUPABASE_SECRET_KEY`.

> ⚠️ **Secret key có toàn quyền** với project (bỏ qua RLS). **Chỉ** đặt ở biến môi trường của BE. **Không** đưa vào FE, không commit lên GitHub.
> **Không** dùng *Publishable key* (`sb_publishable_...`) cho BE: upload sẽ bị lỗi `new row violates row-level security policy`.
> Tab *Legacy anon, service_role API keys* là key cũ, Supabase sẽ ngừng hỗ trợ, không dùng.

### 2.7. Tạo Storage bucket cho ảnh upload

1. Sidebar → **Storage**.
2. Menu trái của Storage, mục **MANAGE** → chọn **Files**.
3. Bấm **New bucket** (bucket đầu tiên thì có thể là nút **Create a file bucket**).
4. Hộp thoại **Create file bucket**:

   | Trường | Điền |
   | --- | --- |
   | **Bucket name** | `uploads` (phải trùng với `SUPABASE_STORAGE_BUCKET`) |
   | **Public bucket** | ✅ **Bật**: ai cũng xem được ảnh qua URL (cần cho ảnh sản phẩm, avatar). Cảnh báo hiện ra là bình thường: chỉ *xem* là public, *upload/xoá* vẫn cần secret key |
   | **Restrict file size** | ✅ Bật → **File size limit**: `4` `MB` |
   | **Restrict MIME types** | ✅ Bật → **Allowed MIME types**: `image/jpeg, image/png, image/webp` |

5. Bấm **Create**.

Bucket `uploads` xuất hiện trong danh sách là xong. **Không cần** tạo policy vì BE upload bằng secret key.

### 2.8. Tổng hợp giá trị từ Supabase

| Biến | Giá trị | Lấy ở |
| --- | --- | --- |
| `DATABASE_URL` | `postgresql://postgres.<ref>:<password>@aws-...pooler.supabase.com:6543/postgres` | 2.5 |
| `SUPABASE_URL` | `https://<ref>.supabase.co` | 2.6 |
| `SUPABASE_SECRET_KEY` | `sb_secret_...` | 2.6 |
| `SUPABASE_STORAGE_BUCKET` | `uploads` | 2.7 |

---

## 3. Vercel: deploy Backend

### 3.1. Đăng ký Vercel

1. Mở **https://vercel.com/signup**.
2. Chọn gói **Hobby** (miễn phí, dùng cho cá nhân), nhập tên.
3. Bấm **Continue with GitHub** → đăng nhập GitHub → **Authorize Vercel**.

### 3.2. Tạo secret cho JWT

Chạy lệnh này **2 lần** ở terminal để có 2 chuỗi ngẫu nhiên khác nhau:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

- Chuỗi 1 → `JWT_ACCESS_SECRET`
- Chuỗi 2 → `JWT_REFRESH_SECRET`

> **Không** dùng lại secret mẫu trong `.env.example`: ai đọc repo cũng tự tạo được token admin.

### 3.3. Import repo BE

1. Vào **https://vercel.com/dashboard**. Kiểm tra **team switcher** (góc trên trái) đang chọn đúng tài khoản/team cá nhân.
2. Bấm nút **Add New…** → chọn **Project**.
3. Màn hình **Import Git Repository**:
   - Lần đầu: bấm **Install** để cài **Vercel GitHub App** → chọn tài khoản GitHub → chọn **All repositories** hoặc **Only select repositories** (tick 2 repo FE, BE) → **Install**.
   - Không thấy repo trong danh sách: dùng dropdown ở góc trên trái danh sách để đổi tài khoản GitHub, hoặc bấm link chỉnh quyền GitHub App để cấp thêm repo.
4. Ở dòng repo **`iViettech-e-commerce-filter-api`** → bấm **Import**.

### 3.4. Cấu hình project BE

Màn hình **New Project / Configure Project**:

| Mục | Giá trị |
| --- | --- |
| **Project Name** | Ví dụ `ecommerce-api-tuan`. Tên này quyết định domain `https://ecommerce-api-tuan.vercel.app` (thêm tên riêng để không bị trùng) |
| **Framework Preset** | **Express** (Vercel tự nhận ra; nếu không thì chọn trong dropdown) |
| **Root Directory** | `./` (giữ nguyên) |
| **Build and Output Settings** | Giữ nguyên, **không** bật Override |

Mở rộng mục **Environment Variables**, thêm từng dòng (**Key** / **Value**):

| Key | Value |
| --- | --- |
| `DATABASE_URL` | Chuỗi ở 2.5 |
| `SUPABASE_URL` | Ở 2.6 |
| `SUPABASE_SECRET_KEY` | Ở 2.6 |
| `SUPABASE_STORAGE_BUCKET` | `uploads` |
| `JWT_ACCESS_SECRET` | Chuỗi 1 ở 3.2 |
| `JWT_REFRESH_SECRET` | Chuỗi 2 ở 3.2 |
| `ACCESS_TOKEN_EXPIRES_IN` | `15m` |
| `REFRESH_TOKEN_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | Tạm để `http://localhost:5173` (sửa ở **bước 5**) |
| `BASE_URL` | Tạm để `http://localhost:3000` (sửa ở **bước 3.6**) |
| `MAIL_HOST` | `smtp.gmail.com` *(tuỳ chọn, chỉ khi cần gửi mail)* |
| `MAIL_PORT` | `465` |
| `MAIL_SECURE` | `true` |
| `MAIL_USER` | Địa chỉ Gmail |
| `MAIL_PASSWORD` | App password 16 ký tự của Gmail (**không** phải mật khẩu đăng nhập) |
| `MAIL_FROM` | `MyShop <email-cua-ban@gmail.com>` (**không** gõ dấu ngoặc kép `"` như trong `.env`) |

> **Mẹo**: có thể copy cả nội dung kiểu file `.env` (`KEY=value` mỗi dòng) rồi **dán vào ô Key đầu tiên**: Vercel tự tách thành nhiều dòng. Kiểm tra lại từng dòng sau khi dán.
> **Không** thêm `PORT`: Vercel tự lo.
> Không cấu hình `MAIL_*` thì app vẫn chạy: đặt hàng không gửi mail, chức năng quên mật khẩu trả lỗi 503.

Bấm **Deploy**.

### 3.5. Chờ build và lấy domain BE

1. Màn hình build hiện log. Chờ khoảng 1 phút đến khi thấy **Congratulations!** / trạng thái **Ready**.
2. Bấm **Continue to Dashboard**.
3. Trang **Overview** của project → mục **Domains** → domain production, ví dụ `ecommerce-api-tuan.vercel.app`.
4. Mở thử trên trình duyệt: **`https://ecommerce-api-tuan.vercel.app/categories`**

   → Thấy JSON danh sách danh mục là **BE đã kết nối DB thành công** ✅.

Lưu domain này (có `https://`, **không** có `/` ở cuối). Đây là **API URL**.

### 3.6. Cập nhật `BASE_URL`

1. Trong project BE → sidebar trái → **Settings** → **Environment Variables**.
2. Tìm `BASE_URL` → bấm **⋯** (ba chấm) → **Edit** → đổi value thành API URL (ví dụ `https://ecommerce-api-tuan.vercel.app`) → **Save**.
3. Sửa biến xong **chưa có tác dụng ngay**. Sẽ redeploy một lần ở bước 5.

### 3.7. Quản lý biến môi trường (tham khảo)

Mỗi biến có:
- **Type**:
  - **Config**: xem lại được giá trị.
  - **Secret**: chỉ ghi, không xem lại được sau khi lưu. Nên chọn **Secret** cho `DATABASE_URL`, `SUPABASE_SECRET_KEY`, `JWT_*`, `MAIL_PASSWORD`.
- **Environments**: Production / Preview / Development. Giữ tick cả **Production** và **Preview**.

---

## 4. Vercel: deploy Frontend

### 4.1. Import repo FE

1. Dashboard Vercel → **Add New…** → **Project**.
2. Ở dòng repo **`iViettech-e-commerce-filter-web`** → **Import**.

### 4.2. Cấu hình project FE

| Mục | Giá trị |
| --- | --- |
| **Project Name** | Ví dụ `ecommerce-web-tuan` → domain `https://ecommerce-web-tuan.vercel.app` |
| **Framework Preset** | **Vite** (tự nhận) |
| **Root Directory** | `./` |
| **Build and Output Settings** | Giữ mặc định: Build `npm run build` (`vite build`), Output `dist`, Install `npm install` |

**Environment Variables**:

| Key | Value |
| --- | --- |
| `VITE_API_URL` | API URL ở 3.5, ví dụ `https://ecommerce-api-tuan.vercel.app` (**không** có `/` cuối) |

> Biến `VITE_*` được **gắn cứng vào file JS lúc build**, ai mở DevTools cũng thấy. Chọn Type **Config**, không đặt bí mật nào vào biến `VITE_*`.
> Đổi `VITE_API_URL` sau này thì **bắt buộc Redeploy** FE mới có tác dụng.

Bấm **Deploy** → chờ **Ready** → **Continue to Dashboard** → lấy domain FE, ví dụ `https://ecommerce-web-tuan.vercel.app`.

---

## 5. Nối FE và BE: cập nhật CLIENT_URL

`CLIENT_URL` dùng để tạo link trong email (xem đơn hàng, đặt lại mật khẩu).

1. Mở project **BE** (`ecommerce-api-tuan`) → **Settings** → **Environment Variables**.
2. `CLIENT_URL` → **⋯** → **Edit** → value = domain FE, ví dụ `https://ecommerce-web-tuan.vercel.app` (không `/` cuối) → **Save**.
3. Redeploy BE để áp dụng `CLIENT_URL` và `BASE_URL`:
   1. Sidebar → **Deployments**.
   2. Ở deployment trên cùng (nhãn **Production**, **Current**) → bấm **⋯** → **Redeploy**.
   3. Hộp thoại **Redeploy to Production** → bấm **Redeploy**.
4. Chờ trạng thái **Ready**.

---

## 6. Kiểm tra sau khi deploy

Mở domain FE và kiểm tra lần lượt:

| # | Kiểm tra | Kết quả mong đợi |
| --- | --- | --- |
| 1 | Trang chủ / danh sách sản phẩm | Hiện sản phẩm mẫu, lọc + phân trang hoạt động |
| 2 | Mở chi tiết sản phẩm rồi nhấn **F5** | Không bị 404 (nhờ `vercel.json`) |
| 3 | Đăng nhập `an@example.com` / `123456` | Vào được, F5 vẫn giữ đăng nhập |
| 4 | Thêm giỏ hàng → Checkout → đặt hàng | Đặt thành công. Có cấu hình mail thì nhận email, link trong mail mở đúng domain FE |
| 5 | Sổ địa chỉ: chọn Tỉnh/Thành, Phường/Xã | Dropdown có dữ liệu |
| 6 | Profile → đổi avatar | Ảnh hiện ra, URL ảnh dạng `https://<ref>.supabase.co/storage/v1/object/public/uploads/...` |
| 7 | Đăng nhập `admin@example.com` / `123456` → tạo sản phẩm có ảnh | Tạo thành công, ảnh có trong Supabase → **Storage** → **Files** → `uploads` |
| 8 | Chat: user gửi tin, admin mở trang Chat | Tin nhắn hiện realtime (xem lưu ý 8.2) |
| 9 | Quên mật khẩu (nếu có mail) | Nhận email, link mở `https://<web>.vercel.app/reset-password#...` |
| 10 | Supabase → **Table Editor** → `orders` | Thấy đơn hàng vừa đặt |

**Xem log khi có lỗi**: project BE trên Vercel → sidebar → **Logs**. Mọi `console.error` của BE (ví dụ lỗi DB, lỗi SMTP) hiện ở đây.

**Đổi mật khẩu tài khoản mẫu**: dữ liệu mẫu dùng mật khẩu `123456` công khai trong repo. Nếu link deploy chia sẻ ra ngoài, đăng nhập `admin@example.com` và đổi mật khẩu ngay (Profile → đổi mật khẩu).

---

## 7. Lỗi thường gặp

| Triệu chứng | Nguyên nhân | Cách xử lý |
| --- | --- | --- |
| Deploy BE thành công nhưng mọi API trả **500**, Logs có `Please install pg package manually` | Thiếu `dialectModule: pg` | Làm lại 1.1 – Bước 2 |
| Logs: `EROFS: read-only file system, mkdir '/var/task/uploads'` | Chưa đổi sang `memoryStorage` | Làm lại 1.1 – Bước 4 |
| Logs: `getaddrinfo ENOTFOUND db.xxxx.supabase.co` hoặc `ENETUNREACH` | Đang dùng **Direct connection** (IPv6) | Dùng **Transaction pooler** + **Use IPv4 connection** (2.5) |
| Logs: `password authentication failed` / `Tenant or user not found` | Sai mật khẩu, còn sót `[ ]`, hoặc user không có dạng `postgres.<ref>` | Copy lại chuỗi ở 2.5. Quên mật khẩu: sidebar **Database** → **Settings** → **Reset database password** (hoặc nút cùng tên trong panel **Connect**) → sửa `DATABASE_URL` trên Vercel → Redeploy |
| Logs: `self-signed certificate in certificate chain` | Thiếu cấu hình SSL | Kiểm tra `dialectOptions.ssl` trong `config/db.js` |
| Mở `/categories` của BE thì báo **404 NOT_FOUND** của Vercel | Vercel không nhận ra app Express | **Settings** → **Build and Deployment** → **Framework Preset** = **Express**, Root Directory `./` → Save → Redeploy |
| FE gọi API tới `http://localhost:3000` / `undefined/products` | Chưa đặt `VITE_API_URL` hoặc đặt rồi nhưng chưa redeploy FE | Đặt biến → **Deployments** → **⋯** → **Redeploy** |
| FE báo lỗi **CORS** | Thường do BE trả 500 (response lỗi không có header CORS) | Xem **Logs** của BE để biết lỗi thật |
| F5 ở trang con FE bị **404** | Thiếu `vercel.json` ở FE | Làm lại 1.2 – Bước 1, push lại |
| Upload ảnh lỗi **413** / `FUNCTION_PAYLOAD_TOO_LARGE` | Ảnh > 4,5 MB | Dùng ảnh nhỏ hơn 4 MB |
| Upload ảnh lỗi `new row violates row-level security policy` | Dùng nhầm publishable key | `SUPABASE_SECRET_KEY` phải là `sb_secret_...` |
| Upload ảnh lỗi `Bucket not found` | Tên bucket không khớp | Tên bucket = `SUPABASE_STORAGE_BUCKET` = `uploads` |
| Link trong email trỏ về `localhost` | Chưa sửa `CLIENT_URL` hoặc chưa redeploy BE | Làm lại bước 5 |
| Không nhận email | Thiếu `MAIL_*`, sai App password, hoặc vào thư mục Spam | Xem **Logs** BE, dòng `Gửi email ... thất bại` |
| API đầu tiên sau lâu không dùng chậm 1–3 giây | **Cold start** của Vercel Function | Bình thường |
| Tất cả API lỗi kết nối DB sau vài ngày không dùng | Project Supabase Free bị **tạm dừng** | Xem 8.1 |

---

## 8. Phụ lục

### 8.1. Giới hạn gói Free cần biết

**Supabase Free**
- Tối đa **2 project** đang hoạt động.
- Project **không có hoạt động trong 7 ngày** sẽ bị **tạm dừng (pause)**. Supabase gửi email báo trước.
- Khôi phục: mở project (hiện *Project "e-commerce" is paused*) → bấm **Resume project** → **Resume** → chờ vài phút.

**Vercel Hobby**
- Chỉ dùng cho mục đích cá nhân, phi thương mại.
- Body request/response tối đa **4,5 MB**.
- Function chạy tối đa **300 giây** mỗi lần gọi.

### 8.2. Lưu ý về chat realtime (socket.io)

Vercel hỗ trợ WebSocket ở dạng **Beta** (từ 06/2026), nên chat chạy được nhưng có giới hạn:

- Kết nối WebSocket **tự đóng sau tối đa 300 giây** (gói Hobby). socket.io-client tự kết nối lại; đoạn xử lý `connect_error` trong `src/services/socket.js` lo việc lấy token mới.
- Khi có nhiều người dùng cùng lúc, Vercel có thể chạy **nhiều instance**. `io.to(room).emit(...)` chỉ gửi tới client **cùng instance**, nên đôi khi admin không nhận realtime tin nhắn của khách (F5 vẫn thấy vì tin đã lưu DB).
  - Với bài tập/demo ít người dùng thì gần như không gặp.
  - Muốn chắc chắn khi chạy thật: thêm **Redis adapter** cho socket.io (Redis từ Vercel Marketplace), hoặc chuyển chat sang **Supabase Realtime**.
- Nếu chat hoàn toàn không kết nối được (DevTools → Network → WS báo lỗi), kiểm tra:
  1. FE đã có `transports: ['websocket']` chưa.
  2. **Logs** của BE.

### 8.3. Cập nhật code về sau

- Push lên nhánh `master` → Vercel **tự deploy production**.
- Push lên nhánh khác / mở Pull Request → Vercel tạo **Preview deployment** với URL riêng.
  - Preview của FE vẫn gọi BE production (theo `VITE_API_URL`), **dùng chung DB thật**.
- Thay đổi cấu trúc DB: sửa `database/schema.sql` để nó luôn mô tả đầy đủ DB.
  - **Thêm bảng / index mới**: chạy `npm run db:sync` ở repo BE.
  - **Thêm / sửa cột của bảng đã có**: `CREATE TABLE IF NOT EXISTS` sẽ bỏ qua bảng đã tồn tại, nên phải chạy câu `ALTER TABLE ...` tương ứng **1 lần** trong Supabase **SQL Editor**.
  - **Không** chạy `npm run db:seed` trên DB thật đang có dữ liệu.
- Sửa biến môi trường trên Vercel → luôn **Redeploy** (mục 5, bước 3).

### 8.4. Checklist nhanh

- [ ] BE + FE: merge nhánh `deploy/vercel-supabase` vào `master` (mục 1.3)
- [ ] Supabase: project (Singapore), `npm run db:seed` (hoặc SQL Editor), 10 bảng đều bật RLS
- [ ] Supabase: bucket `uploads` public, lấy `DATABASE_URL` (pooler 6543), `SUPABASE_URL`, `sb_secret_...`
- [ ] Vercel BE: preset Express, đủ biến môi trường → `/categories` trả JSON
- [ ] Vercel FE: preset Vite, `VITE_API_URL` → mở được trang
- [ ] BE: sửa `CLIENT_URL`, `BASE_URL` → Redeploy
- [ ] Chạy hết checklist mục 6
