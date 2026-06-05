/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DUE_DILIGENCE_DB, COOPERATION_TIMELINE, KPI_BENCHMARKS } from "./data";
import { DueDiligenceItem, TimelinePhase, KPITargetItem } from "./types";
import Header from "./components/Header";
import OverviewSection from "./components/OverviewSection";
import StrategyFitSection from "./components/StrategyFitSection";
import DueDiligenceSection from "./components/DueDiligenceSection";
import TimelineSection from "./components/TimelineSection";
import DealCalculator from "./components/DealCalculator";
import KPITracker from "./components/KPITracker";
import ProposalMaker from "./components/ProposalMaker";
import PrintExecutiveReport from "./components/PrintExecutiveReport";
import { Sparkles, FileSpreadsheet, ArrowRight, DownloadCloud, Landmark, ShieldCheck } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  // Master states
  const [checklistItems, setChecklistItems] = useState<DueDiligenceItem[]>(DUE_DILIGENCE_DB);
  const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>(COOPERATION_TIMELINE);
  const [kpiTargets, setKpiTargets] = useState<KPITargetItem[]>(KPI_BENCHMARKS);
  const [showProposalDraft, setShowProposalDraft] = useState<boolean>(false);
  const [showPrintReport, setShowPrintReport] = useState<boolean>(false);

  // Synchronized financial modeling inputs for matching report calculators
  const [activeModel, setActiveModel] = useState<"wholesale" | "revshare" | "capsule">("capsule");
  const [volume, setVolume] = useState<number>(100);
  const [retailPrice, setRetailPrice] = useState<number>(3500000); // 3.5m VND
  const [cogsPercent, setCogsPercent] = useState<number>(25);
  const [discountPercent, setDiscountPercent] = useState<number>(45);
  const [marketingCost, setMarketingCost] = useState<number>(30000000); // 30m VND

  // Compute calculated values
  const getRiskWeight = (level: "high" | "medium" | "low") => {
    if (level === "high") return 3;
    if (level === "medium") return 2;
    return 1;
  };

  const totalPossibleWeight = checklistItems.reduce((acc, curr) => acc + getRiskWeight(curr.riskLevel), 0);
  const currentPassedWeight = checklistItems.reduce((acc, curr) => {
    if (curr.status === "passed") {
      return acc + getRiskWeight(curr.riskLevel);
    }
    return acc;
  }, 0);

  const clearanceScore = totalPossibleWeight > 0 ? Math.round((currentPassedWeight / totalPossibleWeight) * 100) : 0;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 selection:bg-amber-100 selection:text-stone-900 font-sans" id="app-root">
      
      {/* HEADER COMPONENT */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        checklistScore={clearanceScore}
        userEmail="anhovan.fu@gmail.com" 
        onPrintClick={() => setShowPrintReport(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-12">
        {/* Dynamic section injection */}
        {activeTab === "overview" && <OverviewSection />}
        
        {activeTab === "synergy" && <StrategyFitSection />}
        
        {activeTab === "due-diligence" && (
          <DueDiligenceSection 
            items={checklistItems} 
            setItems={setChecklistItems} 
            clearanceScore={clearanceScore} 
          />
        )}
        
        {activeTab === "timeline" && (
          <TimelineSection 
            timeline={timelinePhases} 
            setTimeline={setTimelinePhases} 
          />
        )}
        
        {activeTab === "calculator" && (
          <DealCalculator 
            activeModel={activeModel}
            setActiveModel={setActiveModel}
            volume={volume}
            setVolume={setVolume}
            retailPrice={retailPrice}
            setRetailPrice={setRetailPrice}
            cogsPercent={cogsPercent}
            setCogsPercent={setCogsPercent}
            discountPercent={discountPercent}
            setDiscountPercent={setDiscountPercent}
            marketingCost={marketingCost}
            setMarketingCost={setMarketingCost}
          />
        )}
        
        {activeTab === "kpis" && (
          <KPITracker 
            kpis={kpiTargets} 
            setKpis={setKpiTargets} 
          />
        )}

        {/* BOTTOM FIXED EXECUTIVE PROPOSAL CENTER */}
        <div className="pt-8 border-t border-stone-200" id="executive-proposal-base">
          <div className="bg-white border border-stone-200/80 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
            {/* Decorative terracotta background gradient flare */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-amber-600 font-bold">EXECUTIVE EXPORT SERVICE</span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-stone-900">Soạn Thảo Biên Bản Ghi Nhớ & Đề Xuất Đối Tác</h3>
              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                Sau khi tinh chỉnh các chỉ số hoặc hoàn tất thẩm định, bạn có thể xem thử và xuất biên bản ghi nhớ (MOU) tinh tế bằng tiếng Việt để chính thức bàn thảo thương lượng với ban sáng lập Dans la Peau.
              </p>
            </div>

            <button
              onClick={() => setShowProposalDraft(!showProposalDraft)}
              className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-white font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
              id="draft-proposal-toggle"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{showProposalDraft ? "Thu gọn bản đề xuất" : "Xem Bản Đề Xuất Đóng Gói (MOU)"}</span>
            </button>
          </div>
        </div>

        {/* Conditional rendering of proposal template */}
        {showProposalDraft && (
          <div className="pt-2">
            <ProposalMaker clearanceScore={clearanceScore} />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 bg-stone-100 py-8 text-center text-xs text-stone-600 font-sans" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-2">
          <p>
            Hệ thống Bản quyền © 2026 <span className="text-stone-800 font-semibold font-serif">Fugalo Co., Ltd</span>. Mọi quyền nội dung được bảo lưu.
          </p>
          <p className="text-[10px] text-stone-500">
            Ứng dựng thẩm định rủi ro và mô phỏng tài chính liên thông phục vụ khảo sát sáp nhập nội bộ. Đảm bảo an ninh dữ liệu.
          </p>
        </div>
      </footer>

      {/* PRINT CENTER / PDF REPORT EXPORTER MODAL Overlay */}
      {showPrintReport && (
        <PrintExecutiveReport 
          checklistItems={checklistItems}
          timelinePhases={timelinePhases}
          kpiTargets={kpiTargets}
          clearanceScore={clearanceScore}
          dealParams={{
            activeModel,
            volume,
            retailPrice,
            cogsPercent,
            discountPercent,
            marketingCost
          }}
          onClose={() => setShowPrintReport(false)}
        />
      )}
    </div>
  );
}
