# Invoice Generator (BILLER)

A modern web application designed to generate and download professional PDF invoices effortlessly. Built with a React frontend and a Node.js/Express backend using Puppeteer for high-quality PDF generation.

## Features

- **Real-time Preview**: See your invoice take shape as you edit details.
- **PDF Generation**: High-fidelity PDF export using Puppeteer.
- **Responsive Design**: Clean and modern UI built with Tailwind CSS.
- **Dynamic Item Management**: Add, remove, and update invoice items easily.
- **Automatic Calculations**: Subtotals, taxes, and totals are calculated automatically.

## Tech Stack

### Frontend
- **React**: UI library for building interactive interfaces.
- **Vite**: Next-generation frontend tooling.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **React Hot Toast**: For toast notifications.

### Backend
- **Node.js**: JavaScript runtime.
- **Express**: Web framework for Node.js.
- **Puppeteer**: Headless browser for generating PDFs.
- **Zod**: Schema validation for API requests.

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher recommended)
- npm (Node Package Manager)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```
   The backend server will start on `http://localhost:5000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173` (or the port shown in your terminal).

## API Documentation

### Generate Invoice PDF

- **Endpoint**: `POST /generate`
- **Description**: Generates a PDF invoice based on the provided data.
- **Request Body**: JSON object containing invoice details (sender, recipient, items, etc.).
- **Response**: A PDF file stream.

## License

This project is open source and available under the [MIT License](LICENSE).
