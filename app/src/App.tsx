import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import type { User } from './lib/api'
import { WorkspaceApp } from './WorkspaceApp'
import { Login } from './pages/AccessPages'

function App() {
  const [user, setUser] = useState<User | null>(() => {
    try { return JSON.parse(localStorage.getItem('htoo_user') || 'null') } catch { return null }
  })

  return <BrowserRouter>{user ? <WorkspaceApp user={user} setUser={setUser} /> : <Routes><Route path="*" element={<Login onLoggedIn={(nextUser) => { setUser(nextUser); localStorage.setItem('htoo_user', JSON.stringify(nextUser)) }} />} /></Routes>}</BrowserRouter>
}

export default App
