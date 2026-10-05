import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDepartmentStore } from '../store/departmentStore';
import { BookOpen, Clock, Zap, Search } from 'lucide-react';

export const ServiceCatalogPage: React.FC = () => {
  const { t } = useTranslation();
  const { getCurrentDepartment, getDepartmentServices } = useDepartmentStore();
  const dept = getCurrentDepartment();
  const services = getDepartmentServices(dept.id);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');

  const categories = ['ALL', ...Array.from(new Set(services.map((s) => s.categoryEn)))];

  const filteredServices = services.filter((s) => {
    if (selectedCategory !== 'ALL' && s.categoryEn !== selectedCategory) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        s.code.toLowerCase().includes(q) ||
        s.nameEn.toLowerCase().includes(q) ||
        s.nameKh.toLowerCase().includes(q) ||
        s.deliverableSpecsEn.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-gray-200/80 dark:border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold border backdrop-blur-md bg-[#77BC1F]/15 border-[#77BC1F]/40 text-[#77BC1F] mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#77BC1F] animate-ping" />
            <span>OFFICIAL SERVICE CATALOG • {dept.code}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#232F3F] dark:text-white tracking-tight flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-[#77BC1F]" />
            <span>{t('nav.catalog')} — {dept.nameEn}</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mt-1">
            Authoritative Turnaround Times (TAT), Technical Specs, and Brief Intake Requirements
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4.5 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-sm backdrop-blur-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search service by code (e.g. MKT-DES-01) or deliverable name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-[#0E1520] border border-gray-200 dark:border-white/15 rounded-xl text-sm font-medium text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#77BC1F]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                selectedCategory === cat
                  ? 'bg-[#77BC1F] text-white shadow-md shadow-[#77BC1F]/30'
                  : 'bg-gray-100 dark:bg-[#0E1520] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10'
              }`}
            >
              {cat === 'ALL' ? 'All Categories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredServices.map((service) => (
          <div
            key={service.id}
            className="p-6 bg-white/90 dark:bg-[#16202C]/90 rounded-2xl border border-gray-200/90 dark:border-white/10 shadow-xs flex flex-col justify-between hover:border-[#77BC1F] dark:hover:border-[#77BC1F] hover:shadow-xl hover:shadow-black/15 transition-all space-y-4 group backdrop-blur-xs"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-center justify-between gap-2 mb-2.5">
                <span className="font-mono text-xs md:text-sm font-bold text-[#232F3F] dark:text-white bg-[#77BC1F]/15 dark:bg-[#77BC1F]/20 px-2.5 py-1 rounded-md border border-[#77BC1F]/30 dark:border-[#77BC1F]/40">
                  {service.code}
                </span>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-300">
                  {service.categoryEn}
                </span>
              </div>

              {/* Service Titles */}
              <h3 className="font-bold text-[#232F3F] dark:text-white text-base leading-snug group-hover:text-[#558D14] dark:group-hover:text-[#77BC1F] transition-colors">
                {service.nameEn}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed font-khmer">
                {service.nameKh}
              </p>

              {/* SLA Metrics Pill Row */}
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-gray-100 dark:border-white/10">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#77BC1F]/15 dark:bg-[#77BC1F]/20 text-[#558D14] dark:text-[#77BC1F] border border-[#77BC1F]/30 dark:border-[#77BC1F]/40 flex items-center gap-1.5 shadow-2xs">
                  <Clock className="w-3.5 h-3.5 text-[#77BC1F]" />
                  <span>Std: {service.standardTatDays}d</span>
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#FF9900]/15 dark:bg-[#FF9900]/20 text-[#B26A00] dark:text-[#FF9900] border border-[#FF9900]/30 dark:border-[#FF9900]/40 flex items-center gap-1.5 shadow-2xs">
                  <Zap className="w-3.5 h-3.5 fill-[#FF9900] text-[#FF9900]" />
                  <span>Rush: {service.rushTatHours}h</span>
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-indigo-50 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                  Review: {service.reviewSlaHours}h
                </span>
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-300">
                  {service.defaultPriority}
                </span>
              </div>

              {/* Technical Specifications */}
              <div className="mt-4 text-xs md:text-sm text-gray-700 dark:text-gray-300 space-y-2 bg-gray-50/80 dark:bg-[#121924] p-3.5 rounded-xl border border-gray-100 dark:border-white/10">
                <div>
                  <strong className="text-[#232F3F] dark:text-white block font-bold mb-0.5">Deliverable Specs:</strong>
                  <span className="leading-relaxed">{service.deliverableSpecsEn}</span>
                </div>
                <div>
                  <strong className="text-[#232F3F] dark:text-white block font-bold mb-0.5">Brief Requirements:</strong>
                  <span className="text-gray-600 dark:text-gray-400 leading-relaxed">{service.briefRequirementsEn}</span>
                </div>
              </div>
            </div>

            {/* Lead Role Footer */}
            <div className="pt-3 border-t border-gray-100 dark:border-white/10 text-xs md:text-sm text-gray-600 dark:text-gray-400 flex items-center justify-between">
              <span>Lead Specialist:</span>
              <span className="font-bold text-[#232F3F] dark:text-[#77BC1F]">{service.responsibleLeadTitleEn}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
