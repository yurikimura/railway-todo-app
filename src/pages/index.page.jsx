import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchLists, setCurrentList } from '~/store/list/index'
import { fetchTasks, resetTask } from '~/store/task'
import { useLogout } from '~/hooks/useLogout'
import { TaskItem } from '~/components/TaskItem'
import { TaskCreateForm } from '~/components/TaskCreateForm'
import './index.css'

const Home = () => {
  const dispatch = useDispatch()
  const [selectedListId, setSelectedListId] = useState(null)
  const [activeTab, setActiveTab] = useState('incomplete') // 'incomplete' or 'completed'
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [statusMenuOpen, setStatusMenuOpen] = useState(false)

  const lists = useSelector(state => state.list.lists)
  const tasks = useSelector(state => state.task.tasks)
  const userName = useSelector(state => state.auth.user?.name)
  const currentListId = useSelector(state => state.list.current)
  const { logout } = useLogout()

  const selectedList = lists?.find(list => list.id === selectedListId)

  useEffect(() => {
    dispatch(fetchLists({ force: true }))
  }, [dispatch])

  // ページがフォーカスを得た時にリスト一覧を再取得
  useEffect(() => {
    const handleFocus = () => {
      dispatch(fetchLists({ force: true }))
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [dispatch])

  useEffect(() => {
    if (selectedListId) {
      dispatch(resetTask()) // 前のタスクをクリア
      dispatch(setCurrentList(selectedListId))
      dispatch(fetchTasks({ force: true })) // 強制的に新しいタスクをフェッチ
    }
  }, [selectedListId, dispatch])

  const handleListSelect = listId => {
    setSelectedListId(listId)
  }

  return (
    <div className="home">
      <header className="home__header">
        <h1 className="home__title">Todoアプリ</h1>
        <div className="home__user">
          <span className="home__user_name">{userName}</span>
          <button onClick={logout} className="home__logout_button">
            サインアウト
          </button>
        </div>
      </header>
      <div className="signin__container">
        <main className="home__main">
          <div className="home__lists_section">
            <div className="home__lists_header">
              <h2 className="home__lists_title">リスト一覧</h2>
              <div className="home__lists_actions">
                <Link to="/list/new" className="home__action_button">
                  リストの新規作成
                </Link>
                {selectedListId && (
                  <Link
                    to={`/lists/${selectedListId}/edit`}
                    className="home__action_button"
                  >
                    選択中のリストを編集
                  </Link>
                )}
              </div>
            </div>

            {lists && lists.length > 0 ? (
              <ul className="home__lists">
                {lists.map(listItem => (
                  <li key={listItem.id} className="home__list_item">
                    <button
                      onClick={() => handleListSelect(listItem.id)}
                      className={`home__list_button ${selectedListId === listItem.id ? 'home__list_button--selected' : ''}`}
                    >
                      <span className="home__list_title">{listItem.title}</span>
                    </button>
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

          {selectedListId && (
            <div className="home__tasks_section">
              <div className="home__tasks_header">
                <div className="home__tasks_header_top">
                  <h2 className="home__tasks_title">タスク一覧</h2>
                  <div className="home__tasks_actions">
                    <button 
                      onClick={() => setShowCreateForm(!showCreateForm)}
                      className="home__new_task_button"
                    >
                      タスクの新規作成
                    </button>
                    <div className="home__tasks_filter">
                      <button
                        type="button"
                        className="home__tasks_filter_button"
                        onClick={() => setStatusMenuOpen(!statusMenuOpen)}
                        aria-expanded={statusMenuOpen}
                        aria-haspopup="listbox"
                      >
                        {activeTab === 'incomplete' ? '未完了' : '完了'}
                      </button>
                      {statusMenuOpen && (
                        <div className="home__tasks_filter_menu" role="listbox">
                          <button
                            type="button"
                            className={`home__tasks_filter_option ${activeTab === 'incomplete' ? 'is-active' : ''}`}
                            onClick={() => { setActiveTab('incomplete'); setStatusMenuOpen(false) }}
                            role="option"
                            aria-selected={activeTab === 'incomplete'}
                          >
                            未完了
                          </button>
                          <button
                            type="button"
                            className={`home__tasks_filter_option ${activeTab === 'completed' ? 'is-active' : ''}`}
                            onClick={() => { setActiveTab('completed'); setStatusMenuOpen(false) }}
                            role="option"
                            aria-selected={activeTab === 'completed'}
                          >
                            完了
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <p className="home__tasks_category">
                  カテゴリー: {selectedList?.title}
                </p>
              </div>
              <div className="home__tasks_content">
                {showCreateForm && <TaskCreateForm />}
                {(() => {
                  const filteredTasks = tasks?.filter(task => 
                    activeTab === 'incomplete' ? !task.done : task.done
                  ) || []
                  
                  return filteredTasks.length > 0 ? (
                    <div className="home__tasks_list">
                      {filteredTasks.map(task => (
                        <TaskItem key={task.id} task={task} />
                      ))}
                    </div>
                  ) : (
                    <div className="home__tasks_empty">
                      <p>
                        {activeTab === 'incomplete' 
                          ? 'このカテゴリーには未完了のタスクがありません' 
                          : 'このカテゴリーには完了したタスクがありません'
                        }
                      </p>
                    </div>
                  )
                })()}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default Home
