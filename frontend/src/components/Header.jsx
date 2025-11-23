import React from 'react';

const Header = () => {
    return (
        <header className="bg-white shadow-sm p-4 mb-6">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Biller</h1>
                <span className="text-sm text-gray-500">Professional Invoice Generator</span>
            </div>
        </header>
    );
};

export default Header;
