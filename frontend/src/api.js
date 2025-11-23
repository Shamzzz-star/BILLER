const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const generateInvoice = async (invoiceData) => {
    try {
        const response = await fetch(`${API_URL}/generate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invoiceData),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(JSON.stringify(errorData));
        }

        const blob = await response.blob();
        return window.URL.createObjectURL(blob);
    } catch (error) {
        console.error("API Error:", error);
        throw error;
    }
};
