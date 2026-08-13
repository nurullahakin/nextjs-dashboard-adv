import bcrypt from "bcrypt";

// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: '410544b2-4001-4271-9855-fec4b6a6442a',
    name: 'User',
    email: 'user@nextmail.com',
    password: '123456',
  },
];

const customers = [
  {
    id: 'd6e15727-9fe1-4961-8c5b-ea44a9bd81aa',
    name: 'Evil Rabbit',
    email: 'evil@rabbit.com',
    image_url: '/customers/evil-rabbit.png',
  },
  {
    id: '3958dc9e-712f-4377-85e9-fec4b6a6442a',
    name: 'Delba de Oliveira',
    email: 'delba@oliveira.com',
    image_url: '/customers/delba-de-oliveira.png',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442a',
    name: 'Lee Robinson',
    email: 'lee@robinson.com',
    image_url: '/customers/lee-robinson.png',
  },
  {
    id: '76d65c26-f784-44a2-ac19-586678f7c2f2',
    name: 'Michael Novotny',
    email: 'michael@novotny.com',
    image_url: '/customers/michael-novotny.png',
  },
  {
    id: 'CC27C14A-0ACF-4F4A-A6C9-D45682C144B9',
    name: 'Amy Burns',
    email: 'amy@burns.com',
    image_url: '/customers/amy-burns.png',
  },
  {
    id: '13D07535-C59E-4157-A011-F8D2EF4E0CBB',
    name: 'Balazs Orban',
    email: 'balazs@orban.com',
    image_url: '/customers/balazs-orban.png',
  },
];

const invoices = [
  {
    id: '3958dc9e-787f-4377-85e9-fec4b6a6442a',
    customer_id: customers[0].id,
    amount: 15795,
    status: 'pending',
    date: '2022-12-06',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442b',
    customer_id: customers[1].id,
    amount: 20348,
    status: 'pending',
    date: '2022-11-14',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442c',
    customer_id: customers[4].id,
    amount: 3040,
    status: 'paid',
    date: '2022-10-29',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442d',
    customer_id: customers[3].id,
    amount: 44800,
    status: 'paid',
    date: '2023-09-10',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442e',
    customer_id: customers[5].id,
    amount: 34577,
    status: 'pending',
    date: '2023-08-05',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a6442f',
    customer_id: customers[2].id,
    amount: 54246,
    status: 'pending',
    date: '2023-07-16',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a64430',
    customer_id: customers[0].id,
    amount: 666,
    status: 'pending',
    date: '2023-06-27',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a64431',
    customer_id: customers[3].id,
    amount: 32545,
    status: 'paid',
    date: '2023-06-09',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a64432',
    customer_id: customers[4].id,
    amount: 1250,
    status: 'paid',
    date: '2023-06-17',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a64433',
    customer_id: customers[5].id,
    amount: 8546,
    status: 'paid',
    date: '2023-06-07',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a64434',
    customer_id: customers[1].id,
    amount: 500,
    status: 'paid',
    date: '2023-08-19',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a64435',
    customer_id: customers[5].id,
    amount: 8945,
    status: 'paid',
    date: '2023-06-03',
  },
  {
    id: '3958dc9e-742f-4377-85e9-fec4b6a64436',
    customer_id: customers[2].id,
    amount: 1000,
    status: 'paid',
    date: '2022-06-05',
  },
];

const revenue = [
  { month: 'Jan', revenue: 2000 },
  { month: 'Feb', revenue: 1800 },
  { month: 'Mar', revenue: 2200 },
  { month: 'Apr', revenue: 2500 },
  { month: 'May', revenue: 2300 },
  { month: 'Jun', revenue: 3200 },
  { month: 'Jul', revenue: 3500 },
  { month: 'Aug', revenue: 3700 },
  { month: 'Sep', revenue: 2500 },
  { month: 'Oct', revenue: 2800 },
  { month: 'Nov', revenue: 3000 },
  { month: 'Dec', revenue: 4800 },
];

const latestInvoices = invoices
  .map((invoice) => {
    const customer = customers.find((c) => c.id === invoice.customer_id);
    return {
      id: invoice.id,
      name: customer?.name || '',
      email: customer?.email || '',
      image_url: customer?.image_url || '',
      amount: (invoice.amount / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      date: invoice.date,
    };
  })
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  .slice(0, 5)
  .map(({ date, ...rest }) => rest);

const cardData = {
  numberOfCustomers: customers.length,
  numberOfInvoices: invoices.length,
  totalPaidInvoices: (
    invoices
      .filter((invoice) => invoice.status === 'paid')
      .reduce((sum, invoice) => sum + invoice.amount, 0) / 100
  ).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }),
  totalPendingInvoices: (
    invoices
      .filter((invoice) => invoice.status === 'pending')
      .reduce((sum, invoice) => sum + invoice.amount, 0) / 100
  ).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  }),
};

export async function fetchRevenue() {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return revenue;
}

export async function fetchLatestInvoices() {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return latestInvoices;
}

