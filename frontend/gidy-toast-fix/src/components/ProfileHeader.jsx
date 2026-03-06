import { useState, useRef } from 'react'
import { Mail, Download, MapPin, MoreVertical, Camera, Pencil, Save, X, Phone, Globe, CheckCircle, Upload, FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { profileApi } from '../services/api'

export default function ProfileHeader({ profile, onUpdate, offline }) {
  const [editing,         setEditing]         = useState(false)
  const [uploading,       setUploading]        = useState(false)
  const [uploadingResume, setUploadingResume]  = useState(false)
  const [saveLoading,     setSaveLoading]      = useState(false)
  const fileRef       = useRef(null)
  const resumeFileRef = useRef(null)

  const [form, setForm] = useState({
    name:        profile?.name        || '',
    designation: profile?.designation || '',
    location:    profile?.location    || '',
    bio:         profile?.bio         || '',
    email:       profile?.email       || '',
    phone:       profile?.phone       || '',
    company:     profile?.company     || '',
    website:     profile?.website     || '',
    openToWork:  profile?.openToWork  || false,
    avatarUrl:   profile?.avatarUrl   || '',
  })

  const openEdit = () => {
    setForm({
      name:        profile?.name        || '',
      designation: profile?.designation || '',
      location:    profile?.location    || '',
      bio:         profile?.bio         || '',
      email:       profile?.email       || '',
      phone:       profile?.phone       || '',
      company:     profile?.company     || '',
      website:     profile?.website     || '',
      openToWork:  profile?.openToWork  || false,
      avatarUrl:   profile?.avatarUrl   || '',
    })
    setEditing(true)
  }

  const handleSave = async () => {
    if (offline) return toast.error('Start the backend to save changes')
    setSaveLoading(true)
    try {
      const updated = await profileApi.update(profile.id, form)
      onUpdate(updated)
      setEditing(false)
      toast.success('Profile updated')
    } catch {
      toast.error('Failed to save — is Spring Boot running?')
    } finally {
      setSaveLoading(false)
    }
  }

  /**
   * Upload photo → POST /api/profiles/{id}/photo (multipart).
   * Backend saves file to /uploads directory, stores URL in MySQL.
   */
  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (offline) return toast.error('Start the backend to upload photos')
    if (file.size > 10 * 1024 * 1024) return toast.error('File too large (max 10 MB)')

    setUploading(true)
    try {
      const updated = await profileApi.uploadPhoto(profile.id, file)
      onUpdate(updated)
      setForm(f => ({ ...f, avatarUrl: updated.avatarUrl }))
      toast.success('Photo updated')
    } catch {
      toast.error('Photo upload failed')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  /**
   * Upload resume → POST /api/profiles/{id}/resume (multipart).
   * Backend saves file, stores URL in MySQL.
   */
  const handleResumeChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (offline) return toast.error('Start the backend to upload resume')
    const allowed = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowed.includes(file.type)) return toast.error('Only PDF or Word files are supported')
    if (file.size > 10 * 1024 * 1024) return toast.error('File too large (max 10 MB)')

    setUploadingResume(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const updated = await profileApi.uploadResume
        ? await profileApi.uploadResume(profile.id, file)
        : await (async () => {
            const res = await fetch(`/api/profiles/${profile.id}/resume`, { method: 'POST', body: fd })
            if (!res.ok) throw new Error('Upload failed')
            return res.json()
          })()
      onUpdate(updated)
      toast.success('Resume uploaded')
    } catch {
      toast.error('Resume upload failed')
    } finally {
      setUploadingResume(false)
      e.target.value = ''
    }
  }

  const initials = profile?.name
    ? profile.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'RS'

  const avatarSrc = form.avatarUrl || profile?.avatarUrl

  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">

        {/* Avatar + Info */}
        <div className="flex items-start gap-4">
          {/* Clickable avatar with camera overlay */}
          <div className="relative group flex-shrink-0">
            <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-md">
              {avatarSrc ? (
                <img src={avatarSrc} alt="avatar"
                  className="w-20 h-20 rounded-full object-cover"
                  onError={(e) => { e.target.style.display = 'none' }} />
              ) : (
                <span className="text-white text-2xl font-bold font-display">{initials}</span>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {/* Camera overlay — click to upload photo */}
            {!uploading && (
              <label className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 rounded-full cursor-pointer transition-all">
                <Camera size={20} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                <input ref={fileRef} type="file" className="hidden" accept="image/*" onChange={handlePhotoChange} />
              </label>
            )}
            {/* Online dot */}
            <div className="absolute bottom-0.5 right-0.5 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900" />
          </div>

          {/* Name / designation */}
          <div className="flex-1 min-w-0">
            {editing ? (
              <div className="space-y-2">
                <input value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="form-input font-semibold" placeholder="Full name" />
                <input value={form.designation}
                  onChange={e => setForm(p => ({ ...p, designation: e.target.value }))}
                  className="form-input text-xs" placeholder="e.g. Fresher / Graduate" />
                <input value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))}
                  className="form-input text-xs" placeholder="City, State, Country" />
              </div>
            ) : (
              <>
                <h1 className="text-xl font-display font-bold text-gray-900 dark:text-white flex items-center gap-2 flex-wrap">
                  {profile?.name}
                  {profile?.designation && (
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                      ( {profile.designation} )
                    </span>
                  )}
                </h1>
                <div className="flex items-center gap-1 mt-1 text-sm text-gray-500 dark:text-gray-400">
                  <MapPin size={13} />
                  <span>{profile?.location || 'Chennai, Tamil Nadu, IND'}</span>
                </div>
                {profile?.openToWork && (
                  <div className="flex items-center gap-1 mt-1.5">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 px-2 py-0.5 rounded-full">
                      <CheckCircle size={11} /> Open to Work
                    </span>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Edit / Save / Cancel buttons */}
        <div className="flex items-center gap-2">
          {editing ? (
            <>
              <button onClick={handleSave} disabled={saveLoading} className="btn-primary disabled:opacity-60">
                {saveLoading
                  ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Save size={14} />}
                Save
              </button>
              <button onClick={() => setEditing(false)} className="btn-outline">
                <X size={14} /> Cancel
              </button>
            </>
          ) : (
            <>
              <button onClick={openEdit} className="btn-outline">
                <Pencil size={14} /> Edit Profile
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400">
                <MoreVertical size={18} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* Bio */}
      <div className="mb-4">
        {editing ? (
          <textarea value={form.bio}
            onChange={e => setForm(p => ({ ...p, bio: e.target.value }))}
            rows={4} className="form-input resize-none" placeholder="Write your bio..." />
        ) : (
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {profile?.bio || "Hi, I'm a developer passionate about building clean, impactful software."}
          </p>
        )}
      </div>

      {/* Additional edit fields */}
      {editing && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Email</label>
            <input value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              className="form-input" placeholder="email@example.com" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Phone</label>
            <input value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              className="form-input" placeholder="+91 XXXXXXXXXX" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Company</label>
            <input value={form.company}
              onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
              className="form-input" placeholder="Company name" />
          </div>
          <div>
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Website</label>
            <input value={form.website}
              onChange={e => setForm(p => ({ ...p, website: e.target.value }))}
              className="form-input" placeholder="https://yoursite.com" />
          </div>
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1 block">Avatar URL (or use camera icon above to upload)</label>
            <input value={form.avatarUrl}
              onChange={e => setForm(p => ({ ...p, avatarUrl: e.target.value }))}
              className="form-input" placeholder="https://example.com/photo.jpg" />
          </div>
          <div className="sm:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={!!form.openToWork}
                onChange={e => setForm(p => ({ ...p, openToWork: e.target.checked }))}
                className="w-4 h-4 rounded text-indigo-600" />
              <span className="text-sm text-gray-700 dark:text-gray-300 font-medium">Open to Work</span>
            </label>
          </div>
        </div>
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4 flex-wrap">
          {profile?.email && !editing && (
            <a href={`mailto:${profile.email}`}
              className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
              <Mail size={15} /> {profile.email}
            </a>
          )}
          {profile?.phone && !editing && (
            <a href={`tel:${profile.phone}`}
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
              <Phone size={13} /> {profile.phone}
            </a>
          )}
          {profile?.website && !editing && (
            <a href={profile.website} target="_blank" rel="noreferrer"
              className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-400">
              <Globe size={13} /> {profile.website.replace('https://', '')}
            </a>
          )}
          {/* Resume upload + download */}
          <div className="flex items-center gap-2">
            <label className={`flex items-center gap-2 px-4 py-1.5 rounded-lg border border-dashed border-indigo-300 dark:border-indigo-700 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all cursor-pointer ${uploadingResume ? 'opacity-60 pointer-events-none' : ''}`}>
              {uploadingResume
                ? <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
                : <Upload size={14} />}
              {uploadingResume ? 'Uploading...' : 'Upload Resume'}
              <input ref={resumeFileRef} type="file" className="hidden" accept=".pdf,.doc,.docx" onChange={handleResumeChange} />
            </label>
            {profile?.resumeUrl ? (
              <a href={profile.resumeUrl} target="_blank" rel="noreferrer"
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
                <Download size={14} /> Download Resume
              </a>
            ) : (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 dark:text-gray-500 italic">
                <FileText size={13} /> No resume uploaded yet
              </span>
            )}
          </div>
        </div>

        {/* League badge */}
        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
          <span className="text-2xl">🥉</span>
          <div className="text-right">
            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 mb-0.5">
              <span>League</span><span>Rank</span><span>Points</span>
            </div>
            <div className="flex items-center gap-4 text-sm font-semibold text-gray-800 dark:text-gray-200">
              <span>{profile?.league || 'Bronze'}</span>
              <span>{profile?.rank   || 33}</span>
              <span>{profile?.points || 50}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 text-right">
        <button className="text-sm text-amber-600 dark:text-amber-400 font-medium hover:underline flex items-center gap-1 ml-auto">
          View My Rewards ›
        </button>
      </div>
    </div>
  )
}
