import { CarFront, ClipboardList, FileText, LayoutDashboard, Users } from 'lucide-react'
import type { Car, Invoice, Item } from './api'

export type PageName = 'dashboard' | 'invoices' | 'invoice-create' | 'invoice-edit' | 'invoice-detail' | 'customers' | 'customer-detail' | 'cars' | 'car-detail' | 'items' | 'item-detail' | 'team-access' | 'settings'

export type Toast = { message: string; kind?: 'success' | 'error' }

export type Language = 'en' | 'my'

export type ThemeMode = 'light' | 'dark'

export type PaymentType = 'pending' | 'kbz-pay' | 'cash'

export const paymentTypeOptions: Array<{ value: PaymentType; label: string }> = [
  { value: 'pending', label: 'pending' }, { value: 'kbz-pay', label: 'kbz-pay' }, { value: 'cash', label: 'cash' },
]

export const navItems: Array<{ id: PageName; labelKey: string; icon: typeof LayoutDashboard }> = [
  { id: 'dashboard', labelKey: 'overview', icon: LayoutDashboard }, { id: 'invoices', labelKey: 'invoices', icon: FileText }, { id: 'customers', labelKey: 'customers', icon: Users }, { id: 'cars', labelKey: 'vehicles', icon: CarFront }, { id: 'items', labelKey: 'services', icon: ClipboardList },
]

