import { useEffect, useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import type { User } from './services/apiServices'
import { WorkspaceApp } from './WorkspaceApp'
import { Login } from './pages/AccessPages'

function App() {
  const [user, setUser] = useState<User | null>(() => {
    if (!localStorage.getItem('htoo_token')) {
      localStorage.removeItem('htoo_user')
      return null
    }
    try { return JSON.parse(localStorage.getItem('htoo_user') || 'null') } catch {
      localStorage.removeItem('htoo_token')
      localStorage.removeItem('htoo_user')
      return null
    }
  })

  useEffect(() => {
    const handleUnauthorized = () => setUser(null)
    window.addEventListener('htoo:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('htoo:unauthorized', handleUnauthorized)
  }, [])

  return <BrowserRouter>{user ? <WorkspaceApp user={user} setUser={setUser} /> : <Routes><Route path="*" element={<Login onLoggedIn={(nextUser) => { setUser(nextUser); localStorage.setItem('htoo_user', JSON.stringify(nextUser)) }} />} /></Routes>}</BrowserRouter>
}

export default App
