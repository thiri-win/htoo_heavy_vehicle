import type { Invoice } from '../lib/api'
import { invoiceDateInputValue } from '../lib/app-shared'
import { money } from '../lib/utils'

const ROWS_PER_PAGE = 20
const CLOSING_NOTE = 'ပစ္စည်းမှာလျှင် စရန်ငွေတစ်ဝက် ချီးမြင့်ပါရန် ကျေးဇူးတင်ပါသည်။'

function toRoman(value: number) {
  const numerals: Array<[number, string]> = [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]
  let remaining = value
  return numerals.reduce((result, [amount, numeral]) => {
    while (remaining >= amount) { result += numeral; remaining -= amount }
    return result
  }, '')
}

function printedDate(value: string | null | undefined) {
  const date = invoiceDateInputValue(value)
  if (!date) return ''
  const [year, month, day] = date.split('-')
  return `${day}-${month}-${year}`
}

function printedPaymentStatus(value: string | null | undefined) {
  const status = (value || '').toLowerCase().replaceAll('_', '-').trim()
  if (status === 'cash') return 'Cash'
  if (status === 'kbz-pay' || status === 'kbzpay') return 'KBZ Pay'
  return ''
}

function InvoiceHeader() {
  return <header className="invoice-print-header">
    <div className="invoice-print-motto">(အရဟံ) ပဥ္စ ဂုဏံ အဟံ ဝန္ဒာမိ</div>
    <div className="invoice-print-business">ဦးဆန်းထူးနှင့်သားများ</div>
    <div className="invoice-print-business-line">ဖရိမ်၊ လေးပုံး၊ လေးခုံ၊ တွင်ခုံ ကားကြီးအောက်ပိုင်းပြုပြင်ရေး နှင့် အထွေထွေ စက်မှုလုပ်ငန်း</div>
    <div className="invoice-print-address">အမှတ်(၁-၂)၊ ဘုရင့်နောင်ပွဲရုံကားကြီးကွင်းပတ်လမ်း၊ မရမ်းကုန်းမြို့နယ်၊ရန်ကုန်မြို့။</div>
    <div className="invoice-print-address">အမှတ်((၂၉/၁)၊ ရွှေတံခါးလမ်း၊ အမှတ်(၄)လမ်းမကြီး၊ ရွှေပြည်သာကွေ့အနီး။</div>
    <div className="invoice-print-phone">ph: 09-5113365, 09-794423528, 09-254208143</div>
  </header>
}

function InvoiceMeta({ invoice }: { invoice: Invoice }) {
  return <div className="invoice-print-meta">
    <div><span>ဘောင်ချာအမှတ်</span><strong>{invoice.invoice_number || ''}</strong></div>
    <div><span>ရက်စွဲ</span><strong>{printedDate(invoice.date)}</strong></div>
    <div><span>အမည်</span><strong>{invoice.customer?.name || ''}</strong></div>
    <div><span>ကားနံပါတ်</span><strong>{invoice.car?.number || ''}</strong></div>
  </div>
}

function InvoiceRows({ lines, startIndex }: { lines: NonNullable<Invoice['details']>; startIndex: number }) {
  return <table className="invoice-print-table">
    <colgroup><col className="serial-col" /><col className="description-col" /><col className="quantity-col" /><col className="amount-col" /></colgroup>
    <thead><tr><th>စဉ်</th><th>အကြောင်းအရာ</th><th>အရေအတွက်</th><th>ကျသင့်ငွေ</th></tr></thead>
    <tbody>{Array.from({ length: ROWS_PER_PAGE }, (_, rowIndex) => {
      const detail = lines[rowIndex]
      const itemName = detail?.item?.name || detail?.name || ''
      return <tr key={rowIndex}>
        <td>{detail ? startIndex + rowIndex + 1 : ''}</td>
        <td>{itemName}</td>
        <td>{detail ? detail.quantity : ''}</td>
        <td>{detail ? money(Number(detail.quantity) * Number(detail.price)) : ''}</td>
      </tr>
    })}</tbody>
  </table>
}

function Totals({ invoice, pageTotals, overall = false }: { invoice: Invoice; pageTotals: number[]; overall?: boolean }) {
  const detailsTotal = invoice.details?.reduce((sum, detail) => sum + Number(detail.quantity) * Number(detail.price), 0) || 0
  const subtotal = Number(invoice.sub_total ?? detailsTotal)
  const grandTotal = Number(invoice.grand_total ?? subtotal)
  const advance = Number(invoice.advance || 0)
  const balance = Math.max(0, grandTotal - advance)
  return <section className="invoice-print-totals">
    {overall && pageTotals.map((value, index) => <div className="invoice-print-total-row" key={index}><span>စာမျက်နှာ {toRoman(index + 1)} စုစုပေါင်း</span><strong>{money(value)}</strong></div>)}
    <div className="invoice-print-total-row"><span>စုစုပေါင်း</span><strong>{money(subtotal)}</strong></div>
    <div className="invoice-print-total-row"><span>စရန်ငွေ</span><strong>{money(advance)}</strong></div>
    <div className="invoice-print-total-row invoice-print-grand-total"><span>ကျန်ငွေ</span><strong>{money(balance)}</strong></div>
  </section>
}

function SignatureAndPayment({ invoice }: { invoice: Invoice }) {
  return <div className="invoice-print-sign-payment">
    <div><span>ငွေပေးချေမှု</span><strong>{printedPaymentStatus(invoice.payment_type)}</strong></div>
    <div><span>လက်မှတ်</span><i /></div>
  </div>
}

function PageFooter({ label, closing = false }: { label: string; closing?: boolean }) {
  return <footer className="invoice-print-footer"><span>{closing ? CLOSING_NOTE : ''}</span><strong>{label}</strong></footer>
}

export function InvoicePrint({ invoice }: { invoice: Invoice }) {
  const lines = invoice.details || []
  const pageCount = Math.max(1, Math.ceil(lines.length / ROWS_PER_PAGE))
  const isMultiPage = pageCount > 1
  const pageTotals = Array.from({ length: pageCount }, (_, pageIndex) => lines
    .slice(pageIndex * ROWS_PER_PAGE, (pageIndex + 1) * ROWS_PER_PAGE)
    .reduce((sum, detail) => sum + Number(detail.quantity) * Number(detail.price), 0))

  return <div className="invoice-print-root" aria-hidden="true">
    {pageTotals.map((_, pageIndex) => {
      const pageLines = lines.slice(pageIndex * ROWS_PER_PAGE, (pageIndex + 1) * ROWS_PER_PAGE)
      const label = `Page ${toRoman(pageIndex + 1)}`
      return <section className="invoice-print-page" key={label}>
        <InvoiceHeader />
        <InvoiceMeta invoice={invoice} />
        <InvoiceRows lines={pageLines} startIndex={pageIndex * ROWS_PER_PAGE} />
        {!isMultiPage && <Totals invoice={invoice} pageTotals={pageTotals} />}
        <div className="invoice-print-bottom">
          {isMultiPage && <div className="invoice-print-page-subtotal"><span>စာမျက်နှာ {toRoman(pageIndex + 1)} စုစုပေါင်း</span><strong>{money(pageTotals[pageIndex])}</strong></div>}
          <SignatureAndPayment invoice={invoice} />
          <PageFooter label={label} closing={!isMultiPage} />
        </div>
      </section>
    })}
    {isMultiPage && <section className="invoice-print-page invoice-print-summary-page">
      <InvoiceHeader />
      <InvoiceMeta invoice={invoice} />
      <h2 className="invoice-print-summary-title">အနှစ်ချုပ်</h2>
      <Totals invoice={invoice} pageTotals={pageTotals} overall />
      <div className="invoice-print-bottom">
        <SignatureAndPayment invoice={invoice} />
        <PageFooter label="Summary" closing />
      </div>
    </section>}
  </div>
}
