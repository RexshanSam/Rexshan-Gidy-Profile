import { useState } from 'react'
import { Sparkles, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { profileApi } from '../services/api'

export default function CareerGoals({ profileId, goals, onUpdate, offline }) {
  const [editing, setEditing] = useState(false)
  const [form,    setForm]    = useState(goals || '')
  const [saving,  setSaving]  = useState(false)

  const handleSave = async () => {
    if (offline) return toast.error('Start the backend to save career goals')
    setSaving(true)
    try {
      const updated = await profileApi.update(profileId, { careerGoals: form })
      onUpdate(updated)
      setEditing(false)
      toast.success('Career goals saved')
    } catch { toast.error('Failed to save') }
    finally  { setSaving(false) }
  }

  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="section-title mb-1">Tell us where you want to go</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Add your career goals and what inspires you. This helps us tailor recommendations,
            learning paths, and opportunities just for you.
          </p>

          {goals && !editing && (
            <p className="mt-3 text-sm text-gray-700 dark:text-gray-300 italic leading-relaxed">
              "{goals}"
            </p>
          )}

          {editing && (
            <div className="mt-3 space-y-2">
              <textarea
                value={form}
                onChange={e => setForm(e.target.value)}
                placeholder="e.g. I want to become a full-stack developer and build products that impact millions..."
                rows={3}
                className="form-input resize-none"
              />
              <div className="flex gap-2">
                <button onClick={handleSave} disabled={saving}
                  className="btn-primary text-xs py-1.5 px-3 disabled:opacity-60">
                  <Save size={12} /> {saving ? 'Saving...' : 'Save'}
                </button>
                <button onClick={() => setEditing(false)} className="btn-outline text-xs py-1.5 px-3">
                  <X size={12} /> Cancel
                </button>
              </div>
            </div>
          )}
        </div>

        {!editing && (
          <button onClick={() => { setForm(goals || ''); setEditing(true) }}
            className="btn-primary flex-shrink-0">
            <Sparkles size={15} />
            {goals ? 'Edit career goals' : 'Add your career goals'}
          </button>
        )}
      </div>
    </div>
  )
}
