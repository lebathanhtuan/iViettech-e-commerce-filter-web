import axios from 'axios'

// Instance axios dùng chung cho toàn bộ project
const api = axios.create({
  baseURL: 'http://localhost:3000',
})

export default api
