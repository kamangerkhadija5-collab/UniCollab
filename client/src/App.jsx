import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/dashboard/Dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Profile from './pages/profile/Profile'
import FindStudents from './pages/teams/FindStudents'
import StudentProfile from './pages/profile/StudentProfile'
import CreateTeam from './pages/teams/CreateTeam'
import Teams from './pages/teams/Teams'
import TeamRequests from './pages/teams/TeamRequests'
import Projects from './pages/projects/Projects'
import TaskBoard from './pages/projects/TaskBoard'
import Chat from './pages/chat/Chat'

export function App() {
  return (
    <Routes>



      <Route path="/" element={<Navigate to="/login" replace />} />

      <Route path="/login" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      <Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  }
/>

    <Route
  path="/find-students"
  element={
    <ProtectedRoute>
      <FindStudents />
    </ProtectedRoute>
  }
/>

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

<Route
  path="/students/:id"
  element={
    <ProtectedRoute>
      <StudentProfile />
    </ProtectedRoute>
  }
/>

<Route
  path="/teams/create"
  element={
    <ProtectedRoute>
      <CreateTeam />
    </ProtectedRoute>
  }
/>

<Route
  path="/teams"
  element={
    <ProtectedRoute>
      <Teams />
    </ProtectedRoute>
  }
/>

<Route
  path="/teams/requests"
  element={
    <ProtectedRoute>
      <TeamRequests />
    </ProtectedRoute>
  }
/>


<Route
  path="/projects"
  element={
    <ProtectedRoute>
      <Projects />
    </ProtectedRoute>
  }
/>


<Route
  path="/tasks"
  element={
    <ProtectedRoute>
      <TaskBoard />
    </ProtectedRoute>
  }
/>


<Route
  path="/chat"
  element={
    <ProtectedRoute>
      <Chat />
    </ProtectedRoute>
  }
/>

    </Routes>

    
  )
}

// export default App
