import React, { useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import './Textarea.css'

const Textarea = ({
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  disabled = false,
  className = '',
  id,
  name,
  required = false,
  rows = 3,
  autoResize = false,
  size = 'medium',
  variant = 'default',
  ...props
}) => {
  const textareaRef = useRef(null)

  const textareaClasses = [
    'app_textarea',
    `app_textarea--${size}`,
    `app_textarea--${variant}`,
    disabled && 'app_textarea--disabled',
    autoResize && 'app_textarea--auto-resize',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  // Auto-resize functionality
  useEffect(() => {
    if (!autoResize || !textareaRef.current) {
      return
    }

    const textarea = textareaRef.current

    const recalcHeight = () => {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }

    textarea.addEventListener('input', recalcHeight)
    recalcHeight()

    return () => {
      textarea.removeEventListener('input', recalcHeight)
    }
  }, [autoResize, value])

  return (
    <textarea
      ref={textareaRef}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={textareaClasses}
      required={required}
      rows={rows}
      {...props}
    />
  )
}

Textarea.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.number,
  autoResize: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'error', 'success']),
}

export default Textarea
