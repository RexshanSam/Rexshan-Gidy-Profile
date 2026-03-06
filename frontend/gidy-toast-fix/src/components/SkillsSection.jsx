import { useState } from 'react'
import { Plus, ThumbsUp, X, Tag } from 'lucide-react'
import toast from 'react-hot-toast'
import { skillsApi } from '../services/api'

const CATEGORIES = ['Frontend', 'Backend', 'Database', 'Testing', 'DevOps', 'Other']
const LEVELS     = ['Beginner', 'Intermediate', 'Advanced', 'Expert']

const LEVEL_COLORS = {
  Expert:       'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300',
  Advanced:     'bg-blue-100   dark:bg-blue-900/30   text-blue-700   dark:text-blue-300',
  Intermediate: 'bg-green-100  dark:bg-green-900/30  text-green-700  dark:text-green-300',
  Beginner:     'bg-gray-100   dark:bg-gray-700       text-gray-600   dark:text-gray-400',
}

export default function SkillsSection({ skills = [], profileId, onUpdate, offline }) {
  const [showAdd,   setShowAdd]   = useState(false)
  const [newSkill,  setNewSkill]  = useState({ name: '', category: 'Frontend', level: 'Intermediate' })
  const [endorsing, setEndorsing] = useState(null)
  const [adding,    setAdding]    = useState(false)

  const handleAdd = async () => {
    if (!newSkill.name.trim()) return toast.error('Enter a skill name')
    if (offline) return toast.error('Start the backend to save skills')
    setAdding(true)
    try {
      const added = await skillsApi.add(profileId, newSkill)
      onUpdate([...skills, added])
      setNewSkill({ name: '', category: 'Frontend', level: 'Intermediate' })
      setShowAdd(false)
      toast.success('Skill saved')
    } catch { toast.error('Failed to add skill') }
    finally  { setAdding(false) }
  }

  const handleDelete = async (skillId) => {
    if (offline) return toast.error('Start the backend to delete skills')
    try {
      await skillsApi.delete(profileId, skillId)
      onUpdate(skills.filter(s => s.id !== skillId))
      toast.success('Skill removed')
    } catch { toast.error('Failed to remove skill') }
  }

  /**
   * ✨ INNOVATION: Endorse a skill.
   * Persists endorsement count to MySQL via POST /api/profiles/{id}/skills/{skillId}/endorse
   */
  const handleEndorse = async (skill) => {
    if (endorsing === skill.id) return
    if (offline) return toast.error('Start the backend to endorse skills')
    setEndorsing(skill.id)
    try {
      const updated = await skillsApi.endorse(profileId, skill.id)
      onUpdate(skills.map(s => s.id === skill.id ? { ...s, endorsements: updated.endorsements } : s))
      toast.success(`${skill.name} endorsed`)
    } catch { toast.error('Failed to endorse') }
    finally  { setTimeout(() => setEndorsing(null), 800) }
  }

  const grouped = skills.reduce((acc, skill) => {
    const cat = skill.category || 'Other'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(skill)
    return acc
  }, {})

  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Tag size={18} className="text-indigo-600 dark:text-indigo-400" />
          <h2 className="section-title">Skills</h2>
          <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
            {skills.length}
          </span>
        </div>
        <button onClick={() => setShowAdd(p => !p)} className="btn-outline text-xs py-1.5 px-3">
          <Plus size={13} /> Add Skill
        </button>
      </div>

      {/* Add skill form */}
      {showAdd && (
        <div className="mb-5 p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 space-y-3 animate-fade-in">
          <div className="flex gap-2 flex-wrap">
            <input value={newSkill.name}
              onChange={e => setNewSkill(p => ({ ...p, name: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && handleAdd()}
              placeholder="Skill name (e.g. React)" className="form-input flex-1 min-w-[120px]" />
            <select value={newSkill.category}
              onChange={e => setNewSkill(p => ({ ...p, category: e.target.value }))}
              className="form-input w-auto">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
            <select value={newSkill.level}
              onChange={e => setNewSkill(p => ({ ...p, level: e.target.value }))}
              className="form-input w-auto">
              {LEVELS.map(l => <option key={l}>{l}</option>)}
            </select>
          </div>
          <div className="flex gap-2 justify-end">
            <button onClick={() => setShowAdd(false)} className="btn-outline text-xs py-1.5 px-3">Cancel</button>
            <button onClick={handleAdd} disabled={adding} className="btn-primary text-xs py-1.5 px-3 disabled:opacity-60">
              {adding ? 'Saving...' : 'Add Skill'}
            </button>
          </div>
        </div>
      )}

      {/* Skills list */}
      {skills.length === 0 ? (
        <div className="text-center py-8 text-gray-400 dark:text-gray-600">
          <Tag size={32} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No skills added yet</p>
        </div>
      ) : (
        <div className="space-y-5">
          {Object.entries(grouped).map(([category, catSkills]) => (
            <div key={category}>
              <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2.5">
                {category}
              </p>
              <div className="flex flex-wrap gap-2">
                {catSkills.map(skill => (
                  <div key={skill.id}
                    className="group relative flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all">

                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>

                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${LEVEL_COLORS[skill.level] || LEVEL_COLORS.Beginner}`}>
                      {skill.level}
                    </span>

                    {/* ✨ Endorse button — saves to MySQL */}
                    <button onClick={() => handleEndorse(skill)}
                      title="Endorse this skill"
                      className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full transition-all ${
                        endorsing === skill.id
                          ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 scale-95'
                          : 'bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:text-indigo-600 dark:hover:text-indigo-400'
                      }`}>
                      <ThumbsUp size={10} />
                      <span>{skill.endorsements || 0}</span>
                    </button>

                    {/* Delete */}
                    <button onClick={() => handleDelete(skill.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-300 dark:text-gray-600 hover:text-red-500 transition-all ml-0.5">
                      <X size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
        <p className="text-[11px] text-gray-400 dark:text-gray-600 flex items-center gap-1">
          <ThumbsUp size={10} />
          Click <span className="font-medium text-indigo-500 mx-0.5">👍</span> on any skill to endorse it
        </p>
      </div>
    </div>
  )
}
