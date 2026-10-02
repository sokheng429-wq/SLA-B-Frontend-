/**
 * B'Groceries SLA Kanban Board - Multi-Department Mock Dataset
 * Supporting: Marketing, IT, Purchasing, Store Ops, Finance, HR
 * Easy to swap with Spring Boot REST API (/api/tickets)
 */

export const INITIAL_ASSIGNEES = [
  { id: 'SM', name: 'Sokha Meas', role: 'Lead Designer', avatar: 'SM', color: '#77BC1F', dept: 'mkt' },
  { id: 'BC', name: 'Bopha Chan', role: 'Graphic Designer', avatar: 'BC', color: '#38BDF8', dept: 'mkt' },
  { id: 'JS', name: 'John Smith', role: 'Multimedia & Video', avatar: 'JS', color: '#A855F7', dept: 'mkt' },
  { id: 'SL', name: 'Sreyleak Ly', role: 'Packaging Designer', avatar: 'SL', color: '#FF9900', dept: 'mkt' },
  { id: 'TD', name: 'Thida Dara', role: 'IT Support Engineer', avatar: 'TD', color: '#00B8D9', dept: 'it' },
  { id: 'KV', name: 'Kosal Vuthy', role: 'Purchasing Officer', avatar: 'KV', color: '#FFAB00', dept: 'purchasing' },
  { id: 'SY', name: 'Sophea Yin', role: 'Store Ops Manager', avatar: 'SY', color: '#36B37E', dept: 'store' },
  { id: 'CL', name: 'Chanthy Lim', role: 'Senior Accountant', avatar: 'CL', color: '#6554C0', dept: 'finance' },
  { id: 'PR', name: 'Phalla Rith', role: 'HR Specialist', avatar: 'PR', color: '#FF5630', dept: 'hr' }
];

export const DEPARTMENTS = [
  { 
    id: 'mkt', 
    code: 'MKT', 
    name: 'Marketing & Brand', 
    dotColor: '#FF9900',
    description: 'Creative studio, promotional posters, video commercial, and brand campaign collateral',
    targetSla: '98.5%'
  },
  { 
    id: 'it', 
    code: 'IT', 
    name: 'IT Service Desk', 
    dotColor: '#00B8D9',
    description: 'Hardware provisioning, network connectivity, store POS troubleshooting, and system accounts',
    targetSla: '99.0%'
  },
  { 
    id: 'purchasing', 
    code: 'PUR', 
    name: 'Purchasing & Sourcing', 
    dotColor: '#FFAB00',
    description: 'Direct farm contracts, FMCG import procurement, supplier price changes, and margin audits',
    targetSla: '96.0%'
  },
  { 
    id: 'store', 
    code: 'OPS', 
    name: 'Store Operations', 
    dotColor: '#36B37E',
    description: 'Hyperstore floor maintenance, refrigeration units, checkout scanners, and dispatch facilities',
    targetSla: '97.5%'
  },
  { 
    id: 'finance', 
    code: 'FIN', 
    name: 'Finance & Accounting', 
    dotColor: '#6554C0',
    description: 'Vendor payment cycles, staff expenses, store cash drops, and financial compliance audits',
    targetSla: '98.0%'
  },
  { 
    id: 'hr', 
    code: 'HR', 
    name: 'Human Resources', 
    dotColor: '#FF5630',
    description: 'Branch recruitments, uniform distribution, staff biometric badges, and training programs',
    targetSla: '95.0%'
  }
];

export const COLUMNS = [
  { id: 'todo', name: 'To do', dotColor: '#8fa0b4', status: 'TODO' },
  { id: 'in_progress', name: 'In progress', dotColor: '#FF9900', status: 'IN_PROGRESS' },
  { id: 'in_review', name: 'In review', dotColor: '#38BDF8', status: 'IN_REVIEW' },
  { id: 'done', name: 'Done', dotColor: '#77BC1F', status: 'DONE' }
];

