
import { useEffect, useState } from 'react'
import { Search, Users, GraduationCap, Code } from 'lucide-react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'

function FindStudents() {
  const [students, setStudents] = useState([])
  const [search, setSearch] = useState('')
  const [skill, setSkill] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  

  const fetchStudents = async () => {
    try {
      setLoading(true)
      setError('')

      const response = await api.get('/students', {
        params: { search, skill },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      setStudents(response.data.students)
    } catch (err) {
      setError(
        err.response?.data?.message || 'Unable to load students.'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudents()
  }, [search, skill])

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Find Students
          </h1>
          <p className="text-gray-500 mt-2">
            Discover students with skills and interests similar to yours.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-8 grid md:grid-cols-2 gap-4">

          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-3.5 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by name or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <input
            type="text"
            placeholder="Filter by skill (e.g. Python)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

        </div>

        {/* Students */}
        {loading ? (
          <p className="text-center py-10 text-gray-500">
            Loading students...
          </p>
        ) : error ? (
          <p className="text-center py-10 text-red-600">
            {error}
          </p>
        ) : students.length === 0 ? (
          <div className="bg-white rounded-xl p-10 text-center border">
            <Users size={40} className="mx-auto text-gray-400 mb-3" />
            <h2 className="font-semibold text-gray-700">
              No students found
            </h2>
            <p className="text-gray-500 mt-2">
              Try another name or skill.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-500 mb-4">
              {students.length} students found
            </p>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {students.map((student) => (
                <div
                  key={student._id}
                  className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition"
                >

                  {/* Student Information */}
                  <div className="flex justify-between items-start">

                    <div>
                      <div className="w-14 h-14 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xl font-bold">
                        {student.fullName?.charAt(0).toUpperCase()}
                      </div>

                      <h2 className="font-bold text-lg text-gray-800 mt-3">
                        {student.fullName}
                      </h2>

                      <p className="text-sm text-gray-500">
                        {student.department || 'Department not added'}
                      </p>
                    </div>

                    <div className="bg-green-50 text-green-700 rounded-lg px-3 py-2 text-sm font-bold">
                      {student.matchingScore}% Match
                    </div>

                  </div>

                  {/* Semester */}
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                    <GraduationCap size={17} />
                    Semester {student.semester || 'N/A'}
                  </div>

                  {/* Bio */}
                  <p className="text-sm text-gray-600 mt-4 line-clamp-3">
                    {student.bio || 'No bio available.'}
                  </p>

                  {/* Skills */}
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Skills
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(student.skills || []).map((item, index) => (
                        <span
                          key={index}
                          className="bg-blue-50 text-blue-700 text-xs px-3 py-1.5 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Interests */}
                  <div className="mt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">
                      Interests
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {(student.interests || []).map((item, index) => (
                        <span
                          key={index}
                          className="bg-purple-50 text-purple-700 text-xs px-3 py-1.5 rounded-full"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Common Skills */}
                  {student.commonSkills?.length > 0 && (
                    <p className="text-xs text-green-700 mt-3">
                      Common skills: {student.commonSkills.join(', ')}
                    </p>
                  )}

                         <button
                        onClick={() => navigate(`/students/${student._id}`)}
                        className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-semibold transition"
                        >
                        View Profile
                        </button>


                  {/* Social Links */}
                  <div className="flex gap-4 mt-5 pt-4 border-t border-gray-100">

                    {student.github && (
                      <a
                        href={student.github}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <Code size={20} />
                      </a>
                    )}

                    {student.linkedin && (
                      <a
                        href={student.linkedin}
                        target="_blank"
                        rel="noreferrer"
                        className="text-gray-600 hover:text-blue-600"
                      >
                        <span className="text-sm font-bold">in</span>
                      </a>
                    )}

                  </div>

                </div>
              ))}

            </div>
          </>
        )}

      </div>
    </div>
  )
}

export default FindStudents
