import { useState } from 'react'
import { Sparkles, Copy, RefreshCw, Check } from 'lucide-react'
import toast from 'react-hot-toast'
import { aiBioApi } from '../services/api'

/**
 * ✨ INNOVATION: AI Bio Generator
 * Calls the backend which uses OpenAI/Gemini (or a smart template fallback)
 * to generate a concise professional bio based on the user's profile data.
 */
export default function AiBioGenerator({ profileId, onApply, offline }) {
  const [loading, setLoading] = useState(false)
  const [bio,     setBio]     = useState('')
  const [copied,  setCopied]  = useState(false)

  const generate = async () => {
    if (offline) return toast.error('Start the backend to use AI Bio Generator')
    setLoading(true)
    setBio('')
    try {
      const result = await aiBioApi.generate(profileId)
      setBio(result.bio)
    } catch {
      toast.error('AI generation failed — is Spring Boot running?')
    } finally {
      setLoading(false)
    }
  }

  const copyBio = async () => {
    await navigator.clipboard.writeText(bio)
    setCopied(true)
    toast.success('Bio copied to clipboard!')
    setTimeout(() => setCopied(false), 2000)
  }

  const applyBio = () => {
    onApply(bio)
    toast.success('Bio applied to your profile! Click Save to persist it.')
  }

  return (
    <div className="card p-6 animate-slide-up border-indigo-100 dark:border-indigo-900 bg-gradient-to-br from-indigo-50/50 to-white dark:from-indigo-950/20 dark:to-gray-900">
      <div className="flex items-start gap-3 mb-4">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0 shadow-md shadow-indigo-200 dark:shadow-indigo-900">
          <Sparkles size={17} className="text-white" />
        </div>
        <div className="flex-1">
          <h2 className="section-title">AI Bio Generator</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Let AI craft a professional bio based on your skills and experience
          </p>
        </div>
        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-700 flex-shrink-0">
          ✨ Innovation
        </span>
      </div>

      {/* Generated bio result */}
      {bio && (
        <div className="mb-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800 animate-fade-in">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{bio}</p>
        </div>
      )}

      {/* Loading shimmer */}
      {loading && (
        <div className="mb-4 p-4 rounded-xl bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800 space-y-2 animate-fade-in">
          <div className="h-3 rounded-full shimmer w-full" />
          <div className="h-3 rounded-full shimmer w-5/6" />
          <div className="h-3 rounded-full shimmer w-4/5" />
          <div className="h-3 rounded-full shimmer w-3/4" />
        </div>
      )}

      {/* Action buttons */}
      <div className="flex items-center gap-2 flex-wrap">
        <button onClick={generate} disabled={loading}
          className="btn-primary disabled:opacity-60 disabled:cursor-not-allowed">
          {loading
            ? <><RefreshCw size={14} className="animate-spin" /> Generating...</>
            : bio
              ? <><RefreshCw size={14} /> Regenerate</>
              : <><Sparkles size={14} /> Generate Bio</>}
        </button>

        {bio && (
          <>
            <button onClick={copyBio} className="btn-outline">
              {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
            </button>
            <button onClick={applyBio}
              className="btn-outline text-indigo-600 dark:text-indigo-400 border-indigo-200 dark:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20">
              Apply to Profile
            </button>
          </>
        )}
      </div>

      <p className="text-[11px] text-gray-400 dark:text-gray-600 mt-3">
        Reads your skills, experience &amp; education — generates a tailored professional summary.
        {!bio && ' No API key needed — uses a smart template by default.'}
      </p>
    </div>
  )
}
