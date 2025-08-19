import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect, vi } from 'vitest'
import Input from '../Input'

describe('Inputコンポーネント', () => {
  it('正しくレンダリングされる', () => {
    render(<Input value="" onChange={() => {}} />)
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('正しいpropsが設定される', () => {
    const mockOnChange = vi.fn()
    render(
      <Input
        id="test-input"
        type="email"
        value="test@example.com"
        placeholder="メールアドレスを入力"
        onChange={mockOnChange}
        autoComplete="email"
        required
      />
    )

    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-input')
    expect(input).toHaveAttribute('type', 'email')
    expect(input).toHaveValue('test@example.com')
    expect(input).toHaveAttribute('placeholder', 'メールアドレスを入力')
    expect(input).toHaveAttribute('autocomplete', 'email')
    expect(input).toBeRequired()
  })

  it('onChangeが正しく呼ばれる', async () => {
    const user = userEvent.setup()
    const mockOnChange = vi.fn()
    render(<Input value="" onChange={mockOnChange} />)

    const input = screen.getByRole('textbox')
    await user.type(input, 'テスト入力')

    expect(mockOnChange).toHaveBeenCalledTimes(5) // "テスト入力"は5文字
  })

  it('disabled状態が正しく反映される', () => {
    render(<Input value="" onChange={() => {}} disabled />)
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('パスワードタイプが正しく設定される', () => {
    render(<Input type="password" value="" onChange={() => {}} />)
    const input = screen.getByDisplayValue('')
    expect(input).toHaveAttribute('type', 'password')
  })

  it('CSSクラスが正しく適用される', () => {
    render(
      <Input
        value=""
        onChange={() => {}}
        size="large"
        variant="error"
        className="custom-class"
      />
    )
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('app_input')
    expect(input).toHaveClass('app_input--large')
    expect(input).toHaveClass('app_input--error')
    expect(input).toHaveClass('custom-class')
  })

  it('フォーカスとブラーイベントが正しく動作する', async () => {
    const mockOnFocus = vi.fn()
    const mockOnBlur = vi.fn()
    render(
      <Input
        value=""
        onChange={() => {}}
        onFocus={mockOnFocus}
        onBlur={mockOnBlur}
      />
    )

    const input = screen.getByRole('textbox')
    await fireEvent.focus(input)
    expect(mockOnFocus).toHaveBeenCalledTimes(1)

    await fireEvent.blur(input)
    expect(mockOnBlur).toHaveBeenCalledTimes(1)
  })
}) 