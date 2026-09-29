import React, { useEffect, useState } from "react";
import { CarFront, Download, Eye, Pencil, Plus, Printer, Search, Trash2, X } from "lucide-react";
import type { Car, Customer, Invoice, Item } from "../../services/apiServices";
import { api } from "../../services/apiServices";
import { initials, money, shortDate } from "../../lib/utils";
import { Badge, Button, Card, Dialog, EmptyState, Input, Select } from "../../components/ui";
import { Pagination } from "../../components/Pagination";
import { type Language, type PaymentType, type Toast, type InvoiceForm as InvoiceFormData, type InvoiceLine, paymentTypeOptions, t, normalizePaymentType, localDateInputValue, shiftDateInputValue, invoiceDateInputValue } from "../../lib/app-shared";


export function InvoiceEditorPage({ language, mode, initial, customers, cars, items, invoices, onChange, onCancel, onDone, notify }: { language: Language; mode: "create" | "edit"; initial: Invoice | null; customers: Customer[]; cars: Car[]; items: Item[]; invoices: Invoice[]; onChange: (value: Invoice[]) => void; onCancel: () => void; onDone: () => void; notify: (message: string, kind?: Toast["kind"]) => void }) {
    const save = async (data: InvoiceFormData) => {
        const total = data.lines.reduce((sum, line) => sum + Number(line.price || 0) * Number(line.quantity || 0), 0);
        const payload = { date: data.date, customer: { name: data.customerName }, car: { number: data.carNumber, brand: data.brand, model: data.model }, invoice_details: data.lines.map((line) => ({ name: line.name, quantity: Number(line.quantity), price: Number(line.price) })), sub_total: total, advance: Number(data.advance || 0), grand_total: total, payment_type: data.paymentType, payment_date: data.paymentType === "cash" ? data.date : null };
        try {
            if (mode === "edit") {
                if (!initial?.id) {
                    notify("This invoice could not be identified for editing.", "error");
                    return;
                }
                const result = await api.updateInvoice(initial.id, payload);
                onChange(invoices.map((invoice) => (invoice.id === initial.id ? { ...result.data, id: initial.id } : invoice)));
            } else {
                const result = await api.createInvoice(payload);
                onChange([result.data, ...invoices]);
            }
            notify(mode === "edit" ? "Invoice updated" : "Invoice created");
            onDone();
        } catch (requestError) {
            notify(requestError instanceof Error ? requestError.message : "Could not save invoice to the live API.", "error");
        }
    };
    return (
        <>
            <div className="page-heading">
                <div>
                    <button
                        className="back-link"
                        onClick={onCancel}
                    >
                        ← {t(language, "backToInvoices")}
                    </button>
                    <div className="eyebrow">{t(language, "financialRecords")}</div>
                    <h1>{mode === "edit" ? t(language, "editInvoice") : t(language, "createInvoice")}</h1>
                    <p>{mode === "edit" ? t(language, "editInvoiceDescription") : t(language, "createInvoiceDescription")}</p>
                </div>
            </div>
            <Card className="invoice-editor-card">
                <InvoiceForm
                    language={language}
                    pageMode
                    initial={initial}
                    customers={customers}
                    cars={cars}
                    items={items}
                    onCancel={onCancel}
                    onSave={save}
                />
            </Card>
        </>
    );
}


