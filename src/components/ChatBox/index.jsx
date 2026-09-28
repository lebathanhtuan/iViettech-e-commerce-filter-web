import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, FloatButton } from 'antd'
import { CloseOutlined, MessageOutlined } from '@ant-design/icons'

import ChatConversation from '../ChatConversation'
import useChatSocket from '../../hooks/useChatSocket'
import { sendChatMessage } from '../../services/socket'
import { getMyMessagesThunk } from '../../redux/thunks/chat.thunk'
import { addMessage } from '../../redux/slices/chat.slice'
import * as S from './styled'

// Nút chat nổi ở góc phải màn hình, chỉ hiển thị khi user (không phải admin) đã đăng nhập
// (UserLayout quyết định có render component này hay không)
function ChatBox() {
  const dispatch = useDispatch()
  const { data: messages, loading } = useSelector((state) => state.chat.messageList)

  const [isOpen, setIsOpen] = useState(false)
  // Số tin admin gửi tới trong lúc khung chat đang đóng
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    dispatch(getMyMessagesThunk())
  }, [dispatch])

  useChatSocket((message) => {
    dispatch(addMessage(message))
    if (message.fromAdmin && !isOpen) {
      setUnreadCount((count) => count + 1)
    }
  })

  const handleOpen = () => {
    setIsOpen(true)
    setUnreadCount(0)
  }

  // User luôn chat trong cuộc trò chuyện của chính mình -> chỉ cần gửi content
  const handleSend = (content) => sendChatMessage({ content })

  if (!isOpen) {
    return (
      <FloatButton
        type="primary"
        icon={<MessageOutlined />}
        tooltip="Chat với shop"
        badge={{ count: unreadCount }}
        onClick={handleOpen}
      />
    )
  }

  return (
    <S.Panel>
      <S.Header>
        <span>Chat với MyShop</span>
        <Button type="text" size="small" icon={<CloseOutlined />} onClick={() => setIsOpen(false)} />
      </S.Header>
      <S.Body>
        <ChatConversation
          messages={messages}
          loading={loading}
          viewAsAdmin={false}
          onSend={handleSend}
          emptyText="Bạn cần hỗ trợ gì? Hãy nhắn cho shop nhé!"
        />
      </S.Body>
    </S.Panel>
  )
}

export default ChatBox
