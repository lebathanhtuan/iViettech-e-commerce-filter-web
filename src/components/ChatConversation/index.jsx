import { useEffect, useRef, useState } from 'react'
import { Button, Input, Spin, message as antdMessage } from 'antd'
import { SendOutlined } from '@ant-design/icons'

import * as S from './styled'

const formatTime = (createdAt) =>
  new Date(createdAt).toLocaleString('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
  })

// Khung chat dùng chung cho user (ChatBox) và admin (trang admin/Chat)
// - viewAsAdmin: true -> tin của admin nằm bên phải (tin của mình), false -> tin của user nằm bên phải
// - onSend(content): trả về Promise { success } hoặc { error }
function ChatConversation({ messages, loading, viewAsAdmin, onSend, emptyText }) {
  const [content, setContent] = useState('')
  const [sending, setSending] = useState(false)
  const listRef = useRef(null)

  // Có tin nhắn mới -> tự cuộn xuống cuối
  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight
    }
  }, [messages])

  const handleSend = async () => {
    const trimmedContent = content.trim()
    if (!trimmedContent || sending) {
      return
    }

    setSending(true)
    const result = await onSend(trimmedContent)
    setSending(false)

    if (result?.error) {
      antdMessage.error(result.error)
    } else {
      setContent('')
    }
  }

  // Enter để gửi, Shift + Enter để xuống dòng
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      handleSend()
    }
  }

  return (
    <S.Wrapper>
      <S.MessageList ref={listRef}>
        {loading && <Spin style={{ display: 'block', margin: '24px auto' }} />}

        {!loading && messages.length === 0 && <S.Empty>{emptyText}</S.Empty>}

        {messages.map((message) => {
          const isMine = message.fromAdmin === viewAsAdmin
          return (
            <S.MessageRow key={message.id} $isMine={isMine}>
              {/* Hiển thị dạng text bình thường (không dùng dangerouslySetInnerHTML) để tránh XSS */}
              <S.Bubble $isMine={isMine}>{message.content}</S.Bubble>
              <S.Time>{formatTime(message.createdAt)}</S.Time>
            </S.MessageRow>
          )
        })}
      </S.MessageList>

      <S.Composer>
        <Input.TextArea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Nhập tin nhắn..."
          autoSize={{ minRows: 1, maxRows: 4 }}
          maxLength={1000}
        />
        <Button type="primary" icon={<SendOutlined />} loading={sending} onClick={handleSend} />
      </S.Composer>
    </S.Wrapper>
  )
}

export default ChatConversation
