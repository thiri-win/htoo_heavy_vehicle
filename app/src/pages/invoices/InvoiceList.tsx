import React, { useEffect, useState } from "react";
import { CarFront, Download, Eye, Pencil, Plus, Printer, Search, Trash2, X } from "lucide-react";
import type { Car, Customer, Invoice, Item } from "../../services/apiServices";
import { api } from "../../services/apiServices";
import { initials, money, shortDate } from "../../lib/utils";
import { Badge, Button, Card, Dialog, EmptyState, Input, Select } from "../../components/ui";
import { Pagination } from "../../components/Pagination";
import { type Language, type PaymentType, type Toast, type InvoiceForm as InvoiceFormData, type InvoiceLine, paymentTypeOptions, t, normalizePaymentType, localDateInputValue, shiftDateInputValue, invoiceDateInputValue } from "../../lib/app-shared";


export function StatusBadge({ status }: { status: string }) {
    const paymentType = normalizePaymentType(status);
    const tone = paymentType === "cash" ? "success" : paymentType === "kbz-pay" ? "info" : "warning";
    return <Badge tone={tone}>{paymentType}</Badge>;
}


export function InvoicesPage({ language, invoices, onCreate, onView, onEdit, onChange, onPrint, notify }: { language: Language; invoices: Invoice[]; onCreate: () => void; onView: (invoice: Invoice) => void; onEdit: (invoice: Invoice) => void; onChange: (value: Invoice[]) => void; onPrint: (invoice: Invoice) => void; notify: (message: string, kind?: Toast["kind"]) => void }) {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("all");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const pageSize = 6;
    const effectiveStartDate = startDate || (endDate ? shiftDateInputValue(endDate, -1) : "");
    const effectiveEndDate = endDate || (startDate ? localDateInputValue(new Date()) : "");
    const filtered = invoices.filter((invoice) => {
        const text = `${invoice.invoice_number} ${invoice.customer?.name} ${invoice.car?.number} ${invoice.details?.map((detail) => detail.item?.name || detail.name).join(" ")}`.toLowerCase();
        const invoiceDate = invoiceDateInputValue(invoice.date);
        const withinDate = (!effectiveStartDate || invoiceDate >= effectiveStartDate) && (!effectiveEndDate || invoiceDate <= effectiveEndDate);
        return text.includes(query.toLowerCase()) && (status === "all" || normalizePaymentType(invoice.payment_type) === status) && withinDate;
    });
    const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const rows = filtered.slice((page - 1) * pageSize, page * pageSize);
    useEffect(() => setPage(1), [query, status, startDate, endDate]);
    const remove = async () => {
        if (!deleteId) return;
        try {
            await api.deleteInvoice(deleteId);
            onChange(invoices.filter((invoice) => invoice.id !== deleteId));
            setDeleteId(null);
            notify(t(language, "invoiceDeleted"));
        } catch {
            notify(t(language, "invoiceDeleteError"), "error");
        }
    };
    return (
        <>
            <div className="page-heading">
                <div>
                    <div className="eyebrow">{t(language, "financialRecords")}</div>
                    <h1>{t(language, "invoiceIndex")}</h1>
                    <p>{t(language, "invoiceIndexDescription")}</p>
                </div>
                <div className="actions">
                    <Button
                        variant="outline"
                        onClick={async () => {
                            try {
                                const blob = await api.exportInvoices();
                                const url = URL.createObjectURL(blob);
                                const link = document.createElement("a");
                                link.href = url;
                                link.download = "invoices-report.xlsx";
                                link.click();
                                URL.revokeObjectURL(url);
                                notify("Excel report downloaded");
                            } catch {
                                notify("Could not export the live Excel report.", "error");
                            }
                        }}
                    >
                        <Download size={14} /> {t(language, "exportExcel")}
                    </Button>
                    <Button onClick={onCreate}>
                        <Plus size={15} /> {t(language, "newInvoice")}
                    </Button>
                </div>
            </div>
            <div className="toolbar">
                <div className="toolbar-left">
                    <div className="search-box">
                        <Search size={15} />
                        <Input
                            placeholder={t(language, "searchInvoices")}
                            value={query}
                            onChange={(event) => setQuery(event.target.value)}
                        />
                    </div>
                    <Select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                    >
                        <option value="all">{t(language, "allStatuses")}</option>
                        {paymentTypeOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </Select>
                    <label className="date-filter">
                        <span>{t(language, "fromDate")}</span>
                        <Input
                            type="date"
                            aria-label={t(language, "fromDate")}
                            value={startDate}
                            onChange={(event) => setStartDate(event.target.value)}
                        />
                    </label>
                    <label className="date-filter">
                        <span>{t(language, "toDate")}</span>
                        <Input
                            type="date"
                            aria-label={t(language, "toDate")}
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                        />
                    </label>
                </div>
                <div className="toolbar-right">
                    <span style={{ fontSize: 11, color: "#8892a4" }}>{filtered.length} records</span>
                </div>
            </div>
            <Card className="table-card">
                <InvoiceTable
                    invoices={rows}
                    onView={onView}
                    onEdit={onEdit}
                    onDelete={(invoice) => setDeleteId(invoice.id)}
                    onPrint={onPrint}
                />
                <Pagination
                    page={page}
                    pages={pages}
                    total={filtered.length}
                    pageSize={pageSize}
                    onPage={setPage}
                />
            </Card>
            <Dialog
                open={Boolean(deleteId)}
                title="Delete invoice?"
                description="This action cannot be undone."
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
                            onClick={remove}
                        >
                            Delete invoice
                        </Button>
                    </>
                }
            >
                <p style={{ color: "#69758a", fontSize: 13 }}>{t(language, "deletionWarning")}</p>
            </Dialog>
        </>
    );
}


