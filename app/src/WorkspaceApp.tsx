import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { api, type Car, type Customer, type Invoice, type Item, type User } from './lib/api'
import { cn } from './lib/utils'
import { Card, EmptyState } from './components/ui'
import { type Language, type ThemeMode, type Toast, type PrintOptions, t, pageFromPath, routeForPage, itemsFromData } from './lib/app-shared'
import { Sidebar } from './components/Sidebar'
import { SettingsPage, TeamAccessPage } from './pages/AccessPages'
import { Dashboard } from './pages/DashboardPage'
import { InvoicesPage, InvoiceEditorPage, InvoiceDetailPage, PrintSetupDialog } from './pages/InvoicePages'
import { CustomersPage, CustomerDetailPage, CarsPage, CarDetailPage, ItemsPage, ItemDetailPage } from './pages/DirectoryPages'

export function WorkspaceApp({ user, setUser }: { user: User; setUser: (user: User | null) => void }) {
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const page = pageFromPath(pathname)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => window.matchMedia('(max-width: 760px)').matches || localStorage.getItem('htoo_sidebar_collapsed') === 'true')
  const [theme, setTheme] = useState<ThemeMode>(() => localStorage.getItem('htoo_theme') === 'dark' ? 'dark' : 'light')
  const [language, setLanguage] = useState<Language>(() => localStorage.getItem('htoo_language') === 'my' ? 'my' : 'en')
  const [customers, setCustomers] = useState<Customer[]>([])
  const [cars, setCars] = useState<Car[]>([])
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [catalogItems, setCatalogItems] = useState<Item[]>([])
  const [toast, setToast] = useState<Toast | null>(null)
  const [printInvoice, setPrintInvoice] = useState<Invoice | null>(null)
  const [printConfigOpen, setPrintConfigOpen] = useState(false)
  const [printOptions, setPrintOptions] = useState<PrintOptions>({ header: 'HTOO Heavy Vehicle', subtitle: 'Workshop service invoice', address: 'Yangon, Myanmar', phone: '', accent: '#5c5ce6', design: 'classic' })
  const [loadingData, setLoadingData] = useState(false)
  const [dataError, setDataError] = useState('')
  const [refreshing, setRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const pullDistanceRef = useRef(0)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const invoiceId = Number(pathname.match(/^\/invoices\/([^/]+)/)?.[1])
  const customerId = Number(pathname.match(/^\/customers\/([^/]+)/)?.[1])
  const carId = Number(pathname.match(/^\/cars\/([^/]+)/)?.[1])
  const itemId = Number(pathname.match(/^\/items\/([^/]+)/)?.[1])
  const selectedInvoice = invoices.find((invoice) => invoice.id === invoiceId)
  const selectedCustomer = customers.find((customer) => customer.id === customerId)
  const selectedCar = cars.find((car) => car.id === carId)
  const selectedItem = itemsFromData(catalogItems, invoices).find((item) => item.id === itemId)

  const items = useMemo(() => itemsFromData(catalogItems, invoices), [invoices, catalogItems])
  const notify = (message: string, kind: Toast['kind'] = 'success') => { setToast({ message, kind }); window.setTimeout(() => setToast(null), 3000) }
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem('htoo_theme', theme) }, [theme])
  useEffect(() => { document.documentElement.lang = language === 'my' ? 'my' : 'en'; localStorage.setItem('htoo_language', language) }, [language])
  useEffect(() => { localStorage.setItem('htoo_sidebar_collapsed', String(sidebarCollapsed)) }, [sidebarCollapsed])
  const refreshData = useCallback(async (initialLoad = false) => {
    if (initialLoad) setLoadingData(true)
    else setRefreshing(true)
    setDataError('')
    try {
      const [customersResult, carsResult, invoicesResult, itemsResult] = await Promise.allSettled([api.customers(), api.cars(), api.invoices('page=1&limit=1000'), api.items()])
      if (customersResult.status === 'fulfilled') setCustomers(customersResult.value.data || [])
      if (carsResult.status === 'fulfilled') setCars(carsResult.value.data || [])
      if (invoicesResult.status === 'fulfilled') setInvoices(invoicesResult.value.data || [])
      if (itemsResult.status === 'fulfilled') setCatalogItems(itemsResult.value.data || [])
      const failed = [customersResult, carsResult, invoicesResult, itemsResult].find((result) => result.status === 'rejected')
      if (failed?.status === 'rejected') setDataError(failed.reason instanceof Error ? failed.reason.message : 'Unable to load data from the API.')
    } finally {
      setLoadingData(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => { void refreshData(true) }, [refreshData, user])

  const handleTouchStart = (event: React.TouchEvent<HTMLElement>) => {
    if (event.touches.length !== 1 || event.currentTarget.scrollTop > 0 || refreshing || loadingData) return
    touchStart.current = { x: event.touches[0].clientX, y: event.touches[0].clientY }
  }
  const handleTouchMove = (event: React.TouchEvent<HTMLElement>) => {
    const start = touchStart.current
    if (!start || event.touches.length !== 1) return
    const deltaY = event.touches[0].clientY - start.y
    const deltaX = event.touches[0].clientX - start.x
    if (deltaY <= 0 || Math.abs(deltaX) > deltaY) { pullDistanceRef.current = 0; setPullDistance(0); return }
    const distance = Math.min(92, deltaY * 0.5)
    pullDistanceRef.current = distance
    setPullDistance(distance)
  }
  const handleTouchEnd = () => {
    touchStart.current = null
    if (pullDistanceRef.current >= 58 && !refreshing && !loadingData) void refreshData()
    pullDistanceRef.current = 0
    setPullDistance(0)
  }

  const signOut = () => { localStorage.removeItem('htoo_token'); localStorage.removeItem('htoo_user'); setUser(null); navigate('/login') }
  const downloadDatabase = async () => {
    try {
      const blob = await api.downloadDatabase()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'htoo-heavy-vehicle-database-backup.sql'
      link.click()
      URL.revokeObjectURL(url)
      notify(t(language, 'databaseDownloaded'))
    } catch {
      notify(t(language, 'databaseDownloadError'), 'error')
    }
  }
  const openPrintSetup = (invoice: Invoice) => { setPrintInvoice(invoice); setPrintConfigOpen(true) }
  const printWithOptions = (options: PrintOptions) => { setPrintOptions(options); setPrintConfigOpen(false); window.setTimeout(() => window.print(), 120) }
  const viewInvoice = (invoice: Invoice) => navigate(`/invoices/${invoice.id}`)
  const editInvoice = (invoice: Invoice) => navigate(`/invoices/${invoice.id}/edit`)
  const deleteInvoice = async (invoice: Invoice) => {
    try {
      await api.deleteInvoice(invoice.id)
      setInvoices((current) => current.filter((item) => item.id !== invoice.id))
      notify(t(language, 'invoiceDeleted'))
    } catch {
      notify(t(language, 'invoiceDeleteError'), 'error')
    }
  }
  const updateUser = (nextUser: User) => { setUser(nextUser); localStorage.setItem('htoo_user', JSON.stringify(nextUser)) }
  return <div className="app-shell">
    <Sidebar page={page} collapsed={sidebarCollapsed} language={language} user={user} onToggle={() => setSidebarCollapsed((value) => !value)} onNavigate={(next) => navigate(routeForPage(next))} onSignOut={signOut} onDownloadDatabase={downloadDatabase} />
    <main className="main" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} onTouchCancel={handleTouchEnd}>
      <div className={cn('pull-refresh-indicator', refreshing && 'refreshing')} style={{ height: refreshing ? 54 : pullDistance }} aria-live="polite" aria-label={refreshing ? 'Refreshing data' : 'Pull down to refresh'}>
        {(pullDistance > 8 || refreshing) && <span className="pull-refresh-spinner" />}
      </div>
      <div className="content">
        {dataError && <div className="api-error" role="alert">Live API error: {dataError}</div>}
        {loadingData ? <Card><EmptyState title="Loading live data" description="Connecting to the HTOO API…" /></Card> : <>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard language={language} userName={user.name} invoices={invoices} cars={cars} onViewInvoices={() => navigate('/invoices')} />} />
            <Route path="/invoices" element={<InvoicesPage language={language} invoices={invoices} onCreate={() => navigate('/invoices/new')} onView={viewInvoice} onEdit={editInvoice} onChange={setInvoices} onPrint={openPrintSetup} notify={notify} />} />
            <Route path="/invoices/new" element={<InvoiceEditorPage language={language} mode="create" initial={null} customers={customers} cars={cars} items={items} invoices={invoices} onChange={setInvoices} onCancel={() => navigate('/invoices')} onDone={() => navigate('/invoices')} notify={notify} />} />
            <Route path="/invoices/:id/edit" element={<InvoiceEditorPage language={language} mode="edit" initial={selectedInvoice || null} customers={customers} cars={cars} items={items} invoices={invoices} onChange={setInvoices} onCancel={() => navigate('/invoices')} onDone={() => navigate('/invoices')} notify={notify} />} />
            <Route path="/invoices/:id" element={selectedInvoice ? <InvoiceDetailPage language={language} invoice={selectedInvoice} onBack={() => navigate('/invoices')} onEdit={() => navigate(`/invoices/${selectedInvoice.id}/edit`)} onPrint={openPrintSetup} /> : <EmptyState title="Invoice not found" description="The requested invoice is not available in the loaded records." />} />
            <Route path="/customers" element={<CustomersPage language={language} isAdmin={user.role_id === 1} customers={customers} onView={(customer) => navigate(`/customers/${customer.id}`)} onChange={setCustomers} notify={notify} />} />
            <Route path="/customers/:id" element={selectedCustomer ? <CustomerDetailPage language={language} customer={selectedCustomer} cars={cars} invoices={invoices} onBack={() => navigate('/customers')} onViewInvoice={viewInvoice} onEditInvoice={editInvoice} onDeleteInvoice={deleteInvoice} onPrintInvoice={openPrintSetup} /> : <EmptyState title="Customer not found" description="The requested customer is not available in the loaded records." />} />
            <Route path="/cars" element={<CarsPage language={language} isAdmin={user.role_id === 1} cars={cars} customers={customers} onView={(car) => navigate(`/cars/${car.id}`)} onChange={setCars} notify={notify} />} />
            <Route path="/cars/:id" element={selectedCar ? <CarDetailPage language={language} car={selectedCar} invoices={invoices} onBack={() => navigate('/cars')} onViewInvoice={viewInvoice} onEditInvoice={editInvoice} onDeleteInvoice={deleteInvoice} onPrintInvoice={openPrintSetup} /> : <EmptyState title="Vehicle not found" description="The requested vehicle is not available in the loaded records." />} />
            <Route path="/items" element={<ItemsPage language={language} isAdmin={user.role_id === 1} items={items} invoices={invoices} onView={(item) => navigate(`/items/${item.id}`)} onChange={setCatalogItems} notify={notify} />} />
            <Route path="/items/:id" element={selectedItem ? <ItemDetailPage language={language} item={selectedItem} invoices={invoices} onBack={() => navigate('/items')} onViewInvoice={viewInvoice} /> : <EmptyState title="Item not found" description="The requested item is not available in the loaded records." />} />
            <Route path="/team-access" element={user.role_id === 1 ? <TeamAccessPage user={user} notify={notify} /> : <EmptyState title="Admin access required" description="Only administrators can manage team access and user roles." />} />
            <Route path="/settings" element={<SettingsPage language={language} theme={theme} user={user} onLanguageChange={setLanguage} onThemeChange={setTheme} onUserChange={updateUser} notify={notify} />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </>}
      </div>
    </main>
    <PrintSetupDialog open={printConfigOpen} initial={printOptions} onClose={() => setPrintConfigOpen(false)} onPrint={printWithOptions} />
    {toast && <div className={cn('toast', toast.kind === 'error' && 'toast-error')}>{toast.message}</div>}
  </div>
}
