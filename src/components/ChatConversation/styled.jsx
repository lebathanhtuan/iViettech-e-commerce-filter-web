import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
`

export const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  background-color: #f5f5f5;
`

export const Empty = styled.p`
  margin-top: 24px;
  text-align: center;
  color: #888;
`

// Props bắt đầu bằng $ (transient props) chỉ dùng cho CSS, không bị truyền xuống thẻ HTML
export const MessageRow = styled.div`
  display: flex;
  flex-direction: column;
  align-items: ${({ $isMine }) => ($isMine ? 'flex-end' : 'flex-start')};
  margin-bottom: 8px;
`

export const Bubble = styled.div`
  max-width: 75%;
  padding: 8px 12px;
  border-radius: 12px;
  white-space: pre-wrap;
  word-break: break-word;
  color: ${({ $isMine }) => ($isMine ? '#fff' : '#333')};
  background-color: ${({ $isMine }) => ($isMine ? '#1677ff' : '#fff')};
`

export const Time = styled.span`
  margin-top: 2px;
  font-size: 11px;
  color: #999;
`

export const Composer = styled.div`
  display: flex;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid #f0f0f0;
  background-color: #fff;
`
