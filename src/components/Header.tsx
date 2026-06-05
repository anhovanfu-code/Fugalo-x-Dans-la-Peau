/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, Compass, Briefcase, Ruler, BarChart3, HelpCircle, Printer } from "lucide-react";
import { FugaloSeal } from "./FugaloLogo";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail?: string;
  checklistScore: number;
  onPrintClick?: () => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  userEmail = "anhovan.fu@gmail.com", 
  checklistScore,
  onPrintClick
}: HeaderProps) {
  const navItems = [
    { id: "overview", label: "Tổng Quan & SWOT", icon: Compass },
    { id: "synergy", label: "Trục Liên Kết", icon: Ruler },
    { id: "due-diligence", label: "Thẩm Định (Due Diligence)", icon: ShieldCheck, badge: `${checklistScore}%` },
    { id: "timeline", label: "Kế Hoạch 90 Ngày", icon: Briefcase },
    { id: "calculator", label: "Bộ Công Cụ Deal", icon: BarChart3 },
    { id: "kpis", label: "Chỉ Số KPI", icon: HelpCircle }
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-md overflow-hidden" id="app-header">
      {/* Decorative luxury terracotta brand line */}
      <div className="h-[3px] bg-gradient-to-r from-amber-800 via-amber-500 to-amber-600 w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Logos & Branding styled precisely from the official uploaded logo */}
        <div className="flex items-center gap-4">
          {/* Authentic terracotta stamp seal representing the hand-carved seal of Fugalo */}
          <FugaloSeal size={52} className="shadow-md hover:scale-105 duration-300 transition-all cursor-pointer" />
          
          <div>
            <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <h1 className="text-xl font-serif font-semibold text-stone-900 tracking-wide flex items-center gap-1.5">
                <span className="tracking-[0.18em] font-serif font-extrabold text-[#db5129] uppercase">FUGALO</span> 
                <span className="text-amber-500 font-sans text-xs select-none">×</span> 
                <span className="text-stone-700 font-serif font-light text-base tracking-wider">Dans la Peau</span>
              </h1>
              <span className="inline-block px-1.5 py-0.5 bg-amber-50 text-amber-700 text-[8px] uppercase tracking-widest font-mono border border-amber-200/50 rounded font-bold">
                M&A PRO EVALUATOR
              </span>
            </div>
            <p className="text-stone-600 font-serif italic tracking-wider mt-1 flex flex-wrap items-center gap-2 text-[10px] sm:text-xs">
              <span className="text-[#db5129] font-serif not-italic tracking-[0.3em] font-extrabold text-[9px] sm:text-[10px] pr-1">
                TÁI SINH GIÁ TRỊ
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500/20 hidden sm:inline" />
              <span className="text-stone-500 font-sans not-italic text-[10px] sm:text-[11px] font-normal">
                Nền tảng kiểm định sáp nhập, chuỗi cung ứng và hoạch định chuỗi Dĩ An
              </span>
            </p>
          </div>
        </div>

        {/* User context info */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 ml-auto md:ml-0 self-end md:self-auto font-sans">
          <div className="text-right">
            <div className="text-[10px] text-stone-500 font-medium">Tài khoản thẩm định</div>
            <div className="text-xs font-semibold text-stone-850">{userEmail}</div>
          </div>
          <div className="h-8 w-[1px] bg-stone-200 hidden sm:block" />
          <button
            onClick={onPrintClick}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-white font-bold rounded-lg text-xs cursor-pointer select-none border border-amber-600/30 transition-all hover:scale-[1.02] shadow"
            id="header-export-pdf-btn"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Xuất Báo Cáo VIP</span>
          </button>
          <div className="bg-stone-50 border border-stone-200 px-3 py-1.5 rounded-lg flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <div className="text-xs font-mono text-stone-600">Dữ liệu sẵn sàng</div>
          </div>
        </div>
      </div>

      {/* Tabs Menu navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="flex space-x-1 overflow-x-auto pb-px no-scrollbar select-none" aria-label="Tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-3.5 border-b-2 font-semibold text-xs sm:text-sm whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "border-amber-500 text-amber-600 bg-amber-500/[0.04]"
                    : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300"
                }`}
                id={`tab-btn-${item.id}`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-amber-500" : "text-stone-400"}`} />
                <span>{item.label}</span>
                {item.id === "due-diligence" && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    checklistScore === 100 
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                      : checklistScore > 50 
                      ? "bg-amber-550/10 text-amber-700 border border-amber-200" 
                      : "bg-stone-100 text-stone-500 border border-stone-200"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
