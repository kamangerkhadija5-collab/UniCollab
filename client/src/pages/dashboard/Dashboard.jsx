import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Users,
  FolderKanban,
  CheckCircle,
  CalendarDays,
  Clock,
  Search,
  ArrowRight,
  ChevronRight
} from 'lucide-react'
import AppLayout from '../../components/layout/AppLayout'
import TeamIllustration from '../../components/common/TeamIllustration'

// Small count-up animation for the overview numbers (display only)
function CountUp({ to }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let current = 0
    const timer = setInterval(() => {
      current += 1
      setValue(current)
      if (current >= to) clearInterval(timer)
    }, 90)
    return () => clearInterval(timer)
  }, [to])

  return <>{value}</>
}

const cardClass =
  'rounded-2xl bg-white shadow-sm ring-1 ring-slate-200/60 transition duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-900/5'

function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const firstName = (user?.fullName || 'Student').split(' ')[0]

  // lets the progress bars animate from 0 on first paint
  const [ready, setReady] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  const stats = [
    { label: 'My Teams', value: 2, note: 'Teams joined', icon: Users, tile: 'bg-blue-50 text-blue-600' },
    { label: 'Active Projects', value: 3, note: 'Projects in progress', icon: FolderKanban, tile: 'bg-violet-50 text-violet-600' },
    { label: 'Pending Tasks', value: 5, note: 'Tasks to complete', icon: Clock, tile: 'bg-amber-50 text-amber-600' },
    { label: 'Completed Tasks', value: 8, note: 'Tasks completed', icon: CheckCircle, tile: 'bg-emerald-50 text-emerald-600' }
  ]

  const projects = [
    { name: 'UniCollab Platform', team: 'Team Alpha', progress: 75, bar: 'from-blue-500 to-blue-600', badge: 'bg-blue-50 text-blue-600', tile: 'bg-blue-50 text-blue-600' },
    { name: 'AI Image Recognition', team: 'Team Innovators', progress: 45, bar: 'from-violet-500 to-violet-600', badge: 'bg-violet-50 text-violet-600', tile: 'bg-violet-50 text-violet-600' },
    { name: 'Student Portal', team: 'Team Alpha', progress: 90, bar: 'from-emerald-500 to-emerald-600', badge: 'bg-emerald-50 text-emerald-600', tile: 'bg-emerald-50 text-emerald-600' }
  ]

  const tasks = [
    { title: 'Complete UI Design', due: 'Due: November 10, 2026', month: 'NOV', day: '10', level: 'High', badge: 'bg-red-50 text-red-600 ring-red-100', date: 'bg-red-50 text-red-600' },
    { title: 'Prepare Project Report', due: 'Due: November 12, 2026', month: 'NOV', day: '12', level: 'Medium', badge: 'bg-yellow-50 text-yellow-700 ring-yellow-100', date: 'bg-amber-50 text-amber-600' },
    { title: 'Review Backend APIs', due: 'Due: November 15, 2026', month: 'NOV', day: '15', level: 'Low', badge: 'bg-emerald-50 text-emerald-700 ring-emerald-100', date: 'bg-emerald-50 text-emerald-600' }
  ]

  return (
    <AppLayout title="Dashboard">
      {/* Welcome banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-blue-50 to-blue-100 p-6 shadow-sm ring-1 ring-blue-100 sm:p-10">
        <div className="relative z-10 max-w-xl">
          <p className="text-sm font-semibold text-blue-600">Welcome back, {firstName}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[#0B1B3F] sm:text-4xl">
            Welcome to <span className="text-blue-600">UniCollab!</span>
          </h1>
          <p className="mt-3 text-slate-600">
            Find teammates, manage your projects, and collaborate with students.
          </p>

          {/* <Link
            to="/students" */}
            <Link
            to="/find-students"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98]"
          >
            <Search size={17} />
            Find teammates
            <ArrowRight size={16} />
          </Link>
        </div>

        <TeamIllustration className="pointer-events-none absolute -right-6 bottom-0 hidden h-[110%] md:block lg:right-4" />
      </section>

      {/* Overview Cards */}
      <section className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon

          return (
            <div key={s.label} className={`${cardClass} p-5`}>
              <div className="flex items-center gap-4">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.tile}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-500">{s.label}</p>
                  <h2 className="text-3xl font-bold tracking-tight text-[#0B1B3F]">
                    <CountUp to={s.value} />
                  </h2>
                </div>
              </div>
              <p className="mt-3 text-sm text-slate-400">{s.note}</p>
            </div>
          )
        })}
      </section>

      {/* Recent Projects & Upcoming Tasks */}
      <section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Recent Projects */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0B1B3F]">Recent Projects</h2>
              <p className="mt-0.5 text-sm text-slate-500">Your team's latest projects</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <FolderKanban size={20} />
            </div>
          </div>

          <div className="space-y-3">
            {projects.map((p) => (
              <div
                key={p.name}
                className="group rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
              >
                <div className="mb-3 flex items-center gap-3">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${p.tile}`}>
                    <FolderKanban size={19} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-semibold text-slate-800">{p.name}</h3>
                    <p className="text-xs text-slate-500">{p.team}</p>
                  </div>

                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${p.badge}`}>
                    {p.progress}%
                  </span>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-2 rounded-full bg-gradient-to-r ${p.bar} transition-all duration-1000 ease-out`}
                    style={{ width: ready ? `${p.progress}%` : '0%' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Tasks */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60">
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-[#0B1B3F]">Upcoming Tasks</h2>
              <p className="mt-0.5 text-sm text-slate-500">Tasks that need your attention</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDays size={20} />
            </div>
          </div>

          <div className="space-y-3">
            {tasks.map((t) => (
              <div
                key={t.title}
                className="group flex items-center gap-4 rounded-xl border border-slate-100 p-4 transition hover:border-blue-200 hover:bg-blue-50/30"
              >
                <div className={`flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl ${t.date}`}>
                  <span className="text-[10px] font-bold leading-none">{t.month}</span>
                  <span className="text-lg font-bold leading-tight">{t.day}</span>
                </div>

                <div className="min-w-0 flex-1">
                  <h3 className="truncate text-sm font-semibold text-slate-800">{t.title}</h3>
                  <p className="mt-0.5 text-xs text-slate-500">{t.due}</p>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset ${t.badge}`}>
                  {t.level}
                </span>

                <ChevronRight size={18} className="hidden text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-blue-500 sm:block" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </AppLayout>
  )
}

export default Dashboard
