import { RaciActivity } from '../types';

export const INITIAL_RACI_ACTIVITIES: RaciActivity[] = [
  {
    id: 1,
    categoryEn: 'Strategy & Planning',
    categoryKh: 'យុទ្ធសាស្ត្រ & ផែនការ',
    activityNameEn: 'Annual/Quarterly Marketing Strategy & Budget Planning',
    activityNameKh: 'ផែនការយុទ្ធសាស្ត្រ & កញ្ចប់ថវិកាប្រចាំឆ្នាំ/ត្រីមាស',
    roles: {
      ceo: 'A',
      opsManager: 'C',
      storeManager: 'C',
      financeSupervisor: 'C',
      purchasingOfficer: 'I',
      graphicDesigner: 'C',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'R'
    }
  },
  {
    id: 2,
    categoryEn: 'Strategy & Planning',
    categoryKh: 'យុទ្ធសាស្ត្រ & ផែនការ',
    activityNameEn: 'Monthly/Weekly Campaign & Promotion Proposal',
    activityNameKh: 'សំណើគម្រោងយុទ្ធនាការ & ប្រូម៉ូសិនប្រចាំខែ/សប្តាហ៍',
    roles: {
      ceo: 'A',
      opsManager: 'C',
      storeManager: 'C',
      financeSupervisor: 'I',
      purchasingOfficer: 'I',
      graphicDesigner: 'C',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'R'
    }
  },
  {
    id: 3,
    categoryEn: 'Creative & Content',
    categoryKh: 'ការរចនា & មាតិកា',
    activityNameEn: 'Creative Artwork Design (Posters, Banners, Social Media Graphics)',
    activityNameKh: 'រចនារូបភាព Creative Artwork, Poster & Banner លើបណ្តាញសង្គម',
    roles: {
      ceo: 'I',
      opsManager: 'I',
      storeManager: 'I',
      financeSupervisor: 'I',
      purchasingOfficer: 'I',
      graphicDesigner: 'R',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'A'
    }
  },
  {
    id: 4,
    categoryEn: 'Creative & Content',
    categoryKh: 'ការរចនា & មាតិកា',
    activityNameEn: 'Video Production, Filming & Editing (Reels, TikTok, Commercials)',
    activityNameKh: 'ការផលិត ថត & កាត់តវីដេអូ Reels, TikTok & Commercials',
    roles: {
      ceo: 'I',
      opsManager: 'I',
      storeManager: 'I',
      financeSupervisor: 'I',
      purchasingOfficer: 'I',
      graphicDesigner: 'C',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'A'
    }
  },
  {
    id: 5,
    categoryEn: 'Creative & Content',
    categoryKh: 'ការរចនា & មាតិកា',
    activityNameEn: 'Content Writing, Copywriting & PR Scripts (KH/EN)',
    activityNameKh: 'សរសេរ Caption, អត្ថបទផ្សព្វផ្សាយ & ស្គ្រីប (ខ្មែរ/អង់គ្លេស)',
    roles: {
      ceo: 'I',
      opsManager: 'I',
      storeManager: 'I',
      financeSupervisor: 'I',
      purchasingOfficer: 'I',
      graphicDesigner: 'C',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'A'
    }
  },
  {
    id: 6,
    categoryEn: 'Digital & Channels',
    categoryKh: 'ឌីជីថល & ឆាណែល',
    activityNameEn: 'Digital Marketing, Social Media Ads & Community Engagement',
    activityNameKh: 'គ្រប់គ្រងផេក បាញ់ Ads & ទំនាក់ទំនងអតិថិជន (FB/IG/TikTok)',
    roles: {
      ceo: 'I',
      opsManager: 'I',
      storeManager: 'I',
      financeSupervisor: 'I',
      purchasingOfficer: 'I',
      graphicDesigner: 'C',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'R'
    }
  },
  {
    id: 7,
    categoryEn: 'Digital & Channels',
    categoryKh: 'ឌីជីថល & ឆាណែល',
    activityNameEn: 'Website, E-commerce Catalog & Landing Page Maintenance',
    activityNameKh: 'អាប់ដេត Website, E-commerce Catalog & Landing Page',
    roles: {
      ceo: 'I',
      opsManager: 'I',
      storeManager: 'I',
      financeSupervisor: 'I',
      purchasingOfficer: 'I',
      graphicDesigner: 'C',
      webDeveloper: 'R',
      digitalMarketingOfficer: 'A'
    }
  },
  {
    id: 8,
    categoryEn: 'Operations & IT',
    categoryKh: 'ប្រតិបត្តិការ & IT',
    activityNameEn: 'IT Systems, POS Promotion Integration & Tech Support',
    activityNameKh: 'ជំនួយបច្ចេកទេស IT, ប្រព័ន្ធ POS & កម្មវិធី App សាខា',
    roles: {
      ceo: 'I',
      opsManager: 'C',
      storeManager: 'C',
      financeSupervisor: 'I',
      purchasingOfficer: 'I',
      graphicDesigner: 'I',
      webDeveloper: 'C',
      digitalMarketingOfficer: 'A'
    }
  },
  {
    id: 9,
    categoryEn: 'Operations & Cost',
    categoryKh: 'ប្រតិបត្តិការ & ថ្លៃដើម',
    activityNameEn: 'Promotion Pricing, Discount Validation & COGS / Gross Margin Feasibility',
    activityNameKh: 'ពិនិត្យតម្លៃប្រូម៉ូសិន, បញ្ចុះតម្លៃ & ថ្លៃដើម COGS / Gross Margin',
    roles: {
      ceo: 'A',
      opsManager: 'R',
      storeManager: 'C',
      financeSupervisor: 'C',
      purchasingOfficer: 'C',
      graphicDesigner: 'I',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'C'
    }
  },
  {
    id: 10,
    categoryEn: 'Operations & Sourcing',
    categoryKh: 'លទ្ធកម្ម & បោះពុម្ព',
    activityNameEn: 'In-Store POSM / Collateral Sourcing, Printing & Delivery',
    activityNameKh: 'ការបញ្ជាទិញ & បោះពុម្ពសម្ភារ POSM, Standee, Poster នៅតាមហាង',
    roles: {
      ceo: 'A',
      opsManager: 'C',
      storeManager: 'I',
      financeSupervisor: 'C',
      purchasingOfficer: 'R',
      graphicDesigner: 'C',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'A'
    }
  },
  {
    id: 11,
    categoryEn: 'Store Execution',
    categoryKh: 'ប្រតិបត្តិការតាមហាង',
    activityNameEn: 'In-Store Promotion Execution, Display Setup & Customer Feedback',
    activityNameKh: 'ការរៀបចំដាក់តាំងសម្ភារផ្សព្វផ្សាយ & ប្រមូលមតិអតិថិជនផ្ទាល់',
    roles: {
      ceo: 'I',
      opsManager: 'C',
      storeManager: 'R',
      financeSupervisor: 'I',
      purchasingOfficer: 'I',
      graphicDesigner: 'I',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'A'
    }
  },
  {
    id: 12,
    categoryEn: 'Finance & Audit',
    categoryKh: 'ហិរញ្ញវត្ថុ & សវនកម្ម',
    activityNameEn: 'Marketing Expense Settlement, Invoicing & Campaign ROI Audit',
    activityNameKh: 'ទូទាត់ចំណាយទីផ្សារ, វិក្កយបត្រ & គណនា ROI យុទ្ធនាការ',
    roles: {
      ceo: 'A',
      opsManager: 'C',
      storeManager: 'I',
      financeSupervisor: 'R',
      purchasingOfficer: 'C',
      graphicDesigner: 'I',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'C'
    }
  },
  {
    id: 13,
    categoryEn: 'Governance & Brand',
    categoryKh: 'អភិបាលកិច្ច & ម៉ាកយីហោ',
    activityNameEn: 'Brand Compliance, Copyright, Legal & Crisis Communication',
    activityNameKh: 'អនុលោមភាពម៉ាកសញ្ញា, កម្មសិទ្ធិបញ្ញា & ដោះស្រាយវិបត្តិ',
    roles: {
      ceo: 'A',
      opsManager: 'C',
      storeManager: 'I',
      financeSupervisor: 'I',
      purchasingOfficer: 'I',
      graphicDesigner: 'C',
      webDeveloper: 'I',
      digitalMarketingOfficer: 'R'
    }
  }
];
