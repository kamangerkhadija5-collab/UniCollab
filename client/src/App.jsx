import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/auth/Login'
import Signup from './pages/auth/Signup'
import Dashboard from './pages/dashboard/Dashboard'
import ProtectedRoute from './components/auth/ProtectedRoute'
import Profile from './pages/profile/Profile'
import FindStudents from './pages/teams/FindStudents'
import StudentProfile from './pages/profile/StudentProfile'
function App() {
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

    </Routes>

    
  )
}

export default App