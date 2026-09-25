import styled from 'styled-components'

export const Wrapper = styled.div`
  padding: 24px;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
`

export const ProductImage = styled.img`
  width: 100%;
  border-radius: 8px;
`

export const ProductName = styled.h1`
  margin-bottom: 8px;
`

export const RatingInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  color: #888;
`

export const ProductPrice = styled.p`
  margin-bottom: 24px;
  font-size: 28px;
  font-weight: bold;
  color: #ff4d4f;
`

export const SectionTitle = styled.h3`
  margin-bottom: 16px;
`

// Dùng div (không dùng p) vì bên trong là HTML có thể chứa <p>, <ul>, <h2>...
// index.css đã reset margin/padding nên cần thêm lại khoảng cách cho các thẻ này
export const ProductDescription = styled.div`
  color: #555;
  line-height: 1.6;

  p,
  ul,
  ol,
  h2,
  h3 {
    margin-bottom: 8px;
  }

  ul,
  ol {
    padding-left: 24px;
  }
`

export const ReviewList = styled.div`
  margin-top: 24px;
`

export const ReviewItem = styled.div`
  display: flex;
  gap: 12px;
  padding: 16px 0;
  border-top: 1px solid #f0f0f0;
`

export const ReviewDate = styled.div`
  margin-bottom: 4px;
  font-size: 12px;
  color: #999;
`
