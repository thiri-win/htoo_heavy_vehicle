import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from 'react'
import { X } from 'lucide-react'
import { cn } from '../lib/utils'

export function Button({ className, variant = 'primary', size = 'default', ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline'; size?: 'sm' | 'default' | 'icon' }) {
  return <button className={cn('btn', `btn-${variant}`, `btn-${size}`, className)} {...props} />
}

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) { return <input className={cn('input', className)} {...props} /> }
export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) { return <select className={cn('input select', className)} {...props} /> }
export function Badge({ children, tone = 'neutral' }: { children: ReactNode; tone?: 'neutral' | 'success' | 'warning' | 'danger' | 'info' }) { return <span className={`badge badge-${tone}`}>{children}</span> }
export function Card({ children, className }: { children: ReactNode; className?: string }) { return <section className={cn('card', className)}>{children}</section> }
export function Dialog({ open, title, description, onClose, children, footer }: { open: boolean; title: string; description?: string; onClose: () => void; children: ReactNode; footer?: ReactNode }) {
  if (!open) return null
  return <div className="dialog-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><div className="dialog" role="dialog" aria-modal="true"><div className="dialog-header"><div><h2>{title}</h2>{description && <p>{description}</p>}</div><Button variant="ghost" size="icon" aria-label="Close" onClick={onClose}><X size={18} /></Button></div><div className="dialog-body">{children}</div>{footer && <div className="dialog-footer">{footer}</div>}</div></div>
}
export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) { return <div className="empty-state"><div className="empty-icon">✦</div><h3>{title}</h3><p>{description}</p>{action}</div> }
