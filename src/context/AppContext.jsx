import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';
import { authApi } from '../API/api';

const AppContext = createContext();

// ---------- PostgreSQL departments ----------
export const DEPARTMENTS = [
  { id: 1, code: 'COM', name_en: 'Commercial & Purchasing', name_km: 'ពាណិជ្ជកម្ម និងលទ្ធកម្ម' },
  { id: 2, code: 'OPS', name_en: 'Store Operations', name_km: 'ប្រតិបត្តិការសាខាហាង' },
  { id: 3, code: 'ECOM', name_en: 'E-Commerce & Digital', name_km: 'ពាណិជ្ជកម្មអេឡិចត្រូនិច' },
  { id: 4, code: 'FIN', name_en: 'Finance & Accounting', name_km: 'ហិរញ្ញវត្ថុ និងគណនេយ្យ' },
  { id: 5, code: 'MKT', name_en: 'Marketing & Brand', name_km: 'ទីផ្សារ និងម៉ាកសញ្ញា' },
];

// ---------- PostgreSQL catalog_items ----------
export const CATALOG_ITEMS = [
  { 
    id: 1, 
    code: 'CAT-POSM', 
    name_en: 'POSM & Store Banners', 
    name_km: 'បដាផ្សព្វផ្សាយ POSM និងស្ទែនឌី', 
    default_priority: 'P2',
    tat_business_days: 3, 
    response_hours: 4,
    default_assignee_team: 'Creative Studio'
  },
  { 
    id: 2, 
    code: 'CAT-POSTER', 
    name_en: 'Social Media Promo Poster', 
    name_km: 'រូបភាពផុសលើបណ្តាញសង្គម', 
    default_priority: 'P2',
    tat_business_days: 2, 
    response_hours: 2,
    default_assignee_team: 'Digital Media'
  },
  { 
    id: 3, 
    code: 'CAT-VIDEO', 
    name_en: 'Video Commercial / Reel', 
    name_km: 'វីដេអូពាណិជ្ជកម្ម និង Reel', 
    default_priority: 'P3',
    tat_business_days: 5, 
    response_hours: 8,
    default_assignee_team: 'Multimedia'
  },
  { 
    id: 4, 
    code: 'CAT-CAMP', 
    name_en: '360° Campaign Launch Pack', 
    name_km: 'កញ្ចប់យុទ្ធនាការធំ 360°', 
    default_priority: 'P1',
    tat_business_days: 7, 
    response_hours: 2,
    default_assignee_team: 'Integrated Ops'
  },
  { 
    id: 5, 
    code: 'CAT-PKG', 
    name_en: 'Packaging Design Adaptation', 
    name_km: 'ការរចនា និងកែសម្រួលវេចខ្ចប់', 
    default_priority: 'P2',
    tat_business_days: 5, 
    response_hours: 6,
    default_assignee_team: 'Branding'
  },
];

