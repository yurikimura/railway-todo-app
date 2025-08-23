import { useCallback, useEffect, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import './TaskCreateForm.css'
import { CheckIcon } from '~/icons/CheckIcon'
import { createTask } from '~/store/task'
import { formatToISO } from '~/utils/dateUtils'
import { useId } from '~/hooks/useId'
import Button from './Button'
import Input from './Input'
import DateTimePicker from './DateTimePicker'

export const TaskCreateForm = () => {
  const dispatch = useDispatch()
  const id = useId()

  const refForm = useRef(null)
  const [elemTextarea, setElemTextarea] = useState(null)

  const [formState, setFormState] = useState('initial')

  const [title, setTitle] = useState('')
  const [detail, setDetail] = useState('')
  const [done, setDone] = useState(false)
  const [limit, setLimit] = useState(null)

  const handleToggle = useCallback(() => {
    setDone(prev => !prev)
  }, [])

  const handleFocus = useCallback(() => {
    setFormState('focused')
  }, [])

  const handleBlur = useCallback(() => {
    if (title || detail || limit) {
      return
    }

    setTimeout(() => {
      // フォーム内の要素がフォーカスされている場合は何もしない
      const formElement = refForm.current
      if (formElement && formElement.contains(document.activeElement)) {
        return
      }

      setFormState('initial')
      setDone(false)
    }, 100)
  }, [title, detail, limit])

  const handleDiscard = useCallback(() => {
    setTitle('')
    setDetail('')
    setLimit(null)
    setFormState('initial')
    setDone(false)
  }, [])

  const onSubmit = useCallback(
    event => {
      event.preventDefault()

      setFormState('submitting')

      const taskData = {
        title: title || (detail ? detail.slice(0, 30) + (detail.length > 30 ? '...' : '') : '新しいタスク'),
        detail,
        done,
        ...(limit && { limit: formatToISO(limit) }),
      }

      void dispatch(createTask(taskData))
        .unwrap()
        .then(() => {
          handleDiscard()
        })
        .catch(err => {
          alert(err.message)
          setFormState('focused')
        })
    },
    [title, detail, done, limit, dispatch, handleDiscard]
  )

  useEffect(() => {
    if (!elemTextarea) {
      return
    }

    const recalcHeight = () => {
      elemTextarea.style.height = 'auto'
      elemTextarea.style.height = `${elemTextarea.scrollHeight}px`
    }

    elemTextarea.addEventListener('input', recalcHeight)
    recalcHeight()

    return () => {
      elemTextarea.removeEventListener('input', recalcHeight)
    }
  }, [elemTextarea])

  return (
    <form
      ref={refForm}
      className="task_create_form"
      onSubmit={onSubmit}
      data-state={formState}
    >
      <div className="task_create_form__title_container">
        <button
          type="button"
          onClick={handleToggle}
          className="task_create_form__mark_button"
          onFocus={handleFocus}
          onBlur={handleBlur}
        >
          {done ? (
            <div
              className="task_create_form__mark____complete"
              aria-label="Completed"
            >
              <CheckIcon className="task_create_form__mark____complete_check" />
            </div>
          ) : (
            <div
              className="task_create_form__mark____incomplete"
              aria-label="Incomplete"
            ></div>
          )}
        </button>
        <Input
          type="text"
          className="task_create_form__title"
          placeholder="Add a new task..."
          value={title}
          onChange={e => setTitle(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={formState === 'submitting'}
        />
      </div>
      {formState !== 'initial' && (
        <div>
          <textarea
            ref={setElemTextarea}
            rows={1}
            className="task_create_form__detail"
            placeholder="Add a description here..."
            value={detail}
            onChange={e => setDetail(e.target.value)}
            onBlur={handleBlur}
            disabled={formState === 'submitting'}
          />
          <div className="task_create_form__limit">
            <DateTimePicker
              id={`${id}-limit`}
              value={limit}
              onChange={setLimit}
              onBlur={handleBlur}
              disabled={formState === 'submitting'}
              placeholder="期限を設定（任意）"
              label="期限"
            />
          </div>
          <div className="task_create_form__actions">
            <Button
              type="button"
              variant="secondary"
              onBlur={handleBlur}
              onClick={handleDiscard}
              disabled={
                (!title && !detail && !limit) || formState === 'submitting'
              }
            >
              Discard
            </Button>
            <div className="task_create_form__spacer"></div>
            <Button
              type="submit"
              onBlur={handleBlur}
              disabled={!detail || formState === 'submitting'}
            >
              Add
            </Button>
          </div>
        </div>
      )}
    </form>
  )
}
