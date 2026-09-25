import React, { useEffect, useState } from 'react'
import { Moon, Save, ShieldCheck, Sun, UserCircle } from 'lucide-react'
import type { User } from '../lib/api'
import { api } from '../lib/api'
import { initials, shortDate } from '../lib/utils'
import { Badge, Button, Card, EmptyState, Input, Select } from '../components/ui'
import { type Language, type ThemeMode, type Toast, t, roleOptions } from '../lib/app-shared'

export function Login({ onLoggedIn }: { onLoggedIn: (user: User) => void }) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const submit = async (event: React.FormEvent) => { event.preventDefault(); setError(''); setLoading(true); try { if (mode === 'signin') { const result = await api.signIn(email, password); localStorage.setItem('htoo_token', result.token); onLoggedIn({ id: result.user.id, name: result.user.name, email: result.user.email, role_id: result.user.role_id ?? 3 }) } else { const result = await api.signUp(name, email, password); onLoggedIn({ id: result.data.id, name: result.data.name, email: result.data.email, role_id: result.data.role_id ?? 3 }) } } catch (requestError) { setError(requestError instanceof Error ? requestError.message : 'Unable to connect to the live API.') } finally { setLoading(false) } }
  return <div className="login-page"><div className="login-art"><div className="brand" style={{ color: 'white', padding: 0 }}><div className="brand-mark">H</div><div><strong>HTOO</strong><small style={{ color: '#c2c4ff' }}>Heavy Vehicle</small></div></div><div><h1>Keep every vehicle moving forward.</h1><p>A focused workspace for service invoices, customers, and the vehicles behind your business.</p></div><div className="login-stats"><div><strong>Live</strong><span>API-connected workspace</span></div><div><strong>100%</strong><span>Real records</span></div><div><strong>24/7</strong><span>Service visibility</span></div></div></div><div className="login-form-side"><form className="login-form" onSubmit={submit}><div className="eyebrow">Operations workspace</div><h2>{mode === 'signin' ? 'Welcome back' : 'Create your account'}</h2><p>{mode === 'signin' ? 'Sign in to manage your workshop operations.' : 'Start organizing your fleet service data.'}</p>{error && <div className="login-note" style={{ color: '#ca5967', borderColor: '#f3cdd1', marginTop: 0, marginBottom: 16 }}>{error}</div>}<div className="login-fields">{mode === 'signup' && <div className="form-field"><label>Full name</label><Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" required /></div>}<div className="form-field"><label>Email address</label><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.com" required /></div><div className="form-field"><label>Password</label><Input type="password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" required /></div><Button className="login-submit" disabled={loading}>{loading ? 'Connecting…' : mode === 'signin' ? 'Sign in to dashboard' : 'Create account'}</Button></div><p style={{ textAlign: 'center', marginTop: 22, marginBottom: 0 }}>{mode === 'signin' ? 'New to HTOO?' : 'Already have an account?'} <button type="button" className="card-link" onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}>{mode === 'signin' ? 'Create an account' : 'Sign in'}</button></p></form></div></div>
}

