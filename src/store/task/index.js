import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { handleThunkError } from '~/utils/handleThunkError'
import axios from '~/vendor/axios'

const initialState = {
  tasks: null,
  listId: null,
  isLoading: false,
}

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    resetTask: state => {
      state.tasks = null
      state.listId = null
      state.isLoading = false
    },
    setTasks: (state, action) => {
      state.tasks = action.payload
    },
    setListId: (state, action) => {
      state.listId = action.payload
    },
    setTaskIsLoading: (state, action) => {
      state.isLoading = action.payload
    },
    addTask: (state, action) => {
      const title = action.payload.title
      const id = action.payload.id
      const detail = action.payload.detail
      const done = action.payload.done
      const limit = action.payload.limit

      if (!state.tasks) {
        state.tasks = []
      }
      state.tasks.push({ title, id, detail, done, limit })
    },
    mutateTask: (state, action) => {
      const id = action.payload.id
      const idx = state.tasks.findIndex(list => list.id === id)
      if (idx === -1) {
        return
      }

      state.tasks[idx] = {
        ...state.tasks[idx],
        ...action.payload,
      }
    },
    removeTask: (state, action) => {
      const id = action.payload.id

      state.tasks = state.tasks.filter(list => list.id !== id)
    },
  },
})

export const {
  resetTask,
  setTasks,
  setListId,
  setTaskIsLoading,
  addTask,
  mutateTask,
  removeTask,
} = taskSlice.actions

export const fetchTasks = createAsyncThunk(
  'https://railway.todo.techtrain.dev/task/fetchTasks',
  async ({ force = false } = {}, thunkApi) => {
    const listId = thunkApi.getState().list.current
    const currentListId = thunkApi.getState().task.listId
    const isLoading = thunkApi.getState().task.isLoading

    if (!force && (currentListId === listId || isLoading)) {
      return
    }

    if (thunkApi.getState().auth.token === null) {
      return
    }

    thunkApi.dispatch(setTaskIsLoading(true))

    try {
      const res = await axios.get(`https://railway.todo.techtrain.dev/lists/${listId}/tasks`)
      thunkApi.dispatch(setTasks(res.data.tasks || []))
      thunkApi.dispatch(setListId(listId))
    } catch (e) {
      handleThunkError(e, thunkApi)
    } finally {
      thunkApi.dispatch(setTaskIsLoading(false))
    }
  }
)

export const createTask = createAsyncThunk(
  'https://railway.todo.techtrain.dev/task/createTask',
  async (payload, thunkApi) => {
    const listId = thunkApi.getState().list.current
    console.log('listId', listId)
    if (!listId) {
      console.warn('createTask: No listId found')
      return
    }

    try {
      const res = await axios.post(`https://railway.todo.techtrain.dev/lists/${listId}/tasks`, {
        "title": "string",
        "detail": "string",
        "done": true,
        "limit": "2023-12-12T23:59:59Z"
      })
      const id = res.data.id

      console.log('Task created successfully:', { ...payload, id })
      thunkApi.dispatch(
        addTask({
          ...payload,
          id,
        })
      )
    } catch (e) {
      console.error('createTask error:', e)
      handleThunkError(e, thunkApi)
    }
  }
)

export const updateTask = createAsyncThunk(
  'https://railway.todo.techtrain.dev/task/updateTask',
  async (payload, thunkApi) => {
    const listId = thunkApi.getState().list.current
    if (!listId) {
      return
    }

    const oldValue = thunkApi
      .getState()
      .task.tasks.find(task => task.id === payload.id)

    if (!oldValue) {
      return
    }

    try {
      await axios.put(`https://railway.todo.techtrain.dev/lists/${listId}/tasks/${payload.id}`, {
        ...oldValue,
        ...payload,
      })
      thunkApi.dispatch(mutateTask(payload))
    } catch (e) {
      handleThunkError(e, thunkApi)
    }
  }
)

export const deleteTask = createAsyncThunk(
  'https://railway.todo.techtrain.dev/task/deleteTask',
  async (payload, thunkApi) => {
    try {
      const listId = thunkApi.getState().list.current
      if (!listId) {
        return
      }

      await axios.delete(`https://railway.todo.techtrain.dev/lists/${listId}/tasks/${payload.id}`)
      thunkApi.dispatch(removeTask(payload))
    } catch (e) {
      handleThunkError(e, thunkApi)
    }
  }
)
