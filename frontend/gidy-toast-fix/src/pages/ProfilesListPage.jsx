import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { profileApi, skillsApi, educationApi, experienceApi } from '../services/api'
import Navbar from '../components/Navbar'
import {
  Plus, User, MapPin, Mail, Briefcase, GraduationCap,
  Tag, Trash2, Eye, CheckCircle, AlertCircle, RefreshCw
} from 'lucide-react'
import toast, { Toaster } from 'react-hot-toast'

// ─── Create Profile Modal ──────────────────────────────────────────────────────
function CreateModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    name: '', designation: '', location: '', email: '',
    phone: '', company: '', website: '', bio: '', openToWork: false,
  })
  const [saving, setSaving] = useState(false)

  const handleCreate = async () => {
    if (!form.name.trim()) return toast.error('Name is required')
    setSaving(true)
    try {
      const created = await profileApi.create(form)
      toast.success('Profile created!')
      onCreate(created)
      onClose()
    } catch {
      toast.error('Failed to create profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="card w-full max-w-lg p-6 space-y-4 animate-fade-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-display font-semibold text-gray-900 dark:text-white">
            Create New Profile
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold">×</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Full Name *</label>
            <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="form-input" placeholder="e.g. Rexshan S" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Designation</label>
            <input value={form.designation} onChange={e => setForm(p => ({ ...p, designation: e.target.value }))}
              className="form-input" placeholder="e.g. Fresher / Graduate" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Location</label>
            <input value={form.location} onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
              className="form-input" placeholder="City, State, Country" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Email</label>
            <input value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="form-input" placeholder="email@example.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Phone</label>
            <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="form-input" placeholder="+91 XXXXXXXXXX" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Company</label>
            <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
              className="form-input" placeholder="Company name" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Website</label>
            <input value={form.website} onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
              className="form-input" placeholder="https://yoursite.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Bio</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
              className="form-input resize-none" rows={3} placeholder="Write a short bio..." />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.openToWork}
                onChange={e => setForm(p => ({ ...p, openToWork: e.target.checked }))}
                className="w-4 h-4 rounded text-indigo-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Open to Work</span>
            </label>
          </div>
        </div>

        <div className="flex gap-2 justify-end pt-2">
          <button onClick={onClose} className="btn-outline">Cancel</button>
          <button onClick={handleCreate} disabled={saving} className="btn-primary disabled:opacity-60">
            {saving ? 'Creating...' : 'Create Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Profile Card ──────────────────────────────────────────────────────────────
function ProfileCard({ profile, onView, onDelete }) {
  const [counts, setCounts] = useState({ skills: 0, experiences: 0, educations: 0 })

  useEffect(() => {
    Promise.all([
      skillsApi.list(profile.id),
      experienceApi.list(profile.id),
      educationApi.list(profile.id),
    ]).then(([s, e, edu]) => {
      setCounts({ skills: s.length, experiences: e.length, educations: edu.length })
    }).catch(() => {})
  }, [profile.id])

  const initials = profile.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  const completion = profile.profileCompletion || 0

  return (
    <div className="card p-5 hover:shadow-md transition-all duration-200 group">

      {/* Top row: avatar + name + badge */}
      <div className="flex items-start gap-4 mb-4">
        <div className="relative flex-shrink-0">
          {profile.avatarUrl ? (
            <img src={profile.avatarUrl} alt={profile.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center shadow">
              <span className="text-white text-lg font-bold font-display">{initials}</span>
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="font-display font-semibold text-gray-900 dark:text-white text-base truncate">
            {profile.name}
          </h3>
          {profile.designation && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{profile.designation}</p>
          )}
          {profile.openToWork && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full mt-1">
              <CheckCircle size={9} /> Open to Work
            </span>
          )}
        </div>

        {/* League badge */}
        <div className="flex-shrink-0 text-center">
          <div className="text-xl">{profile.league === 'Gold' ? '🥇' : profile.league === 'Silver' ? '🥈' : '🥉'}</div>
          <div className="text-[10px] text-gray-400 dark:text-gray-500">{profile.league || 'Bronze'}</div>
        </div>
      </div>

      {/* Info row */}
      <div className="space-y-1 mb-4">
        {profile.location && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <MapPin size={11} className="flex-shrink-0" /> <span className="truncate">{profile.location}</span>
          </div>
        )}
        {profile.email && (
          <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <Mail size={11} className="flex-shrink-0" /> <span className="truncate">{profile.email}</span>
          </div>
        )}
        {profile.bio && (
          <p className="text-xs text-gray-600 dark:text-gray-400 italic mt-1 line-clamp-2">"{profile.bio}"</p>
        )}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[
          { icon: Tag,          label: 'Skills',     count: counts.skills },
          { icon: Briefcase,    label: 'Experience', count: counts.experiences },
          { icon: GraduationCap,label: 'Education',  count: counts.educations },
        ].map(({ icon: Icon, label, count }) => (
          <div key={label} className="text-center p-2 rounded-xl bg-gray-50 dark:bg-gray-800">
            <Icon size={14} className="mx-auto mb-1 text-indigo-500" />
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{count}</div>
            <div className="text-[10px] text-gray-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Completion bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] text-gray-400 dark:text-gray-500">Profile completion</span>
          <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400">{completion}%</span>
        </div>
        <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all"
            style={{ width: `${completion}%` }} />
        </div>
      </div>

      {/* Points row */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
        <span>Rank <span className="font-semibold text-gray-700 dark:text-gray-300">#{profile.rank || 1}</span></span>
        <span><span className="font-semibold text-amber-600 dark:text-amber-400">{profile.points || 0}</span> pts</span>
        <span>ID: <span className="font-mono text-gray-400">{profile.id}</span></span>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={() => onView(profile.id)}
          className="btn-primary flex-1 justify-center py-2 text-xs">
          <Eye size={13} /> View Profile
        </button>
        <button onClick={() => onDelete(profile.id)}
          className="btn-danger py-2 px-3 text-xs">
          <Trash2 size={13} />
        </button>
      </div>
    </div>
  )
}

// ─── Main ProfilesListPage ─────────────────────────────────────────────────────
export default function ProfilesListPage() {
  const navigate = useNavigate()
  const [profiles,    setProfiles]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [offline,     setOffline]     = useState(false)
  const [showCreate,  setShowCreate]  = useState(false)
  const [deleting,    setDeleting]    = useState(null)

  useEffect(() => {
    fetchProfiles()
  }, [])

  async function fetchProfiles() {
    setLoading(true)
    try {
      const data = await profileApi.getAll()
      setProfiles(data)
      setOffline(false)
    } catch {
      setOffline(true)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this profile? This cannot be undone.')) return
    setDeleting(id)
    try {
      await profileApi.delete ? profileApi.delete(id) : fetch(`/api/profiles/${id}`, { method: 'DELETE' })
      setProfiles(prev => prev.filter(p => p.id !== id))
      toast.success('Profile deleted')
    } catch {
      toast.error('Failed to delete profile')
    } finally {
      setDeleting(null)
    }
  }

  const handleView = (id) => navigate(`/profile/${id}`)

  const handleCreated = (newProfile) => {
    setProfiles(prev => [...prev, newProfile])
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar profile={null} />
      <Toaster position="top-right" />

      {/* Offline banner */}
      {offline && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
            <AlertCircle size={15} />
            <span><strong>Backend not detected</strong> — Start Spring Boot on port 8080 and refresh.</span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-display font-bold text-gray-900 dark:text-white">
              All Profiles
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {loading ? 'Loading...' : `${profiles.length} profile${profiles.length !== 1 ? 's' : ''} saved in MySQL`}
            </p>
          </div>
          <div className="flex gap-2">
            <button onClick={fetchProfiles}
              className="btn-outline py-2 px-3" title="Refresh">
              <RefreshCw size={15} />
            </button>
            <button onClick={() => setShowCreate(true)} className="btn-primary">
              <Plus size={15} /> New Profile
            </button>
          </div>
        </div>

        {/* Loading spinner */}
        {loading && (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
              <p className="text-sm text-gray-400">Fetching profiles from MySQL...</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!loading && profiles.length === 0 && !offline && (
          <div className="text-center py-24 card">
            <User size={48} className="mx-auto mb-4 text-gray-300 dark:text-gray-700" />
            <h3 className="font-display font-semibold text-gray-700 dark:text-gray-300 text-lg mb-2">
              No profiles yet
            </h3>
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              Create your first profile to get started
            </p>
            <button onClick={() => setShowCreate(true)} className="btn-primary mx-auto">
              <Plus size={15} /> Create First Profile
            </button>
          </div>
        )}

        {/* Profiles grid */}
        {!loading && profiles.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {profiles.map(profile => (
              <div key={profile.id} className={`transition-opacity ${deleting === profile.id ? 'opacity-40 pointer-events-none' : ''}`}>
                <ProfileCard
                  profile={profile}
                  onView={handleView}
                  onDelete={handleDelete}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      {showCreate && (
        <CreateModal
          onClose={() => setShowCreate(false)}
          onCreate={handleCreated}
        />
      )}
    </div>
  )
}
