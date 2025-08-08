import React from 'react'
import PropTypes from 'prop-types'
import './DateTimePicker.css'
import {
  formatToDatetimeLocal,
  parseFromDatetimeLocal,
} from '~/utils/dateUtils'

const DateTimePicker = ({
  value,
  onChange,
  onFocus,
  onBlur,
  disabled = false,
  className = '',
  id,
  name,
  required = false,
  placeholder = '',
  label,
  ...props
}) => {
  const inputClasses = [
    'datetime_picker',
    disabled && 'datetime_picker--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const handleChange = event => {
    const newValue = event.target.value
    if (onChange) {
      const dateValue = newValue ? parseFromDatetimeLocal(newValue) : null
      onChange(dateValue)
    }
  }

  const formattedValue = value ? formatToDatetimeLocal(value) : ''

  return (
    <div className="datetime_picker_container">
      {label && (
        <label htmlFor={id} className="datetime_picker_label">
          {label}
        </label>
      )}
      <input
        type="datetime-local"
        id={id}
        name={name}
        value={formattedValue}
        onChange={handleChange}
        onFocus={onFocus}
        onBlur={onBlur}
        disabled={disabled}
        className={inputClasses}
        required={required}
        placeholder={placeholder}
        {...props}
      />
    </div>
  )
}

DateTimePicker.propTypes = {
  value: PropTypes.instanceOf(Date),
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  placeholder: PropTypes.string,
  label: PropTypes.string,
}

export default DateTimePicker
