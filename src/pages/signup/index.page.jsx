import React, { useCallback, useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import './index.css'
import { useSignup } from '~/hooks/useSignup'
import { useId } from '~/hooks/useId'
import Input from '~/components/Input'

const SignUp = () => {
  const auth = useSelector(state => state.auth.token !== null)

  const id = useId()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')

  const { signup } = useSignup()

  const onSubmit = useCallback(
    event => {
      event.preventDefault()

      setIsSubmitting(true)

      signup({ email, name, password })
        .catch(err => {
          setErrorMessage(`サインアップに失敗しました: ${err.message}`)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [email, name, password, signup]
  )

  if (auth) {
    return <Redirect to="/" />
  }

  return (
    <div className="signup">
      <header className="signup__header">
        <h1 className="signup__app_title">Todoアプリ</h1>
      </header>
      <h2 className="signup__title">新規登録</h2>
      {errorMessage && <div className="signup__error">{errorMessage}</div>}
      <form className="signup__form" onSubmit={onSubmit}>
        <fieldset className="signup__form_field">
          <label htmlFor={`${id}-email`} className="signup__form_label">
            メールアドレス
          </label>
          <Input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </fieldset>
        <fieldset className="signup__form_field">
          <label htmlFor={`${id}-name`} className="signup__form_label">
            名前
          </label>
          <Input
            id={`${id}-name`}
            type="text"
            autoComplete="name"
            value={name}
            onChange={event => setName(event.target.value)}
          />
        </fieldset>
        <fieldset className="signup__form_field">
          <label htmlFor={`${id}-password`} className="signup__form_label">
            パスワード
        </label>
          <Input
            id={`${id}-password`}
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </fieldset>
        <div className="signup__form_actions">
          <button
            type="submit"
            className="signup__primary_button"
            disabled={isSubmitting}
          >
            作成
          </button>
        </div>
      </form>
    </div>
  )
}

export default SignUp
