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



export function CarDetailPage({ language, car, invoices, onBack, onViewInvoice, onEditInvoice, onDeleteInvoice, onPrintInvoice }: { language: Language; car: Car; invoices: Invoice[]; onBack: () => void; onViewInvoice: (invoice: Invoice) => void; onEditInvoice: (invoice: Invoice) => void; onDeleteInvoice: (invoice: Invoice) => Promise<void>; onPrintInvoice: (invoice: Invoice) => void }) {
  const carInvoices = invoices.filter((invoice) => invoice.car_id === car.id || invoice.car?.id === car.id || invoice.car?.number === car.number)
  return <><div className="page-heading"><div><button className="back-link" onClick={onBack}>← {t(language, 'vehicles')}</button><div className="eyebrow">Vehicle profile</div><h1>{car.number}</h1><p>{[car.brand, car.model].filter(Boolean).join(' ') || 'Vehicle history'} · Related service records</p></div></div><div className="detail-grid"><Card><div className="detail-label">{t(language, 'vehicle')}</div><div className="detail-person"><div className="vehicle-icon"><CarFront size={19} /></div><div><h2>{car.number}</h2><p>{[car.brand, car.model].filter(Boolean).join(' ') || 'No model recorded'}</p></div></div></Card><Card><div className="detail-label">Owner</div><div className="detail-person"><div className="avatar">{initials(car.customer?.name || 'NA')}</div><div><h2>{car.customer?.name || '—'}</h2><p>Registered customer</p></div></div></Card><Card><div className="detail-label">Invoices</div><div className="detail-payment"><strong>{carInvoices.length}</strong><span>service invoices for this vehicle</span></div></Card></div><RelatedInvoices title="Invoice summary" invoices={carInvoices} onView={onViewInvoice} onEdit={onEditInvoice} onDelete={onDeleteInvoice} onPrint={onPrintInvoice} /></>
}