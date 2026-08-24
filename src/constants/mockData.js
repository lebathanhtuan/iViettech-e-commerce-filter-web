/**
 * Dữ liệu mẫu để xem trước giao diện khi chưa có API.
 *
 * [BÀI TẬP] Sau khi học viên implement xong các hàm trong services/productService.js
 * thì dữ liệu thật từ API sẽ được dùng thay cho dữ liệu mẫu này.
 */
export const MOCK_CATEGORIES = [
  { id: 1, name: 'Điện thoại' },
  { id: 2, name: 'Laptop' },
  { id: 3, name: 'Phụ kiện' },
]

export const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'iPhone 15 Pro Max',
    price: 29990000,
    categoryId: 1,
    categoryName: 'Điện thoại',
    image: 'https://placehold.co/300x300?text=iPhone+15',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S24 Ultra',
    price: 26990000,
    categoryId: 1,
    categoryName: 'Điện thoại',
    image: 'https://placehold.co/300x300?text=Galaxy+S24',
  },
  {
    id: 3,
    name: 'Xiaomi 14',
    price: 18990000,
    categoryId: 1,
    categoryName: 'Điện thoại',
    image: 'https://placehold.co/300x300?text=Xiaomi+14',
  },
  {
    id: 4,
    name: 'MacBook Air M3',
    price: 27990000,
    categoryId: 2,
    categoryName: 'Laptop',
    image: 'https://placehold.co/300x300?text=MacBook+Air',
  },
  {
    id: 5,
    name: 'Dell XPS 13',
    price: 31990000,
    categoryId: 2,
    categoryName: 'Laptop',
    image: 'https://placehold.co/300x300?text=Dell+XPS',
  },
  {
    id: 6,
    name: 'Asus Zenbook 14',
    price: 22990000,
    categoryId: 2,
    categoryName: 'Laptop',
    image: 'https://placehold.co/300x300?text=Zenbook',
  },
  {
    id: 7,
    name: 'Tai nghe AirPods Pro 2',
    price: 5990000,
    categoryId: 3,
    categoryName: 'Phụ kiện',
    image: 'https://placehold.co/300x300?text=AirPods',
  },
  {
    id: 8,
    name: 'Chuột Logitech MX Master 3S',
    price: 2490000,
    categoryId: 3,
    categoryName: 'Phụ kiện',
    image: 'https://placehold.co/300x300?text=MX+Master',
  },
  {
    id: 9,
    name: 'Bàn phím Keychron K2',
    price: 1990000,
    categoryId: 3,
    categoryName: 'Phụ kiện',
    image: 'https://placehold.co/300x300?text=Keychron',
  },
  {
    id: 10,
    name: 'Sạc dự phòng Anker 20000mAh',
    price: 990000,
    categoryId: 3,
    categoryName: 'Phụ kiện',
    image: 'https://placehold.co/300x300?text=Anker',
  },
]
