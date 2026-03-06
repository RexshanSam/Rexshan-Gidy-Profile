import { useState } from 'react'
import { GraduationCap, Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import toast from 'react-hot-toast'
import { educationApi } from '../services/api'

const EMPTY = { institution: '', degree: '', field: '', startYear: '', endYear: '', current: false, grade: '' }

// ─── Defined OUTSIDE the parent so React never treats it as a new component ───
function EduForm({ form, setForm, saving, onSave, onCancel }) {
  return (
    <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 space-y-3 animate-fade-in">
      <input value={form.institution} onChange={e => setForm(p => ({ ...p, institution: e.target.value }))}
        placeholder="Institution name *" className="form-input" />
      <div className="grid grid-cols-2 gap-3">
        <input value={form.degree} onChange={e => setForm(p => ({ ...p, degree: e.target.value }))}
          placeholder="Degree *" className="form-input" />
        <input value={form.field} onChange={e => setForm(p => ({ ...p, field: e.target.value }))}
          placeholder="Field of study" className="form-input" />
        <input type="number" value={form.startYear} onChange={e => setForm(p => ({ ...p, startYear: e.target.value }))}
          placeholder="Start year" className="form-input" />
        <input type="number" value={form.endYear} onChange={e => setForm(p => ({ ...p, endYear: e.target.value }))}
          disabled={form.current} placeholder="End year" className="form-input disabled:opacity-50" />
      </div>
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 cursor-pointer">
          <input type="checkbox" checked={form.current}
            onChange={e => setForm(p => ({ ...p, current: e.target.checked, endYear: '' }))}
            className="rounded" />
          Currently studying
        </label>
        <input value={form.grade} onChange={e => setForm(p => ({ ...p, grade: e.target.value }))}
          placeholder="Grade / CGPA" className="form-input flex-1" />
      </div>
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="btn-outline text-xs py-1.5 px-3"><X size={12} /> Cancel</button>
        <button onClick={onSave} disabled={saving} className="btn-primary text-xs py-1.5 px-3 disabled:opacity-60">
          <Save size={12} /> {saving ? 'Saving...' : 'Save'}
        </button>
      </div>
    </div>
  )
}

export default function EducationSection({ educations = [], profileId, onUpdate, offline }) {
  const [showAdd, setShowAdd] = useState(false)
  const [editId,  setEditId]  = useState(null)
  const [form,    setForm]    = useState(EMPTY)
  const [saving,  setSaving]  = useState(false)

  const handleAdd = async () => {
    if (!form.institution || !form.degree) return toast.error('Institution and degree are required')
    if (offline) return toast.error('Start the backend to add education')
    setSaving(true)
    try {
      const added = await educationApi.add(profileId, form)
      onUpdate([...educations, added])
      setForm(EMPTY); setShowAdd(false)
      toast.success('Education saved')
    } catch { toast.error('Failed to add education') }
    finally  { setSaving(false) }
  }

  const handleUpdate = async (id) => {
    if (offline) return toast.error('Start the backend to update education')
    setSaving(true)
    try {
      const updated = await educationApi.update(profileId, id, form)
      onUpdate(educations.map(e => e.id === id ? updated : e))
      setEditId(null)
      toast.success('Education updated')
    } catch { toast.error('Failed to update') }
    finally  { setSaving(false) }
  }

  const handleDelete = async (id) => {
    if (offline) return toast.error('Start the backend to delete education')
    try {
      await educationApi.delete(profileId, id)
      onUpdate(educations.filter(e => e.id !== id))
      toast.success('Education removed')
    } catch { toast.error('Failed to delete') }
  }

  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <GraduationCap size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="section-title">Education</h2>
        </div>
        <button onClick={() => { setForm(EMPTY); setShowAdd(p => !p) }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 transition-all">
          <Plus size={18} />
        </button>
      </div>

      {showAdd && (
        <div className="mb-4">
          <EduForm form={form} setForm={setForm} saving={saving} onSave={handleAdd} onCancel={() => setShowAdd(false)} />
        </div>
      )}

      {educations.length === 0 && !showAdd ? (
        <div className="text-center py-10">
          <GraduationCap size={32} className="mx-auto mb-2 text-gray-300 dark:text-gray-700" />
          <p className="text-sm text-gray-400 dark:text-gray-500">Add your education details</p>
        </div>
      ) : (
        <div className="space-y-4">
          {educations.map(edu => (
            <div key={edu.id} className="group">
              {editId === edu.id ? (
                <EduForm form={form} setForm={setForm} saving={saving}
                  onSave={() => handleUpdate(edu.id)} onCancel={() => setEditId(null)} />
              ) : (
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <GraduationCap size={18} className="text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                          {edu.degree}{edu.field ? ` – ${edu.field}` : ''}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{edu.institution}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                          {edu.startYear} – {edu.current ? 'Present' : edu.endYear}
                          {edu.grade && <span className="ml-2 text-green-600 dark:text-green-400">• {edu.grade}</span>}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setForm(edu); setEditId(edu.id) }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-indigo-600">
                          <Pencil size={13} />
                        </button>
                        <button onClick={() => handleDelete(edu.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-gray-400 hover:text-red-500">
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
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