export function InvoiceTable({ invoices, compact = false, onView, onEdit, onDelete, onPrint }: { invoices: Invoice[]; compact?: boolean; onView?: (invoice: Invoice) => void; onEdit?: (invoice: Invoice) => void; onDelete?: (invoice: Invoice) => void; onPrint?: (invoice: Invoice) => void }) {
    return invoices.length ? (
        <div className="table-wrap">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Invoice</th>
                        <th>Customer</th>
                        <th>Vehicle</th>
                        <th>Date</th>
                        <th>Amount</th>
                        <th>Status</th>
                        {!compact && <th></th>}
                    </tr>
                </thead>
                <tbody>
                    {invoices.map((invoice) => (
                        <tr key={invoice.id}>
                            <td>
                                <strong>#{invoice.invoice_number}</strong>
                            </td>
                            <td>
                                <div className="td-main">
                                    <span className="tiny-avatar">{initials(invoice.customer?.name || "NA")}</span>
                                    <strong>{invoice.customer?.name || "Walk-in customer"}</strong>
                                </div>
                            </td>
                            <td>{invoice.car?.number || "—"}</td>
                            <td>{shortDate(invoice.date)}</td>
                            <td>
                                <strong>{money(invoice.grand_total)}</strong>
                            </td>
                            <td>
                                <StatusBadge status={invoice.payment_type} />
                            </td>
                            {!compact && (
                                <td>
                                    <div className="table-actions">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="View"
                                            onClick={() => onView?.(invoice)}
                                        >
                                            <Eye size={14} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Print / Save PDF"
                                            onClick={() => onPrint?.(invoice)}
                                        >
                                            <Printer size={14} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Edit"
                                            onClick={() => onEdit?.(invoice)}
                                        >
                                            <Pencil size={14} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            title="Delete"
                                            onClick={() => onDelete?.(invoice)}
                                        >
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    ) : (
        <EmptyState
            title="No invoices found"
            description="Try adjusting your search or create a new invoice."
        />
    );
}