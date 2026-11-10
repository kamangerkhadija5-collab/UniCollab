import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, GraduationCap, Code, Mail, ExternalLink, AlertCircle, Loader2 } from 'lucide-react'
import api from '../../services/api'
import AppLayout from '../../components/layout/AppLayout'

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
    return (
      <AppLayout title="Student Profile">
        <div className="flex items-center justify-center gap-3 py-24 text-slate-500">
          <Loader2 size={22} className="animate-spin text-blue-600" />
          Loading profile...
        </div>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout title="Student Profile">
        <div
          role="alert"
          className="flex items-center justify-center gap-2 rounded-2xl border border-red-100 bg-red-50 px-6 py-10 text-red-700"
        >
          <AlertCircle size={20} />
          {error}
        </div>
      </AppLayout>
    )
  }

  if (!student) return null

  return (
    <AppLayout title="Student Profile">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => navigate('/find-students')}
          className="mb-6 inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back to Students
        </button>

        <div className="overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-slate-900/5">
          {/* Cover */}
          <div className="relative h-36 bg-gradient-to-br from-blue-100 via-indigo-50 to-white sm:h-44">
            <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full border-[32px] border-blue-200/40" />
            <div className="absolute -bottom-24 left-24 h-56 w-56 rounded-full border-[32px] border-blue-200/40" />
          </div>

          <div className="px-6 pb-8 sm:px-10">
            {/* Identity */}
            <div className="relative z-10 -mt-12 flex flex-col gap-4 sm:-mt-14 sm:flex-row sm:items-start">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 text-4xl font-bold text-white shadow-xl ring-4 ring-white sm:h-28 sm:w-28">
                {student.fullName?.charAt(0).toUpperCase()}
              </div>

              <div className="sm:pt-16">
                <h1 className="text-2xl font-bold tracking-tight text-[#0B1B3F] sm:text-3xl">
                  {student.fullName}
                </h1>
                <p className="mt-1 text-slate-500">
                  {student.department || 'Department not added'}
                </p>
              </div>
            </div>

            <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-600">
              <GraduationCap size={18} />
              Semester: {student.semester || 'N/A'}
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
              <div className="space-y-8">
                <div>
                  <h2 className="mb-2 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    About
                  </h2>
                  <p className="leading-relaxed text-slate-600">
                    {student.bio || 'No bio available.'}
                  </p>
                </div>

                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Skills
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(student.skills || []).map((item, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-blue-50 px-3.5 py-1.5 text-sm font-medium text-blue-700 ring-1 ring-inset ring-blue-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-400">
                    Interests
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {(student.interests || []).map((item, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-violet-50 px-3.5 py-1.5 text-sm font-medium text-violet-700 ring-1 ring-inset ring-violet-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="h-fit space-y-3 rounded-2xl bg-slate-50 p-5 ring-1 ring-slate-900/5">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
                  Contact
                </h2>

                <p className="flex items-start gap-2 break-all text-sm text-slate-600">
                  <Mail size={17} className="mt-0.5 shrink-0 text-slate-400" />
                  <span>
                    <strong className="font-semibold text-slate-700">Email:</strong>{' '}
                    {student.email}
                  </span>
                </p>

                {student.github && (
                  <a
                    href={student.github}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-blue-600 ring-1 ring-slate-200 transition hover:ring-blue-300"
                  >
                    <span className="flex items-center gap-2">
                      <Code size={18} /> GitHub Profile
                    </span>
                    <ExternalLink size={15} className="text-slate-400" />
                  </a>
                )}

                {student.linkedin && (
                  <a
                    href={student.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between gap-2 rounded-xl bg-white px-4 py-3 text-sm font-medium text-blue-600 ring-1 ring-slate-200 transition hover:ring-blue-300"
                  >
                    LinkedIn Profile
                    <ExternalLink size={15} className="text-slate-400" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

export default StudentProfile
