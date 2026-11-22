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
        const projectList = response.data.projects || []
        setProjects(projectList)

        if (projectList.length > 0) {
          setSelectedProject(projectList[0]._id)
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
      setTasks(response.data.tasks || [])
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to load tasks')
    }
  }

  useEffect(() => {
    if (selectedProject) {
      setForm((prev) => ({ ...prev, assignedTo: '' }))
      fetchTasks()
    }
  }, [selectedProject])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedProject) {
      alert('Please select a project first')
      return
    }

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
        dueDate: '',
        assignedTo: ''
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

  const activeProject = projects.find((p) => p._id === selectedProject)

  if (loading) return <p className="p-8 text-center text-gray-500">Loading Task Board...</p>

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Kanban Board</h1>

      {projects.length === 0 ? (
        <div className="bg-gray-50 p-8 rounded-xl text-center border">
          <p className="text-gray-600 font-medium">
            No projects found. Create a project under your team to start managing tasks.
          </p>
        </div>
      ) : (
        <>
          <div className="mb-6">
            <label className="block font-medium mb-2 text-gray-700">
              Select Project
            </label>
            <select
              value={selectedProject}
              onChange={(e) => setSelectedProject(e.target.value)}
              className="border rounded-lg p-3 w-full md:w-1/2 focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {projects.map((project) => (
                <option key={project._id} value={project._id}>
                  {project.name || project.title}
                </option>
              ))}
            </select>
          </div>

          <form
            onSubmit={handleSubmit}
            className="border bg-white rounded-xl p-5 mb-8 space-y-4 shadow-sm"
          >
            <h2 className="text-xl font-semibold text-gray-800">Create Task</h2>

            <input
              required
              placeholder="Task title"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
            />

            <textarea
              placeholder="Task description"
              rows="3"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="border rounded-lg p-3 w-full focus:outline-none focus:border-blue-500"
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="border rounded-lg p-3 bg-white"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>

              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="border rounded-lg p-3 bg-white"
              />

              <select
                value={form.assignedTo}
                onChange={(e) => setForm({ ...form, assignedTo: e.target.value })}
                className="border rounded-lg p-3 bg-white"
              >
                <option value="">Unassigned</option>
                {activeProject?.team?.members?.map(
                  (member) =>
                    member.user && (
                      <option key={member.user._id || member.user} value={member.user._id || member.user}>
                        {member.user.fullName || 'Team Member'}
                      </option>
                    )
                )}
              </select>
            </div>

            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
            >
              + Add Task
            </button>
          </form>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {columns.map((column) => (
              <div
                key={column.status}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault()
                  const taskId = e.dataTransfer.getData('taskId')
                  if (taskId) {
                    updateStatus(taskId, column.status)
                  }
                }}
                className="bg-gray-100 rounded-xl p-4 min-h-[350px] border"
              >
                <h2 className="text-xl font-bold mb-4 flex justify-between items-center text-gray-700">
                  <span>{column.title}</span>
                  <span className="bg-gray-200 text-gray-700 text-xs px-2.5 py-1 rounded-full">
                    {tasks.filter((task) => task.status === column.status).length}
                  </span>
                </h2>

                {tasks
                  .filter((task) => task.status === column.status)
                  .map((task) => (
                    <div
                      key={task._id}
                      draggable
                      onDragStart={(e) => {
                        e.dataTransfer.setData('taskId', task._id)
                      }}
                      className="bg-white rounded-lg p-4 mb-3 shadow-sm border border-gray-200 cursor-grab active:cursor-grabbing hover:shadow-md transition"
                    >
                      <h3 className="font-semibold text-gray-800">{task.title}</h3>
                      {task.description && (
                        <p className="text-sm text-gray-600 my-2">{task.description}</p>
                      )}

                      <div className="flex justify-between items-center text-xs text-gray-500 my-3">
                        <span className="capitalize font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                          {task.priority} Priority
                        </span>
                        <span>
                          Assigned: {task.assignedTo?.fullName || 'Unassigned'}
                        </span>
                      </div>

                      <select
                        value={task.status}
                        onChange={(e) => updateStatus(task._id, e.target.value)}
                        className="border rounded p-2 w-full text-sm bg-gray-50 focus:bg-white"
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