export const INITIAL_TICKETS = [
  // ----------------- Marketing & Brand Tickets (Exact Mock Data) -----------------
  {
    id: 'MKT-2026-0002',
    deptId: 'mkt',
    columnId: 'todo',
    title: 'Weekend Organic Vegetables & Fresh Fruit Social Poster',
    description: 'Weekly promotional price poster for Facebook, Telegram channel, and mobile app banner featuring fresh farm direct organics.',
    category: 'Social',
    priority: 'P2',
    is_rush: false,
    progress: 0,
    assigneeId: 'BC',
    dueDate: 'Oct 6',
    doneDate: null,
    department: 'Marketing & Brand',
    createdAt: '2026-09-30',
    tatDays: 2,
    commentsCount: 2
  },
  {
    id: 'MKT-2026-0003',
    deptId: 'mkt',
    columnId: 'in_progress',
    title: 'Korean Food Fair Cooking Demo Video Reel',
    description: '30-second TikTok & IG Reel featuring chef demo of imported Samyang & Kimchi items with dynamic transitions.',
    category: 'Video',
    priority: 'P2',
    is_rush: false,
    progress: 55,
    assigneeId: 'JS',
    dueDate: 'Oct 4',
    doneDate: null,
    department: 'Marketing & Brand',
    createdAt: '2026-09-29',
    tatDays: 4,
    commentsCount: 5
  },
  {
    id: 'MKT-2026-0005',
    deptId: 'mkt',
    columnId: 'in_progress',
    title: 'Private Label Jasmine Rice Packaging & Shelf Talker',
    description: 'B\'Groceries Premium Jasmine Rice 5kg bag dieline packaging adaptation and eye-level shelf talker display.',
    category: 'Packaging',
    priority: 'P3',
    is_rush: false,
    progress: 30,
    assigneeId: 'SL',
    dueDate: 'Oct 9',
    doneDate: null,
    department: 'Marketing & Brand',
    createdAt: '2026-09-28',
    tatDays: 5,
    commentsCount: 3
  },
  {
    id: 'MKT-2026-0004',
    deptId: 'mkt',
    columnId: 'in_review',
    title: 'B-Groceries Mobile App $5 First Order Campaign Pack',
    description: 'High priority 360 campaign: In-app splash modal, social carousel ads, store QR entrance standees.',
    category: 'Campaign',
    priority: 'P1',
    is_rush: true,
    progress: 85,
    assigneeId: 'SM',
    dueDate: 'Oct 3',
    doneDate: null,
    department: 'Marketing & Brand',
    createdAt: '2026-09-27',
    tatDays: 3,
    commentsCount: 7
  },
  {
    id: 'MKT-2026-0001',
    deptId: 'mkt',
    columnId: 'done',
    title: 'Water Festival Mega Sale POSM & Entrance Banner',
    description: 'Entrance archway banner, aisle hanging wobblers, and checkout counter standee with festive dragon boat motif.',
    category: 'POSM',
    priority: 'P1',
    is_rush: true,
    progress: 100,
    assigneeId: 'SM',
    dueDate: 'Sep 28',
    doneDate: 'Sep 28',
    department: 'Marketing & Brand',
    createdAt: '2026-09-22',
    tatDays: 3,
    commentsCount: 4
  },
  {
    id: 'MKT-2026-0006',
    deptId: 'mkt',
    columnId: 'done',
    title: 'Fresh Seafood Friday Clearance Flash Sale Poster',
    description: 'Flash sale announcement poster for morning seafood delivery catch, discounted 30% after 4 PM.',
    category: 'Social',
    priority: 'P1',
    is_rush: true,
    progress: 100,
    assigneeId: 'JS',
    dueDate: 'Sep 30',
    doneDate: 'Sep 30',
    department: 'Marketing & Brand',
    createdAt: '2026-09-25',
    tatDays: 2,
    commentsCount: 3
  },

  // ----------------- IT Service Desk Tickets -----------------
  {
    id: 'IT-2026-0101',
    deptId: 'it',
    columnId: 'todo',
    title: 'Store #3 Checkout POS Terminal #4 Barcode Scanner Glitch',
    description: 'Hardware laser scanner freezes intermittently during peak evening rush. Replacement Honeywell unit required.',
    category: 'Hardware',
    priority: 'P1',
    is_rush: true,
    progress: 0,
    assigneeId: 'TD',
    dueDate: 'Oct 5',
    doneDate: null,
    department: 'IT Service Desk',
    createdAt: '2026-10-01',
    tatDays: 1,
    commentsCount: 3
  },
  {
    id: 'IT-2026-0102',
    deptId: 'it',
    columnId: 'in_progress',
    title: 'HQ Fiber WAN Failover Setup with Smart Telecom 4G Backup',
    description: 'Configure automated dual-WAN load balance on Mikrotik router to prevent POS disconnection if fiber drops.',
    category: 'Network',
    priority: 'P2',
    is_rush: false,
    progress: 60,
    assigneeId: 'TD',
    dueDate: 'Oct 7',
    doneDate: null,
    department: 'IT Service Desk',
    createdAt: '2026-09-29',
    tatDays: 3,
    commentsCount: 4
  },
  {
    id: 'IT-2026-0103',
    deptId: 'it',
    columnId: 'done',
    title: 'Spring Boot Backend Security Patch & PostgreSQL Index Optimization',
    description: 'Deployed JWT token refresh fix and added B-Tree indexes on tickets table to speed up dashboard queries.',
    category: 'Software',
    priority: 'P1',
    is_rush: true,
    progress: 100,
    assigneeId: 'TD',
    dueDate: 'Sep 30',
    doneDate: 'Sep 30',
    department: 'IT Service Desk',
    createdAt: '2026-09-27',
    tatDays: 2,
    commentsCount: 6
  },

  // ----------------- Purchasing & Sourcing Tickets -----------------
  {
    id: 'PUR-2026-0201',
    deptId: 'purchasing',
    columnId: 'todo',
    title: 'Kampot Pepper & Battambang Orange Supplier Contract Renewal',
    description: 'Review Q4 farm-gate bulk pricing with agricultural cooperative. Target 8% margin improvement.',
    category: 'Produce',
    priority: 'P2',
    is_rush: false,
    progress: 0,
    assigneeId: 'KV',
    dueDate: 'Oct 11',
    doneDate: null,
    department: 'Purchasing & Sourcing',
    createdAt: '2026-10-01',
    tatDays: 5,
    commentsCount: 1
  },
  {
    id: 'PUR-2026-0202',
    deptId: 'purchasing',
    columnId: 'in_progress',
    title: 'Import Clearance: Korean Ramen & Japanese Dairy Cargo #402',
    description: 'Port of Sihanoukville customs declaration and cold-chain truck dispatch to Phnom Penh Central DC.',
    category: 'Import',
    priority: 'P1',
    is_rush: true,
    progress: 75,
    assigneeId: 'KV',
    dueDate: 'Oct 4',
    doneDate: null,
    department: 'Purchasing & Sourcing',
    createdAt: '2026-09-28',
    tatDays: 3,
    commentsCount: 8
  },

  // ----------------- Store Operations Tickets -----------------
  {
    id: 'OPS-2026-0301',
    deptId: 'store',
    columnId: 'todo',
    title: 'Chbar Ampov Branch Cold Room Compressor Inspection',
    description: 'Routine maintenance and refrigerant pressure gauge top-up before weekend bulk seafood storage.',
    category: 'Facility',
    priority: 'P2',
    is_rush: false,
    progress: 0,
    assigneeId: 'SY',
    dueDate: 'Oct 8',
    doneDate: null,
    department: 'Store Operations',
    createdAt: '2026-10-01',
    tatDays: 4,
    commentsCount: 2
  },
  {
    id: 'OPS-2026-0302',
    deptId: 'store',
    columnId: 'in_progress',
    title: 'Toul Kork Hyperstore Express Delivery Motorbike Fleet Audit',
    description: 'GPS tracker validation and thermal delivery bag hygiene inspection for 25 courier motorcycles.',
    category: 'Fleet',
    priority: 'P3',
    is_rush: false,
    progress: 45,
    assigneeId: 'SY',
    dueDate: 'Oct 6',
    doneDate: null,
    department: 'Store Operations',
    createdAt: '2026-09-29',
    tatDays: 3,
    commentsCount: 3
  },

  // ----------------- Finance & Accounting Tickets -----------------
  {
    id: 'FIN-2026-0401',
    deptId: 'finance',
    columnId: 'todo',
    title: 'September 2026 Vendor AP Reconciliation & Bank Transfer Batch',
    description: 'Consolidate 142 supplier tax invoices, verify delivery receipts against ERP, and prepare Wing Bank batch.',
    category: 'Payables',
    priority: 'P1',
    is_rush: false,
    progress: 0,
    assigneeId: 'CL',
    dueDate: 'Oct 5',
    doneDate: null,
    department: 'Finance & Accounting',
    createdAt: '2026-10-01',
    tatDays: 3,
    commentsCount: 2
  },
  {
    id: 'FIN-2026-0402',
    deptId: 'finance',
    columnId: 'done',
    title: 'Water Festival Staff Holiday Pay & Overtime Advance Disbursed',
    description: 'Payroll pre-audit for 320 store staff and warehouse personnel completed with General Manager approval.',
    category: 'Payroll',
    priority: 'P1',
    is_rush: true,
    progress: 100,
    assigneeId: 'CL',
    dueDate: 'Sep 29',
    doneDate: 'Sep 29',
    department: 'Finance & Accounting',
    createdAt: '2026-09-26',
    tatDays: 2,
    commentsCount: 5
  },

  // ----------------- Human Resources Tickets -----------------
  {
    id: 'HR-2026-0501',
    deptId: 'hr',
    columnId: 'in_progress',
    title: 'Q4 Customer Service & Cashier Hygiene Training Batch #12',
    description: '15 newly hired grocery pickers and cashiers for Sen Sok hyperstore onboarding and food safety certification.',
    category: 'Training',
    priority: 'P2',
    is_rush: false,
    progress: 50,
    assigneeId: 'PR',
    dueDate: 'Oct 8',
    doneDate: null,
    department: 'Human Resources',
    createdAt: '2026-09-30',
    tatDays: 4,
    commentsCount: 3
  }
];

