const generateInvoiceHTML = (data) => {
  const {
    sellerDetails,
    buyerDetails,
    items,
    taxRate,
    discountRate,
    currency,
    oldBalance = 0,
    cashReceived = 0,
    invoiceNumber,
    invoiceDate,
    dueDate,
    notes
  } = data;

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.price, 0);
  const taxAmount = (subtotal * taxRate) / 100;
  const discountAmount = (subtotal * discountRate) / 100;
  const total = subtotal + taxAmount - discountAmount;
  const balanceDue = total + oldBalance - cashReceived;

  const formatDate = (dateString) => {
    if (!dateString) return new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <title>Invoice ${invoiceNumber || ''}</title>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
      <style>
        body { 
            font-family: 'Inter', sans-serif; 
            color: #1f2937; 
            margin: 0; 
            padding: 0; 
            background: #f3f4f6; 
            -webkit-print-color-adjust: exact; 
        }
        .invoice-container { 
            max-width: 800px; 
            margin: 40px auto; 
            background: #fff; 
            border-radius: 12px; 
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); 
            overflow: hidden; 
        }
        .header { 
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); 
            color: #fff; 
            padding: 40px; 
            display: flex; 
            justify-content: space-between; 
            align-items: flex-start; 
        }
        .header-content h1 { 
            margin: 0; 
            font-size: 36px; 
            font-weight: 800; 
            letter-spacing: -1px; 
        }
        .header-content p { 
            margin: 5px 0 0; 
            opacity: 0.9; 
            font-size: 14px; 
        }
        .invoice-meta { 
            text-align: right; 
        }
        .invoice-meta div { 
            margin-bottom: 5px; 
            font-size: 14px; 
            opacity: 0.9; 
        }
        .invoice-meta .number { 
            font-size: 18px; 
            font-weight: 700; 
            margin-bottom: 10px; 
            opacity: 1; 
        }
        .content { 
            padding: 40px; 
        }
        .addresses { 
            display: flex; 
            justify-content: space-between; 
            margin-bottom: 50px; 
        }
        .address-box { 
            width: 45%; 
        }
        .address-box h3 { 
            font-size: 12px; 
            text-transform: uppercase; 
            color: #6b7280; 
            margin: 0 0 10px 0; 
            font-weight: 600; 
            letter-spacing: 0.5px; 
        }
        .address-box p { 
            margin: 0; 
            font-size: 15px; 
            line-height: 1.6; 
            color: #374151; 
        }
        .address-box strong { 
            color: #111827; 
            font-weight: 600; 
            display: block; 
            margin-bottom: 4px; 
            font-size: 16px; 
        }
        table { 
            width: 100%; 
            border-collapse: collapse; 
            margin-bottom: 40px; 
        }
        th { 
            text-align: left; 
            padding: 15px; 
            background: #f9fafb; 
            color: #6b7280; 
            font-size: 12px; 
            font-weight: 600; 
            text-transform: uppercase; 
            letter-spacing: 0.5px; 
            border-bottom: 1px solid #e5e7eb; 
        }
        td { 
            padding: 15px; 
            border-bottom: 1px solid #f3f4f6; 
            font-size: 15px; 
            color: #374151; 
        }
        td.amount { 
            text-align: right; 
            font-weight: 500; 
            color: #111827; 
        }
        th.amount { 
            text-align: right; 
        }
        tr:last-child td { 
            border-bottom: none; 
        }
        .summary-section { 
            display: flex; 
            justify-content: flex-end; 
        }
        .totals-box { 
            width: 40%; 
        }
        .row { 
            display: flex; 
            justify-content: space-between; 
            padding: 8px 0; 
            font-size: 15px; 
            color: #4b5563; 
        }
        .row span:last-child { 
            color: #111827; 
            font-weight: 500; 
        }
        .row.divider { 
            border-bottom: 1px solid #e5e7eb; 
            margin-bottom: 8px; 
            padding-bottom: 12px; 
        }
        .row.final { 
            background: #eff6ff; 
            padding: 15px; 
            border-radius: 8px; 
            margin-top: 10px; 
            color: #1e40af; 
            font-weight: 700; 
            font-size: 18px; 
            align-items: center; 
        }
        .notes-section { 
            margin-top: 50px; 
            padding: 20px 40px; 
            border-top: 1px solid #e5e7eb; 
            background: #f9fafb;
            text-align: center;
        }
        .notes-section h4 { 
            margin: 0 0 5px 0; 
            font-size: 12px; 
            color: #6b7280; 
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .notes-section p { 
            margin: 0; 
            font-size: 13px; 
            color: #4b5563; 
            line-height: 1.6; 
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="header-content">
            <h1>INVOICE</h1>
            <p>Thank you for your business</p>
          </div>
          <div class="invoice-meta">
            <div class="number">#${invoiceNumber || 'PENDING'}</div>
            <div>Date: ${formatDate(invoiceDate)}</div>
            ${dueDate ? `<div>Due Date: ${formatDate(dueDate)}</div>` : ''}
          </div>
        </div>

        <div class="content">
          <div class="addresses">
            <div class="address-box">
              <h3>Billed From</h3>
              <strong>${sellerDetails.name}</strong>
              <p>${sellerDetails.address ? sellerDetails.address.replace(/\n/g, '<br>') : ''}</p>
              <p>${sellerDetails.email || ''}</p>
            </div>
            <div class="address-box">
              <h3>Billed To</h3>
              <strong>${buyerDetails.name}</strong>
              <p>${buyerDetails.address ? buyerDetails.address.replace(/\n/g, '<br>') : ''}</p>
              <p>${buyerDetails.email || ''}</p>
            </div>
          </div>

          <table cellpadding="0" cellspacing="0">
            <thead>
              <tr>
                <th width="60%">Item Description</th>
                <th width="15%" class="amount">Price</th>
                <th width="10%" class="amount">Qty</th>
                <th width="15%" class="amount">Total</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td class="amount">${currency} ${item.price.toFixed(2)}</td>
                  <td class="amount">${item.quantity}</td>
                  <td class="amount">${currency} ${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="summary-section">
            <div class="totals-box">
              <div class="row">
                <span>Subtotal</span>
                <span>${currency} ${subtotal.toFixed(2)}</span>
              </div>
              <div class="row">
                <span>Tax (${taxRate}%)</span>
                <span>${currency} ${taxAmount.toFixed(2)}</span>
              </div>
              <div class="row divider">
                <span>Discount (${discountRate}%)</span>
                <span>-${currency} ${discountAmount.toFixed(2)}</span>
              </div>
              <div class="row" style="font-weight: 600; color: #111827; margin-bottom: 10px;">
                <span>Total</span>
                <span>${currency} ${total.toFixed(2)}</span>
              </div>
              
              ${(oldBalance > 0 || cashReceived > 0) ? `
                <div class="row">
                  <span>Old Balance</span>
                  <span>${currency} ${oldBalance.toFixed(2)}</span>
                </div>
                <div class="row divider">
                  <span>Cash Received</span>
                  <span>-${currency} ${cashReceived.toFixed(2)}</span>
                </div>
              ` : ''}
              
              <div class="row final">
                <span>Balance Due</span>
                <span>${currency} ${balanceDue.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        ${notes ? `
          <div class="notes-section">
            <p>${notes.replace(/\n/g, '<br>')}</p>
          </div>
        ` : ''}
      </div>
    </body>
    </html>
  `;
};

module.exports = { generateInvoiceHTML };