// ---------- PostgreSQL catalog_brief_fields ("No Brief = No Start") ----------
export const CATALOG_BRIEF_FIELDS = {
  'CAT-POSM': [
    { key: 'placement_type', label_en: 'Placement / Display Format', label_km: 'ទម្រង់ទីតាំងដំឡើង', type: 'SELECT', options: ['Entrance Arch', 'Aisle Wobbler', 'Checkout Standee', 'Shelf Talker', 'Pond Banner'], required: true },
    { key: 'dimensions_cm', label_en: 'Dimensions (Width x Height in cm)', label_km: 'ទំហំ (ទទឹង x កំពស់ គិតជា ស.ម)', type: 'TEXT', placeholder: 'e.g. 400 x 250 cm', required: true },
    { key: 'headline_text', label_en: 'Headline / Promo Offer (EN & KH)', label_km: 'ចំណងជើង និងប្រូម៉ូសិន (ខ្មែរ/អង់គ្លេស)', type: 'TEXT', placeholder: 'e.g. Water Festival Mega Savings up to 50% Off', required: true },
    { key: 'sku_list_price', label_en: 'Participating SKUs & Promo Prices', label_km: 'បញ្ជីមុខទំនិញ និងតម្លៃពិសេស', type: 'LONG_TEXT', placeholder: 'List items, regular price, promo price', required: true },
    { key: 'target_install_date', label_en: 'Target In-Store Installation Date', label_km: 'កាលបរិច្ឆេទដាក់ដំឡើងក្នុងហាង', type: 'DATE', required: true },
    { key: 'product_drive_link', label_en: 'High-Res Assets / Barcodes Link', label_km: 'តំណភ្ជាប់រូបភាពទំនិញច្បាស់ និងបាកូដ', type: 'URL', placeholder: 'https://drive.google.com/...', required: false },
  ],
  'CAT-POSTER': [
    { key: 'social_channels', label_en: 'Target Social Channels', label_km: 'បណ្តាញសង្គមគោលដៅ', type: 'SELECT', options: ['Facebook Page', 'Telegram Channel', 'Mobile App Banner', 'Instagram Story'], required: true },
    { key: 'promo_period', label_en: 'Promotion Validity Period', label_km: 'សុពលភាពប្រូម៉ូសិន', type: 'TEXT', placeholder: 'e.g. Oct 2 - Oct 4, 2026', required: true },
    { key: 'promo_mechanic', label_en: 'Discount Mechanic / Key Callout', label_km: 'លក្ខខណ្ឌបញ្ចុះតម្លៃ ឬសារសំខាន់', type: 'LONG_TEXT', placeholder: 'e.g. Buy 2 Get 1 Free on Organic Produce', required: true },
    { key: 'asset_folder_url', label_en: 'Raw Photos / Logos Cloud Link', label_km: 'តំណភ្ជាប់ទៅកាន់ Folder រូបភាពដើម', type: 'URL', placeholder: 'https://drive.google.com/...', required: true },
  ],
  'CAT-VIDEO': [
    { key: 'video_format', label_en: 'Video Format & Aspect Ratio', label_km: 'ទម្រង់វីដេអូ', type: 'SELECT', options: ['9:16 Vertical (Reel / TikTok)', '16:9 Landscape (YouTube / TV)', '1:1 Square (Feed)'], required: true },
    { key: 'target_duration', label_en: 'Target Length (Seconds)', label_km: 'ប្រវែងវីដេអូ (វិនាទី)', type: 'NUMBER', placeholder: 'e.g. 30', required: true },
    { key: 'video_script', label_en: 'Script Outline & Key Points', label_km: 'សាច់រឿងសង្ខេប និងចំណុចសំខាន់', type: 'LONG_TEXT', placeholder: 'Key messaging, visual hooks, call to action', required: true },
    { key: 'raw_footage_url', label_en: 'Raw Footage Cloud Link', label_km: 'តំណភ្ជាប់វីដេអូដើម (Drive / OneDrive)', type: 'URL', placeholder: 'https://drive.google.com/...', required: true },
  ],
  'CAT-CAMP': [
    { key: 'campaign_goal', label_en: 'Campaign Objective & Core Theme', label_km: 'គោលបំណងយុទ្ធនាការ និងប្រធានបទស្នូល', type: 'LONG_TEXT', placeholder: 'Main goal, KPI, audience segment', required: true },
    { key: 'launch_date', label_en: 'Official Campaign Launch Date', label_km: 'កាលបរិច្ឆេទចាប់ផ្តើមយុទ្ធនាការ', type: 'DATE', required: true },
    { key: 'key_deliverables', label_en: 'Required Deliverables Checklist', label_km: 'បញ្ជីសម្ភារៈផ្សព្វផ្សាយដែលត្រូវការ', type: 'LONG_TEXT', placeholder: 'App splash, posters, shelf talkers, standees...', required: true },
    { key: 'budget_tier', label_en: 'Marketing Budget Tier', label_km: 'កម្រិតថវិកាទីផ្សារ', type: 'SELECT', options: ['Tier 1 (> $10,000)', 'Tier 2 ($3,000 - $10,000)', 'Tier 3 (< $3,000)'], required: true },
  ],
  'CAT-PKG': [
    { key: 'packaging_type', label_en: 'Packaging Format', label_km: 'ប្រភេទវេចខ្ចប់', type: 'SELECT', options: ['Primary Box / Bag', 'Label Sticker', 'Multipack Wrap', 'Shrink Sleeve'], required: true },
    { key: 'barcode_sku', label_en: 'SKU Code & Registered Barcode', label_km: 'លេខកូដទំនិញ និងបាកូដ', type: 'TEXT', placeholder: 'e.g. SKU-9948 / 8841029381', required: true },
    { key: 'dieline_spec', label_en: 'Printer Dieline Specs Link', label_km: 'តំណភ្ជាប់ប្លង់ខ្នាតពុម្ពពីរោងពុម្ព', type: 'URL', placeholder: 'https://drive.google.com/...', required: true },
  ]
};

