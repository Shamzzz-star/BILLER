const puppeteer = require('puppeteer');

const generatePDF = async (htmlContent) => {
    let browser;
    try {
        browser = await puppeteer.launch({
            headless: "new",
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
        const pdfBuffer = await page.pdf({ format: 'A4', printBackground: true });
        return pdfBuffer;
    } catch (error) {
        console.error("Error generating PDF:", error);
        throw error;
    } finally {
        if (browser) {
            await browser.close();
        }
    }
};

module.exports = { generatePDF };
