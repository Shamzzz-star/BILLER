import React, { useState } from 'react';
import { parseQuickBill } from '../utils/quickBillParser';

const QuickBill = ({ onParse }) => {
    const [input, setInput] = useState('');

    const handleParse = () => {
        if (!input.trim()) return;
        const parsedData = parseQuickBill(input);
        onParse(parsedData);
        setInput('');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Quick Bill</h2>
            <div className="flex gap-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="e.g., sale of 10 box at 3000/box to Salim"
                    className="flex-1 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleParse()}
                />
                <button
                    onClick={handleParse}
                    className="bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition-colors font-medium"
                >
                    Auto-Fill
                </button>
            </div>
        </div>
    );
};

export default QuickBill;