// ---------- PostgreSQL sla_settings ----------
export const SLA_SETTINGS = {
  intake_cutoff: '15:00', // 3:00 PM ICT
  timezone: 'Asia/Phnom_Penh',
  max_revisions: 2,
  change_request_extra_days: 3,
  auto_approve_hours: 48,
  auto_approve_promo_hours: 24,
  rush_quota_per_month: 3,
  work_days: ['MON', 'TUE', 'WED', 'THU', 'FRI']
};

// Initial tickets synced with database/seeds.sql
const INITIAL_MARKETING_TICKETS = [
  {
    id: 'MKT-2026-0001',
    title: 'Water Festival Mega Sale POSM & Entrance Banner',
    description: 'Entrance arch, aisle wobblers, and checkout counter standee with festival theme.',
    catalogCode: 'CAT-POSM',
    catalogName: 'POSM & Store Banners',
    department: 'Commercial & Purchasing',
    departmentCode: 'COM',
    priority: 'P1', // 'P1' | 'P2' | 'P3' | 'P4'
    is_rush: true,
    is_promo_pricing: true,
    status: 'IN_PRODUCTION', // 'BRIEF_CHECK' | 'IN_PRODUCTION' | 'IN_REVIEW' | 'DELIVERED'
    assignee: 'Sokha Meas (Lead Designer)',
    assigneeAvatar: 'SM',
    requester: 'Dara Chan (Category Manager)',
    clock_state: 'RUNNING', // 'NOT_STARTED' | 'RUNNING' | 'PAUSED' | 'STOPPED'
    pause_reason: null,
    tat_days: 2,
    slaTimeLeft: '1 Business Day left',
    due_date: '2026-10-01',
    submitted_at: '2026-09-28 10:15 AM (Before 3PM Cutoff)',
    counted_from_date: '2026-09-28',
    revision_count: 0,
    sla_met: null,
    brief_json: {
      placement_type: 'Entrance Arch',
      dimensions_cm: '400 x 250 cm',
      headline_text: 'Water Festival Mega Savings up to 50% Off',
      sku_list_price: 'Beverages, Snack Packs, Rice 5kg',
      target_install_date: '2026-10-01'
    },
    ticket_pauses: [],
    revisions: [],
    approvals: [
      { id: 1, kind: 'RUSH_GM_APPROVAL', result: 'APPROVED', decided_at: '2026-09-28 10:25 AM', note: 'Approved by GM Ratana Seng' }
    ],
    comments: [
      { id: 1, author: 'Sokha Meas', body: 'Drafted high-res vector cutouts for the Water Festival boat artwork. Sending to print team.', internal: true, time: '11:00 AM' }
    ]
  },
  {
    id: 'MKT-2026-0002',
    title: 'Weekend Organic Vegetables & Fresh Fruit Social Poster',
    description: 'Weekly promotional price poster for Facebook, Telegram channel, and App banner.',
    catalogCode: 'CAT-POSTER',
    catalogName: 'Social Media Promo Poster',
    department: 'Store Operations',
    departmentCode: 'OPS',
    priority: 'P2',
    is_rush: false,
    is_promo_pricing: true,
    status: 'BRIEF_CHECK',
    assignee: 'Bopha Chea (Marketing Ops)',
    assigneeAvatar: 'BC',
    requester: 'Sophea Yin (Branch Manager)',
    clock_state: 'PAUSED',
    pause_reason: 'MISSING_ASSETS', // 'MISSING_INFO' | 'MISSING_ASSETS' | 'AWAITING_REQUESTER'
    tat_days: 2,
    slaTimeLeft: 'Paused (Awaiting Supplier Photos)',
    due_date: '2026-10-02',
    submitted_at: '2026-09-28 09:30 AM',
    counted_from_date: '2026-09-28',
    revision_count: 0,
    sla_met: null,
    brief_json: {
      social_channels: 'Facebook Page',
      promo_period: 'Oct 2 - Oct 4, 2026',
      promo_mechanic: 'Buy 2 Get 1 Free on Hydroponic Greens',
      asset_folder_url: 'https://drive.bgroceries.com/produce-photos'
    },
    ticket_pauses: [
      { id: 1, reason: 'MISSING_ASSETS', started_at: '2026-09-28 10:00 AM', ended_at: null, started_by: 'Bopha Chea' }
    ],
    revisions: [],
    approvals: [],
    comments: [
      { id: 1, author: 'Bopha Chea', body: 'Contacted Sophea Yin for updated supplier photo pack. Ticket SLA clock paused.', internal: false, time: '10:02 AM' }
    ]
  },
  {
    id: 'MKT-2026-0003',
    title: 'Korean Food Fair Cooking Demo Video Reel',
    description: '30-second TikTok & IG Reel featuring chef demo of imported Samyang & Kimchi items.',
    catalogCode: 'CAT-VIDEO',
    catalogName: 'Video Commercial / Reel',
    department: 'Commercial & Purchasing',
    departmentCode: 'COM',
    priority: 'P3',
    is_rush: false,
    is_promo_pricing: false,
    status: 'IN_REVIEW',
    assignee: 'John Smith (Video Editor)',
    assigneeAvatar: 'JS',
    requester: 'Piseth Lim (Import Specialist)',
    clock_state: 'RUNNING',
    pause_reason: null,
    tat_days: 5,
    slaTimeLeft: '48h Auto-Approve window (14h left)',
    due_date: '2026-10-03',
    submitted_at: '2026-09-26 02:20 PM',
    counted_from_date: '2026-09-26',
    revision_count: 1, // Standard revision round 1
    sla_met: null,
    brief_json: {
      video_format: '9:16 Vertical (Reel / TikTok)',
      target_duration: 30,
      video_script: 'Chef cooking Samyang Buldak carbonara with imported cheese',
      raw_footage_url: 'https://drive.bgroceries.com/korean-demo-raw'
    },
    ticket_pauses: [],
    revisions: [
      { id: 1, round_no: 1, kind: 'STANDARD', requested_by: 'Piseth Lim', feedback: 'Please highlight the price tag more prominently and add the watermark.', extra_days: 0, date: '2026-09-27' }
    ],
    approvals: [
      { id: 1, kind: 'REQUESTER_APPROVAL', result: 'PENDING', deadline_at: '2026-09-30 09:00 AM', note: 'Awaiting final sign-off within 48h SLA window' }
    ],
    comments: [
      { id: 1, author: 'John Smith', body: 'Uploaded Video Cut v2 with requested watermark and price emphasis.', internal: false, time: '08:50 AM' }
    ]
  },
  {
    id: 'MKT-2026-0004',
    title: 'B-Groceries Mobile App $5 First Order Campaign Pack',
    description: 'Comprehensive 360 launch pack: In-app splash, digital flyers, store QR standee.',
    catalogCode: 'CAT-CAMP',
    catalogName: '360° Campaign Launch Pack',
    department: 'E-Commerce & Digital',
    departmentCode: 'ECOM',
    priority: 'P1',
    is_rush: true,
    is_promo_pricing: false,
    status: 'DELIVERED',
    assignee: 'Sokha Meas (Lead Designer)',
    assigneeAvatar: 'SM',
    requester: 'Vannak Heng (E-Commerce Head)',
    clock_state: 'STOPPED',
    pause_reason: null,
    tat_days: 7,
    slaTimeLeft: 'Delivered in 4 Days (SLA Met)',
    due_date: '2026-09-26',
    submitted_at: '2026-09-22 11:00 AM',
    counted_from_date: '2026-09-22',
    revision_count: 1,
    sla_met: true,
    brief_json: {
      campaign_goal: 'Drive 10,000 new app downloads via $5 voucher welcome code',
      launch_date: '2026-09-24',
      key_deliverables: 'App splash screen, Facebook ad carousel, In-store QR table talker',
      budget_tier: 'Tier 1 (> $10,000)'
    },
    ticket_pauses: [],
    revisions: [
      { id: 1, round_no: 1, kind: 'STANDARD', requested_by: 'Vannak Heng', feedback: 'Adjust QR code size on standee for better smartphone scan distance.', extra_days: 0, date: '2026-09-24' }
    ],
    approvals: [
      { id: 1, kind: 'REQUESTER_APPROVAL', result: 'APPROVED', decided_at: '2026-09-26 03:45 PM', note: 'Sign-off complete. Campaign live.' }
    ],
    comments: []
  },
  {
    id: 'MKT-2026-0005',
    title: 'Private Label Jasmine Rice Packaging & Shelf Talker',
    description: 'Front and back packaging adaptation for 5kg B-Groceries Royal Jasmine Rice.',
    catalogCode: 'CAT-POSM',
    catalogName: 'POSM & Store Banners',
    department: 'Commercial & Purchasing',
    departmentCode: 'COM',
    priority: 'P2',
    is_rush: false,
    is_promo_pricing: false,
    status: 'IN_PRODUCTION',
    assignee: 'Sarah Lee (Brand Designer)',
    assigneeAvatar: 'SL',
    requester: 'Dara Chan (Category Manager)',
    clock_state: 'RUNNING',
    pause_reason: null,
    tat_days: 3,
    slaTimeLeft: '2 Business Days left',
    due_date: '2026-10-02',
    submitted_at: '2026-09-27 04:10 PM (Counted Next Day - 3PM Cutoff)',
    counted_from_date: '2026-09-28',
    revision_count: 0,
    sla_met: null,
    brief_json: {
      placement_type: 'Shelf Talker',
      dimensions_cm: '30 x 15 cm',
      headline_text: '100% Premium Battambang Jasmine Rice',
      sku_list_price: 'SKU-9948: $6.20 per bag',
      target_install_date: '2026-10-05'
    },
    ticket_pauses: [],
    revisions: [],
    approvals: [],
    comments: []
  },
  {
    id: 'MKT-2026-0006',
    title: 'Fresh Seafood Friday Clearance Flash Sale Poster',
    description: 'Immediate 1-day promo graphic for Salmon & Prawn flash sale discount.',
    catalogCode: 'CAT-POSTER',
    catalogName: 'Social Media Promo Poster',
    department: 'Store Operations',
    departmentCode: 'OPS',
    priority: 'P1',
    is_rush: true,
    is_promo_pricing: true,
    status: 'DELIVERED',
    assignee: 'John Smith (Designer)',
    assigneeAvatar: 'JS',
    requester: 'Sophea Yin (Branch Manager)',
    clock_state: 'STOPPED',
    pause_reason: null,
    tat_days: 1,
    slaTimeLeft: 'Delivered in 6 Hours (SLA Met)',
    due_date: '2026-09-26',
    submitted_at: '2026-09-25 08:30 AM',
    counted_from_date: '2026-09-25',
    revision_count: 0,
    sla_met: true,
    brief_json: {
      social_channels: 'Telegram Channel',
      promo_period: 'Sep 25, 2026 only',
      promo_mechanic: '30% off all fresh Norwegian Salmon',
      asset_folder_url: 'https://drive.bgroceries.com/seafood-assets'
    },
    ticket_pauses: [],
    revisions: [],
    approvals: [],
    comments: []
  }
];

