import { useEffect, useState } from 'react'
import type { Item } from '../../services/apiServices'
import { api } from '../../services/apiServices'
import { Button, Dialog, Input } from '../../components/ui'
import { type Language, type Toast, t } from '../../lib/app-shared'

export function ItemForm({ item, items, onChange, language, onClose, notify }: { item: Item | null; items: Item[]; onChange: (items: Item[]) => void; language: Language; onClose: () => void; notify: (message: string, kind?: Toast['kind']) => void }) {
  const [name, setName] = useState(item?.name || '')
  useEffect(() => setName(item?.name || ''), [item])

  const save = async () => {
    if (!item || !name.trim()) return
    try {
      const result = await api.updateItem(item.id, { name: name.trim() })
      onChange(items.map((current) => current.id === item.id ? { ...current, ...result.data } : current))
      onClose()
      notify(t(language, 'itemUpdated'))
    } catch {
      notify(t(language, 'itemUpdateError'), 'error')
    }
  }

  return <Dialog open={Boolean(item)} title="Edit item" description="Update the service item name used on invoices." onClose={onClose} footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={save} disabled={!name.trim()}>Save item</Button></>}><div className="form-field"><label>Item name</label><Input autoFocus value={name} onChange={(event) => setName(event.target.value)} /></div></Dialog>
}
