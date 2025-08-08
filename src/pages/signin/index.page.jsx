import React, { useCallback, useState } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLogin } from '~/hooks/useLogin'
import { useId } from '~/hooks/useId'
import Input from '~/components/Input'
import './index.css'

const SignIn = () => {
  const auth = useSelector(state => state.auth.token !== null)
  const { login } = useLogin()

  const id = useId()
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = useCallback(
    event => {
      event.preventDefault()

      setIsSubmitting(true)

      login({ email, password })
        .catch(err => {
          setErrorMessage(err.message)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [email, password, login]
  )

  if (auth) {
    return <Redirect to="/" />
  }

  return (
    <div className="signin">
      <header className="signin__header">
        <h1 className="signin__app_title">Todoアプリ</h1>
      </header>
      <h2 className="signin__title">サインイン</h2>
      {errorMessage && <div className="signin__error">{errorMessage}</div>}
      <form className="signin__form" onSubmit={onSubmit}>
        <fieldset className="signin__form_field">
          <label htmlFor={`${id}-email`} className="signin__form_label">
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
        <fieldset className="signin__form_field">
          <label htmlFor={`${id}-password`} className="signin__form_label">
            パスワード
          </label>
          <Input
            id={`${id}-password`}
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </fieldset>
        <div className="signin__form_actions">
          <button
            type="submit"
            className="signin__primary_button"
            disabled={isSubmitting}
          >
            サインイン
          </button>
          <div className="signin__form_actions_row">
            <Link className="signin__secondary_button" to="/signup">
              新規作成
            </Link>
          </div>
        </div>
      </form>
    </div>
  )
}

export default SignIn
