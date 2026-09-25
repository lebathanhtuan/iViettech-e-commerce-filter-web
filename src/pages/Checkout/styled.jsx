import styled from 'styled-components'

export const Box = styled.div`
  margin-bottom: 24px;
  padding: 24px;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
`

export const SectionTitle = styled.h3`
  margin-bottom: 16px;
`

export const Note = styled.p`
  margin-bottom: 16px;
  color: #888;
`

export const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
`

export const TotalPrice = styled.div`
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  font-size: 18px;
  font-weight: bold;

  span:last-child {
    color: #ff4d4f;
  }
`
