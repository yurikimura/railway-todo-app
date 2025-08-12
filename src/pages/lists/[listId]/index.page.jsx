import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import { TaskItem } from '~/components/TaskItem'
import { TaskCreateForm } from '~/components/TaskCreateForm'
import Button from '~/components/Button'
import { setCurrentList } from '~/store/list'
import { fetchTasks } from '~/store/task'
import './index.css'

const ListIndex = () => {
  const dispatch = useDispatch()
  const { listId } = useParams()
  const [activeTab, setActiveTab] = useState('incomplete') // 'incomplete' or 'completed'
  const [showCreateForm, setShowCreateForm] = useState(false)

  const isLoading = useSelector(
    state => state.task.isLoading || state.list.isLoading
  )

  const tasks = useSelector(state => state.task.tasks)
  const listName = useSelector(state => {
    const currentId = state.list.current
    const list = state.list.lists?.find(list => list.id === currentId)
    return list?.title
  })
  const incompleteTasksCount = useSelector(state => {
    return state.task.tasks?.filter(task => !task.done).length
  })

  useEffect(() => {
    dispatch(setCurrentList(listId))
    dispatch(fetchTasks()).unwrap()
  }, [listId, dispatch])

  if (isLoading) {
    return <div></div>
  }

  return (
    <div className="tasks_list">
      <div className="tasks_list__title">
        {listName}
        {incompleteTasksCount > 0 && (
          <span className="tasks_list__title__count">
            {incompleteTasksCount}
          </span>
        )}
        <div className="tasks_list__title_spacer"></div>
        <Link to={`/lists/${listId}/edit`}>
          <Button>Edit...</Button>
        </Link>
      </div>
      
      <div className="tasks_list__header">
        <div className="tasks_list__header_top">
          <h2 className="tasks_list__tasks_title">タスク一覧</h2>
          <button 
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="tasks_list__new_task_button"
          >
            タスクの新規作成
          </button>
        </div>
        <div className="tasks_list__tabs">
          <button
            onClick={() => setActiveTab('incomplete')}
            className={`tasks_list__tab ${activeTab === 'incomplete' ? 'tasks_list__tab--active' : ''}`}
          >
            未完了
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`tasks_list__tab ${activeTab === 'completed' ? 'tasks_list__tab--active' : ''}`}
          >
            完了
          </button>
        </div>
      </div>
      
      <div className="tasks_list__items">
        {showCreateForm && <TaskCreateForm />}
        {(() => {
          const filteredTasks = tasks?.filter(task => 
            activeTab === 'incomplete' ? !task.done : task.done
          ) || []
          
          return filteredTasks.length > 0 ? (
            <>
              {filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} />
              ))}
            </>
          ) : (
            <div className="tasks_list__items__empty">
              {activeTab === 'incomplete' 
                ? 'No incomplete tasks yet!' 
                : 'No completed tasks yet!'
              }
            </div>
          )
        })()}
      </div>
    </div>
  )
}

export default ListIndex
