import { useState, useEffect } from 'react'
import { profileApi, skillsApi, experienceApi, educationApi } from '../services/api'
import Navbar from '../components/Navbar'
import ProfileHeader from '../components/ProfileHeader'
import SkillsSection from '../components/SkillsSection'
import ExperienceSection from '../components/ExperienceSection'
import EducationSection from '../components/EducationSection'
import LevelUpSection from '../components/LevelUpSection'
import CareerGoals from '../components/CareerGoals'
import AiBioGenerator from '../components/AiBioGenerator'

// ─── Default profile created on first launch if DB is empty ──────────────────
const DEFAULT_PROFILE = {
  name:        'Your Name',
  designation: 'Fresher / Graduate',
  location:    'City, State, Country',
  bio:         "Hi, I'm new here — click Edit Profile to update your details.",
  email:       '',
  phone:       '',
  website:     '',
  openToWork:  false,
  league:      'Bronze',
  rank:        1,
  points:      0,
  profileCompletion: 0,
}

function Spinner() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading profile...</p>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [profile,     setProfile]     = useState(null)
  const [skills,      setSkills]      = useState([])
  const [experiences, setExperiences] = useState([])
  const [educations,  setEducations]  = useState([])
  const [offline,     setOffline]     = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [statusMsg,   setStatusMsg]   = useState('Connecting to backend...')

  useEffect(() => {
    loadProfile()
  }, [])

  async function loadProfile() {
    setLoading(true)
    try {
      // ── Step 1: Get all profiles ──────────────────────────────────────────
      setStatusMsg('Connecting to backend...')
      const allProfiles = await profileApi.getAll()

      let targetProfile
      if (allProfiles.length === 0) {
        // ── Step 2: No profile exists yet — create a default one ─────────────
        setStatusMsg('First launch — creating your profile...')
        targetProfile = await profileApi.create(DEFAULT_PROFILE)
      } else {
        // ── Step 3: Use the first profile found ───────────────────────────────
        targetProfile = allProfiles[0]
      }

      const pid = targetProfile.id

      // ── Step 4: Load all related data in parallel ─────────────────────────
      setStatusMsg('Loading your data...')
      const [s, e, edu] = await Promise.all([
        skillsApi.list(pid),
        experienceApi.list(pid),
        educationApi.list(pid),
      ])

      setProfile(targetProfile)
      setSkills(s)
      setExperiences(e)
      setEducations(edu)
      setOffline(false)

    } catch (err) {
      // ── Backend unreachable — show offline warning ────────────────────────
      console.warn('Backend offline:', err.message)
      setProfile({
        id: 1, name: 'Rexshan S', designation: 'Fresher / Graduate',
        location: 'Chennai, Tamil Nadu, IND',
        bio: "Hi, I'm Rexshan — a B.Sc Mathematics student (2022–2025) with a builder's mindset.",
        email: 'rexshansam22@gmail.com', phone: '+91 9487248821',
        website: 'https://rexshansam.netlify.app', openToWork: true,
        league: 'Bronze', rank: 33, points: 50, profileCompletion: 80,
      })
      setSkills([
        { id: 1, name: 'Java',           category: 'Backend',  level: 'Intermediate', endorsements: 3 },
        { id: 2, name: 'Spring Boot',    category: 'Backend',  level: 'Intermediate', endorsements: 1 },
        { id: 3, name: 'React JS',       category: 'Frontend', level: 'Intermediate', endorsements: 5 },
        { id: 4, name: 'JavaScript',     category: 'Frontend', level: 'Advanced',     endorsements: 4 },
        { id: 5, name: 'HTML5',          category: 'Frontend', level: 'Advanced',     endorsements: 2 },
        { id: 6, name: 'CSS3',           category: 'Frontend', level: 'Advanced',     endorsements: 2 },
        { id: 7, name: 'MySQL',          category: 'Database', level: 'Intermediate', endorsements: 1 },
        { id: 8, name: 'Manual Testing', category: 'Testing',  level: 'Beginner',     endorsements: 0 },
      ])
      setExperiences([])
      setEducations([{
        id: 1, institution: "St. John's College, Palayamkottai",
        degree: 'Bachelor of Science in Mathematics', field: 'Mathematics',
        startYear: '2022', endYear: '2025', current: false, grade: '60%',
      }])
      setOffline(true)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-200 border-t-indigo-600 animate-spin" />
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{statusMsg}</p>
      </div>
    </div>
  )

  const progress = {
    hasExperience: experiences.length > 0,
    hasSkills:     skills.length > 0,
    hasResume:     !!profile?.resumeUrl,
    hasEducation:  educations.length > 0,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <Navbar profile={profile} />

      {/* Offline warning banner */}
      {offline && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3">
          <div className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300 flex items-center gap-2">
            <span>⚠️</span>
            <span>
              <strong>Backend not detected</strong> — showing mock data.
              Start Spring Boot on port 8080 and make sure MySQL is running. Then refresh this page.
            </span>
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ──────────────────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-5">
            <ProfileHeader
              profile={profile}
              onUpdate={setProfile}
              offline={offline}
            />
            <CareerGoals
              profileId={profile?.id}
              goals={profile?.careerGoals}
              onUpdate={setProfile}
              offline={offline}
            />
            <ExperienceSection
              experiences={experiences}
              profileId={profile?.id}
              onUpdate={setExperiences}
              offline={offline}
            />
            <EducationSection
              educations={educations}
              profileId={profile?.id}
              onUpdate={setEducations}
              offline={offline}
            />
            <AiBioGenerator
              profileId={profile?.id}
              onApply={(bio) => setProfile(p => ({ ...p, bio }))}
              offline={offline}
            />
          </div>

          {/* ── Right column (sidebar) ────────────────────────────────────── */}
          <div className="space-y-5">
            <LevelUpSection
              progress={progress}
              completion={profile?.profileCompletion || 0}
            />
            <SkillsSection
              skills={skills}
              profileId={profile?.id}
              onUpdate={setSkills}
              offline={offline}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
