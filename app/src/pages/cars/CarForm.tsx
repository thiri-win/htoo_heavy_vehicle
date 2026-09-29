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



export function CarDialog({ open, initial, customers, onClose, onSave }: { open: boolean; initial: Car | null; customers: Customer[]; onClose: () => void; onSave: (data: CarForm) => void }) { const [form, setForm] = useState<CarForm>({ number: initial?.number || '', brand: initial?.brand || '', model: initial?.model || '', customer_id: String(initial?.customer_id || customers[0]?.id || '') }); useEffect(() => setForm({ number: initial?.number || '', brand: initial?.brand || '', model: initial?.model || '', customer_id: String(initial?.customer_id || customers[0]?.id || '') }), [initial, open, customers]); const patch = (next: Partial<CarForm>) => setForm((value) => ({ ...value, ...next })); return <Dialog open={open} title={initial ? 'Edit vehicle' : 'Add vehicle'} description="Add the registration and owner details for a vehicle." onClose={onClose} footer={<><Button variant="outline" onClick={onClose}>Cancel</Button><Button onClick={() => onSave(form)} disabled={!form.number || !form.customer_id}>Save vehicle</Button></>}><div className="form-grid"><div className="form-field"><label>Vehicle number</label><Input autoFocus value={form.number} onChange={(e) => patch({ number: e.target.value })} placeholder="9H-4821" /></div><div className="form-field"><label>Customer</label><Select value={form.customer_id} onChange={(e) => patch({ customer_id: e.target.value })}>{customers.map((customer) => <option key={customer.id} value={customer.id}>{customer.name}</option>)}</Select></div><div className="form-field"><label>Brand</label><Input value={form.brand} onChange={(e) => patch({ brand: e.target.value })} placeholder="Hino" /></div><div className="form-field"><label>Model</label><Input value={form.model} onChange={(e) => patch({ model: e.target.value })} placeholder="500 Series" /></div></div></Dialog> }