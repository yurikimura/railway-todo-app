import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useLogout } from '~/hooks/useLogout'
import PropTypes from 'prop-types'
import './PageHeader.css'

const PageHeader = ({ title, showBackButton = false, backLink = '/' }) => {
  const userName = useSelector(state => state.auth.user?.name)
  const { logout } = useLogout()

  return (
    <header className="page_header">
      <div className="page_header__left">
        {showBackButton && (
          <Link to={backLink} className="page_header__back_button">
            ← 戻る
          </Link>
        )}
        <h1 className="page_header__title">{title}</h1>
      </div>
      <div className="page_header__right">
        <Link to="/" className="page_header__home_link">
          ホーム
        </Link>
        <span className="page_header__user_name">{userName}</span>
        <button onClick={logout} className="page_header__logout_button">
          ログアウト
        </button>
      </div>
    </header>
  )
}

PageHeader.propTypes = {
  title: PropTypes.string.isRequired,
  showBackButton: PropTypes.bool,
  backLink: PropTypes.string,
}

export default PageHeader
