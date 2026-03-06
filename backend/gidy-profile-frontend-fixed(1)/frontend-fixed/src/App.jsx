import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import ProfilePage from './pages/ProfilePage'
import ProfilesListPage from './pages/ProfilesListPage'
import { Toaster } from 'react-hot-toast'

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* Profiles list — shows all saved profiles */}
          <Route path="/profiles"    element={<ProfilesListPage />} />
          {/* Single profile view */}
          <Route path="/profile/:id" element={<ProfilePage />} />
          {/* Root redirects to profiles list */}
          <Route path="/"            element={<Navigate to="/profiles" replace />} />
          <Route path="*"            element={<Navigate to="/profiles" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