export async function fetchCardData() {
  await new Promise((resolve) => setTimeout(resolve, 10));
  return cardData;
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number,
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  // Join invoices with customer data
  const invoicesWithCustomers = invoices.map((invoice) => {
    const customer = customers.find((c) => c.id === invoice.customer_id);
    return {
      id: invoice.id,
      amount: invoice.amount,
      date: invoice.date,
      status: invoice.status,
      name: customer?.name || '',
      email: customer?.email || '',
      image_url: customer?.image_url || '',
    };
  });

  // Filter based on query (case-insensitive search)
  const filtered = invoicesWithCustomers.filter((invoice) => {
    const lowerQuery = query.toLowerCase();
    return (
      invoice.name.toLowerCase().includes(lowerQuery) ||
      invoice.email.toLowerCase().includes(lowerQuery) ||
      invoice.amount.toString().includes(lowerQuery) ||
      invoice.date.toLowerCase().includes(lowerQuery) ||
      invoice.status.toLowerCase().includes(lowerQuery)
    );
  });

  // Sort by date descending
  const sorted = filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Apply pagination
  return sorted.slice(offset, offset + ITEMS_PER_PAGE);
}

export async function fetchInvoicesPages(query: string) {
  // Join invoices with customer data
  const invoicesWithCustomers = invoices.map((invoice) => {
    const customer = customers.find((c) => c.id === invoice.customer_id);
    return {
      name: customer?.name || '',
      email: customer?.email || '',
      amount: invoice.amount,
      date: invoice.date,
      status: invoice.status,
    };
  });

  // Filter based on query (case-insensitive search)
  const filtered = invoicesWithCustomers.filter((invoice) => {
    const lowerQuery = query.toLowerCase();
    return (
      invoice.name.toLowerCase().includes(lowerQuery) ||
      invoice.email.toLowerCase().includes(lowerQuery) ||
      invoice.amount.toString().includes(lowerQuery) ||
      invoice.date.toLowerCase().includes(lowerQuery) ||
      invoice.status.toLowerCase().includes(lowerQuery)
    );
  });

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  return totalPages;
}

export async function fetchCustomers() {
  return customers
    .map((customer) => ({
      id: customer.id,
      name: customer.name,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchFilteredCustomers(query: string) {
  const lowerQuery = query.toLowerCase();
  
  const customersWithInvoices = customers.map((customer) => {
    // Get all invoices for this customer
    const customerInvoices = invoices.filter(
      (invoice) => invoice.customer_id === customer.id
    );
    
    // Calculate totals
    const total_invoices = customerInvoices.length;
    const total_pending = customerInvoices
      .filter((inv) => inv.status === 'pending')
      .reduce((sum, inv) => sum + inv.amount, 0);
    const total_paid = customerInvoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.amount, 0);
    
    return {
      id: customer.id,
      name: customer.name,
      email: customer.email,
      image_url: customer.image_url,
      total_invoices,
      total_pending: (total_pending / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      total_paid: (total_paid / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
    };
  });
  
  // Filter by query
  const filtered = customersWithInvoices.filter((customer) => {
    return (
      customer.name.toLowerCase().includes(lowerQuery) ||
      customer.email.toLowerCase().includes(lowerQuery)
    );
  });
  
  // Sort by name
  return filtered.sort((a, b) => a.name.localeCompare(b.name));
}

export async function fetchInvoiceById(id: string) {
  const invoice = invoices.find((inv) => inv.id === id);
  if (invoice) {
    return {
      id: invoice.id,
      customer_id: invoice.customer_id,
      amount: invoice.amount / 100, // Convert amount from cents to dollars
      status: invoice.status,
    };
  }
  return undefined;
}

export async function insertInvoice(data: {
  customerId: string;
  amount: number;
  status: 'pending' | 'paid';
  date: string;
}) {
  const newInvoice = {
    id: crypto.randomUUID(),
    customer_id: data.customerId,
    amount: data.amount,
    status: data.status,
    date: data.date,
  };
  invoices.push(newInvoice);
  return newInvoice;
}

export async function updateInvoice(
  id: string,
  data: {
    customerId: string;
    amount: number;
    status: 'pending' | 'paid';
  }
) {
  const index = invoices.findIndex((invoice) => invoice.id === id);
  if (index !== -1) {
    invoices[index] = {
      ...invoices[index],
      customer_id: data.customerId,
      amount: data.amount,
      status: data.status,
    };
    return invoices[index];
  }
  return undefined;
}

export async function deleteInvoice(id: string) {
  const index = invoices.findIndex((invoice) => invoice.id === id);
  if (index !== -1) {
    const deleted = invoices.splice(index, 1);
    return deleted[0];
  }
  return undefined;
}

export async function getUserByEmail(email: string) {
  let user = users.find((u) => u.email === email);
  if (user) {
    user = { ...user };
    user.password = await bcrypt.hash(user.password, 10);
  }
  return user;
}

export { users, customers, invoices, revenue, latestInvoices, cardData };
