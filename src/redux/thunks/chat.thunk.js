import { createAsyncThunk } from '@reduxjs/toolkit'

import * as chatService from '../../services/chatService'

const getErrorMessage = (error) => error.response?.data?.message || 'Có lỗi xảy ra'

// Lịch sử chat của user đang đăng nhập
export const getMyMessagesThunk = createAsyncThunk(
  'chat/getMyMessages',
  async (_, { rejectWithValue }) => {
    try {
      const result = await chatService.getMyMessages()
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// (Admin) Danh sách cuộc trò chuyện
export const getConversationListThunk = createAsyncThunk(
  'chat/getConversationList',
  async (_, { rejectWithValue }) => {
    try {
      const result = await chatService.getConversationList()
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)

// (Admin) Lịch sử chat với 1 user
export const getConversationMessagesThunk = createAsyncThunk(
  'chat/getConversationMessages',
  async (userId, { rejectWithValue }) => {
    try {
      const result = await chatService.getConversationMessages(userId)
      return result
    } catch (error) {
      return rejectWithValue(getErrorMessage(error))
    }
  }
)
