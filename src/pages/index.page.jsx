import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLists } from '~/store/list/index'
import { useLogout } from '~/hooks/useLogout'
import { ListIcon } from '~/icons/ListIcon'
import { PlusIcon } from '~/icons/PlusIcon'
import './index.css'

const Home = () => {
  const dispatch = useDispatch()

  const lists = useSelector(state => state.list.lists)
  const userName = useSelector(state => state.auth.user?.name)
  const { logout } = useLogout()

  useEffect(() => {
    dispatch(fetchLists())
  }, [dispatch])

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">Todoアプリ</h1>
        <div className="home__user">
          <span className="home__user_name">{userName}</span>
          <button onClick={logout} className="home__logout_button">
            ログアウト
          </button>
        </div>
      </header>

      <main className="home__main">
        <div className="home__lists_section">
          <div className="home__lists_header">
            <h2 className="home__lists_title">リスト</h2>
            <Link to="/list/new" className="home__new_list_button">
              <PlusIcon className="home__new_list_icon" />
              新規作成
            </Link>
          </div>

          {lists && lists.length > 0 ? (
            <ul className="home__lists">
              {lists.map(listItem => (
                <li key={listItem.id} className="home__list_item">
                  <Link
                    to={`/lists/${listItem.id}`}
                    className="home__list_link"
                  >
                    <ListIcon className="home__list_icon" />
                    <span className="home__list_title">{listItem.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="home__empty">
              <p>リストがありません</p>
              <Link to="/list/new" className="home__create_first_button">
                最初のリストを作成
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Home