export const translations: Record<Language, Record<string, string>> = {
  en: { overview: 'Overview', invoices: 'Invoices', customers: 'Customers', vehicles: 'Vehicles', services: 'Services & Items', settings: 'Settings', mainMenu: 'Main menu', workspace: 'Workspace', quickTip: 'Quick tip', signOut: 'Log out', profile: 'User profile', profileDescription: 'Update the name and email shown in your workspace.', appearance: 'Appearance', appearanceDescription: 'Choose how HTOO looks on this device.', language: 'Language', languageDescription: 'Choose the language used by the workspace.', theme: 'Theme', light: 'Light', dark: 'Dark', english: 'English', myanmar: 'Myanmar', saveChanges: 'Save changes', preferencesSaved: 'Preferences saved', financialRecords: 'Financial records', invoiceIndex: 'Invoice index', invoiceIndexDescription: 'Search and manage every service invoice.', invoiceDetail: 'Invoice detail', newInvoice: 'New invoice', createInvoice: 'Create invoice', editInvoice: 'Edit invoice', createInvoiceDescription: 'Add a new service invoice to your live records.', editInvoiceDescription: 'Update the service, vehicle, and payment details.', backToInvoices: 'Back to invoices', cancel: 'Cancel', saveInvoice: 'Save invoice', exportExcel: 'Export Excel', searchInvoices: 'Search invoice, customer, vehicle…', allStatuses: 'All statuses', paid: 'Paid', partial: 'Partial', pending: 'Pending', invoiceDate: 'Invoice date', fromDate: 'Start date', toDate: 'End date', paymentStatus: 'Payment status', customer: 'Customer', phone: 'Phone', vehicleNumber: 'Vehicle number', brand: 'Brand', model: 'Model', owner: 'Owner', makeModel: 'Make & model', serviceStatus: 'Service status', activeProfile: 'Active profile', service: 'Service', latestPrice: 'Latest price', usage: 'Usage', serviceItems: 'Service items', addItem: 'Add item', serviceDescription: 'Service description', advanceReceived: 'Advance received', balanceDue: 'Balance due', subtotal: 'Subtotal', advance: 'Advance', grandTotal: 'Grand total', goodMorning: 'Good morning', dashboardDescription: 'Here is what’s happening with your workshop today.', totalRevenue: 'Total revenue', openBalance: 'Open balance', activeCustomers: 'Active customers', vehiclesServiced: 'Vehicles serviced', fromLiveInvoices: 'From live invoices', liveCustomerRecords: 'Live customer records', liveVehicleRecords: 'Live vehicle records', invoiceActivity: 'Invoice activity', paymentStatusChart: 'Payment status', recentInvoices: 'Recent invoices', revenueByMonth: 'Revenue by month', totalInvoiceByMonth: 'Total invoice value by month', totalInvoiceValue: 'Invoice total', vehicleRepairFrequency: 'Most-serviced vehicles', repairs: 'Repairs', noVehicleRepairData: 'No vehicle repair data', noVehicleRepairDescription: 'Vehicle repair frequency will appear when invoices are available.', viewAll: 'View all →', printPdf: 'Print / Save PDF', printSetup: 'PDF print setup', printSetupDescription: 'Add the header and design details before printing.', pdfHeader: 'Header', pdfSubtitle: 'Subtitle', pdfAddress: 'Address', pdfPhone: 'Phone', pdfDesign: 'Design', classic: 'Classic', minimal: 'Minimal', accent: 'Accent', print: 'Print / Save PDF', close: 'Close', billTo: 'Bill to', vehicle: 'Vehicle', serviceDescriptionColumn: 'Service description', quantity: 'Qty', price: 'Price', total: 'Total', customerDirectory: 'Customer directory', customerDescription: 'Manage the people and businesses you serve.', vehicleDirectory: 'Fleet directory', vehicleDescription: 'Keep every truck profile ready for its next service.', addCustomer: 'Add customer', addVehicle: 'Add vehicle', searchCustomers: 'Search customers…', searchVehicles: 'Search number, brand, customer…', noCustomersFound: 'No customers found', noVehiclesFound: 'No vehicles found', trySearch: 'Try another search term.', serviceDescriptionText: 'Services shown here are read from the live API.', searchServices: 'Search services…', noServicesFound: 'No services found', noServicesDescription: 'Services will appear here when they are returned by the live API.', showingServices: 'Showing services from live invoices', liveApi: 'Live API' },
  my: { overview: 'ခြုံငုံသုံးသပ်ချက်', invoices: 'ငွေတောင်းခံလွှာများ', customers: 'ဖောက်သည်များ', vehicles: 'ယာဉ်များ', services: 'ဝန်ဆောင်မှုနှင့်ပစ္စည်းများ', settings: 'ဆက်တင်များ', mainMenu: 'အဓိကမီနူး', workspace: 'လုပ်ငန်းခွင်', quickTip: 'အမြန်အကြံပြုချက်', signOut: 'ထွက်ရန်', profile: 'အသုံးပြုသူပရိုဖိုင်', profileDescription: 'လုပ်ငန်းခွင်တွင်ပြသမည့် အမည်နှင့်အီးမေးလ်ကို ပြင်ဆင်ပါ။', appearance: 'အသွင်အပြင်', appearanceDescription: 'ဤစက်တွင် HTOO ပြသပုံကို ရွေးချယ်ပါ။', language: 'ဘာသာစကား', languageDescription: 'လုပ်ငန်းခွင်တွင် အသုံးပြုမည့်ဘာသာစကားကို ရွေးပါ။', theme: 'အရောင်ပုံစံ', light: 'အလင်း', dark: 'အမှောင်', english: 'အင်္ဂလိပ်', myanmar: 'မြန်မာ', saveChanges: 'ပြောင်းလဲမှုများ သိမ်းရန်', preferencesSaved: 'စိတ်ကြိုက်ရွေးချယ်မှုများ သိမ်းပြီးပါပြီ', financialRecords: 'ငွေကြေးမှတ်တမ်းများ', invoiceIndex: 'ငွေတောင်းခံလွှာစာရင်း', invoiceIndexDescription: 'ဝန်ဆောင်မှုငွေတောင်းခံလွှာများကို ရှာဖွေစီမံပါ။', invoiceDetail: 'ငွေတောင်းခံလွှာအသေးစိတ်', newInvoice: 'ငွေတောင်းခံလွှာအသစ်', createInvoice: 'ငွေတောင်းခံလွှာ ဖန်တီးရန်', editInvoice: 'ငွေတောင်းခံလွှာ ပြင်ရန်', createInvoiceDescription: 'တိုက်ရိုက်မှတ်တမ်းများထဲသို့ ဝန်ဆောင်မှုငွေတောင်းခံလွှာအသစ် ထည့်ပါ။', editInvoiceDescription: 'ဝန်ဆောင်မှု၊ ယာဉ်နှင့် ငွေပေးချေမှုအသေးစိတ်ကို ပြင်ဆင်ပါ။', backToInvoices: 'ငွေတောင်းခံလွှာများသို့ ပြန်ရန်', cancel: 'ပယ်ဖျက်ရန်', saveInvoice: 'ငွေတောင်းခံလွှာ သိမ်းရန်', exportExcel: 'Excel ထုတ်ရန်', searchInvoices: 'ငွေတောင်းခံလွှာ၊ ဖောက်သည်၊ ယာဉ် ရှာရန်…', allStatuses: 'အခြေအနေအားလုံး', paid: 'ပေးချေပြီး', partial: 'တစ်စိတ်တစ်ပိုင်း', pending: 'ဆိုင်းငံ့', invoiceDate: 'ငွေတောင်းခံလွှာရက်စွဲ', fromDate: 'စတင်ရက်စွဲ', toDate: 'ပြီးဆုံးရက်စွဲ', paymentStatus: 'ငွေပေးချေမှုအခြေအနေ', customer: 'ဖောက်သည်', phone: 'ဖုန်း', vehicleNumber: 'ယာဉ်နံပါတ်', brand: 'အမျိုးအစား', model: 'မော်ဒယ်', owner: 'ပိုင်ရှင်', makeModel: 'အမျိုးအစားနှင့်မော်ဒယ်', serviceStatus: 'ဝန်ဆောင်မှုအခြေအနေ', activeProfile: 'အသုံးပြုနေသောမှတ်တမ်း', service: 'ဝန်ဆောင်မှု', latestPrice: 'နောက်ဆုံးစျေးနှုန်း', usage: 'အသုံးပြုမှု', serviceItems: 'ဝန်ဆောင်မှုများ', addItem: 'ပစ္စည်းထည့်ရန်', serviceDescription: 'ဝန်ဆောင်မှုဖော်ပြချက်', advanceReceived: 'ကြိုတင်လက်ခံရရှိငွေ', balanceDue: 'ကျန်ငွေ', subtotal: 'စုစုပေါင်းခွဲ', advance: 'ကြိုတင်ငွေ', grandTotal: 'စုစုပေါင်း', goodMorning: 'မင်္ဂလာနံနက်ခင်းပါ', dashboardDescription: 'ယနေ့ သင့်အလုပ်ရုံတွင် ဖြစ်ပျက်နေသည်များကို ဤနေရာတွင် ကြည့်နိုင်ပါသည်။', totalRevenue: 'စုစုပေါင်းဝင်ငွေ', openBalance: 'ကျန်ရှိငွေ', activeCustomers: 'လက်ရှိဖောက်သည်များ', vehiclesServiced: 'ဝန်ဆောင်မှုပေးထားသောယာဉ်များ', fromLiveInvoices: 'တိုက်ရိုက်ငွေတောင်းခံလွှာများမှ', liveCustomerRecords: 'တိုက်ရိုက်ဖောက်သည်မှတ်တမ်းများ', liveVehicleRecords: 'တိုက်ရိုက်ယာဉ်မှတ်တမ်းများ', invoiceActivity: 'ငွေတောင်းခံလွှာ လှုပ်ရှားမှု', paymentStatusChart: 'ငွေပေးချေမှုအခြေအနေ', recentInvoices: 'လတ်တလောငွေတောင်းခံလွှာများ', revenueByMonth: 'လစဉ်ဝင်ငွေ', totalInvoiceByMonth: 'လအလိုက် ငွေတောင်းခံလွှာ စုစုပေါင်း', totalInvoiceValue: 'ငွေတောင်းခံလွှာ စုစုပေါင်း', vehicleRepairFrequency: 'ဝန်ဆောင်မှုအများဆုံး ယာဉ်များ', repairs: 'ပြုပြင်မှုများ', noVehicleRepairData: 'ယာဉ်ပြုပြင်မှုဒေတာ မရှိပါ', noVehicleRepairDescription: 'ငွေတောင်းခံလွှာများ ရှိလာသောအခါ ယာဉ်ပြုပြင်မှုအကြိမ်ရေကို ပြသပါမည်။', viewAll: 'အားလုံးကြည့်ရန် →', printPdf: 'ပုံနှိပ် / PDF သိမ်းရန်', printSetup: 'PDF ပုံနှိပ်ပြင်ဆင်မှု', printSetupDescription: 'ပုံနှိပ်မထုတ်မီ ခေါင်းစီးနှင့် ဒီဇိုင်းအသေးစိတ် ထည့်ပါ။', pdfHeader: 'ခေါင်းစီး', pdfSubtitle: 'စာတန်းထိုး', pdfAddress: 'လိပ်စာ', pdfPhone: 'ဖုန်း', pdfDesign: 'ဒီဇိုင်း', classic: 'ရိုးရိုး', minimal: 'ရိုးရှင်း', accent: 'အရောင်', print: 'ပုံနှိပ် / PDF သိမ်းရန်', close: 'ပိတ်ရန်', billTo: 'ငွေတောင်းခံသူ', vehicle: 'ယာဉ်', serviceDescriptionColumn: 'ဝန်ဆောင်မှုဖော်ပြချက်', quantity: 'အရေအတွက်', price: 'စျေးနှုန်း', total: 'စုစုပေါင်း', customerDirectory: 'ဖောက်သည်စာရင်း', customerDescription: 'ဝန်ဆောင်မှုပေးနေသော ဖောက်သည်များနှင့် လုပ်ငန်းများကို စီမံပါ။', vehicleDirectory: 'ယာဉ်စာရင်း', vehicleDescription: 'နောက်လာမည့် ဝန်ဆောင်မှုအတွက် ယာဉ်မှတ်တမ်းများကို အသင့်ထားပါ။', addCustomer: 'ဖောက်သည်ထည့်ရန်', addVehicle: 'ယာဉ်ထည့်ရန်', searchCustomers: 'ဖောက်သည်များ ရှာရန်…', searchVehicles: 'နံပါတ်၊ အမျိုးအစား၊ ဖောက်သည် ရှာရန်…', noCustomersFound: 'ဖောက်သည် မတွေ့ပါ', noVehiclesFound: 'ယာဉ် မတွေ့ပါ', trySearch: 'အခြားရှာဖွေမှုဖြင့် စမ်းကြည့်ပါ။', serviceDescriptionText: 'ဝန်ဆောင်မှုများကို တိုက်ရိုက် API မှ ရယူထားပါသည်။', searchServices: 'ဝန်ဆောင်မှုများ ရှာရန်…', noServicesFound: 'ဝန်ဆောင်မှု မတွေ့ပါ', noServicesDescription: 'တိုက်ရိုက် API မှ ပြန်လာသော ဝန်ဆောင်မှုများကို ဤနေရာတွင် ပြသပါမည်။', showingServices: 'တိုက်ရိုက်ငွေတောင်းခံလွှာများမှ ဝန်ဆောင်မှုများ', liveApi: 'တိုက်ရိုက် API' },
}

