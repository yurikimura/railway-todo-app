import { useCallback, useState, useEffect } from 'react'
import { Link, useHistory, useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { BackButton } from '~/components/BackButton'
import Button from '~/components/Button'
import Input from '~/components/Input'
import Textarea from '~/components/Textarea'
import DateTimePicker from '~/components/DateTimePicker'
import './index.css'
import { setCurrentList } from '~/store/list'
import { fetchTasks, updateTask, deleteTask } from '~/store/task'
import { formatToISO } from '~/utils/dateUtils'
import { useId } from '~/hooks/useId'

const EditTask = () => {
  const id = useId()

  const { listId, taskId } = useParams()
  const history = useHistory()
  const dispatch = useDispatch()

  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [done, setDone] = useState(false)
  const [limit, setLimit] = useState(null)

  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const task = useSelector(state =>
    state.task.tasks?.find(task => task.id === taskId)
  )

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDetail(task.detail)
      setDone(task.done)
      setLimit(task.limit ? new Date(task.limit) : null)
    }
  }, [task])

  useEffect(() => {
    void dispatch(setCurrentList(listId))
    void dispatch(fetchTasks())
  }, [listId, dispatch])

  const onSubmit = useCallback(
    event => {
      event.preventDefault()

      setIsSubmitting(true)

      const taskData = {
        id: taskId,
        title,
        detail,
        done,
        ...(limit !== null && { limit: formatToISO(limit) }),
      }

      void dispatch(updateTask(taskData))
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
    [title, taskId, listId, detail, done, limit, dispatch, history]
  )

  const handleDelete = useCallback(() => {
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return
    }

    setIsSubmitting(true)

    void dispatch(deleteTask({ id: taskId }))
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
  }, [taskId, dispatch, history])

  return (
    <main className="edit_list">
      <BackButton />
      <h2 className="edit_list__title">Edit List</h2>
      <p className="edit_list__error">{errorMessage}</p>
      <form className="edit_list__form" onSubmit={onSubmit}>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-title`} className="edit_list__form_label">
            Title
          </label>
          <Input
            id={`${id}-title`}
            placeholder="Buy some milk"
            value={title}
            onChange={event => setTitle(event.target.value)}
          />
        </fieldset>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-detail`} className="edit_list__form_label">
            Description
          </label>
          <Textarea
            id={`${id}-detail`}
            placeholder="Blah blah blah"
            value={detail}
            onChange={event => setDetail(event.target.value)}
            autoResize
          />
        </fieldset>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-limit`} className="edit_list__form_label">
            期限
          </label>
          <DateTimePicker
            id={`${id}-limit`}
            value={limit}
            onChange={setLimit}
            disabled={isSubmitting}
          />
        </fieldset>
        <fieldset className="edit_list__form_field">
          <label htmlFor={`${id}-done`} className="edit_list__form_label">
            Is Done
          </label>
          <div>
            <input
              id={`${id}-done`}
              type="checkbox"
              checked={done}
              onChange={event => setDone(event.target.checked)}
            />
          </div>
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

export default EditTask
