import React from 'react'
import PropTypes from 'prop-types'
import './AuthLayout.css'

const AuthLayout = ({ children, title = 'Todoアプリ' }) => {
  return (
    <div className="auth_layout">
      <header className="auth_layout__header">
        <h1 className="auth_layout__app_title">{title}</h1>
      </header>
      <div className="auth_layout__content">
        <div className="auth_layout__container">{children}</div>
      </div>
    </div>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
}

export default AuthLayout
