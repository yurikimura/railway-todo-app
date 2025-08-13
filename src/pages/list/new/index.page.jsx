import React, { useCallback, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import Button from '~/components/Button'
import Input from '~/components/Input'
import './index.css'
import '~/pages/index.css'
import { createList, setCurrentList } from '~/store/list/index'
import { useId } from '~/hooks/useId'
import { useLogout } from '~/hooks/useLogout'

const NewList = () => {
  const id = useId()
  const history = useHistory()
  const dispatch = useDispatch()
  const userName = useSelector(state => state.auth.user?.name)
  const { logout } = useLogout()

  const [title, setTitle] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const onSubmit = useCallback(
    event => {
      event.preventDefault()

      setIsSubmitting(true)

      void dispatch(createList({ title, detail: '' }))
        .unwrap()
        .then(listId => {
          dispatch(setCurrentList(listId))
          history.push(`/`)
        })
        .catch(err => {
          setErrorMessage(err.message)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [title, dispatch, history]
  )

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">Todoアプリ</h1>
        <div className="home__user">
          <span className="home__user_name">{userName}</span>
          <button onClick={logout} className="home__logout_button">
            サインアウト
          </button>
        </div>
      </header>
      <div className="signin__container">
        <main className="new_list">
          <h2 className="new_list__title">リスト新規作成</h2>
          <p className="new_list__error">{errorMessage}</p>
          <form className="new_list__form" onSubmit={onSubmit}>
            <fieldset className="new_list__form_field">
              <label htmlFor={`${id}-title`} className="new_list__form_label">
                タイトル
              </label>
              <Input
                id={`${id}-title`}
                placeholder=""
                value={title}
                onChange={event => setTitle(event.target.value)}
              />
            </fieldset>
            <div className="new_list__form_actions">
              <Button type="submit" size="small" disabled={isSubmitting}>
                作成
              </Button>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default NewList
