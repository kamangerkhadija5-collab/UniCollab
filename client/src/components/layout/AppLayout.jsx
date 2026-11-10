import { useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  MessageCircle,
  Search,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  GraduationCap,
  ChevronDown,
  UserRound
} from 'lucide-react'

const menuItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Find Students', path: '/find-students', icon: Search },
  { name: 'My Teams', path: '/teams', icon: Users },
  { name: 'Projects', path: '/projects', icon: FolderKanban },
  { name: 'Messages', path: '/chat', icon: MessageCircle }
]

// Shared shell (sidebar + top bar) used by every logged-in page.
// Usage: <AppLayout title="Dashboard"> ...page content... </AppLayout>
function AppLayout({ title, children }) {
  const [open, setOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  const user = JSON.parse(localStorage.getItem('user') || 'null')
  const initial = (user?.fullName || 'S').charAt(0).toUpperCase()

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')

    navigate('/login', { replace: true })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f2f7ff] via-white to-[#eef3ff] text-slate-900">
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-slate-200/70 bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-md shadow-blue-600/25">
              <GraduationCap size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-[#0B1B3F]">UniCollab</span>
          </div>

          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 lg:hidden"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.name}
                  to={item.path}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={19}
                        className={isActive ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}
                      />
                      <span>{item.name}</span>
                    </>
                  )}
                </NavLink>
              )
            })}
          </div>
        </nav>

        {/* Sidebar bottom */}
        <div className="space-y-1 px-3 pb-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900">
            <Settings size={19} className="text-slate-400" />
            Settings
          </button>

          <button
            className="flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            onClick={handleLogout}
          >
            <LogOut size={19} className="text-slate-400" />
            Logout
          </button>

          <div className="mt-3 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 ring-1 ring-blue-100">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              <GraduationCap size={22} />
            </div>
            <p className="text-xs font-semibold leading-snug text-[#0B1B3F]">
              Students. Projects.
              <span className="block text-blue-600">A Brighter Tomorrow.</span>
            </p>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200/60 bg-white/80 px-4 backdrop-blur-md sm:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div>
              <h2 className="text-base font-semibold text-[#0B1B3F]">{title}</h2>
              <p className="hidden text-xs text-slate-500 sm:block">
                Manage your university collaboration.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-3">
            <button
              type="button"
              className="rounded-full p-2.5 text-slate-500 transition hover:bg-blue-50 hover:text-blue-600"
              aria-label="Notifications"
            >
              <Bell size={20} />
            </button>

            {/* User menu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                className="flex items-center gap-2.5 rounded-full py-1 pl-1 pr-2 transition hover:bg-slate-100 sm:pr-3"
                aria-haspopup="menu"
                aria-expanded={menuOpen}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-sm font-bold text-white">
                  {initial}
                </div>
                <div className="hidden text-left sm:block">
                  <p className="text-sm font-semibold leading-tight text-slate-800">
                    {user?.fullName || 'Student'}
                  </p>
                  <p className="text-xs text-slate-500">University Member</p>
                </div>
                <ChevronDown
                  size={16}
                  className={`hidden text-slate-400 transition sm:block ${menuOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                  <div
                    role="menu"
                    className="absolute right-0 z-40 mt-2 w-52 overflow-hidden rounded-2xl bg-white p-1.5 shadow-xl ring-1 ring-slate-900/5"
                  >
                    {/* Change '/profile' if your profile route has a different path */}
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
                    >
                      <UserRound size={18} className="text-slate-400" />
                      My Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-8">{children}</main>
      </div>
    </div>
  )
}

export default AppLayout