export const SERVICE_CATALOGS = {
  mkt: [
    { id: 'CAT-POSM', name: 'POSM & Store Banners', icon: 'Layout', tat: '3 Days', priority: 'P2', fee: 'Free' },
    { id: 'CAT-POSTER', name: 'Social Media Promo Poster', icon: 'Image', tat: '2 Days', priority: 'P2', fee: 'Free' },
    { id: 'CAT-VIDEO', name: 'Video Commercial / Reel', icon: 'Film', tat: '5 Days', priority: 'P3', fee: 'Free' },
    { id: 'CAT-CAMP', name: '360° Campaign Launch Pack', icon: 'Zap', tat: '7 Days', priority: 'P1', fee: 'Free' },
    { id: 'CAT-PKG', name: 'Packaging Design Adaptation', icon: 'Box', tat: '5 Days', priority: 'P2', fee: 'Free' }
  ],
  it: [
    { id: 'CAT-POS-FIX', name: 'POS Terminal Glitch Repair', icon: 'Monitor', tat: '4 Hours', priority: 'P1', fee: 'Free' },
    { id: 'CAT-VPN-ACC', name: 'VPN & ERP Remote Access', icon: 'Key', tat: '24 Hours', priority: 'P2', fee: 'Free' },
    { id: 'CAT-HW-NEW', name: 'New Staff Laptop & Badge Provision', icon: 'Laptop', tat: '2 Days', priority: 'P3', fee: 'Free' },
    { id: 'CAT-WIFI-NET', name: 'Store WiFi & Barcode Scanner Sync', icon: 'Wifi', tat: '8 Hours', priority: 'P2', fee: 'Free' }
  ],
  purchasing: [
    { id: 'CAT-PRICE-CHG', name: 'Supplier Promo Price Adjustment', icon: 'Tag', tat: '2 Days', priority: 'P2', fee: 'Free' },
    { id: 'CAT-NEW-SKU', name: 'New Farm Product Onboarding', icon: 'FilePlus', tat: '5 Days', priority: 'P3', fee: 'Free' },
    { id: 'CAT-RUSH-ORDER', name: 'Emergency Stock Out Recovery', icon: 'Truck', tat: '24 Hours', priority: 'P1', fee: 'Free' }
  ],
  store: [
    { id: 'CAT-FRIDGE-REP', name: 'Refrigeration / Chiller Repair', icon: 'Snowflake', tat: '4 Hours', priority: 'P1', fee: 'Free' },
    { id: 'CAT-SHELF-MOD', name: 'Aisle Shelf Reset & Display Planogram', icon: 'Layers', tat: '3 Days', priority: 'P3', fee: 'Free' },
    { id: 'CAT-SCANNER-EX', name: 'Motorcycle Delivery Box Replacement', icon: 'PackageCheck', tat: '1 Day', priority: 'P2', fee: 'Free' }
  ],
  finance: [
    { id: 'CAT-INV-PAY', name: 'Supplier Invoice Payment Expedite', icon: 'CreditCard', tat: '3 Days', priority: 'P1', fee: 'Free' },
    { id: 'CAT-EXP-CLAIM', name: 'Store Petty Cash Reconciliation', icon: 'Receipt', tat: '2 Days', priority: 'P2', fee: 'Free' }
  ],
  hr: [
    { id: 'CAT-BADGE-ID', name: 'Employee Smart Biometric Card', icon: 'UserCheck', tat: '2 Days', priority: 'P3', fee: 'Free' },
    { id: 'CAT-STAFF-UNIF', name: 'Uniform & Safety Boots Provision', icon: 'Shirt', tat: '3 Days', priority: 'P2', fee: 'Free' },
    { id: 'CAT-LEAVE-RUSH', name: 'Medical Leave & Shift Replacement', icon: 'CalendarCheck', tat: '12 Hours', priority: 'P1', fee: 'Free' }
  ]
};
