export const parseQuickBill = (text) => {
    // Normalize text
    const lowerText = text.toLowerCase();

    // Regex patterns
    // "10 box" or "10 items"
    const quantityRegex = /(\d+)\s*([a-zA-Z]+)?/;
    // "at 3000" or "for 3000" or "@ 3000"
    const priceRegex = /(?:at|for|@)\s*(\d+(?:\.\d{1,2})?)/;
    // "to Salim" or "for Salim" (if not price)
    const buyerRegex = /(?:to|buyer)\s+([a-zA-Z0-9\s]+)/;

    // Attempt to extract
    const quantityMatch = lowerText.match(quantityRegex);
    const priceMatch = lowerText.match(priceRegex);
    const buyerMatch = lowerText.match(buyerRegex);

    const result = {
        items: [],
        buyerDetails: {},
    };

    if (quantityMatch) {
        const quantity = parseInt(quantityMatch[1], 10);
        const unit = quantityMatch[2] || 'items';

        // Try to guess description from the text if possible, or just use generic
        // For "sale of 10 box", description could be "box"
        let description = unit;

        // If text contains "sale of ... at", try to extract what's between
        const saleOfRegex = /sale of\s+(.*?)\s+(?:at|for|to)/;
        const saleOfMatch = lowerText.match(saleOfRegex);
        if (saleOfMatch) {
            description = saleOfMatch[1];
        } else {
            // Fallback: use the unit as description if it exists and isn't just "items"
            if (unit && unit !== 'items') description = unit;
            else description = "Item";
        }

        const price = priceMatch ? parseFloat(priceMatch[1]) : 0;

        result.items.push({
            description: description,
            quantity: quantity,
            price: price,
        });
    }

    if (buyerMatch) {
        result.buyerDetails.name = buyerMatch[1].trim();
    }

    return result;
};
