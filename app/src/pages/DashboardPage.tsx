import React from 'react'
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { Plus } from 'lucide-react'
import type { Car, Invoice } from '../lib/api'
import { money } from '../lib/utils'
import { Badge, Button, Card, EmptyState } from '../components/ui'
import { type Language, t, normalizePaymentType } from '../lib/app-shared'
import { InvoiceTable } from './InvoicePages'

export function Dashboard({ language, userName, invoices, cars, onViewInvoices }: { language: Language; userName: string; invoices: Invoice[]; cars: Car[]; onViewInvoices: () => void }) {
  const monthly = Array.from({ length: 6 }, (_, offset) => {
    const date = new Date()
    date.setDate(1)
    date.setMonth(date.getMonth() - (5 - offset))
    const year = date.getFullYear()
    const month = date.getMonth()
    const monthInvoices = invoices.filter((invoice) => { const invoiceDate = new Date(invoice.date); return invoiceDate.getFullYear() === year && invoiceDate.getMonth() === month })
    return { month: date.toLocaleDateString(undefined, { month: 'short' }), invoiceTotal: monthInvoices.reduce((sum, invoice) => sum + Number(invoice.grand_total || 0), 0) }
  })
  const paymentMix = [{ name: 'cash', value: invoices.filter((invoice) => normalizePaymentType(invoice.payment_type) === 'cash').length, color: '#5c5ce6' }, { name: 'kbz-pay', value: invoices.filter((invoice) => normalizePaymentType(invoice.payment_type) === 'kbz-pay').length, color: '#78d6b1' }, { name: 'pending', value: invoices.filter((invoice) => normalizePaymentType(invoice.payment_type) === 'pending').length, color: '#f3c65e' }]
  const vehicleRepairRows = cars.map((car) => ({ car, count: invoices.filter((invoice) => invoice.car_id === car.id || invoice.car?.id === car.id).length })).filter((row) => row.count > 0).sort((left, right) => right.count - left.count).slice(0, 5)
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
  return <><div className="page-heading"><div><div className="eyebrow">{today}</div><h1>{t(language, 'goodMorning')}, {userName}.</h1><p>{t(language, 'dashboardDescription')}</p></div><div className="actions"><Button onClick={onViewInvoices}><Plus size={15} /> {t(language, 'newInvoice')}</Button></div></div><div className="dashboard-grid"><Card><div className="card-title"><div><h2>{t(language, 'vehicleRepairFrequency')}</h2><p>{t(language, 'repairs')} recorded from live invoices</p></div><span className="live-label">Live API</span></div>{vehicleRepairRows.length ? <div className="table-wrap"><table className="data-table"><thead><tr><th>{t(language, 'vehicle')}</th><th>{t(language, 'customer')}</th><th>{t(language, 'repairs')}</th></tr></thead><tbody>{vehicleRepairRows.map(({ car, count }) => <tr key={car.id}><td><strong>{car.number}</strong></td><td>{car.customer?.name || '—'}</td><td><Badge tone="info">{count}</Badge></td></tr>)}</tbody></table></div> : <EmptyState title={t(language, 'noVehicleRepairData')} description={t(language, 'noVehicleRepairDescription')} />}</Card><Card><div className="card-title"><div><h2>{t(language, 'paymentStatusChart')}</h2><p>Current invoice collection mix</p></div><span className="live-label">Live API</span></div>{invoices.length ? <div className="donut-wrap"><div style={{ width: 160, height: 190 }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={paymentMix} dataKey="value" innerRadius={52} outerRadius={72} paddingAngle={4} stroke="none">{paymentMix.map((entry) => <Cell key={entry.name} fill={entry.color} />)}</Pie><Tooltip content={<ChartTooltip label="Invoices" />} /></PieChart></ResponsiveContainer></div><div className="donut-legend">{paymentMix.map((item) => <div className="legend-row" key={item.name}><span className="legend-dot" style={{ background: item.color }} /><span>{item.name}</span><strong>{item.value}</strong></div>)}</div></div> : <EmptyState title="No payment data" description="Payment status will appear when the API has invoices." />}</Card></div><div className="dashboard-grid"><Card><div className="card-title"><div><h2>{t(language, 'recentInvoices')}</h2><p>The latest work added to your workspace</p></div><button className="card-link" onClick={onViewInvoices}>{t(language, 'viewAll')}</button></div><InvoiceTable invoices={invoices.slice(0, 4)} compact /></Card><Card><div className="card-title"><div><h2>{t(language, 'totalInvoiceByMonth')}</h2><p>{t(language, 'totalInvoiceValue')}</p></div></div><div className="chart" style={{ height: 224 }}>{invoices.length ? <ResponsiveContainer width="100%" height="100%"><BarChart data={monthly} margin={{ top: 8, right: 10, left: 0, bottom: 0 }}><CartesianGrid vertical={false} /><XAxis dataKey="month" axisLine={false} tickLine={false} /><YAxis axisLine={false} tickLine={false} width={52} tickFormatter={formatChartAmount} /><Tooltip content={<ChartTooltip label={t(language, 'totalInvoiceValue')} />} /><Bar dataKey="invoiceTotal" fill="#78d6b1" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer> : <EmptyState title="No invoice totals" description="Invoice totals will appear when the API has invoices." />}</div></Card></div></>
}

export function StatCard({ label, value, foot, icon, tone }: { label: string; value: string; foot: string; icon: React.ReactNode; tone: string }) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}>{icon}</span></div><div className="stat-value">{value}</div><div className="stat-foot">{foot}</div></div> }

export function formatChartAmount(value: number) {
  if (Math.abs(value) >= 1000000) return `${(value / 1000000).toFixed(1)}M`
  if (Math.abs(value) >= 1000) return `${Math.round(value / 1000)}K`
  return String(value)
}

export function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label: string }) { return active && payload?.length ? <div className="tooltip">{label}<strong>{payload[0].value}</strong></div> : null }
