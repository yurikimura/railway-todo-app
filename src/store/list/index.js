import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { handleThunkError } from '~/utils/handleThunkError'
import axios from '~/vendor/axios'

const initialState = {
  lists: null,
  current: null,
  isLoading: false,
}

export const listSlice = createSlice({
  name: 'list',
  initialState,
  reducers: {
    resetList: state => {
      state.lists = null
      state.current = null
      state.isLoading = false
    },
    setList: (state, action) => {
      state.lists = action.payload

      if (action.payload.length > 0) {
        state.current = action.payload[0].id
      } else {
        state.current = null
      }
    },
    setCurrentList: (state, action) => {
      state.current = action.payload
    },
    setListIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    addList: (state, action) => {
      const title = action.payload.title
      const detail = action.payload.detail
      const id = action.payload.id

      state.lists.push({ title, detail, id })
    },
    removeList: (state, action) => {
      const id = action.payload.id

      state.lists = state.lists.filter(list => list.id !== id)

      if (state.current === id) {
        state.current = state.lists[0]?.id || null
      }
    },
    mutateList: (state, action) => {
      const id = action.payload.id
      const title = action.payload.title
      const detail = action.payload.detail

      state.lists = state.lists.map(list => {
        if (list.id === id) {
          list.title = title
          if (detail !== undefined) {
            list.detail = detail
          }
        }

        return list
      })
    },
  },
})

export const {
  resetList,
  setList,
  setCurrentList,
  setListIsLoading,
  addList,
  removeList,
  mutateList,
} = listSlice.actions

export const fetchLists = createAsyncThunk(
  'https://railway.todo.techtrain.dev/list/fetchLists',
  async ({ force = false } = {}, thunkApi) => {
    const isLoading = thunkApi.getState().list.isLoading

    if (!force && (thunkApi.getState().list.lists || isLoading)) {
      return
    }

    if (thunkApi.getState().auth.token === null) {
      return
    }

    thunkApi.dispatch(setListIsLoading(true))

    try {
      const res = await axios.get('/lists')
      thunkApi.dispatch(setList(res.data))
    } catch (e) {
      return handleThunkError(e, thunkApi)
    } finally {
      thunkApi.dispatch(setListIsLoading(false))
    }
  }
)

export const createList = createAsyncThunk(
  'https://railway.todo.techtrain.dev/list/createList',
  async ({ title, detail }, thunkApi) => {
    try {
      const res = await axios.post('https://railway.todo.techtrain.dev/lists', { title, detail })
      thunkApi.dispatch(addList(res.data))

      return res.data.id
    } catch (e) {
      return handleThunkError(e, thunkApi)
    }
  }
)

export const deleteList = createAsyncThunk(
  'https://railway.todo.techtrain.dev/list/deleteList',
  async ({ id }, thunkApi) => {
    try {
      await axios.delete(`https://railway.todo.techtrain.dev/lists/${id}`)
      thunkApi.dispatch(removeList({ id }))
    } catch (e) {
      return handleThunkError(e, thunkApi)
    }
  }
)

export const updateList = createAsyncThunk(
  'https://railway.todo.techtrain.dev/list/updateList',
  async ({ id, title, detail }, thunkApi) => {
    try {
      const payload = { title }
      if (detail !== undefined) {
        payload.detail = detail
      }
      await axios.put(`https://railway.todo.techtrain.dev/lists/${id}`, payload)
      thunkApi.dispatch(mutateList({ id, title, detail }))
    } catch (e) {
      return handleThunkError(e, thunkApi)
    }
  }
)
