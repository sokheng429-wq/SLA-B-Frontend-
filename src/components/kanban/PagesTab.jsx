import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Copy,
  Check
} from 'lucide-react';

export default function PagesTab() {
  const [copiedId, setCopiedId] = useState(null);
  const [searchDoc, setSearchDoc] = useState('');

  const articles = [
    {
      id: 'sla-01',
      title: 'Rule 1: "No Brief = No Start" Mandatory Policy',
      tag: 'Core Policy',
      tagColor: '#FF9900',
      summary: 'Creative work cannot commence until all required brief fields (dimensions, final text, price points, and cloud assets) are provided.',
      points: [
        'Missing dimensions or blurry placeholder images trigger an immediate SLA PAUSE.',
        'The SLA clock remains frozen until the requester uploads verified high-resolution assets.',
        'Notification is automatically dispatched to the branch or category manager via Telegram.'
      ]
    },
    {
      id: 'sla-02',
      title: 'Rule 2: Daily 15:00 ICT (3:00 PM) Intake Cutoff',
      tag: 'Time & Calendar',
      tagColor: '#77BC1F',
      summary: 'All tickets submitted before 3:00 PM ICT on business days (Mon–Fri) start SLA TAT tracking on the same day.',
      points: [
        'Tickets submitted after 3:00 PM ICT or during weekends/public holidays begin count at 08:00 AM on the next business day.',
        'SLA time calculations respect official Cambodian Public Holidays (Water Festival, Pchum Ben, Khmer New Year).',
        'Emergency rush overrides require General Manager Telegram confirmation.'
      ]
    },
    {
      id: 'sla-03',
      title: 'Rule 3: Monthly Department Rush Quota (3 Requests / Month)',
      tag: 'Quota & Approvals',
      tagColor: '#FF9900',
      summary: 'To protect creative quality and prevent burnout, each department is allocated a strict quota of 3 Rush tickets per calendar month.',
      points: [
        'A Rush ticket cuts standard TAT in half (e.g. 5 days to 2 days).',
        'Once the 3 monthly quotas are depleted, rush requests require GM approval and payment of an express printing surcharge.',
        'Department quotas reset automatically on the 1st of every calendar month at 00:00 ICT.'
      ]
    },
    {
      id: 'sla-04',
      title: 'Rule 4: Standard 2-Round Revision Cycle & Scope Changes',
      tag: 'Revisions',
      tagColor: '#38BDF8',
      summary: 'Standard SLA includes up to two (2) revision rounds for minor copy adjustments and visual refinements.',
      points: [
        'Minor revisions (e.g. typo correction, color tint) do not add days to the TAT.',
        'Major change requests (e.g. altering dimensions, adding new SKUs, or redesigning concept) require +3 additional business days.',
        'If no feedback is received within 48 hours of initial delivery, the ticket is auto-approved and closed as Done.'
      ]
    }
  ];

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredArticles = articles.filter(a => 
    a.title.toLowerCase().includes(searchDoc.toLowerCase()) ||
    a.summary.toLowerCase().includes(searchDoc.toLowerCase())
  );

  return (
    <div className="flex-1 overflow-y-auto px-10 py-6 space-y-6">
      {/* Knowledge Base Header */}
      <div className="p-6 rounded-2xl bg-[#141c27] border border-[#2f3d50] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#FF9900]/20 text-[#FF9900] flex items-center justify-center">
            <BookOpen size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#eef2f6]">
              SLA Knowledge Base &amp; Operating Standards
            </h2>
            <p className="text-xs text-[#8fa0b4] mt-0.5">
              Official service level agreement guidelines, turnaround timelines, and escalation matrices for B'Groceries.
            </p>
          </div>
        </div>

        {/* Search doc */}
        <div className="relative w-72">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8fa0b4]" />
          <input
            type="text"
            value={searchDoc}
            onChange={(e) => setSearchDoc(e.target.value)}
            placeholder="Search guidelines..."
            className="w-full h-9 pl-9 pr-4 rounded-xl bg-[#232F3F] border border-[#2f3d50] text-xs text-[#eef2f6] placeholder-[#8fa0b4]/60 focus-visible:ring-2 focus-visible:ring-[#FF9900] focus-visible:outline-none"
          />
        </div>
      </div>

      {/* Article Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredArticles.map((art) => (
          <div
            key={art.id}
            className="p-6 rounded-2xl bg-[#141c27] border border-[#2f3d50] hover:border-[#FF9900]/50 transition-all shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span 
                  style={{
                    backgroundColor: `${art.tagColor}20`,
                    color: art.tagColor,
                    borderColor: `${art.tagColor}40`
                  }}
                  className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                >
                  {art.tag}
                </span>

                <button
                  type="button"
                  onClick={() => handleCopy(art.id, `${art.title}\n${art.summary}`)}
                  className="text-[#8fa0b4] hover:text-[#eef2f6] p-1 rounded-md transition-colors"
                  title="Copy policy guideline"
                >
                  {copiedId === art.id ? <Check size={14} className="text-[#77BC1F]" /> : <Copy size={14} />}
                </button>
              </div>

              <h3 className="text-base font-bold text-[#eef2f6] mb-2 leading-snug">
                {art.title}
              </h3>
              <p className="text-xs text-[#8fa0b4] leading-relaxed mb-4">
                {art.summary}
              </p>

              <div className="space-y-2 pt-2 border-t border-[#2f3d50]/50">
                {art.points.map((pt, pIdx) => (
                  <div key={pIdx} className="flex items-start gap-2 text-xs text-[#eef2f6]/90">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#77BC1F] mt-1.5 shrink-0" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-[#2f3d50]/50 flex items-center justify-between text-[11px] text-[#8fa0b4]">
              <span>Last updated: Oct 2026</span>
              <span className="text-[#FF9900] font-bold">Policy SLA-2026-v2.4</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
