




import { useNavigate } from 'react-router-dom'
import { NavLink } from 'react-router-dom'

import {
  LayoutDashboard,
  Users,
  FolderKanban,
  MessageCircle,
  Search,
  Bell,
  UserRound,
  Settings,
  LogOut,
  CheckCircle,
  CalendarDays,
  Clock
} from 'lucide-react'

function Dashboard() {

  const user = JSON.parse(localStorage.getItem('user') || 'null')

const navigate = useNavigate()

const handleLogout = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')

  navigate('/login', { replace: true })
}
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Find Students', path: '/students', icon: Search },
    { name: 'My Teams', path: '/teams', icon: Users },
    { name: 'Projects', path: '/projects', icon: FolderKanban },
    { name: 'Messages', path: '/chat', icon: MessageCircle },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-[#101B35] text-white flex flex-col p-6">

        {/* Logo */}
        <h1 className="text-2xl font-bold mb-10">
          UniCollab
        </h1>

        <p className="text-xs text-gray-400 uppercase tracking-wider mb-4">
          Main Menu
        </p>

        {/* Navigation */}
        <nav className="space-y-2">

          {menuItems.map((item) => {
            const Icon = item.icon

            return (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:bg-white/10'
                  }`
                }
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </NavLink>
            )
          })}

        </nav>

        {/* Sidebar Bottom */}
        <div className="mt-auto space-y-2">

          <button className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl w-full">
            <Settings size={20} />
            Settings
          </button>

          <button className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-white/10 rounded-xl w-full" onClick={handleLogout}>
            <LogOut size={20} />
            Logout
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">

        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8">

          <div>
            <h2 className="text-xl font-semibold text-[#101B35]">
              Dashboard
            </h2>

            <p className="text-sm text-gray-500">
              Manage your university collaboration.
            </p>
          </div>

          <div className="flex items-center gap-5">

            <button className="text-gray-500 hover:text-blue-600">
              <Bell size={22} />
            </button>

            <div className="flex items-center gap-3">

              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <UserRound size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {user?.fullName || 'Student'}
                </p>

                <p className="text-xs text-gray-500">
                  University Member
                </p>
              </div>

            </div>

          </div>

        </header>

        {/* Dashboard Overview */}
        <section className="p-8">

          {/* Welcome Section */}
          <div className="mb-8">

            <h1 className="text-2xl font-bold text-[#101B35]">
              Welcome to UniCollab!
            </h1>

            <p className="text-gray-500 mt-2">
              Find teammates, manage your projects, and collaborate with students.
            </p>

          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">

            {/* My Teams */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">My Teams</p>
                <Users className="text-blue-600" size={24} />
              </div>

              <h2 className="text-3xl font-bold text-[#101B35] mt-4">
                2
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Teams joined
              </p>
            </div>

            {/* Active Projects */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">Active Projects</p>
                <FolderKanban className="text-purple-600" size={24} />
              </div>

              <h2 className="text-3xl font-bold text-[#101B35] mt-4">
                3
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Projects in progress
              </p>
            </div>

            {/* Pending Tasks */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">Pending Tasks</p>
                <Clock className="text-orange-500" size={24} />
              </div>

              <h2 className="text-3xl font-bold text-[#101B35] mt-4">
                5
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Tasks to complete
              </p>
            </div>

            {/* Completed Tasks */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between">
                <p className="text-gray-500 text-sm">Completed Tasks</p>
                <CheckCircle className="text-green-600" size={24} />
              </div>

              <h2 className="text-3xl font-bold text-[#101B35] mt-4">
                8
              </h2>

              <p className="text-sm text-gray-400 mt-2">
                Tasks completed
              </p>
            </div>

          </div>

          {/* Recent Projects & Upcoming Tasks */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-8">

            {/* Recent Projects */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-lg font-bold text-[#101B35]">
                    Recent Projects
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Your team's latest projects
                  </p>
                </div>

                <FolderKanban className="text-blue-600" size={23} />

              </div>

              <div className="space-y-6">

                {/* Project 1 */}
                <div>

                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        UniCollab Platform
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Team Alpha
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-blue-600">
                      75%
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full w-[75%]" />
                  </div>

                </div>

                {/* Project 2 */}
                <div>

                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        AI Image Recognition
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Team Innovators
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-purple-600">
                      45%
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full w-[45%]" />
                  </div>

                </div>

                {/* Project 3 */}
                <div>

                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        Student Portal
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Team Alpha
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-green-600">
                      90%
                    </span>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full w-[90%]" />
                  </div>

                </div>

              </div>

            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

              <div className="flex items-center justify-between mb-6">

                <div>
                  <h2 className="text-lg font-bold text-[#101B35]">
                    Upcoming Tasks
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Tasks that need your attention
                  </p>
                </div>

                <CalendarDays className="text-blue-600" size={23} />

              </div>

              <div className="space-y-4">

                {/* Task 1 */}
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">

                  <div className="flex items-start gap-3">
                    <Clock size={19} className="text-orange-500 mt-1" />

                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        Complete UI Design
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Due: November 10, 2026
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1 rounded-full">
                    High
                  </span>

                </div>

                {/* Task 2 */}
                <div className="flex items-center justify-between gap-3 border-b border-gray-100 pb-4">

                  <div className="flex items-start gap-3">
                    <Clock size={19} className="text-orange-500 mt-1" />

                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        Prepare Project Report
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Due: November 12, 2026
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-yellow-700 bg-yellow-50 px-3 py-1 rounded-full">
                    Medium
                  </span>

                </div>

                {/* Task 3 */}
                <div className="flex items-center justify-between gap-3">

                  <div className="flex items-start gap-3">
                    <Clock size={19} className="text-orange-500 mt-1" />

                    <div>
                      <h3 className="text-sm font-semibold text-gray-800">
                        Review Backend APIs
                      </h3>

                      <p className="text-xs text-gray-500 mt-1">
                        Due: November 15, 2026
                      </p>
                    </div>
                  </div>

                  <span className="text-xs font-medium text-green-700 bg-green-50 px-3 py-1 rounded-full">
                    Low
                  </span>

                </div>

              </div>

            </div>

          </div>

        </section>

      </main>

    </div>
  )
}

export default Dashboard
