import React, { useEffect, useState } from "react";
import { CarFront, Download, Eye, Pencil, Plus, Printer, Search, Trash2, X } from "lucide-react";
import type { Car, Customer, Invoice, Item } from "../../services/apiServices";
import { api } from "../../services/apiServices";
import { initials, money, shortDate } from "../../lib/utils";
import { Badge, Button, Card, Dialog, EmptyState, Input, Select } from "../../components/ui";
import { Pagination } from "../../components/Pagination";
import { type Language, type PaymentType, type Toast, type InvoiceForm as InvoiceFormData, type InvoiceLine, paymentTypeOptions, t, normalizePaymentType, localDateInputValue, shiftDateInputValue, invoiceDateInputValue } from "../../lib/app-shared";
import { InvoiceTable, StatusBadge } from "./InvoiceList";


export function InvoiceDetailPage({ language, invoice, onBack, onEdit, onPrint }: { language: Language; invoice: Invoice; onBack: () => void; onEdit: () => void; onPrint: (invoice: Invoice) => void }) {
    return (
        <>
            <div className="page-heading">
                <div>
                    <button
                        className="back-link"
                        onClick={onBack}
                    >
                        ← {t(language, "backToInvoices")}
                    </button>
                    <div className="eyebrow">{t(language, "financialRecords")}</div>
                    <h1>{t(language, "invoiceDetail")}</h1>
                    <p>
                        #{invoice.invoice_number} · {shortDate(invoice.date)}
                    </p>
                </div>
                <div className="actions">
                    <Button
                        variant="outline"
                        onClick={() => onPrint(invoice)}
                    >
                        <Printer size={14} /> {t(language, "printPdf")}
                    </Button>
                    <Button onClick={onEdit}>
                        <Pencil size={14} /> {t(language, "editInvoice")}
                    </Button>
                </div>
            </div>
            <div className="detail-grid">
                <Card>
                    <div className="detail-label">{t(language, "billTo")}</div>
                    <div className="detail-person">
                        <div className="avatar">{initials(invoice.customer?.name || "NA")}</div>
                        <div>
                            <h2>{invoice.customer?.name || "—"}</h2>
                            <p>{invoice.customer?.phone || "No phone recorded"}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="detail-label">{t(language, "vehicle")}</div>
                    <div className="detail-person">
                        <div className="vehicle-icon">
                            <CarFront size={19} />
                        </div>
                        <div>
                            <h2>{invoice.car?.number || "—"}</h2>
                            <p>{[invoice.car?.brand, invoice.car?.model].filter(Boolean).join(" ") || "No model recorded"}</p>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="detail-label">{t(language, "paymentStatus")}</div>
                    <div className="detail-payment">
                        <StatusBadge status={invoice.payment_type} />
                        <strong>{money(invoice.grand_total)}</strong>
                        <span>Advance: {money(invoice.advance)}</span>
                    </div>
                </Card>
            </div>
            <Card className="detail-lines-card">
                <div className="card-title">
                    <div>
                        <h2>{t(language, "serviceItems")}</h2>
                        <p>Services included in this invoice.</p>
                    </div>
                    <StatusBadge status={invoice.payment_type} />
                </div>
                <div className="table-wrap">
                    <table className="data-table invoice-detail-table">
                        <thead>
                            <tr>
                                <th>{t(language, "serviceDescriptionColumn")}</th>
                                <th>{t(language, "quantity")}</th>
                                <th>{t(language, "price")}</th>
                                <th>{t(language, "total")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoice.details?.map((detail, index) => (
                                <tr key={detail.id || index}>
                                    <td>
                                        <strong>{detail.item?.name || detail.name || "—"}</strong>
                                    </td>
                                    <td>{detail.quantity}</td>
                                    <td>{money(detail.price)}</td>
                                    <td>
                                        <strong>{money(Number(detail.price) * Number(detail.quantity))}</strong>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr><td colSpan={3}>{t(language, "subtotal")}</td><td><strong>{money(invoice.sub_total)}</strong></td></tr>
                            <tr><td colSpan={3}>{t(language, "advance")}</td><td><strong>- {money(invoice.advance)}</strong></td></tr>
                            <tr className="invoice-detail-grand"><td colSpan={3}>{t(language, "grandTotal")}</td><td><strong>{money(invoice.grand_total)}</strong></td></tr>
                        </tfoot>
                    </table>
                </div>
            </Card>
        </>
    );
}


export function RelatedInvoices({ title, invoices, onView, onEdit, onDelete, onPrint }: { title: string; invoices: Invoice[]; onView: (invoice: Invoice) => void; onEdit: (invoice: Invoice) => void; onDelete: (invoice: Invoice) => Promise<void>; onPrint: (invoice: Invoice) => void }) {
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const invoiceToDelete = invoices.find((invoice) => invoice.id === deleteId);
    return (
        <Card className="table-card">
            <div className="card-title detail-section-heading">
                <div>
                    <h2>{title}</h2>
                    <p>Review every invoice connected to this profile.</p>
                </div>
                <Badge tone="info">{invoices.length} invoices</Badge>
            </div>
            <InvoiceTable
                invoices={invoices}
                onView={onView}
                onEdit={onEdit}
                onPrint={onPrint}
                onDelete={(invoice) => setDeleteId(invoice.id)}
            />
            <Dialog
                open={Boolean(invoiceToDelete)}
                title="Delete invoice?"
                description="This action will remove the invoice from the live API."
                onClose={() => setDeleteId(null)}
                footer={
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setDeleteId(null)}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="danger"
                            onClick={async () => {
                                if (invoiceToDelete) await onDelete(invoiceToDelete);
                                setDeleteId(null);
                            }}
                        >
                            Delete invoice
                        </Button>
                    </>
                }
            >
                <p style={{ color: "#69758a", fontSize: 13 }}>{invoiceToDelete ? `Invoice #${invoiceToDelete.invoice_number} will be permanently removed.` : ""}</p>
            </Dialog>
        </Card>
    );
}
