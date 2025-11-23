const z = require('zod');

const itemSchema = z.object({
  description: z.string().min(1, "Description is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price must be non-negative"),
});

const invoiceSchema = z.object({
  sellerDetails: z.object({
    name: z.string().min(1, "Seller name is required"),
    address: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
  }),
  buyerDetails: z.object({
    name: z.string().min(1, "Buyer name is required"),
    address: z.string().optional(),
    email: z.string().email().optional().or(z.literal('')),
  }),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  taxRate: z.number().min(0).default(0),
  discountRate: z.number().min(0).default(0),
  currency: z.string().default('USD'),
  oldBalance: z.number().default(0),
  cashReceived: z.number().default(0),
  invoiceNumber: z.string().optional(),
  invoiceDate: z.string().optional(),
  dueDate: z.string().optional(),
  notes: z.string().optional(),
});

module.exports = { invoiceSchema };
