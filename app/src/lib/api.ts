export type User = { id: number; name: string; email: string; role_id?: number; role?: { id: number; name: string }; createdAt?: string }
export type Customer = { id: number; name: string; phone?: string | null; _count?: { invoices: number; cars: number } }
export type Car = { id: number; number: string; model?: string | null; brand?: string | null; customer_id: number; customer?: Customer }
export type Item = { id: number; name: string; price?: number }
export type InvoiceDetail = { id?: number; item_id?: number; item?: Item; name?: string; quantity: number; price: number }
export type Invoice = {
  id: number; invoice_number: string; date: string; customer_id?: number; customer: Customer; car_id?: number; car: Car
  sub_total: number; advance: number; grand_total: number; payment_type: string; payment_date?: string | null; details: InvoiceDetail[]
}
export type Page<T> = { data: T[]; pagination?: { total_items: number; current_page: number; per_page: number; total_pages: number } }

// The frontend is deployed separately from the API, so use the live API by default.
// VITE_API_URL can still override this for another environment, but it should include
// the `/api` path (for example: https://api-six-xi-11.vercel.app/api).
const API_BASE = (import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api' : 'https://api-six-xi-11.vercel.app/api')).replace(/\/$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const token = localStorage.getItem('htoo_token')
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(init?.headers || {}) },
  })
  if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || `Request failed (${response.status})`)
  const contentType = response.headers.get('content-type') || ''
  return contentType.includes('json') ? response.json() : response as unknown as T
}

export const api = {
  async signIn(email: string, password: string) { return request<{ token: string; user: User }>('/auth/signin', { method: 'POST', body: JSON.stringify({ email, password }) }) },
  async signUp(name: string, email: string, password: string) { return request<{ data: User }>('/auth/signup', { method: 'POST', body: JSON.stringify({ name, email, password }) }) },
  async users() { return request<Page<User>>('/users') },
  async updateUserRole(id: number, role_id: number) { return request<{ data: User }>(`/users/${id}/role`, { method: 'PATCH', body: JSON.stringify({ role_id }) }) },
  async customers() { return request<Page<Customer>>('/customers') },
  async createCustomer(data: Pick<Customer, 'name'>) { return request<{ data: Customer }>('/customers', { method: 'POST', body: JSON.stringify(data) }) },
  async updateCustomer(id: number, data: Pick<Customer, 'name'>) { return request<{ data: Customer }>(`/customers/${id}`, { method: 'PATCH', body: JSON.stringify(data) }) },
  async deleteCustomer(id: number) { return request(`/customers/${id}`, { method: 'DELETE' }) },
  async cars() { return request<Page<Car>>('/cars') },
  async createCar(data: { number: string; model?: string; brand?: string; customer_id: number }) { return request<{ data: Car }>('/cars', { method: 'POST', body: JSON.stringify(data) }) },
  async updateCar(id: number, data: { number: string; model?: string; brand?: string; customer_id: number }) { return request<{ data: Car }>(`/cars/${id}`, { method: 'PUT', body: JSON.stringify(data) }) },
  async deleteCar(id: number) { return request(`/cars/${id}`, { method: 'DELETE' }) },
  async items() { return request<Page<Item>>('/items') },
  async deleteItem(id: number) { return request(`/items/${id}`, { method: 'DELETE' }) },
  async updateItem(id: number, data: { name: string }) { return request<{ data: Item }>(`/items/${id}`, { method: 'PUT', body: JSON.stringify(data) }) },
  async invoices(params = '') { return request<Page<Invoice>>(`/invoices${params ? `?${params}` : ''}`) },
  async invoice(id: number) { return request<{ data: Invoice }>(`/invoices/${id}`) },
  async createInvoice(data: unknown) { return request<{ data: Invoice }>('/invoices', { method: 'POST', body: JSON.stringify(data) }) },
  async updateInvoice(id: number, data: unknown) { return request<{ data: Invoice }>(`/invoices/${id}`, { method: 'PATCH', body: JSON.stringify(data) }) },
  async deleteInvoice(id: number) { return request(`/invoices/${id}`, { method: 'DELETE' }) },
  async exportInvoices(params = '') { const token = localStorage.getItem('htoo_token'); const response = await fetch(`${API_BASE}/invoices/export/excel${params ? `?${params}` : ''}`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }); if (!response.ok) throw new Error('Could not export report'); return response.blob() },
  async downloadDatabase() { const token = localStorage.getItem('htoo_token'); const response = await fetch(`${API_BASE}/admin/database`, { headers: token ? { Authorization: `Bearer ${token}` } : {} }); if (!response.ok) throw new Error((await response.json().catch(() => null))?.error || 'Could not download the database backup'); return response.blob() },
}
