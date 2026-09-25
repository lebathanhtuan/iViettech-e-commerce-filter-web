import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  Row,
  Col,
  Button,
  Empty,
  Spin,
  Space,
  InputNumber,
  Rate,
  Form,
  Input,
  Avatar,
  message,
} from 'antd'
import { HeartOutlined, HeartFilled, UserOutlined } from '@ant-design/icons'

import { getProductDetailThunk } from '../../redux/thunks/product.thunk'
import { addToCartThunk } from '../../redux/thunks/cart.thunk'
import { addFavoriteThunk, deleteFavoriteThunk } from '../../redux/thunks/favorite.thunk'
import { getReviewListThunk, createReviewThunk } from '../../redux/thunks/review.thunk'
import { ROUTES } from '../../constants/routes'
import * as S from './styled'

function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [reviewForm] = Form.useForm()

  const [quantity, setQuantity] = useState(1)

  const { data: product, loading } = useSelector((state) => state.product.productDetail)
  const { data: user } = useSelector((state) => state.auth.userInfo)
  const { loading: addToCartLoading } = useSelector((state) => state.cart.addToCartData)
  const { data: favorites } = useSelector((state) => state.favorite.favoriteList)
  const { data: reviews } = useSelector((state) => state.review.reviewList)
  const { loading: createReviewLoading } = useSelector((state) => state.review.createReviewData)

  useEffect(() => {
    dispatch(getProductDetailThunk(id))
    dispatch(getReviewListThunk(id))
  }, [dispatch, id])

  // Sản phẩm đang xem có nằm trong danh sách yêu thích không
  const isFavorite = favorites.some((item) => item.id === Number(id))

  // Mỗi user chỉ được đánh giá 1 lần: đã có đánh giá của mình trong danh sách thì ẩn form
  const isReviewed = reviews.some((review) => review.user.id === user?.id)

  // Điểm trung bình = tổng số sao / số lượt đánh giá
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
      : 0

  // Các chức năng giỏ hàng, yêu thích bắt buộc đăng nhập
  const checkLogin = () => {
    if (!user) {
      message.warning('Vui lòng đăng nhập để tiếp tục')
      navigate(ROUTES.USER.LOGIN)
      return false
    }
    return true
  }

  const handleAddToCart = async () => {
    if (!checkLogin()) return

    try {
      // Sản phẩm đã có trong giỏ thì backend tự cộng thêm quantity
      await dispatch(addToCartThunk({ productId: product.id, quantity: quantity })).unwrap()
      message.success('Đã thêm vào giỏ hàng')
    } catch (error) {
      message.error(error)
    }
  }

  const handleToggleFavorite = async () => {
    if (!checkLogin()) return

    try {
      if (isFavorite) {
        await dispatch(deleteFavoriteThunk(product.id)).unwrap()
        message.success('Đã bỏ yêu thích')
      } else {
        await dispatch(addFavoriteThunk(product.id)).unwrap()
        message.success('Đã thêm vào yêu thích')
      }
    } catch (error) {
      message.error(error)
    }
  }

  // values: { rating, comment }
  const handleSubmitReview = async (values) => {
    try {
      await dispatch(createReviewThunk({ productId: id, data: values })).unwrap()
      message.success('Cảm ơn bạn đã đánh giá')
      reviewForm.resetFields()
    } catch (error) {
      message.error(error)
    }
  }

  if (loading) {
    return <Spin style={{ display: 'block', margin: '48px auto' }} />
  }

  if (!product) {
    return <Empty description="Không tìm thấy sản phẩm" />
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <S.Wrapper>
        <Row gutter={32}>
          <Col span={10}>
            <S.ProductImage
              alt={product.name}
              src={product.image || 'https://placehold.co/500x500?text=Product'}
            />
          </Col>

          <Col span={14}>
            <S.ProductName>{product.name}</S.ProductName>
            <S.RatingInfo>
              <Rate disabled allowHalf value={averageRating} />
              <span>({reviews.length} đánh giá)</span>
            </S.RatingInfo>
            <S.ProductPrice>
              {product.price?.toLocaleString('vi-VN')} đ
            </S.ProductPrice>

            <Space>
              <InputNumber min={1} value={quantity} onChange={(value) => setQuantity(value || 1)} />
              <Button
                type="primary"
                size="large"
                loading={addToCartLoading}
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>
              <Button
                size="large"
                icon={isFavorite ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                onClick={handleToggleFavorite}
              >
                {isFavorite ? 'Đã yêu thích' : 'Yêu thích'}
              </Button>
            </Space>
          </Col>
        </Row>
      </S.Wrapper>

      <S.Wrapper>
        <S.SectionTitle>Mô tả sản phẩm</S.SectionTitle>
        {product.description ? (
          // description là HTML do admin nhập bằng Quill editor -> dùng dangerouslySetInnerHTML để
          // hiển thị đúng định dạng (in đậm, danh sách...).
          // Chỉ dùng cho dữ liệu tin cậy (admin nhập). KHÔNG dùng cho nội dung user nhập
          // (vd: bình luận) vì có thể bị chèn script độc hại (tấn công XSS).
          // Quill 2 lưu dấu cách thành &nbsp; -> đổi lại thành dấu cách để chữ tự xuống dòng
          <S.ProductDescription
            dangerouslySetInnerHTML={{ __html: product.description.replaceAll('&nbsp;', ' ') }}
          />
        ) : (
          <p>Chưa có mô tả cho sản phẩm này.</p>
        )}
      </S.Wrapper>

      <S.Wrapper>
        <S.SectionTitle>Đánh giá sản phẩm</S.SectionTitle>

        {!user && (
          <p>
            Vui lòng <a onClick={() => navigate(ROUTES.USER.LOGIN)}>đăng nhập</a> để đánh giá sản phẩm.
          </p>
        )}

        {user && isReviewed && <p>Bạn đã đánh giá sản phẩm này. Cảm ơn bạn!</p>}

        {user && !isReviewed && (
          <Form
            form={reviewForm}
            layout="vertical"
            onFinish={handleSubmitReview}
            initialValues={{ rating: 5 }}
          >
            <Form.Item
              label="Số sao"
              name="rating"
              rules={[{ required: true, message: 'Vui lòng chọn số sao' }]}
            >
              <Rate />
            </Form.Item>
            <Form.Item
              label="Bình luận"
              name="comment"
              rules={[{ required: true, message: 'Vui lòng nhập bình luận' }]}
            >
              <Input.TextArea rows={3} placeholder="Chia sẻ cảm nhận của bạn về sản phẩm" />
            </Form.Item>
            <Button type="primary" htmlType="submit" loading={createReviewLoading}>
              Gửi đánh giá
            </Button>
          </Form>
        )}

        <S.ReviewList>
          {reviews.length === 0 && <Empty description="Chưa có đánh giá nào" />}
          {reviews.map((review) => (
            <S.ReviewItem key={review.id}>
              <Avatar src={review.user.avatar} icon={<UserOutlined />} />
              <div>
                <Space>
                  <strong>{review.user.name}</strong>
                  <Rate disabled value={review.rating} style={{ fontSize: 14 }} />
                </Space>
                <S.ReviewDate>{new Date(review.createdAt).toLocaleString('vi-VN')}</S.ReviewDate>
                {/* Bình luận của user hiển thị dạng text thường (React tự escape, an toàn) */}
                <p>{review.comment}</p>
              </div>
            </S.ReviewItem>
          ))}
        </S.ReviewList>
      </S.Wrapper>
    </Space>
  )
}

export default ProductDetail
