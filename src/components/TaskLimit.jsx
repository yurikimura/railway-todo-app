import React from 'react'
import PropTypes from 'prop-types'
import './TaskLimit.css'
import { formatDisplayDate, calculateTimeRemaining } from '~/utils/dateUtils'

const TaskLimit = ({ limit, showRemaining = true, className = '' }) => {
  if (!limit) return null

  const { text, isOverdue, isToday } = calculateTimeRemaining(limit)
  const displayDate = formatDisplayDate(limit)

  const limitClasses = [
    'task_limit',
    isOverdue && 'task_limit--overdue',
    isToday && 'task_limit--today',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={limitClasses}>
      <div className="task_limit__date">{displayDate}</div>
      {showRemaining && text && (
        <div className="task_limit__remaining">{text}</div>
      )}
    </div>
  )
}

TaskLimit.propTypes = {
  limit: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  showRemaining: PropTypes.bool,
  className: PropTypes.string,
}

export default TaskLimit
