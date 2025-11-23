const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { invoiceSchema } = require('./schemas');
const { generateInvoiceHTML } = require('./template');
const { generatePDF } = require('./pdfService');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/generate', async (req, res) => {
    try {
        // Validate input
        const validationResult = invoiceSchema.safeParse(req.body);

        if (!validationResult.success) {
            return res.status(400).json({ error: validationResult.error.errors });
        }

        const invoiceData = validationResult.data;

        // Generate HTML
        const html = generateInvoiceHTML(invoiceData);

        // Generate PDF
        const pdfBuffer = await generatePDF(html);

        // Send PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Length': pdfBuffer.length,
        });

        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
