import React, { useState } from 'react'
import { CarFront, ClipboardList, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Invoice, Item } from '../../services/apiServices'
import { api } from '../../services/apiServices'
import { money, shortDate } from '../../lib/utils'
import { Badge, Button, Card, Dialog, EmptyState, Input } from '../../components/ui'
import { type Language, type Toast, t } from '../../lib/app-shared'
import { ItemForm } from './ItemForm'



export function ItemsPage({ language, isAdmin, items, invoices, onView, onChange, notify }: { language: Language; isAdmin: boolean; items: Item[]; invoices: Invoice[]; onView: (item: Item) => void; onChange: (items: Item[]) => void; notify: (message: string, kind?: Toast['kind']) => void }) {
  const [query, setQuery] = useState('')
  const [editing, setEditing] = useState<Item | null>(null)
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const filtered = items.filter((item) => item.name.toLowerCase().includes(query.toLowerCase()))
  const remove = async () => {
    if (!deleteId) return
    try {
      await api.deleteItem(deleteId)
      onChange(items.filter((item) => item.id !== deleteId))
      setDeleteId(null)
      notify(t(language, 'itemDeleted'))
    } catch { notify(t(language, 'itemDeleteError'), 'error') }
  }
  return <><div className="page-heading"><div><h1>{t(language, 'services')}</h1><p>{t(language, 'serviceDescriptionText')}</p></div><span className="live-label">{t(language, 'liveApi')}</span></div><div className="toolbar"><div className="search-box"><Search size={15} /><Input placeholder={t(language, 'searchServices')} value={query} onChange={(e) => setQuery(e.target.value)} /></div><span style={{ fontSize: 11, color: '#8892a4' }}>{filtered.length} {t(language, 'services')}</span></div><Card className="table-card"><div className="table-wrap"><table className="data-table"><thead><tr><th>{t(language, 'service')}</th><th>{t(language, 'latestPrice')}</th><th>{t(language, 'usage')}</th><th></th></tr></thead><tbody>{filtered.map((item) => <tr key={item.id}><td><div className="td-main"><span className="tiny-avatar" style={{ background: '#fff6dc', color: '#d39d1f' }}><ClipboardList size={13} /></span><strong>{item.name}</strong></div></td><td>{money(item.price)}</td><td>{invoices.reduce((count, invoice) => count + (invoice.details?.some((detail) => detail.item_id === item.id || detail.item?.id === item.id || detail.item?.name === item.name || detail.name === item.name) ? 1 : 0), 0)} {t(language, 'invoices')}</td><td><div className="table-actions"><Button variant="ghost" size="icon" title="View" onClick={() => onView(item)}><Eye size={14} /></Button><Button variant="ghost" size="icon" title="Edit" onClick={() => setEditing(item)}><Pencil size={14} /></Button>{isAdmin && <Button variant="ghost" size="icon" title="Delete" onClick={() => setDeleteId(item.id)}><Trash2 size={14} /></Button>}</div></td></tr>)}</tbody></table></div>{!filtered.length && <EmptyState title={t(language, 'noServicesFound')} description={t(language, 'noServicesDescription')} />}<div className="pagination"><span>{t(language, 'showingServices')}</span></div></Card><ItemForm item={editing} items={items} onChange={onChange} language={language} onClose={() => setEditing(null)} notify={notify} /><Dialog open={Boolean(deleteId)} title="Delete item?" description="Only administrators can delete items." onClose={() => setDeleteId(null)} footer={<><Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button><Button variant="danger" onClick={remove}>Delete item</Button></>}><p style={{ color: '#69758a', fontSize: 13 }}>{t(language, 'deletionWarning')}</p></Dialog></> }
