import { Plus } from 'lucide-react'
import { Button } from './ui'

export function ListHeading({ eyebrow, title, description, actionLabel, onAction }: { eyebrow?: string; title: string; description: string; actionLabel: string; onAction: () => void }) {
  return <div className="page-heading"><div>{eyebrow && <div className="eyebrow">{eyebrow}</div>}<h1>{title}</h1><p>{description}</p></div><div className="actions"><Button onClick={onAction}><Plus size={15} /> {actionLabel}</Button></div></div>
}
