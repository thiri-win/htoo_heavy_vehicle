import React, { useEffect, useState } from 'react'
import { CarFront, ClipboardList, Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import type { Car, Customer, Invoice } from '../../services/apiServices'
import { api } from '../../services/apiServices'
import { initials, money, shortDate } from '../../lib/utils'
import { Badge, Button, Card, Dialog, EmptyState, Input, Select } from '../../components/ui'
import { type Language, type Toast, type CarForm, t } from '../../lib/app-shared'
import { InvoiceTable } from '../invoices/InvoiceList'
import { RelatedInvoices } from '../invoices/InvoiceDetail'
import { ListHeading } from '../../components/ListHeading'
import { Pagination } from '../../components/Pagination'



export function CustomerDialog({ open, initial, onClose, onSave }: { open: boolean; initial: Customer | null; onClose: () => void; onSave: (name: string) => void }) { const [name, setName] = useState(initial?.name || ''); useEffect(() => setName(initial?.name || ''), [initial, open]); return <Dialog open={open} title={initial ? 'Edit customer' : 'Add customer'} description="Keep customer contact records easy to find." onClose={onClose} footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(name)} disabled={!name.trim()}>Save customer</Button></>}><div className="form-field"><label>Customer or company name</label><Input autoFocus value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Golden Land Logistics" /></div></Dialog> }