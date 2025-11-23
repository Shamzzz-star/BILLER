import React, { useState } from 'react';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import QuickBill from './components/QuickBill';
import InvoiceForm from './components/InvoiceForm';

function App() {
  const [quickData, setQuickData] = useState(null);

  const handleQuickParse = (data) => {
    setQuickData(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 pb-12">
      <Toaster position="top-right" />
      <Header />
      <main className="container mx-auto px-4 max-w-5xl">
        <QuickBill onParse={handleQuickParse} />
        <InvoiceForm initialData={quickData} />
      </main>
    </div>
  );
}

export default App;
