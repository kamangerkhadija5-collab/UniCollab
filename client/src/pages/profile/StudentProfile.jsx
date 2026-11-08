
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, GraduationCap, Code } from 'lucide-react'
import api from '../../services/api'

function StudentProfile() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [student, setStudent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await api.get(`/students/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        })

        setStudent(response.data.student)
      } catch (err) {
        setError(
          err.response?.data?.message || 'Unable to load student profile.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchStudent()
  }, [id])

  if (loading) {
    return <p className="p-10 text-center">Loading profile...</p>
  }

  if (error) {
    return <p className="p-10 text-center text-red-600">{error}</p>
  }

  if (!student) return null

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-3xl mx-auto">

        <button
          onClick={() => navigate('/find-students')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Students
        </button>

        <div className="bg-white rounded-2xl border shadow-sm p-8">

          <div className="flex items-center gap-5 mb-6">
            <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-3xl font-bold">
              {student.fullName?.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {student.fullName}
              </h1>
              <p className="text-gray-500">
                {student.department || 'Department not added'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-gray-600 mb-5">
            <GraduationCap size={20} />
            Semester: {student.semester || 'N/A'}
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-2">About</h2>
            <p className="text-gray-600">
              {student.bio || 'No bio available.'}
            </p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {(student.skills || []).map((item, index) => (
                <span
                  key={index}
                  className="bg-blue-50 text-blue-700 px-3 py-2 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold text-gray-800 mb-3">Interests</h2>
            <div className="flex flex-wrap gap-2">
              {(student.interests || []).map((item, index) => (
                <span
                  key={index}
                  className="bg-purple-50 text-purple-700 px-3 py-2 rounded-full text-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t pt-5 space-y-3">
            <p className="text-gray-600">
              <strong>Email:</strong> {student.email}
            </p>

            {student.github && (
              <a
                href={student.github}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-blue-600"
              >
                <Code size={18} /> GitHub Profile
              </a>
            )}

            {student.linkedin && (
              <a
                href={student.linkedin}
                target="_blank"
                rel="noreferrer"
                className="text-blue-600 block"
              >
                LinkedIn Profile
              </a>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default StudentProfile
