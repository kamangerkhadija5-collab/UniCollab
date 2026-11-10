import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  GraduationCap,
  Search,
  Users,
  FolderKanban,
  MessageCircle,
  ArrowRight,
  Menu,
  X,
  UserPlus
} from 'lucide-react'
import TeamIllustration from '../../components/common/TeamIllustration'

// Public landing page. Add it to your routes, for example:
//   <Route path="/" element={<Home />} />
function Home() {
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Home', href: '#home' },
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how' }
  ]

  const features = [
    { icon: Search, title: 'Find Your People', text: 'Search students by skill, department and interests to find the right teammates.', tile: 'bg-blue-50 text-blue-600' },
    { icon: Users, title: 'Form Teams', text: 'See matching scores and common skills, then team up with students who complement you.', tile: 'bg-violet-50 text-violet-600' },
    { icon: FolderKanban, title: 'Track Projects', text: 'Keep your projects, tasks and deadlines organised in one simple dashboard.', tile: 'bg-emerald-50 text-emerald-600' },
    { icon: MessageCircle, title: 'Stay Connected', text: 'Chat with your team and keep every conversation in one place.', tile: 'bg-amber-50 text-amber-600' }
  ]

  const steps = [
    { icon: UserPlus, title: 'Create your profile', text: 'Add your skills, interests and a short bio.' },
    { icon: Search, title: 'Find teammates', text: 'Browse students and see how well you match.' },
    { icon: FolderKanban, title: 'Build together', text: 'Plan your project and follow progress as a team.' }
  ]

  return (
    <div className="min-h-screen scroll-smooth bg-gradient-to-b from-[#f2f7ff] via-white to-[#f2f7ff] text-slate-900">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-slate-200/60 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-8">
          <a href="#home" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-600/25">
              <GraduationCap size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#0B1B3F]">UniCollab</span>
          </a>

          <nav className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-slate-200 transition hover:bg-slate-50"
            >
              Sign In
            </Link>
            <Link
              to="/signup"
              className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-blue-600/25 transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="space-y-1 border-t border-slate-100 bg-white px-4 py-3 md:hidden">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                {l.label}
              </a>
            ))}
            <div className="flex gap-3 pt-2">
              <Link to="/login" className="flex-1 rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-slate-700 ring-1 ring-slate-200">
                Sign In
              </Link>
              <Link to="/signup" className="flex-1 rounded-xl bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white">
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero */}
      <section id="home" className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-8 lg:grid-cols-2 lg:py-20">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 ring-1 ring-blue-100">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            University collaboration platform
          </span>

          <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight text-[#0B1B3F] sm:text-5xl lg:text-6xl">
            Build something
            <span className="block text-blue-600">great together</span>
          </h1>

          <p className="mt-5 max-w-lg text-lg text-slate-600">
            Find your team, share your ideas, and bring university projects to life.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-[0.98]"
            >
              Get Started
              <ArrowRight size={16} />
            </Link>
            <a
              href="#features"
              className="inline-flex items-center rounded-xl bg-white px-6 py-3.5 text-sm font-semibold text-blue-600 ring-1 ring-blue-200 transition hover:bg-blue-50"
            >
              Explore Features
            </a>
          </div>
        </div>

        <TeamIllustration className="mx-auto w-full max-w-xl drop-shadow-sm" />
      </section>

      {/* Features */}
      <section id="features" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-8">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-[#0B1B3F]">Everything your team needs</h2>
          <p className="mt-3 text-slate-600">Simple tools to find people and finish projects.</p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {features.map((f) => {
            const Icon = f.icon

            return (
              <div
                key={f.title}
                className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-200/60 transition duration-200 hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/5"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.tile}`}>
                  <Icon size={24} />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#0B1B3F]">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{f.text}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-7xl scroll-mt-20 px-4 py-12 sm:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 p-8 ring-1 ring-blue-100 sm:p-12">
          <h2 className="text-center text-3xl font-bold tracking-tight text-[#0B1B3F]">How it works</h2>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => {
              const Icon = s.icon

              return (
                <div key={s.title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-slate-900/5">
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                      <Icon size={21} />
                    </div>
                    <span className="text-3xl font-bold text-blue-100">0{i + 1}</span>
                  </div>
                  <h3 className="mt-4 font-bold text-[#0B1B3F]">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-slate-600">{s.text}</p>
                </div>
              )
            })}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700"
            >
              Create your free account
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto mt-6 max-w-7xl border-t border-slate-200/70 px-4 py-8 sm:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <GraduationCap size={17} />
            </div>
            <div>
              <p className="text-sm font-bold text-[#0B1B3F]">UniCollab</p>
              <p className="text-xs text-slate-500">Students. Projects. A Brighter Tomorrow.</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/login" className="hover:text-blue-600">Sign In</Link>
            <Link to="/signup" className="hover:text-blue-600">Sign Up</Link>
          </div>

          <p className="text-xs text-slate-400">© {new Date().getFullYear()} UniCollab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default Home
