import styled from 'styled-components'

export const Wrapper = styled.div`
  padding: 24px;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
`

export const PageTitle = styled.h2`
  margin-bottom: 16px;
`

export const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const ProductImage = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 4px;
`

export const Summary = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  margin-top: 24px;
`

export const TotalPrice = styled.p`
  font-size: 18px;

  span {
    font-weight: bold;
    color: #ff4d4f;
  }
`
