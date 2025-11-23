import React from 'react';

const ItemRow = ({ item, index, onChange, onRemove }) => {
    const handleChange = (field, value) => {
        onChange(index, { ...item, [field]: value });
    };

    return (
        <div className="flex gap-4 mb-4 items-end">
            <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                    type="text"
                    value={item.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="w-24">
                <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleChange('quantity', parseInt(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
                <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={item.price}
                    onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                    className="w-full p-2 border border-gray-300 rounded-md"
                />
            </div>
            <div className="w-32">
                <label className="block text-sm font-medium text-gray-700 mb-1">Total</label>
                <div className="p-2 bg-gray-50 border border-gray-200 rounded-md text-right text-gray-700">
                    {(item.quantity * item.price).toFixed(2)}
                </div>
            </div>
            <button
                onClick={() => onRemove(index)}
                className="p-2 text-red-500 hover:text-red-700"
                title="Remove Item"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    );
};

export default ItemRow;
