import { Briefcase, UserCheck, FileText, GraduationCap } from 'lucide-react'

const CHECKLIST = [
  { label: 'Add Your Experience', icon: Briefcase,     points: 20, key: 'hasExperience',
    desc: 'Showcase your work history and professional background.' },
  { label: 'Add Your Skills',     icon: UserCheck,     points: 10, key: 'hasSkills',
    desc: 'Tell employers what you are good at.' },
  { label: 'Upload Resume',       icon: FileText,      points: 15, key: 'hasResume',
    desc: 'Let recruiters download your full resume.' },
  { label: 'Add Education',       icon: GraduationCap, points: 15, key: 'hasEducation',
    desc: 'Show your academic background and degrees.' },
]

const MAX_POINTS = CHECKLIST.reduce((s, i) => s + i.points, 0) // 60

export default function LevelUpSection({ progress = {}, completion = 0, onScrollTo }) {
  const done  = CHECKLIST.filter(i => progress[i.key]).length
  const total = CHECKLIST.length

  const handleItemClick = (key, isDone) => {
    // Only scroll when section not yet completed
    if (!isDone && onScrollTo) onScrollTo(key)
  }

  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg">🎓</span>
        <h2 className="section-title">Level Up Profile</h2>
      </div>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        Just a few clicks away from awesomeness, complete your profile!
      </p>

      {/* Progress bar */}
      <div className="mb-5">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-xs text-gray-500 dark:text-gray-400">Progress: {completion}%</span>
          <span className="text-xs font-semibold text-green-600 dark:text-green-400">{done}/{total} done</span>
        </div>
        <div className="h-2.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
            style={{ width: `${Math.round((completion / MAX_POINTS) * 100)}%` }}
          />
        </div>
      </div>

      {/* Checklist items */}
      <div className="space-y-3">
        {CHECKLIST.map(({ label, icon: Icon, points, key, desc }) => {
          const isDone = !!progress[key]
          const isClickable = !isDone && (key !== 'hasResume') // Resume upload is in header, not a section
          return (
            <div
              key={key}
              onClick={() => handleItemClick(key, isDone)}
              title={isClickable ? `Click to go to ${label}` : undefined}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                isDone
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800'
                  : 'bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700'
              } ${isClickable ? 'cursor-pointer hover:border-indigo-300 dark:hover:border-indigo-600 hover:shadow-sm' : 'cursor-default'}`}>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                isDone ? 'bg-green-100 dark:bg-green-900/40' : 'bg-white dark:bg-gray-700'
              }`}>
                <Icon size={15} className={isDone ? 'text-green-600 dark:text-green-400' : 'text-gray-400'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${
                  isDone ? 'text-green-700 dark:text-green-300 line-through opacity-60' : 'text-gray-700 dark:text-gray-300'
                }`}>{label}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">
                  {isClickable ? '↓ Click to jump there' : desc}
                </p>
              </div>
              <span className={`text-xs font-semibold flex-shrink-0 ${
                isDone ? 'text-green-600 dark:text-green-400' : 'text-indigo-600 dark:text-indigo-400'
              }`}>
                +{points}%
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
