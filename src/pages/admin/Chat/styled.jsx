import styled from 'styled-components'

export const PageTitle = styled.h2`
  margin-bottom: 16px;
`

export const Container = styled.div`
  display: flex;
  height: calc(100vh - 64px - 48px - 48px); /* trừ header, padding của Content và tiêu đề trang */
  min-height: 400px;
  overflow: hidden;
  background-color: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
`

export const Sidebar = styled.div`
  width: 300px;
  flex-shrink: 0;
  overflow-y: auto;
  border-right: 1px solid #f0f0f0;
`

export const ConversationItem = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  background-color: ${({ $active }) => ($active ? '#e6f4ff' : 'transparent')};

  &:hover {
    background-color: ${({ $active }) => ($active ? '#e6f4ff' : '#fafafa')};
  }
`

export const ConversationInfo = styled.div`
  flex: 1;
  min-width: 0;
`

export const ConversationName = styled.div`
  font-weight: 500;
`

export const LastMessage = styled.div`
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 13px;
  color: #888;
`

export const ChatArea = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`

export const ChatHeader = styled.div`
  display: flex;
  flex-direction: column;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;

  span {
    font-size: 13px;
    color: #888;
  }
`

export const ChatBody = styled.div`
  flex: 1;
  min-height: 0;
`
