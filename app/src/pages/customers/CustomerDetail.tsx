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



export function CustomerDetailPage({ language, customer, cars, invoices, onBack, onViewInvoice, onEditInvoice, onDeleteInvoice, onPrintInvoice }: { language: Language; customer: Customer; cars: Car[]; invoices: Invoice[]; onBack: () => void; onViewInvoice: (invoice: Invoice) => void; onEditInvoice: (invoice: Invoice) => void; onDeleteInvoice: (invoice: Invoice) => Promise<void>; onPrintInvoice: (invoice: Invoice) => void }) {
  const customerCars = cars.filter((car) => car.customer_id === customer.id)
  const customerInvoices = invoices.filter((invoice) => invoice.customer_id === customer.id || invoice.customer?.id === customer.id)
  return <><div className="page-heading"><div><button className="back-link" onClick={onBack}>← {t(language, 'customers')}</button><div className="eyebrow">Customer profile</div><h1>{customer.name}</h1><p>{customer.phone || 'No phone recorded'} · Customer history and related records</p></div></div><div className="detail-grid"><Card><div className="detail-label">{t(language, 'customer')}</div><div className="detail-person"><div className="avatar">{initials(customer.name)}</div><div><h2>{customer.name}</h2><p>{customer.phone || 'No phone recorded'}</p></div></div></Card><Card><div className="detail-label">Vehicles</div><div className="detail-payment"><strong>{customerCars.length}</strong><span>vehicles registered to this customer</span></div></Card><Card><div className="detail-label">Invoices</div><div className="detail-payment"><strong>{customerInvoices.length}</strong><span>invoices in the live records</span></div></Card></div><Card className="table-card"><div className="card-title detail-section-heading"><div><h2>Car summary</h2><p>Vehicles registered under this customer.</p></div><Badge tone="success">{customerCars.length} vehicles</Badge></div>{customerCars.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>Vehicle</th><th>Make & model</th><th>Service history</th></tr></thead><tbody>{customerCars.map((car) => <tr key={car.id}><td><div className="td-main"><span className="tiny-avatar" style={{ background: '#e8faf4', color: '#1aaf7b' }}><CarFront size={13} /></span><strong>{car.number}</strong></div></td><td>{[car.brand, car.model].filter(Boolean).join(' ') || '—'}</td><td>{customerInvoices.filter((invoice) => invoice.car_id === car.id || invoice.car?.id === car.id).length} invoices</td></tr>)}</tbody></table></div> : <EmptyState title="No vehicles linked" description="Vehicles assigned to this customer will appear here." />}</Card><RelatedInvoices title="Invoice summary" invoices={customerInvoices} onView={onViewInvoice} onEdit={onEditInvoice} onDelete={onDeleteInvoice} onPrint={onPrintInvoice} /></>
}