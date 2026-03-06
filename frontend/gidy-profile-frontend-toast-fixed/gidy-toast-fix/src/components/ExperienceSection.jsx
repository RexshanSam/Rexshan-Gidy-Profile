import { useState } from 'react'
import { Briefcase, Plus, Pencil, Trash2, X, Save, Building } from 'lucide-react'
import toast from 'react-hot-toast'
import { experienceApi } from '../services/api'

const EMPTY = { company: '', role: '', startDate: '', endDate: '', current: false, description: '' }

const fmt = (d) => {
  if (!d) return ''
  const [y, m] = d.split('-')
  if (!m) return y
  return new Date(y, m - 1).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
}

// ─── Defined OUTSIDE the parent so React never treats it as a new component ───
function ExpForm({ form, setForm, saving, onSave, onCancel }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 space-y-3 animate-fade-in">
      <input value={form.company} onChange={e => setForm(p => ({ ...p, company: e.target.value }))}
        placeholder="Company name *" className="form-input" />
      <input value={form.role} onChange={e => setForm(p => ({ ...p, role: e.target.value }))}
        placeholder="Job title / Role *" className="form-input" />
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">Start Date</label>
          <input type="month" value={form.startDate} onChange={e => setForm(p => ({ ...p, startDate: e.target.value }))}
            className="form-input" />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 mb-1 block">End Date</label>
          <input type="month" value={form.endDate} onChange={e => setForm(p => ({ ...p, endDate: e.target.value }))}
            disabled={form.current} className="form-input disabled:opacity-50" />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
        <input type="checkbox" checked={form.current}
          onChange={e => setForm(p => ({ ...p, current: e.target.checked, endDate: '' }))}
          className="rounded" />
        Currently working here
      </label>
      <textarea value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
        placeholder="Describe your role and achievements..." rows={3}
        className="form-input resize-none" />
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="btn-outline text-xs py-1.5 px-3"><X size={12} /> Cancel</button>
        <button onClick={onSave} disabled={saving} className="btn-primary text-xs py-1.5 px-3 disabled:opacity-60">
          <Save size={12} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default function ExperienceSection({ experiences = [], profileId, onUpdate, offline }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editId,  setEditId]  = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [saving,  setSaving]  = useState(false)

  const handleAdd = async () => {
    if (!form.company || !form.role) return toast.error('Company and role are required')
    if (offline) return toast.error('Start the backend to add experience')
    setSaving(true)
    try {
      const added = await experienceApi.add(profileId, form)
      onUpdate([...experiences, added])
      setForm(EMPTY); setShowAdd(false)
      toast.success('Experience saved')
    } catch { toast.error('Failed to add experience') }
    finally  { setSaving(false) }
  }

  const handleUpdate = async (id) => {
    if (offline) return toast.error('Start the backend to update experience')
    setSaving(true)
    try {
      const updated = await experienceApi.update(profileId, id, form)
      onUpdate(experiences.map(e => e.id === id ? updated : e))
      setEditId(null)
      toast.success('Experience updated')
    } catch { toast.error('Failed to update') }
    finally  { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (offline) return toast.error('Start the backend to delete experience')
    try {
      await experienceApi.delete(profileId, id)
      onUpdate(experiences.filter(e => e.id !== id))
      toast.success('Experience removed')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Briefcase size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="section-title">Experience</h2>
        </div>
        <button onClick={() => { setForm(EMPTY); setShowAdd(p => !p) }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-all">
          <Plus size={18} />
        </button>
      </div>

      {showAdd && (
        <div className="mb-4">
          <ExpForm form={form} setForm={setForm} saving={saving} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
        </div>
      )}

      {experiences.length === 0 && !showAdd ? (
        <div className="text-center py-10">
          <div className="text-4xl mb-3">👆</div>
          <p className="text-sm text-gray-400 dark:text-gray-500">Add Your Experiences!</p>
        </div>
      ) : (
        <div className="space-y-5">
          {experiences.map((exp, idx) => (
            <div key={exp.id} className="relative">
              {editId === exp.id ? (
                <ExpForm form={form} setForm={setForm} saving={saving}
                  onSave={() => handleUpdate(exp.id)} onCancel={() => setEditId(null)} />
              ) : (
                <div className="flex gap-4 group">
                  <div className="flex flex-col items-center">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800 flex items-center justify-center flex-shrink-0">
                      <Building size={16} className="text-indigo-600 dark:text-indigo-400" />
                    </div>
                    {idx < experiences.length - 1 && (
                      <div className="w-px flex-1 bg-gray-100 dark:bg-gray-800 my-2" />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{exp.role}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{exp.company}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {fmt(exp.startDate)} – {exp.current ? 'Present' : fmt(exp.endDate)}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setForm(exp); setEditId(exp.id) }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-indigo-600">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(exp.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    {exp.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">{exp.description}</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
