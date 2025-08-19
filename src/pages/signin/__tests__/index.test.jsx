import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { configureStore } from '@reduxjs/toolkit'
import SignIn from '../index.page'

// モックの作成
const mockLogin = vi.fn().mockResolvedValue()

// モックモジュール
vi.mock('~/hooks/useLogin', () => ({
  useLogin: () => ({
    login: mockLogin,
  }),
}))

vi.mock('~/hooks/useId', () => ({
  useId: () => 'test-id',
}))

// Redux store のモック設定
const createMockStore = (initialState = {}) => {
  return configureStore({
    reducer: {
      auth: (state = { token: null }, action) => {
        switch (action.type) {
          case 'SET_TOKEN':
            return { ...state, token: action.payload }
          default:
            return state
        }
      },
    },
    preloadedState: {
      auth: { token: null },
      ...initialState,
    },
  })
}

// テスト用のラッパーコンポーネント
const TestWrapper = ({ children, initialState = {}, history }) => {
  const store = createMockStore(initialState)
  const testHistory = history || createMemoryHistory()

  return (
    <Provider store={store}>
      <Router history={testHistory}>{children}</Router>
    </Provider>
  )
}

describe('SignInコンポーネント', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('正しくレンダリングされる', () => {
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    )

    // ページタイトルとヘッダーの確認
    expect(screen.getByText('Todoアプリ')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'サインイン' })).toBeInTheDocument()
  })

  it('フォームの要素が正しく表示される', () => {
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    )

    // ラベルとフィールドの確認
    expect(screen.getByLabelText('メールアドレス')).toBeInTheDocument()
    expect(screen.getByLabelText('パスワード')).toBeInTheDocument()

    // ボタンの確認
    expect(screen.getByRole('button', { name: 'サインイン' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '新規作成' })).toBeInTheDocument()
  })

  it('入力フィールドが正しく動作する', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('メールアドレス')
    const passwordInput = screen.getByLabelText('パスワード')

    // メールアドレス入力
    await user.type(emailInput, 'test@example.com')
    expect(emailInput).toHaveValue('test@example.com')

    // パスワード入力
    await user.type(passwordInput, 'password123')
    expect(passwordInput).toHaveValue('password123')
  })

  it('フォーム送信が正しく動作する', async () => {
    const user = userEvent.setup()
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('メールアドレス')
    const passwordInput = screen.getByLabelText('パスワード')
    const submitButton = screen.getByRole('button', { name: 'サインイン' })

    // フォームに入力
    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    // フォーム送信
    await user.click(submitButton)

    // loginフックが呼ばれることを確認
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      })
    })
  })

  it('ログイン済みユーザーは / にリダイレクトされる', () => {
    const history = createMemoryHistory()
    render(
      <TestWrapper
        initialState={{ auth: { token: 'valid-token' } }}
        history={history}
      >
        <SignIn />
      </TestWrapper>
    )

    // リダイレクトが発生したことを確認
    expect(history.location.pathname).toBe('/')
  })

  it('ボタンが初期状態では有効である', () => {
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    )

    const submitButton = screen.getByRole('button', { name: 'サインイン' })
    expect(submitButton).not.toBeDisabled()
  })

  it('必要なHTML属性が正しく設定されている', () => {
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    )

    const emailInput = screen.getByLabelText('メールアドレス')
    const passwordInput = screen.getByLabelText('パスワード')

    // type属性の確認
    expect(emailInput).toHaveAttribute('type', 'email')
    expect(passwordInput).toHaveAttribute('type', 'password')

    // autocomplete属性の確認
    expect(emailInput).toHaveAttribute('autocomplete', 'email')
    expect(passwordInput).toHaveAttribute('autocomplete', 'current-password')

    // ID属性の確認
    expect(emailInput).toHaveAttribute('id', 'test-id-email')
    expect(passwordInput).toHaveAttribute('id', 'test-id-password')
  })

  it('新規作成リンクが正しく設定されている', () => {
    render(
      <TestWrapper>
        <SignIn />
      </TestWrapper>
    )

    const signupLink = screen.getByRole('link', { name: '新規作成' })
    expect(signupLink).toHaveAttribute('href', '/signup')
  })
}) 