export function AppProvider({ children }) {
  // Theme state: 'dark' | 'light'
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('sla_theme') || 'dark';
  });

  // Language state: 'en' | 'kh'
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('sla_lang') || 'en';
  });

  // Authenticated user from localStorage (default to Marketing Ops lead for seamless Jira preview)
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('sla_auth_user');
      if (savedUser) return JSON.parse(savedUser);
    } catch {}
    return {
      username: 'admin_staff',
      fullName: 'Sokha Meas',
      email: 'sokha.meas@bgroceries.com',
      role: 'MARKETING_OPS',
      roleLabel: 'Marketing Operations & Creative Lead',
      department: 'Marketing & Brand (MKT)',
      avatar: 'SM'
    };
  });

  // Current page: default to 'dashboard' so Jira board is immediately visible
  const [currentPage, setCurrentPage] = useState(() => {
    try {
      const saved = localStorage.getItem('sla_current_page');
      return saved || 'dashboard';
    } catch {
      return 'dashboard';
    }
  });

  // Marketing SLA Tickets state
  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('sla_marketing_tickets_v2');
    return saved ? JSON.parse(saved) : INITIAL_MARKETING_TICKETS;
  });

  // Rush quota usage per department: { COM: 2, OPS: 1, ECOM: 1, FIN: 0 }
  const [rushQuotas, setRushQuotas] = useState({
    COM: 2,
    OPS: 1,
    ECOM: 1,
    FIN: 0
  });

  // Sync theme attribute on document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('sla_theme', theme);
  }, [theme]);

  // Sync lang
  useEffect(() => {
    document.documentElement.setAttribute('lang', lang);
    localStorage.setItem('sla_lang', lang);
  }, [lang]);

  // Sync tickets to localStorage
  useEffect(() => {
    localStorage.setItem('sla_marketing_tickets_v2', JSON.stringify(tickets));
  }, [tickets]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleLang = () => {
    setLang((prev) => (prev === 'en' ? 'kh' : 'en'));
  };

  // Translation helper
  const t = (key) => {
    const dict = translations[lang] || translations.en;
    return dict[key] || translations.en[key] || key;
  };

  // Verify token on app load if stored
  useEffect(() => {
    const checkSession = async () => {
      if (authApi.isAuthenticated()) {
        try {
          const profile = await authApi.getCurrentUser();
          if (profile) {
            setUser((prev) => ({
              ...prev,
              ...profile,
              avatar: (profile.fullName || profile.username || 'SM').slice(0, 2).toUpperCase()
            }));
          }
        } catch {
          // Token expired or invalid
        }
      }
    };
    checkSession();
  }, []);

  const login = async (username, password) => {
    const authResult = await authApi.login(username, password);
    setUser(authResult.user);
    setCurrentPage('dashboard');
    return authResult;
  };

  const loginOffline = (username = 'admin_staff') => {
    const cleanName = (username || '').trim() || 'admin_staff';
    const words = cleanName.split(/[\s_.-]+/);
    const initials = words.length > 1
      ? (words[0][0] + words[1][0]).toUpperCase()
      : cleanName.slice(0, 2).toUpperCase();

    const userData = {
      username: cleanName,
      email: `${cleanName.toLowerCase().replace(/[\s_]+/g, '.')}@bgroceries.com`,
      role: 'MARKETING_OPS',
      roleLabel: 'Marketing Operations & Creative Lead',
      department: 'Marketing & Brand (MKT)',
      avatar: initials || 'SM'
    };

    setUser(userData);
    setCurrentPage('dashboard');
    localStorage.setItem('sla_auth_user', JSON.stringify(userData));
  };

  const logout = () => {
    authApi.clearAuth();
    setUser(null);
    setCurrentPage('login');
  };

  // Move ticket across pipeline
  const moveTicket = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const isDelivered = newStatus === 'DELIVERED';
          return {
            ...t,
            status: newStatus,
            clock_state: isDelivered ? 'STOPPED' : (t.clock_state === 'STOPPED' ? 'RUNNING' : t.clock_state),
            sla_met: isDelivered ? true : t.sla_met,
            slaTimeLeft: isDelivered ? 'Delivered (SLA Met)' : t.slaTimeLeft,
          };
        }
        return t;
      })
    );
  };

  // Pause SLA Clock with reason (MISSING_INFO, MISSING_ASSETS, AWAITING_REQUESTER)
  const pauseTicket = (ticketId, reason) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const pauseEntry = {
            id: Date.now(),
            reason,
            started_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            ended_at: null,
            started_by: user?.username || 'Marketing Ops'
          };
          return {
            ...t,
            clock_state: 'PAUSED',
            pause_reason: reason,
            slaTimeLeft: `Paused: ${reason === 'MISSING_ASSETS' ? 'Missing Assets' : reason === 'MISSING_INFO' ? 'Missing Info' : 'Awaiting Requester'}`,
            ticket_pauses: [pauseEntry, ...(t.ticket_pauses || [])]
          };
        }
        return t;
      })
    );
  };

  // Resume SLA Clock
  const resumeTicket = (ticketId) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const updatedPauses = (t.ticket_pauses || []).map((p, idx) => 
            idx === 0 && !p.ended_at 
              ? { ...p, ended_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
              : p
          );
          return {
            ...t,
            clock_state: 'RUNNING',
            pause_reason: null,
            slaTimeLeft: `${t.tat_days} Business Days active`,
            ticket_pauses: updatedPauses
          };
        }
        return t;
      })
    );
  };

  // Add Revision (Standard round 1-2, round 3+ is CHANGE_REQUEST adding +3 business days)
  const requestRevision = (ticketId, feedback) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const nextRound = (t.revision_count || 0) + 1;
          const isChangeRequest = nextRound >= 3;
          const extraDays = isChangeRequest ? 3 : 0;
          
          const newRevision = {
            id: Date.now(),
            round_no: nextRound,
            kind: isChangeRequest ? 'CHANGE_REQUEST' : 'STANDARD',
            requested_by: user?.username || 'Requester',
            feedback,
            extra_days: extraDays,
            date: new Date().toISOString().slice(0, 10)
          };

          return {
            ...t,
            revision_count: nextRound,
            status: 'IN_PRODUCTION', // sends back to creative production
            clock_state: 'RUNNING',
            slaTimeLeft: isChangeRequest ? `+3 Days added (Change Request Round ${nextRound})` : `Revision Round ${nextRound} in progress`,
            revisions: [newRevision, ...(t.revisions || [])]
          };
        }
        return t;
      })
    );
  };

  // Add Comment (Public or Internal)
  const addComment = (ticketId, body, internal = false) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          const comment = {
            id: Date.now(),
            author: user?.username || 'Current User',
            body,
            internal,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          return {
            ...t,
            comments: [...(t.comments || []), comment]
          };
        }
        return t;
      })
    );
  };

  // Add new ticket with cutoff calculation and brief fields
  const addTicket = (newTicket) => {
    const nextNum = String(tickets.length + 1).padStart(4, '0');
    
    // Check 3:00 PM cutoff (Cambodia UTC+7)
    const now = new Date();
    const currentHour = now.getHours();
    const isPastCutoff = currentHour >= 15;
    
    const countDate = new Date();
    if (isPastCutoff) {
      countDate.setDate(countDate.getDate() + 1);
    }
    const countedFromDate = countDate.toISOString().slice(0, 10);
    const submittedNote = isPastCutoff 
      ? `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (Past 3PM Cutoff - Counted Next Business Day)`
      : `${now.toLocaleDateString()} ${now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} (Before 3PM Cutoff)`;

    // Check Rush quota
    const deptCode = newTicket.departmentCode || 'COM';
    const usedQuota = rushQuotas[deptCode] || 0;
    const isOverQuota = newTicket.is_rush && usedQuota >= 3;

    if (newTicket.is_rush) {
      setRushQuotas(prev => ({
        ...prev,
        [deptCode]: (prev[deptCode] || 0) + 1
      }));
    }

    const ticket = {
      id: `MKT-2026-${nextNum}`,
      status: 'BRIEF_CHECK',
      clock_state: 'RUNNING',
      pause_reason: null,
      submitted_at: submittedNote,
      counted_from_date: countedFromDate,
      revision_count: 0,
      sla_met: null,
      assigneeAvatar: (newTicket.assignee || 'SM').slice(0, 2).toUpperCase(),
      requester: user?.username || 'Current Requester',
      is_over_quota: isOverQuota,
      brief_json: newTicket.brief_json || {},
      ticket_pauses: [],
      revisions: [],
      approvals: isOverQuota ? [
        { id: 1, kind: 'RUSH_GM_APPROVAL', result: 'PENDING', note: 'Quota limit exceeded (3/3). Awaiting GM Sign-off.' }
      ] : [],
      comments: [],
      ...newTicket
    };

    setTickets((prev) => [ticket, ...prev]);
  };

  const deleteTicket = (ticketId) => {
    setTickets((prev) => prev.filter((t) => t.id !== ticketId));
  };

  return (
    <AppContext.Provider
      value={{
        theme,
        toggleTheme,
        lang,
        setLang,
        toggleLang,
        t,
        user,
        currentPage,
        setCurrentPage,
        login,
        loginOffline,
        logout,
        authApi,
        tickets,
        moveTicket,
        pauseTicket,
        resumeTicket,
        requestRevision,
        addComment,
        addTicket,
        deleteTicket,
        DEPARTMENTS,
        CATALOG_ITEMS,
        CATALOG_BRIEF_FIELDS,
        SLA_SETTINGS,
        rushQuotas
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
