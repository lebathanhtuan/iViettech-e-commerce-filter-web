import { createSlice } from '@reduxjs/toolkit'

import {
  getMyMessagesThunk,
  getConversationListThunk,
  getConversationMessagesThunk,
} from '../thunks/chat.thunk'

const initialState = {
  // Tin nhắn của cuộc trò chuyện đang mở (user: của chính mình, admin: của khách đang chọn)
  messageList: {
    data: [],
    loading: false,
    error: null,
  },
  // (Admin) Danh sách cuộc trò chuyện
  conversationList: {
    data: [],
    loading: false,
    error: null,
  },
}

const chatSlice = createSlice({
  name: 'chat',
  initialState: initialState,
  reducers: {
    // Có tin nhắn mới từ socket -> thêm vào cuối danh sách đang hiển thị
    addMessage: (state, action) => {
      const isExist = state.messageList.data.some((message) => message.id === action.payload.id)
      if (!isExist) {
        state.messageList.data.push(action.payload)
      }
    },
    // (Admin) Có tin nhắn mới -> cập nhật tin cuối của cuộc trò chuyện và đưa lên đầu danh sách
    updateConversation: (state, action) => {
      const message = action.payload
      const index = state.conversationList.data.findIndex(
        (conversation) => conversation.user.id === message.userId
      )
      if (index !== -1) {
        const [conversation] = state.conversationList.data.splice(index, 1)
        conversation.lastMessage = message
        state.conversationList.data.unshift(conversation)
      }
    },
  },
  extraReducers: (builder) => {
    // Get my messages + get conversation messages: cùng đổ vào messageList
    builder.addCase(getMyMessagesThunk.pending, (state) => {
      state.messageList.loading = true
      state.messageList.error = null
    })
    builder.addCase(getMyMessagesThunk.fulfilled, (state, action) => {
      state.messageList.loading = false
      state.messageList.data = action.payload
    })
    builder.addCase(getMyMessagesThunk.rejected, (state, action) => {
      state.messageList.loading = false
      state.messageList.error = action.payload
    })

    builder.addCase(getConversationMessagesThunk.pending, (state) => {
      state.messageList.loading = true
      state.messageList.error = null
      state.messageList.data = [] // Xóa tin của khách trước, tránh hiển thị nhầm khi đổi khách
    })
    builder.addCase(getConversationMessagesThunk.fulfilled, (state, action) => {
      state.messageList.loading = false
      state.messageList.data = action.payload
    })
    builder.addCase(getConversationMessagesThunk.rejected, (state, action) => {
      state.messageList.loading = false
      state.messageList.error = action.payload
    })

    // Get conversation list
    builder.addCase(getConversationListThunk.pending, (state) => {
      state.conversationList.loading = true
      state.conversationList.error = null
    })
    builder.addCase(getConversationListThunk.fulfilled, (state, action) => {
      state.conversationList.loading = false
      state.conversationList.data = action.payload
    })
    builder.addCase(getConversationListThunk.rejected, (state, action) => {
      state.conversationList.loading = false
      state.conversationList.error = action.payload
    })
  },
})

export const { addMessage, updateConversation } = chatSlice.actions

export default chatSlice.reducer
