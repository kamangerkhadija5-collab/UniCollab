import { useEffect, useState } from 'react'
import { Search, Users, GraduationCap, Code, Sparkles, AlertCircle, ArrowRight } from 'lucide-react'
import api from '../../services/api'
import { useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'

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

  const inputClass =
    'w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10'

  return (
    <AppLayout title="Find Students">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3F]">
          Find Students
        </h1>
        <p className="mt-2 text-slate-500">
          Discover students with skills and interests similar to yours.
        </p>
      </div>

      {/* Search and Filter */}
      <div className="mb-8 grid gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-900/5 sm:p-5 md:grid-cols-2">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search by name or department..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={inputClass}
          />
        </div>

        <div className="relative">
          <Code
            size={18}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Filter by skill (e.g. Python)"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      {/* Students */}
      {loading ? (
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="animate-pulse rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5"
            >
              <div className="h-14 w-14 rounded-full bg-slate-200" />
              <div className="mt-4 h-4 w-1/2 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/3 rounded bg-slate-100" />
              <div className="mt-6 h-3 w-full rounded bg-slate-100" />
              <div className="mt-2 h-3 w-5/6 rounded bg-slate-100" />
              <div className="mt-6 h-10 w-full rounded-xl bg-slate-100" />
            </div>
          ))}
          <p className="sr-only">Loading students...</p>
        </div>
      ) : error ? (
        <div
          role="alert"
          className="flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-red-700"
        >
          <AlertCircle size={20} />
          {error}
        </div>
      ) : students.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
            <Users size={28} />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">
            No students found
          </h2>
          <p className="mt-2 text-slate-500">
            Try another name or skill.
          </p>
        </div>
      ) : (
        <>
          <p className="mb-4 text-sm font-medium text-slate-500">
            {students.length} students found
          </p>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {students.map((student) => (
              <div
                key={student._id}
                className="group flex flex-col rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/5"
              >
                {/* Student Information */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-xl font-bold text-white shadow-md shadow-blue-600/20">
                      {student.fullName?.charAt(0).toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <h2 className="truncate text-lg font-bold text-[#0B1B3F]">
                        {student.fullName}
                      </h2>

                      <p className="truncate text-sm text-slate-500">
                        {student.department || 'Department not added'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Semester + Match */}
                <div className="mt-5 flex items-center justify-between gap-2">
                  <div className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">
                    <GraduationCap size={15} />
                    Semester {student.semester || 'N/A'}
                  </div>

                  <div className="flex shrink-0 items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700 ring-1 ring-inset ring-emerald-200">
                    <Sparkles size={13} />
                    {student.matchingScore}% Match
                  </div>
                </div>

                {/* Bio */}
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
                  {student.bio || 'No bio available.'}
                </p>

                {/* Skills */}
                <div className="mt-5">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Skills
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(student.skills || []).map((item, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Interests */}
                <div className="mt-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                    Interests
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {(student.interests || []).map((item, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-violet-50 px-3 py-1 text-xs font-medium text-violet-700 ring-1 ring-inset ring-violet-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Common Skills */}
                {student.commonSkills?.length > 0 && (
                  <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                    Common skills: {student.commonSkills.join(', ')}
                  </p>
                )}

                <div className="mt-auto pt-6">
                  <button
                    onClick={() => navigate(`/students/${student._id}`)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700 active:scale-[0.99]"
                  >
                    View Profile
                    <ArrowRight size={16} className="transition group-hover:translate-x-0.5" />
                  </button>

                  {/* Social Links */}
                  {(student.github || student.linkedin) && (
                    <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                      {student.github && (
                        <a
                          href={student.github}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Code size={18} />
                        </a>
                      )}

                      {student.linkedin && (
                        <a
                          href={student.linkedin}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                        >
                          <span className="text-sm font-bold">in</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </AppLayout>
  )
}

export default FindStudents