export const extraTranslations: Record<Language, Record<string, string>> = {
  en: { deletionWarning: 'All other related records associated with this item may also be deleted.', customerDeleted: 'Customer deleted successfully.', vehicleDeleted: 'Vehicle deleted successfully.', invoiceDeleted: 'Invoice deleted successfully.', itemUpdated: 'Item updated successfully.', itemDeleted: 'Item deleted successfully.', customerDeleteError: 'Could not delete the customer.', vehicleDeleteError: 'Could not delete the vehicle.', invoiceDeleteError: 'Could not delete the invoice.', itemUpdateError: 'Could not update the item.', itemDeleteError: 'Could not delete the item.', downloadDatabase: 'Download database', databaseDownloaded: 'Database backup downloaded.', databaseDownloadError: 'Could not download the database backup.' },
  my: { deletionWarning: 'ဤအကြောင်းအရာနှင့်သတ်ဆိုင်သော အခြားဆက်စပ်သောအရာများ အကုန် ပျက်သွားနိုင်ပါတယ်', customerDeleted: 'ဖောက်သည်ကို အောင်မြင်စွာ ဖျက်လိုက်ပါပြီ။', vehicleDeleted: 'ယာဉ်ကို အောင်မြင်စွာ ဖျက်လိုက်ပါပြီ။', invoiceDeleted: 'ငွေတောင်းခံလွှာကို အောင်မြင်စွာ ဖျက်လိုက်ပါပြီ။', itemUpdated: 'ပစ္စည်းကို အောင်မြင်စွာ ပြင်ဆင်လိုက်ပါပြီ။', itemDeleted: 'ပစ္စည်းကို အောင်မြင်စွာ ဖျက်လိုက်ပါပြီ။', customerDeleteError: 'ဖောက်သည်ကို ဖျက်၍မရပါ။', vehicleDeleteError: 'ယာဉ်ကို ဖျက်၍မရပါ။', invoiceDeleteError: 'ငွေတောင်းခံလွှာကို ဖျက်၍မရပါ။', itemUpdateError: 'ပစ္စည်းကို ပြင်ဆင်၍မရပါ။', itemDeleteError: 'ပစ္စည်းကို ဖျက်၍မရပါ။', downloadDatabase: 'ဒေတာဘေ့စ် ဒေါင်းလုဒ်ရန်', databaseDownloaded: 'ဒေတာဘေ့စ် အရန်ကူးဖိုင်ကို ဒေါင်းလုဒ်ပြီးပါပြီ။', databaseDownloadError: 'ဒေတာဘေ့စ် အရန်ကူးဖိုင်ကို ဒေါင်းလုဒ်မရပါ။' },
}

