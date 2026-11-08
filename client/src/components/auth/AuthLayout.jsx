import { Users, CheckCircle2 } from 'lucide-react'

// Props stay the same as before: title, subtitle, footer, children
function AuthLayout({ title, subtitle, footer, children }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-[1.1fr_1fr] bg-white">
      {/* Brand panel (hidden on small screens) */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden bg-gradient-to-br from-[#101B35] via-[#14264d] to-blue-700 p-12 text-white">
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full border-[40px] border-white/5" />
        <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full border-[40px] border-white/5" />

        <div className="relative flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-white text-[#101B35] flex items-center justify-center">
            <Users size={22} />
          </div>
          <span className="text-2xl font-bold tracking-tight">UniCollab</span>
        </div>

        <div className="relative">
          <h2 className="max-w-md text-4xl font-bold leading-tight tracking-tight">
            Build better projects with the right teammates.
          </h2>
          <p className="mt-4 max-w-sm text-blue-100">
            Find students with the skills you need, form a team, and track your work in one place.
          </p>

          {/* Preview mock */}
          <div className="relative mt-12 max-w-sm">
            <div className="rounded-2xl bg-white p-5 text-[#101B35] shadow-2xl rotate-[-2deg]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Team Alpha</p>
                  <p className="text-xs text-slate-500">UniCollab Platform</p>
                </div>
                <div className="flex -space-x-2">
                  {['A', 'K', 'S'].map((l, i) => (
                    <span
                      key={l}
                      className={`h-8 w-8 rounded-full ring-2 ring-white text-xs font-semibold flex items-center justify-center ${
                        ['bg-blue-100 text-blue-700', 'bg-violet-100 text-violet-700', 'bg-rose-100 text-rose-700'][i]
                      }`}
                    >
                      {l}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 h-2 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-2 w-3/4 rounded-full bg-blue-600" />
              </div>
              <p className="mt-2 text-xs text-slate-500">75% complete</p>
            </div>

            <div className="absolute -bottom-6 -right-6 flex items-center gap-2 rounded-xl bg-white/95 px-4 py-3 text-sm font-medium text-[#101B35] shadow-xl rotate-[3deg]">
              <CheckCircle2 size={18} className="text-emerald-600" />
              New teammate joined
            </div>
          </div>
        </div>

        <p className="relative text-sm text-blue-200">Made for university students.</p>
      </aside>

      {/* Form panel */}
      <main className="flex items-center justify-center px-6 py-12 bg-slate-50 lg:bg-white">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
              <Users size={20} />
            </div>
            <span className="text-xl font-bold text-[#101B35]">UniCollab</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-[#101B35]">{title}</h1>
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