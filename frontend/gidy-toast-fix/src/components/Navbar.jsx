import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Moon, Sun, Bell, ChevronDown, LogOut, MessageSquare, Users, ArrowLeft } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

const NAV_ITEMS = ['Jobs', 'Hackathons', 'Projects', 'Tasks', 'Organization']

export default function Navbar({ profile }) {
  const { isDark, toggle } = useTheme()
  const [showDrop, setShowDrop] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const isProfilePage = location.pathname.startsWith('/profile/')

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'ME'

  const handleLogout = () => {
    setShowDrop(false)
    navigate('/profiles')
  }

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Left */}
          <div className="flex items-center gap-3">
            {isProfilePage && (
              <button onClick={() => navigate('/profiles')}
                className="flex items-center gap-1.5 text-sm text-indigo-600 dark:text-indigo-400 hover:underline mr-1">
                <ArrowLeft size={15} /> All Profiles
              </button>
            )}

            <a href="/profiles" className="flex items-center gap-2 no-underline">
              <div className="w-8 h-8 rounded-lg bg-gray-900 dark:bg-white flex items-center justify-center">
                <span className="text-white dark:text-gray-900 font-display font-bold text-sm">G</span>
              </div>
              <span className="font-display font-semibold text-gray-900 dark:text-white text-lg tracking-tight">
                Gidy
              </span>
            </a>

            <div className="hidden md:flex items-center gap-1 ml-4">
              <button onClick={() => navigate('/profiles')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${location.pathname === '/profiles'
                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}>
                <Users size={14} /> Profiles
              </button>
              {NAV_ITEMS.map(label => (
                <button key={label}
                  className="px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            <button onClick={toggle}
              className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}>
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all relative">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* Avatar dropdown */}
            <div className="relative">
              <button onClick={() => setShowDrop(p => !p)}
                className="flex items-center gap-1 hover:opacity-80 transition-opacity">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt={profile?.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200 dark:border-gray-700" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
                    {initials}
                  </div>
                )}
                <ChevronDown size={14} className="text-gray-500 dark:text-gray-400" />
              </button>

              {showDrop && (
                <div className="absolute right-0 top-10 w-48 card py-1 shadow-lg animate-fade-in z-50">
                  <button
                    onClick={() => { navigate('/profiles'); setShowDrop(false) }}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <Users size={15} /> All Profiles
                  </button>
                  <button
                    onClick={() => setShowDrop(false)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <MessageSquare size={15} /> Feedback
                  </button>
                  {/* Logout → back to profiles */}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                    <LogOut size={15} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
