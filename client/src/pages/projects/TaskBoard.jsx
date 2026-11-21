
import { useEffect, useState } from 'react'
import api from '../../services/api'

function TaskBoard() {
  const [projects, setProjects] = useState([])
  const [selectedProject, setSelectedProject] = useState('')
  const [tasks, setTasks] = useState([])
const [form, setForm] = useState({
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
  assignedTo: ''
})

  const [loading, setLoading] = useState(true)

  const config = {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  }

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects', config)
        setProjects(response.data.projects)

        if (response.data.projects.length > 0) {
          setSelectedProject(response.data.projects[0]._id)
        }
      } catch (error) {
        alert(error.response?.data?.message || 'Failed to load projects')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const fetchTasks = async () => {
    if (!selectedProject) return

    try {
      const response = await api.get(
        `/tasks/project/${selectedProject}`,
        config
      )
      setTasks(response.data.tasks)
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load tasks')
    }
  }

  useEffect(() => {
    fetchTasks()
  }, [selectedProject])

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      await api.post(
        '/tasks',
        { ...form, project: selectedProject },
        config
      )

      alert('Task created successfully')

      setForm({
        title: '',
        description: '',
        priority: 'medium',
        dueDate: ''
      })

      fetchTasks()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create task')
    }
  }

  const updateStatus = async (taskId, status) => {
    try {
      await api.put(`/tasks/${taskId}/status`, { status }, config)
      fetchTasks()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status')
    }
  }

  const columns = [
    { status: 'todo', title: 'To Do' },
    { status: 'in-progress', title: 'In Progress' },
    { status: 'done', title: 'Done' }
  ]

  if (loading) return <p className="p-8">Loading...</p>

  
return (
  <div className="max-w-7xl mx-auto p-6">
    <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>

    {projects.length === 0 ? (
      <p>Create a project first to manage its tasks.</p>
    ) : (
      <>
        <label className="block font-medium mb-2">
          Select Project
        </label>

        <select
          value={selectedProject}
          onChange={(e) => setSelectedProject(e.target.value)}
          className="border rounded-lg p-3 mb-6 w-full md:w-1/2"
        >
          {projects.map(project => (
            <option key={project._id} value={project._id}>
              {project.name}
            </option>
          ))}
        </select>

        <form
          onSubmit={handleSubmit}
          className="border rounded-xl p-5 mb-8 space-y-3"
        >
          <h2 className="text-xl font-semibold">Create Task</h2>

          <input
            required
            placeholder="Task title"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="border rounded-lg p-3 w-full"
          />

          <textarea
            placeholder="Task description"
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="border rounded-lg p-3 w-full"
          />

          <div className="flex flex-wrap gap-3">
            <select
              value={form.priority}
              onChange={e => setForm({ ...form, priority: e.target.value })}
              className="border rounded-lg p-3"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <input
              type="date"
              value={form.dueDate}
              onChange={e => setForm({ ...form, dueDate: e.target.value })}
              className="border rounded-lg p-3"
            />

            <select
              value={form.assignedTo}
              onChange={e => setForm({ ...form, assignedTo: e.target.value })}
              className="border rounded-lg p-3"
            >
              <option value="">Unassigned</option>

              {projects
                .find(project => project._id === selectedProject)
                ?.team?.members?.map(member => (
                  member.user && (
                    <option key={member.user._id} value={member.user._id}>
                      {member.user.fullName}
                    </option>
                  )
                ))}
            </select>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Add Task
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {columns.map(column => (
            <div
              key={column.status}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault()
                const taskId = e.dataTransfer.getData('taskId')

                if (taskId) {
                  updateStatus(taskId, column.status)
                }
              }}
              className="bg-gray-100 rounded-xl p-4 min-h-64"
            >
              <h2 className="text-xl font-bold mb-4">
                {column.title}
                <span className="text-gray-500 text-sm ml-2">
                  ({tasks.filter(task => task.status === column.status).length})
                </span>
              </h2>

              {tasks
                .filter(task => task.status === column.status)
                .map(task => (
                  <div
                    key={task._id}
                    draggable
                    onDragStart={e => {
                      e.dataTransfer.setData('taskId', task._id)
                    }}
                    className="bg-white rounded-lg p-4 mb-3 shadow-sm cursor-grab active:cursor-grabbing"
                  >
                    <h3 className="font-semibold">{task.title}</h3>

                    <p className="text-sm text-gray-600 my-2">
                      {task.description}
                    </p>

                    <p className="text-xs text-gray-500">
                      Priority: {task.priority}
                    </p>

                    <p className="text-xs text-gray-500 mb-3">
                      Assigned: {task.assignedTo?.fullName || 'Unassigned'}
                    </p>

                    <select
                      value={task.status}
                      onChange={e => updateStatus(task._id, e.target.value)}
                      className="border rounded p-2 w-full text-sm"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="done">Done</option>
                    </select>
                  </div>
                ))}
            </div>
          ))}
        </div>
      </>
    )}
  </div>
)
}

export default TaskBoard
