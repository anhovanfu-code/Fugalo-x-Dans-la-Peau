/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { ShieldCheck, Compass, Briefcase, Ruler, BarChart3, HelpCircle, Printer, Gift, Layout, Layers } from "lucide-react";
import { FugaloSeal } from "./FugaloLogo";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail?: string;
  checklistScore: number;
  onPrintClick?: () => void;
  viewMode?: "tabbed" | "full";
  setViewMode?: (mode: "tabbed" | "full") => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  userEmail = "anhovan.fu@gmail.com", 
  checklistScore,
  onPrintClick,
  viewMode,
  setViewMode
}: HeaderProps) {
  const navItems = [
    { id: "overview", label: "Tổng Quan & SWOT", icon: Compass },
    { id: "synergy", label: "Trục Liên Kết", icon: Ruler },
    { id: "due-diligence", label: "Thẩm Định (Due Diligence)", icon: ShieldCheck, badge: `${checklistScore}%` },
    { id: "timeline", label: "Kế Hoạch 90 Ngày", icon: Briefcase },
    { id: "calculator", label: "Bộ Công Cụ Deal", icon: BarChart3 },
    { id: "b2b-gifting", label: "B2B & Quà Tặng VIP", icon: Gift },
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
                Nền tảng kiểm định sáp nhập, chuỗi cung ứng và hoạch định chuỗi TP. Hồ Chí Minh
              </span>
            </p>
          </div>
        </div>

        {/* User context info */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 ml-auto md:ml-0 self-end md:self-auto font-sans">
          <div className="text-right">
            <div className="text-[10px] text-stone-500 font-medium flex items-center justify-end gap-1.5">
              <span>Tài khoản thẩm định</span>
              <span className="relative flex h-1.5 w-1.5" title="Hệ thống dữ liệu sẵn sàng">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
            </div>
            <div className="text-xs font-semibold text-stone-850">{userEmail}</div>
          </div>
          <div className="h-8 w-[1px] bg-stone-200 hidden sm:block" />
          
          {/* Elegant layout switcher directly in the right corner header */}
          {viewMode && setViewMode && (
            <div className="flex items-center bg-stone-100 hover:bg-stone-200/50 border border-stone-200/80 p-0.5 rounded-lg select-none shrink-0" title="Đổi giao diện bố cục">
              <button
                onClick={() => setViewMode("tabbed")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "tabbed"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-900 hover:bg-white/85"
                }`}
                title="Bố cục: Click Từng Tab"
              >
                <Layout className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("full")}
                className={`p-1.5 rounded-md transition-all cursor-pointer ${
                  viewMode === "full"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "text-stone-500 hover:text-stone-900 hover:bg-white/85"
                }`}
                title="Bố cục: Trải toàn bộ liền mạch"
              >
                <Layers className="w-4 h-4" />
              </button>
            </div>
          )}

          <button
            onClick={onPrintClick}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-white font-bold rounded-lg text-xs cursor-pointer border border-amber-600/20 shadow-sm transition-all hover:scale-[1.02]"
            id="header-export-pdf-btn"
          >
            <Printer className="w-3.5 h-3.5 text-white" />
            <span>Xuất Báo Cáo VIP</span>
          </button>
        </div>
      </div>

      {/* Tabs Menu navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-100 mt-2 sm:mt-0">
        <nav className="flex flex-wrap gap-2 py-3.5 select-none" aria-label="Tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs sm:text-[13px] transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-amber-600 text-white shadow-sm ring-1 ring-amber-600/20"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/80"
                }`}
                id={`tab-btn-${item.id}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-stone-500"}`} />
                <span>{item.label}</span>
                {item.id === "due-diligence" && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                    isActive 
                      ? "bg-amber-800 text-white" 
                      : "bg-emerald-50 text-emerald-700 border border-emerald-250"
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
