import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import ItemRow from './ItemRow';
import { generateInvoice } from '../api';

const InvoiceForm = ({ initialData }) => {
    const [formData, setFormData] = useState(() => {
        const savedSeller = localStorage.getItem('sellerDetails');
        const initialSeller = savedSeller ? JSON.parse(savedSeller) : { name: '', address: '', email: '' };

        return {
            sellerDetails: initialSeller,
            buyerDetails: { name: '', address: '', email: '' },
            items: [{ description: '', quantity: 1, price: 0 }],
            taxRate: 0,
            discountRate: 0,
            currency: 'USD',
            oldBalance: 0,
            cashReceived: 0,
            invoiceNumber: '',
            invoiceDate: new Date().toISOString().split('T')[0],
            dueDate: '',
            notes: 'Generated via Biller - Professional Invoice Generator',
        };
    });

    const [loading, setLoading] = useState(false);

    // Save seller details to local storage whenever they change
    useEffect(() => {
        localStorage.setItem('sellerDetails', JSON.stringify(formData.sellerDetails));
    }, [formData.sellerDetails]);

    useEffect(() => {
        if (initialData) {
            setFormData(prev => ({
                ...prev,
                ...initialData,
                items: initialData.items && initialData.items.length > 0 ? initialData.items : prev.items,
                buyerDetails: { ...prev.buyerDetails, ...initialData.buyerDetails },
            }));
            toast.success('Quick Bill data applied!');
        }
    }, [initialData]);

    const handleItemChange = (index, newItem) => {
        const newItems = [...formData.items];
        newItems[index] = newItem;
        setFormData({ ...formData, items: newItems });
    };

    const addItem = () => {
        setFormData({
            ...formData,
            items: [...formData.items, { description: '', quantity: 1, price: 0 }],
        });
    };

    const removeItem = (index) => {
        if (formData.items.length === 1) {
            toast.error("You must have at least one item.");
            return;
        }
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const calculateTotals = () => {
        const subtotal = formData.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
        const tax = (subtotal * formData.taxRate) / 100;
        const discount = (subtotal * formData.discountRate) / 100;
        const total = subtotal + tax - discount;
        const balanceDue = total + formData.oldBalance - formData.cashReceived;
        return { subtotal, tax, discount, total, balanceDue };
    };

    const totals = calculateTotals();

    const validateForm = () => {
        if (!formData.sellerDetails.name.trim()) return "Seller Name is required.";
        if (!formData.buyerDetails.name.trim()) return "Buyer Name is required.";
        if (formData.items.length === 0) return "At least one item is required.";

        for (let i = 0; i < formData.items.length; i++) {
            const item = formData.items[i];
            if (!item.description.trim()) return `Item ${i + 1} description is required.`;
            if (item.quantity <= 0) return `Item ${i + 1} quantity must be greater than 0.`;
            if (item.price < 0) return `Item ${i + 1} price cannot be negative.`;
        }
        return null;
    };

    const handleSubmit = async () => {
        const error = validateForm();
        if (error) {
            toast.error(error);
            return;
        }

        setLoading(true);
        const loadingToast = toast.loading('Generating Invoice...');
        try {
            const url = await generateInvoice(formData);
            toast.dismiss(loadingToast);
            toast.success('Invoice generated successfully!');
            window.open(url, '_blank');
        } catch (error) {
            toast.dismiss(loadingToast);
            toast.error("Failed to generate invoice: " + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-8 rounded-lg shadow-md">
            {/* Invoice Meta Data */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 border-b pb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                    <input
                        type="text"
                        value={formData.invoiceNumber}
                        onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                        placeholder="INV-001"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                    <input
                        type="date"
                        value={formData.invoiceDate}
                        onChange={(e) => setFormData({ ...formData, invoiceDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>
            </div>

            {/* Seller & Buyer Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Seller Details</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.sellerDetails.name}
                            onChange={(e) => setFormData({ ...formData, sellerDetails: { ...formData.sellerDetails, name: e.target.value } })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <textarea
                            placeholder="Address"
                            value={formData.sellerDetails.address}
                            onChange={(e) => setFormData({ ...formData, sellerDetails: { ...formData.sellerDetails, address: e.target.value } })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.sellerDetails.email}
                            onChange={(e) => setFormData({ ...formData, sellerDetails: { ...formData.sellerDetails, email: e.target.value } })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Buyer Details</h3>
                    <div className="space-y-3">
                        <input
                            type="text"
                            placeholder="Name"
                            value={formData.buyerDetails.name}
                            onChange={(e) => setFormData({ ...formData, buyerDetails: { ...formData.buyerDetails, name: e.target.value } })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <textarea
                            placeholder="Address"
                            value={formData.buyerDetails.address}
                            onChange={(e) => setFormData({ ...formData, buyerDetails: { ...formData.buyerDetails, address: e.target.value } })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={formData.buyerDetails.email}
                            onChange={(e) => setFormData({ ...formData, buyerDetails: { ...formData.buyerDetails, email: e.target.value } })}
                            className="w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                </div>
            </div>

            {/* Items */}
            <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 text-gray-700 border-b pb-2">Items</h3>
                {formData.items.map((item, index) => (
                    <ItemRow
                        key={index}
                        index={index}
                        item={item}
                        onChange={handleItemChange}
                        onRemove={removeItem}
                    />
                ))}
                <button
                    onClick={addItem}
                    className="mt-2 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                >
                    <span className="text-xl">+</span> Add Item
                </button>
            </div>

            {/* Totals & Settings */}
            <div className="flex flex-col md:flex-row justify-end gap-8 border-t pt-6">
                <div className="w-full md:w-64 space-y-3">
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Tax Rate (%)</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.taxRate}
                            onChange={(e) => setFormData({ ...formData, taxRate: parseFloat(e.target.value) || 0 })}
                            className="w-24 p-1 border border-gray-300 rounded-md text-right"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Discount (%)</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.discountRate}
                            onChange={(e) => setFormData({ ...formData, discountRate: parseFloat(e.target.value) || 0 })}
                            className="w-24 p-1 border border-gray-300 rounded-md text-right"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Old Balance</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.oldBalance}
                            onChange={(e) => setFormData({ ...formData, oldBalance: parseFloat(e.target.value) || 0 })}
                            className="w-24 p-1 border border-gray-300 rounded-md text-right"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Cash Received</label>
                        <input
                            type="number"
                            min="0"
                            value={formData.cashReceived}
                            onChange={(e) => setFormData({ ...formData, cashReceived: parseFloat(e.target.value) || 0 })}
                            className="w-24 p-1 border border-gray-300 rounded-md text-right"
                        />
                    </div>
                    <div className="flex justify-between items-center">
                        <label className="text-sm font-medium text-gray-700">Currency</label>
                        <select
                            value={formData.currency}
                            onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                            className="w-24 p-1 border border-gray-300 rounded-md text-right"
                        >
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                            <option value="INR">INR</option>
                        </select>
                    </div>
                </div>
                <div className="w-full md:w-72 bg-gray-50 p-4 rounded-md space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal:</span>
                        <span>{formData.currency} {totals.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Tax:</span>
                        <span>{formData.currency} {totals.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Discount:</span>
                        <span>-{formData.currency} {totals.discount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-800 font-semibold border-t border-gray-200 pt-2 mt-2">
                        <span>Total:</span>
                        <span>{formData.currency} {totals.total.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Old Balance:</span>
                        <span>{formData.currency} {totals.total > 0 ? formData.oldBalance.toFixed(2) : '0.00'}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                        <span>Cash Received:</span>
                        <span>-{formData.currency} {formData.cashReceived.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-xl font-bold text-blue-800 border-t-2 border-blue-200 pt-2 mt-2">
                        <span>Balance Due:</span>
                        <span>{formData.currency} {totals.balanceDue.toFixed(2)}</span>
                    </div>
                </div>
            </div>

            {/* Notes */}
            <div className="mt-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-md h-24"
                    placeholder="Additional notes, payment terms, or thank you message..."
                />
            </div>

            <div className="mt-8 flex justify-end">
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className={`px-8 py-3 bg-green-600 text-white rounded-md font-bold text-lg hover:bg-green-700 transition-colors shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    {loading ? 'Generating...' : 'Generate Invoice'}
                </button>
            </div>
        </div>
    );
};

export default InvoiceForm;
