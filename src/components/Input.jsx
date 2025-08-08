import React from 'react'
import PropTypes from 'prop-types'
import './Input.css'

const Input = ({
  type = 'text',
  value,
  onChange,
  onFocus,
  onBlur,
  placeholder,
  disabled = false,
  className = '',
  id,
  name,
  autoComplete,
  required = false,
  size = 'medium',
  variant = 'default',
  ...props
}) => {
  const inputClasses = [
    'app_input',
    `app_input--${size}`,
    `app_input--${variant}`,
    disabled && 'app_input--disabled',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder={placeholder}
      disabled={disabled}
      className={inputClasses}
      autoComplete={autoComplete}
      required={required}
      {...props}
    />
  )
}

Input.propTypes = {
  type: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  autoComplete: PropTypes.string,
  required: PropTypes.bool,
  size: PropTypes.oneOf(['small', 'medium', 'large']),
  variant: PropTypes.oneOf(['default', 'error', 'success']),
}

export default Input
