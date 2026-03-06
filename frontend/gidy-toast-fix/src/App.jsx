import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import ProfilePage from './pages/ProfilePage'
import ProfilesListPage from './pages/ProfilesListPage'

// NO <Toaster> here — it lives in main.jsx outside this component
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/profiles" element={<ProfilesListPage />} />
          <Route path="/profile/:id" element={<ProfilePage />} />
          <Route path="/" element={<Navigate to="/profiles" replace />} />
          <Route path="*" element={<Navigate to="/profiles" replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}
