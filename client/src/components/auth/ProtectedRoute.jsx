import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import api from '../../services/api'

function ProtectedRoute({ children }) {
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (!token) {
      setStatus('unauthenticated')
      return
    }

    const verifyToken = async () => {
      try {
        const response = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        localStorage.setItem(
          'user',
          JSON.stringify(response.data.user)
        )

        setStatus('authenticated')
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setStatus('unauthenticated')
      }
    }

    verifyToken()
  }, [])

  if (status === 'loading') {
    return <div className="p-10 text-center">Verifying login...</div>
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute