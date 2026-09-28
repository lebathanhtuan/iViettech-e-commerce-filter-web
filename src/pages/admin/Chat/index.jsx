import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, Badge, Empty, Spin } from 'antd'
import { UserOutlined } from '@ant-design/icons'

import ChatConversation from '../../../components/ChatConversation'
import useChatSocket from '../../../hooks/useChatSocket'
import { sendChatMessage } from '../../../services/socket'
import {
  getConversationListThunk,
  getConversationMessagesThunk,
} from '../../../redux/thunks/chat.thunk'
import { addMessage, updateConversation } from '../../../redux/slices/chat.slice'
import * as S from './styled'

function AdminChat() {
  const dispatch = useDispatch()

  const { data: conversations, loading: conversationLoading } = useSelector(
    (state) => state.chat.conversationList
  )
  const { data: messages, loading: messageLoading } = useSelector(
    (state) => state.chat.messageList
  )

  const [selectedUserId, setSelectedUserId] = useState(null)
  // id các khách có tin nhắn mới mà admin chưa mở xem
  const [unreadUserIds, setUnreadUserIds] = useState([])

  const selectedConversation = conversations.find(
    (conversation) => conversation.user.id === selectedUserId
  )

  useEffect(() => {
    dispatch(getConversationListThunk())
  }, [dispatch])

  useEffect(() => {
    if (selectedUserId) {
      dispatch(getConversationMessagesThunk(selectedUserId))
    }
  }, [dispatch, selectedUserId])

  useChatSocket((message) => {
    const isExistConversation = conversations.some(
      (conversation) => conversation.user.id === message.userId
    )

    if (isExistConversation) {
      dispatch(updateConversation(message))
    } else {
      // Khách mới nhắn lần đầu -> chưa có trong danh sách, lấy lại danh sách từ server
      dispatch(getConversationListThunk())
    }

    if (message.userId === selectedUserId) {
      dispatch(addMessage(message))
    } else if (!message.fromAdmin && !unreadUserIds.includes(message.userId)) {
      setUnreadUserIds([...unreadUserIds, message.userId])
    }
  })

  const handleSelectConversation = (userId) => {
    setSelectedUserId(userId)
    setUnreadUserIds(unreadUserIds.filter((id) => id !== userId))
  }

  // Admin trả lời khách nào thì phải gửi kèm userId của khách đó
  const handleSend = (content) => sendChatMessage({ content, userId: selectedUserId })

  return (
    <div>
      <S.PageTitle>Chat với khách hàng</S.PageTitle>

      <S.Container>
        <S.Sidebar>
          {conversationLoading && <Spin style={{ display: 'block', margin: '24px auto' }} />}

          {!conversationLoading && conversations.length === 0 && (
            <Empty description="Chưa có khách nào nhắn tin" style={{ marginTop: 48 }} />
          )}

          {conversations.map(({ user, lastMessage }) => (
            <S.ConversationItem
              key={user.id}
              $active={user.id === selectedUserId}
              onClick={() => handleSelectConversation(user.id)}
            >
              <Badge dot={unreadUserIds.includes(user.id)}>
                <Avatar src={user.avatar} icon={<UserOutlined />} />
              </Badge>
              <S.ConversationInfo>
                <S.ConversationName>{user.name}</S.ConversationName>
                <S.LastMessage>
                  {lastMessage.fromAdmin && 'Bạn: '}
                  {lastMessage.content}
                </S.LastMessage>
              </S.ConversationInfo>
            </S.ConversationItem>
          ))}
        </S.Sidebar>

        <S.ChatArea>
          {selectedConversation ? (
            <>
              <S.ChatHeader>
                <strong>{selectedConversation.user.name}</strong>
                <span>{selectedConversation.user.email}</span>
              </S.ChatHeader>
              <S.ChatBody>
                <ChatConversation
                  messages={messages}
                  loading={messageLoading}
                  viewAsAdmin={true}
                  onSend={handleSend}
                  emptyText="Chưa có tin nhắn"
                />
              </S.ChatBody>
            </>
          ) : (
            <Empty description="Chọn 1 khách hàng để bắt đầu trò chuyện" style={{ marginTop: 120 }} />
          )}
        </S.ChatArea>
      </S.Container>
    </div>
  )
}

export default AdminChat