export function InvoiceForm({ language, pageMode = false, initial, customers, cars, items, onCancel, onSave }: { language: Language; pageMode?: boolean; initial: Invoice | null; customers: Customer[]; cars: Car[]; items: Item[]; onCancel: () => void; onSave: (data: InvoiceFormData) => void }) {
    const [form, setForm] = useState<InvoiceFormData>(() => ({ date: initial?.date?.slice(0, 10) || new Date().toISOString().slice(0, 10), customerName: initial?.customer?.name || "", carNumber: initial?.car?.number || "", brand: initial?.car?.brand || "", model: initial?.car?.model || "", advance: Number(initial?.advance || 0), paymentType: normalizePaymentType(initial?.payment_type), lines: initial?.details?.map((detail) => ({ name: detail.item?.name || detail.name || "", quantity: detail.quantity, price: Number(detail.price) })) || [{ name: "", quantity: 1, price: 0 }] }));
    const total = form.lines.reduce((sum, line) => sum + Number(line.price || 0) * Number(line.quantity || 0), 0);
    const patch = (next: Partial<InvoiceFormData>) => setForm((value) => ({ ...value, ...next }));
    const selectCustomer = (name: string) => {
        const match = customers.find((customer) => customer.name === name);
        patch({ customerName: name, carNumber: (match && cars.find((car) => car.customer_id === match.id)?.number) || form.carNumber });
    };
    const selectCar = (number: string) => {
        const match = cars.find((car) => car.number === number);
        patch({ carNumber: number, brand: match?.brand || "", model: match?.model || "", customerName: match?.customer?.name || form.customerName });
    };
    return (
        <>
            <div className="form-grid">
                <div className="form-field">
                    <label>{t(language, "invoiceDate")}</label>
                    <Input
                        type="date"
                        value={form.date}
                        onChange={(e) => patch({ date: e.target.value })}
                    />
                </div>
                <div className="form-field">
                    <label>{t(language, "paymentStatus")}</label>
                    <Select
                        value={form.paymentType}
                        onChange={(e) => patch({ paymentType: e.target.value as PaymentType })}
                    >
                        {paymentTypeOptions.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </Select>
                </div>
                <div className="form-field">
                    <label>{t(language, "customer")}</label>
                    <Input
                        list="customer-list"
                        value={form.customerName}
                        onChange={(e) => selectCustomer(e.target.value)}
                        placeholder="Search or add customer"
                    />
                    <datalist id="customer-list">
                        {customers.map((customer) => (
                            <option
                                key={customer.id}
                                value={customer.name}
                            />
                        ))}
                    </datalist>
                </div>
                <div className="form-field">
                    <label>{t(language, "vehicleNumber")}</label>
                    <Input
                        list="car-list"
                        value={form.carNumber}
                        onChange={(e) => selectCar(e.target.value)}
                        placeholder="e.g. 9H-4821"
                    />
                    <datalist id="car-list">
                        {cars.map((car) => (
                            <option
                                key={car.id}
                                value={car.number}
                            />
                        ))}
                    </datalist>
                </div>
                <div className="form-field">
                    <label>{t(language, "brand")}</label>
                    <Input
                        value={form.brand}
                        onChange={(e) => patch({ brand: e.target.value })}
                        placeholder="Hino"
                    />
                </div>
                <div className="form-field">
                    <label>{t(language, "model")}</label>
                    <Input
                        value={form.model}
                        onChange={(e) => patch({ model: e.target.value })}
                        placeholder="500 Series"
                    />
                </div>
            </div>
            <hr className="form-divider" />
            <div
                className="card-title"
                style={{ marginBottom: 10 }}
            >
                <div>
                    <h2 style={{ fontSize: 13 }}>{t(language, "serviceItems")}</h2>
                    <p>Add one or more billable services.</p>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => patch({ lines: [...form.lines, { name: "", quantity: 1, price: 0 }] })}
                >
                    <Plus size={13} /> {t(language, "addItem")}
                </Button>
            </div>
            <div className="line-items">
                <div className="line-item line-item-header" aria-hidden="true">
                    <span>{t(language, "serviceDescriptionColumn")}</span>
                    <span>{t(language, "quantity")}</span>
                    <span>{t(language, "price")}</span>
                    <span>{t(language, "total")}</span>
                    <span />
                </div>
                {form.lines.map((line, index) => (
                    <div
                        className="line-item"
                        key={index}
                    >
                        <Input
                            list="item-list"
                            value={line.name}
                            placeholder={t(language, "serviceDescription")}
                            onChange={(e) => {
                                const next = [...form.lines];
                                next[index] = { ...line, name: e.target.value };
                                patch({ lines: next });
                            }}
                        />
                        <Input
                            type="number"
                            min="1"
                            value={line.quantity}
                            onChange={(e) => {
                                const next = [...form.lines];
                                next[index] = { ...line, quantity: Number(e.target.value) };
                                patch({ lines: next });
                            }}
                        />
                        <Input
                            type="number"
                            min="0"
                            value={line.price}
                            onChange={(e) => {
                                const next = [...form.lines];
                                next[index] = { ...line, price: Number(e.target.value) };
                                patch({ lines: next });
                            }}
                        />
                        <strong className="line-item-total">{money(Number(line.price || 0) * Number(line.quantity || 0))}</strong>
                        {form.lines.length > 1 ? (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => patch({ lines: form.lines.filter((_, lineIndex) => lineIndex !== index) })}
                            >
                                <X size={15} />
                            </Button>
                        ) : (
                            <span />
                        )}
                    </div>
                ))}
                <datalist id="item-list">
                    {items.map((item) => (
                        <option
                            key={item.id}
                            value={item.name}
                        />
                    ))}
                </datalist>
            </div>
            <hr className="form-divider" />
            <div className="form-grid">
                <div className="form-field">
                    <label>{t(language, "advanceReceived")}</label>
                    <Input
                        type="number"
                        min="0"
                        value={form.advance}
                        onChange={(e) => patch({ advance: Number(e.target.value) })}
                    />
                </div>
                <div className="form-field">
                    <label>{t(language, "balanceDue")}</label>
                    <Input
                        value={money(Math.max(0, total - Number(form.advance)))}
                        readOnly
                    />
                </div>
            </div>
            <div className="invoice-totals editor-totals" style={{ marginTop: 18 }}>
                <div className="invoice-total-row"><span>{t(language, "subtotal")}</span><strong>{money(total)}</strong></div>
                <div className="invoice-total-row"><span>{t(language, "advance")}</span><strong>- {money(form.advance)}</strong></div>
                <div className="invoice-total-row grand"><span>{t(language, "grandTotal")}</span><strong>{money(total)}</strong></div>
            </div>
            <div
                className={pageMode ? "editor-actions" : "dialog-footer"}
                style={pageMode ? undefined : { margin: "20px -22px -20px" }}
            >
                <Button
                    variant="outline"
                    onClick={onCancel}
                >
                    {t(language, "cancel")}
                </Button>
                <Button
                    onClick={() => onSave(form)}
                    disabled={!form.customerName || !form.carNumber || !form.lines[0]?.name}
                >
                    {t(language, "saveInvoice")}
                </Button>
            </div>
        </>
    );
}