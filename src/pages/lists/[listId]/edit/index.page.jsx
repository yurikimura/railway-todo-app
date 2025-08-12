import { useCallback, useState, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { BackButton } from '~/components/BackButton'
import Button from '~/components/Button'
import Input from '~/components/Input'
import Textarea from '~/components/Textarea'
import './index.css'
import { fetchLists, updateList, deleteList } from '~/store/list'
import { useId } from '~/hooks/useId'

const EditList = () => {
  const id = useId()

  const { listId } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')

  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const list = useSelector(state =>
    state.list.lists?.find(list => list.id === listId)
  )

  useEffect(() => {
    if (list) {
      setTitle(list.title)
      setDetail(list.detail || '')
    }
  }, [list])

  useEffect(() => {
    void dispatch(fetchLists())
  }, [listId, dispatch])

  const onSubmit = useCallback(
    event => {
      event.preventDefault()

      setIsSubmitting(true)

      void dispatch(updateList({ id: listId, title, detail }))
        .unwrap()
        .then(() => {
          history.push(`/lists/${listId}`)
        })
        .catch(err => {
          setErrorMessage(err.message)
        })
        .finally(() => {
          setIsSubmitting(false)
        })
    },
    [title, detail, listId, dispatch, history]
  )

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this list?')) {
      return
    }

    setIsSubmitting(true)

    void dispatch(deleteList({ id: listId }))
      .unwrap()
      .then(() => {
        history.push(`/`)
      })
      .catch(err => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setIsSubmitting(false)
      })
  }, [dispatch, history, listId])

  return (
    <main className="edit_list">
      <BackButton />
      <h2 className="edit_list__title">Edit List</h2>
      <p className="edit_list__error">{errorMessage}</p>
      <form className="edit_list__form" onSubmit={onSubmit}>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-title`} className="edit_list__form_label">
            Name
          </label>
          <Input
            id={`${id}-title`}
            placeholder="Family"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </fieldset>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-detail`} className="edit_list__form_label">
            Detail
          </label>
          <Textarea
            id={`${id}-detail`}
            placeholder="リストの詳細を入力してください"
            value={detail}
            onChange={event => setDetail(event.target.value)}
            rows={3}
            autoResize={true}
          />
        </fieldset>
        <div className="edit_list__form_actions">
          <Link to="/" data-variant="secondary" className="app_button">
            Cancel
          </Link>
          <div className="edit_list__form_actions_spacer"></div>
          <Button
            type="button"
            variant="danger"
            className="edit_list__form_actions_delete"
            disabled={isSubmitting}
            onClick={handleDelete}
          >
            Delete
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            Update
          </Button>
        </div>
      </form>
    </main>
  )
}

export default EditList
