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

export const SectionTitle = styled.h3`
  margin-bottom: 16px;
`

export const FormWrapper = styled.div`
  max-width: 400px;
`

export const AvatarBox = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
`

export const ProductInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

export const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 4px;
`

export const ProductName = styled.h4`
  margin-bottom: 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const ProductPrice = styled.p`
  color: #ff4d4f;
  font-weight: bold;
`
