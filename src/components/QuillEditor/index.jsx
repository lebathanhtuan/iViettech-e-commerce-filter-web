import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'

// Toolbar đơn giản: tiêu đề, in đậm / nghiêng / gạch chân, danh sách, link, xóa định dạng
const modules = {
  toolbar: [
    [{ header: [2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['link'],
    ['clean'],
  ],
}

// Đặt trong <Form.Item name="description"> thì antd Form tự truyền value + onChange vào,
// giá trị lưu trong form là chuỗi HTML, vd: "<p>Hàng <strong>chính hãng</strong></p>"
function QuillEditor({ value, onChange, placeholder }) {
  return (
    <ReactQuill
      theme="snow"
      value={value || ''}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder}
      style={{ backgroundColor: '#fff' }}
    />
  )
}

export default QuillEditor