export function t(language: Language, key: string) { return translations[language][key] || extraTranslations[language][key] || translations.en[key] || extraTranslations.en[key] || key }

export function normalizePaymentType(value: string | null | undefined): PaymentType {
  const normalized = (value || '').toLowerCase().replace('_', '-')
  if (normalized === 'cash' || normalized === 'paid') return 'cash'
  if (normalized === 'kbz-pay' || normalized === 'partial') return 'kbz-pay'
  return 'pending'
}

export function localDateInputValue(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function shiftDateInputValue(value: string, months: number) {
  const date = new Date(`${value}T00:00:00`)
  date.setMonth(date.getMonth() + months)
  return localDateInputValue(date)
}

export function invoiceDateInputValue(value: string | null | undefined) {
  if (!value) return ''
  const match = String(value).match(/^\d{4}-\d{2}-\d{2}/)
  return match?.[0] || localDateInputValue(new Date(value))
}

export function pageFromPath(pathname: string): PageName {
  if (pathname === '/' || pathname === '/dashboard') return 'dashboard'
  if (pathname === '/invoices/new') return 'invoice-create'
  if (/^\/invoices\/[^/]+\/edit$/.test(pathname)) return 'invoice-edit'
  if (/^\/invoices\/[^/]+$/.test(pathname)) return 'invoice-detail'
  if (pathname === '/invoices') return 'invoices'
  if (/^\/customers\/[^/]+$/.test(pathname)) return 'customer-detail'
  if (pathname === '/customers') return 'customers'
  if (/^\/cars\/[^/]+$/.test(pathname)) return 'car-detail'
  if (pathname === '/cars') return 'cars'
  if (/^\/items\/[^/]+$/.test(pathname)) return 'item-detail'
  if (pathname === '/items') return 'items'
  if (pathname === '/team-access') return 'team-access'
  if (pathname === '/settings') return 'settings'
  return 'dashboard'
}

export function activeNavPage(page: PageName): PageName {
  if (page === 'invoice-create' || page === 'invoice-edit' || page === 'invoice-detail') return 'invoices'
  if (page === 'customer-detail') return 'customers'
  if (page === 'car-detail') return 'cars'
  if (page === 'item-detail') return 'items'
  return page
}

export function routeForPage(page: PageName): string {
  const routes: Partial<Record<PageName, string>> = { dashboard: '/dashboard', invoices: '/invoices', customers: '/customers', cars: '/cars', items: '/items', settings: '/settings', 'team-access': '/team-access', 'invoice-create': '/invoices/new' }
  return routes[page] || '/dashboard'
}

export function itemsFromData(catalogItems: Item[], invoices: Invoice[]) {
  const itemMap = new Map<string, Item>()
  catalogItems.forEach((item) => itemMap.set(String(item.id), item))
  const invoicePriceSeen = new Set<string>()
  invoices.forEach((invoice) => invoice.details?.forEach((detail, index) => {
    const item = detail.item
    const name = item?.name || detail.name
    const id = item?.id ?? detail.item_id ?? -(index + 1)
    const key = String(item?.id ?? detail.item_id ?? `name:${name}`)
    if (!name) return
    const current = itemMap.get(key) || { id, name, price: Number(item?.price || 0) }
    if (!invoicePriceSeen.has(key)) {
      itemMap.set(key, { ...current, name, price: Number(detail.price ?? current.price ?? 0) })
      invoicePriceSeen.add(key)
    }
  }))
  return Array.from(itemMap.values())
}

export type InvoiceLine = { name: string; quantity: number; price: number }

export type InvoiceForm = { date: string; customerName: string; carNumber: string; brand: string; model: string; advance: number; paymentType: string; lines: InvoiceLine[] }

export const roleOptions = [{ id: 1, name: 'Admin' }, { id: 2, name: 'Manager' }, { id: 3, name: 'User' }]

export type CarForm = { number: string; brand: string; model: string; customer_id: string }