export function TeamAccessPage({ user, notify }: { user: User; notify: (message: string, kind?: Toast['kind']) => void }) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [savingId, setSavingId] = useState<number | null>(null)
  const isAdmin = user.role_id === 1
  useEffect(() => {
    if (!isAdmin) { setLoading(false); return }
    api.users().then((result) => setUsers(result.data || [])).catch((requestError) => setError(requestError instanceof Error ? requestError.message : 'Could not load team access users.')).finally(() => setLoading(false))
  }, [isAdmin])
  const updateRole = async (id: number, role_id: number) => {
    setSavingId(id)
    try {
      const result = await api.updateUserRole(id, role_id)
      setUsers((current) => current.map((member) => member.id === id ? result.data : member))
      notify('User role updated')
    } catch (requestError) {
      notify(requestError instanceof Error ? requestError.message : 'Could not update user role.', 'error')
    } finally { setSavingId(null) }
  }
  if (!isAdmin) return <Card><EmptyState title="Admin access required" description="Only administrators can manage team access and user roles." /></Card>
  return <><div className="page-heading"><div><div className="eyebrow">Workspace administration</div><h1>Team access</h1><p>Manage the roles assigned to everyone in this workspace.</p></div><Badge tone="info">Admin only</Badge></div><Card className="table-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>User</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead><tbody>{users.map((member) => <tr key={member.id}><td><div className="td-main"><span className="tiny-avatar">{initials(member.name)}</span><strong>{member.name}</strong>{member.id === user.id && <Badge tone="success">You</Badge>}</div></td><td>{member.email}</td><td><Select value={String(member.role_id || 3)} disabled={savingId === member.id || member.id === user.id} onChange={(event) => updateRole(member.id, Number(event.target.value))} aria-label={`Role for ${member.name}`}>{roleOptions.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}</Select></td><td>{member.createdAt ? shortDate(member.createdAt) : '—'}</td></tr>)}</tbody></table></div>{loading && <EmptyState title="Loading team access" description="Fetching users from the API…" />}{!loading && error && <EmptyState title="Could not load users" description={error} />}{!loading && !error && !users.length && <EmptyState title="No users found" description="Users will appear here after they register." />}</Card></>
}

export function SettingsPage({ language, theme, user, onLanguageChange, onThemeChange, onUserChange, notify }: { language: Language; theme: ThemeMode; user: User; onLanguageChange: (language: Language) => void; onThemeChange: (theme: ThemeMode) => void; onUserChange: (user: User) => void; notify: (message: string, kind?: Toast['kind']) => void }) {
  const [name, setName] = useState(user.name)
  const [email, setEmail] = useState(user.email)
  useEffect(() => { setName(user.name); setEmail(user.email) }, [user])
  const saveProfile = () => { if (!name.trim() || !email.trim()) return; onUserChange({ ...user, name: name.trim(), email: email.trim() }); notify(t(language, 'preferencesSaved')) }
  return <><div className="page-heading"><div><div className="eyebrow">{t(language, 'workspace')}</div><h1>{t(language, 'settings')}</h1><p>Personalize your HTOO workspace and account details.</p></div></div><div className="settings-grid"><Card><div className="settings-card-heading"><div className="settings-icon"><UserCircle size={20} /></div><div><h2>{t(language, 'profile')}</h2><p>{t(language, 'profileDescription')}</p></div></div><div className="form-grid settings-form"><div className="form-field"><label>Name</label><Input value={name} onChange={(event) => setName(event.target.value)} /></div><div className="form-field"><label>Email</label><Input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></div></div><div className="settings-actions"><Button onClick={saveProfile} disabled={!name.trim() || !email.trim()}><Save size={14} /> {t(language, 'saveChanges')}</Button></div></Card><Card><div className="settings-card-heading"><div className="settings-icon"><Sun size={20} /></div><div><h2>{t(language, 'appearance')}</h2><p>{t(language, 'appearanceDescription')}</p></div></div><div className="preference-row"><div><strong>{t(language, 'theme')}</strong><span>{theme === 'dark' ? t(language, 'dark') : t(language, 'light')}</span></div><div className="segmented-control"><button className={theme === 'light' ? 'selected' : ''} onClick={() => onThemeChange('light')}><Sun size={14} /> {t(language, 'light')}</button><button className={theme === 'dark' ? 'selected' : ''} onClick={() => onThemeChange('dark')}><Moon size={14} /> {t(language, 'dark')}</button></div></div></Card><Card><div className="settings-card-heading"><div className="settings-icon"><span className="language-glyph">文</span></div><div><h2>{t(language, 'language')}</h2><p>{t(language, 'languageDescription')}</p></div></div><div className="preference-row"><div><strong>{t(language, 'language')}</strong><span>{language === 'my' ? t(language, 'myanmar') : t(language, 'english')}</span></div><Select value={language} onChange={(event) => onLanguageChange(event.target.value as Language)} style={{ width: 150 }}><option value="en">{t(language, 'english')}</option><option value="my">{t(language, 'myanmar')}</option></Select></div></Card></div></>
}
