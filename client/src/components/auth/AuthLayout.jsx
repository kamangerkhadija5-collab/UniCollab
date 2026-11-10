import { Users, Search, KanbanSquare, MessageCircle, GraduationCap } from 'lucide-react'
import TeamIllustration from '../common/TeamIllustration'

// Props stay the same as before: title, subtitle, footer, children
function AuthLayout({ title, subtitle, footer, children }) {
  const features = [
    { icon: Search, text: 'Find students' },
    { icon: Users, text: 'Form teams' },
    { icon: KanbanSquare, text: 'Track projects' },
    { icon: MessageCircle, text: 'Chat with your team' }
  ]

  return (
    <div className="grid min-h-screen bg-white lg:grid-cols-[1.1fr_1fr]">
      {/* Brand panel (hidden on small screens) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-white p-12 lg:flex xl:p-14">
        <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="absolute -right-10 bottom-10 h-72 w-72 rounded-full bg-violet-200/50 blur-3xl" />

        <div className="relative flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
            <GraduationCap size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight text-[#0B1B3F]">UniCollab</span>
        </div>

        <div className="relative">
          <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight text-[#0B1B3F] xl:text-5xl">
            Build something
            <span className="block text-blue-600">great together</span>
          </h2>
          <p className="mt-4 max-w-md text-lg text-slate-600">
            Find students with the skills you need, form a team, and track your work in one place.
          </p>

          <TeamIllustration className="mt-8 w-full max-w-lg" />

          <ul className="mt-6 grid max-w-lg grid-cols-2 gap-3">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-2.5 rounded-xl bg-white/80 px-3 py-2.5 text-sm font-medium text-slate-700 shadow-sm ring-1 ring-slate-900/5">
                <Icon size={17} className="shrink-0 text-blue-600" />
                {text}
              </li>
            ))}
          </ul>
        </div>

        <p className="relative text-sm text-slate-500">Made for university students.</p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center bg-slate-50 px-6 py-12 lg:bg-white">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-600/30">
              <GraduationCap size={20} />
            </div>
            <span className="text-xl font-bold text-[#0B1B3F]">UniCollab</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#0B1B3F]">{title}</h1>
            <p className="mt-2 text-slate-500">{subtitle}</p>
          </div>

          {children}

          <p className="mt-8 text-center text-sm text-slate-500">{footer}</p>
        </div>
      </main>
    </div>
  )
}

export default AuthLayout
