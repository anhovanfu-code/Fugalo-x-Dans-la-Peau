/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DueDiligenceItem, TimelinePhase, KPITargetItem } from "../types";
import { 
  Printer, ArrowLeft, Check, Copy, FileText, Sliders, 
  MapPin, Landmark, Calendar, ShieldCheck, Percent, HelpCircle 
} from "lucide-react";
import { FugaloBrand } from "./FugaloLogo";

interface PrintExecutiveReportProps {
  checklistItems: DueDiligenceItem[];
  timelinePhases: TimelinePhase[];
  kpiTargets: KPITargetItem[];
  clearanceScore: number;
  dealParams: {
    activeModel: "wholesale" | "revshare" | "capsule";
    volume: number;
    retailPrice: number;
    cogsPercent: number;
    discountPercent: number;
    marketingCost: number;
  };
  onClose: () => void;
}

export default function PrintExecutiveReport({
  checklistItems,
  timelinePhases,
  kpiTargets,
  clearanceScore,
  dealParams,
  onClose
}: PrintExecutiveReportProps) {
  // Input Settings Customization
  const [reportTitle, setReportTitle] = useState(
    "Báo cáo Thẩm định Sáp nhập & Dự thảo Đề xuất Liên doanh Fugalo × Dans la Peau"
  );
  const [signeeName, setSigneeName] = useState("Hồ Văn An");
  const [partnerSignatory, setPartnerSignatory] = useState("Ban Sáng Lập Dans la Peau");
  const [docRefId, setDocRefId] = useState("FGL-DLP-M&A-2026-CONF");
  
  // Section filters
  const [includeCover, setIncludeCover] = useState(true);
  const [includeSWOT, setIncludeSWOT] = useState(true);
  const [includeChecklist, setIncludeChecklist] = useState(true);
  const [includeCalculator, setIncludeCalculator] = useState(true);
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeStaffing, setIncludeStaffing] = useState(true);
  const [includeBudgetAndRaci, setIncludeBudgetAndRaci] = useState(true);
  const [includePlaybook, setIncludePlaybook] = useState(true);
  const [includeMOU, setIncludeMOU] = useState(true);

  const [copied, setCopied] = useState(false);

  // Time & Date format
  const todayStr = new Date().toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });

  // Calculate simulated deal figures dynamically for report consistency
  const { activeModel, volume, retailPrice, cogsPercent, discountPercent, marketingCost } = dealParams;
  const totalRevenue = volume * retailPrice;
  const totalCogs = (cogsPercent / 100) * totalRevenue;

  let modelLabel = "Co-branded Capsule Group";
  let fugaloRevenue = 0;
  let dlpRevenue = 0;
  let fugaloCosts = 0;
  let dlpCosts = 0;

  if (activeModel === "wholesale") {
    modelLabel = "Wholesale Model (Mua sỉ thương mại)";
    const purchaseCost = totalRevenue * (1 - discountPercent / 100);
    fugaloRevenue = totalRevenue;
    dlpRevenue = purchaseCost;
    fugaloCosts = purchaseCost + marketingCost;
    dlpCosts = totalCogs;
  } else if (activeModel === "revshare") {
    modelLabel = "Revenue Share Model (Hợp tác ăn chia doanh thu)";
    fugaloRevenue = totalRevenue * (discountPercent / 100);
    dlpRevenue = totalRevenue * (1 - discountPercent / 100);
    fugaloCosts = marketingCost * 0.5;
    dlpCosts = totalCogs + marketingCost * 0.5;
  } else {
    modelLabel = "Co-branded Capsule Line (Đồng sáng lập bộ sưu tập liên doanh)";
    const totalIntegratedCosts = totalCogs + marketingCost;
    const netProfitPool = Math.max(0, totalRevenue - totalIntegratedCosts);
    fugaloRevenue = netProfitPool * 0.5;
    dlpRevenue = totalCogs + netProfitPool * 0.5;
    fugaloCosts = marketingCost * 0.5;
    dlpCosts = totalCogs + marketingCost * 0.5;
  }

  const fugaloNet = Math.round(fugaloRevenue - (activeModel === "capsule" ? 0 : fugaloCosts));
  const dlpNet = Math.round(dlpRevenue - dlpCosts);

  // Status computation for cover page badge
  const getClearanceStatusBadge = () => {
    if (clearanceScore >= 85) return { text: "TIÊU CHUẨN AN TOÀN CAO (APPROVED)", color: "text-emerald-700 bg-emerald-50 border-emerald-300" };
    if (clearanceScore >= 50) return { text: "CÓ KHẢ THI - CẦN GIÁM SÁT (FEASIBLE WITH CAUTION)", color: "text-amber-700 bg-amber-50 border-amber-300" };
    return { text: "CẢNH BÁO RỦI RO CAO (HIGH RISK WARNING)", color: "text-rose-700 bg-rose-50 border-rose-300" };
  };

  const statusBadge = getClearanceStatusBadge();

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    let md = `# ${reportTitle}\n`;
    md += `Mã hiệu tài liệu: ${docRefId} | Ngày cấp: ${todayStr}\n`;
    md += `Người lập báo cáo: ${signeeName} (BOD Fugalo)\n`;
    md += `Tỷ lệ vượt chuẩn Thẩm định: ${clearanceScore}%\n\n`;

    if (includeSWOT) {
      md += `## 1. PHÂN TÍCH SWOT & ĐỊNH HƯỚNG\n`;
      md += `- Điểm mạnh: Đồ da thủ công cao cấp, tay nghề thợ cả lâu năm, sản phẩm tinh xảo độc đáo.\n`;
      md += `- Điểm yếu: Tính minh bạch pháp lý/tài chính còn vướng mắc lịch sử, thương hiệu có rủi ro trùng tên quốc tế.\n`;
      md += `- Cơ hội: Nhúng trực tiếp tệp khách VIP sỉ lẻ từ Fugalo để mua chéo, khai sinh mô hình tuần hoàn Spa Refresh.\n`;
      md += `- Thách thức: Tranh chấp quyền bảo hộ thương hiệu từ Louis Vuitton Malletier tại một số thị trường ngoại biên.\n\n`;
    }

    if (includeChecklist) {
      md += `## 2. BẢNG TIẾN TRÌNH THẨM ĐỊNH DUE DILIGENCE\n`;
      checklistItems.forEach(item => {
        md += `- [${item.status === 'passed' ? 'x' : ' '}] ${item.vietnameseQuestion} (Đánh giá rủi ro: ${item.riskLevel.toUpperCase()} | Trạng thái: ${item.status.toUpperCase()})\n`;
      });
      md += `\n`;
    }

    if (includeCalculator) {
      md += `## 3. MÔ PHỎNG TÀI CHÍNH LIÊN DOANH (ACTIVE MODEL: ${modelLabel.toUpperCase()})\n`;
      md += `- Sản lượng tiêu thụ mô phỏng: ${volume} sản phẩm\n`;
      md += `- Giá bán lẻ dự kiến bình quân: ${formatVND(retailPrice)}\n`;
      md += `- Tổng doanh thu ước tính: ${formatVND(totalRevenue)}\n`;
      md += `- Lợi nhuận ròng dự kiến Fugalo Co., Ltd: ${formatVND(fugaloNet)}\n`;
      md += `- Lợi nhuận ròng dự kiến Dans la Peau: ${formatVND(dlpNet)}\n\n`;
    }

    if (includeTimeline) {
      md += `## 4. LỘ TRÌNH VẬN HÀNH PILOT 90 NGÀY\n`;
      md += `- Giai đoạn 1 (Ngày 1-30): Thẩm định Due Diligence bổ sung xưởng & Chốt sườn dải giá.\n`;
      md += `- Giai đoạn 2 (Ngày 31-60): Thiết kế rập, PP Sample & Chế tác mẫu thử thủ công Capsule.\n`;
      md += `- Giai đoạn 3 (Ngày 61-90): Sản xuất loạt thử nghiệm, Activation tệp khách hàng VIP & Go-Live.\n\n`;
    }

    if (includeStaffing) {
      md += `## 5. CƠ CẤU TỔ CHỨC & STAFFING PLAN\n`;
      md += `- Bộ khung nhân sự 13 chuyên viên đặc cách (Dedicated Squad) cho liên minh thực tế.\n`;
      md += `- Program Director và Finance Controller kiểm soát cost, QA Manager đốc thúc sản lượng.\n\n`;
    }

    if (includeBudgetAndRaci) {
      md += `## 6. DỰ TOÁN NGÂN SÁCH PILOT & MA TRẬN RACI\n`;
      md += `- Dự trù kinh phí 90 ngày: 1,95 tỷ - 4,68 tỷ VND tùy theo kịch bản rủi ro.\n`;
      md += `- Phân định minh bạch ma trận RACI giữa ban điều hành và xưởng thợ cả.\n\n`;
    }

    if (includePlaybook) {
      md += `## 7. BATTLE PLAYBOOK 13 TUẦN VÀ CHỈ TIÊU KIP GATES\n`;
      md += `- Thiết mốc 3 Gates chốt chặn quan trọng tại các ngày 30, 60 và 90 đánh giá tiến trình.\n`;
      md += `- Ràng buộc chỉ tiêu QA dưới 2.5% loại bỏ lỗi, blended margin đạt &gt;= 55%.\n\n`;
    }

    if (includeMOU) {
      md += `## 8. BẢN GHI NHỚ GHI NHẬN HỢP TÁC LIÊN DOANH (MOU)\n`;
      md += `- Ghi nhận cơ cấu đóng góp, quyền điều phối thương hiệu và phân chia lợi tức sau thuế.\n\n`;
    }

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  // Dynamic page numbering sequence computed based on current user filter configuration
  let seqIdx = 0;
  const pageNums = {
    cover: includeCover ? ++seqIdx : 0,
    swot: includeSWOT ? ++seqIdx : 0,
    checklist: includeChecklist ? ++seqIdx : 0,
    calculator: includeCalculator ? ++seqIdx : 0,
    timeline: includeTimeline ? ++seqIdx : 0,
    staffing: includeStaffing ? ++seqIdx : 0,
    budget: includeBudgetAndRaci ? ++seqIdx : 0,
    playbook: includePlaybook ? ++seqIdx : 0,
    mou: includeMOU ? ++seqIdx : 0,
  };
  const totalReportPages = seqIdx || 1;

  return (
    <div className="fixed inset-0 bg-stone-150 bg-stone-100 z-50 flex flex-col md:flex-row font-sans text-stone-800 overflow-hidden no-print" id="print-report-workspace">
      
      {/* Dynamic Native CSS Injection for print layout page controls */}
      <style>{`
        @media print {
          /* Hide everything except the print template */
          body, html {
            background: #ffffff !important;
            color: #000000 !important;
            height: auto !important;
            overflow: visible !important;
          }
          #print-report-workspace {
            display: none !important;
          }
          #app-root, #app-header, #app-footer, .no-print {
            display: none !important;
          }
          #print-document-container {
            display: block !important;
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
          }
          .print-a4-page {
            display: block !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 auto !important;
            padding: 24mm 20mm !important;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            color: #1c1917 !important;
            page-break-after: always !important;
            break-after: page !important;
            font-size: 13px !important;
            line-height: 1.6 !important;
          }
          .print-page-header {
            display: flex !important;
            justify-content: space-between !important;
            border-bottom: 1px solid #e7e5e4 !important;
            padding-bottom: 2mm !important;
            margin-bottom: 8mm !important;
            font-size: 9px !important;
            color: #78716c !important;
            text-transform: uppercase !important;
            letter-spacing: 0.05em !important;
          }
          .print-page-footer {
            position: absolute !important;
            bottom: 15mm !important;
            left: 20mm !important;
            right: 20mm !important;
            display: flex !important;
            justify-content: space-between !important;
            border-top: 1px solid #e7e5e4 !important;
            padding-top: 2mm !important;
            font-size: 8px !important;
            color: #78716c !important;
          }
        }
      `}</style>

      {/* LEFT PANEL: configuration & filters */}
      <div className="w-full md:w-80 bg-white border-b md:border-b-0 md:border-r border-stone-200 p-5 flex flex-col justify-between overflow-y-auto shrink-0 select-none z-10">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <button 
              onClick={onClose}
              className="flex items-center gap-1.5 text-xs text-stone-605 text-stone-600 hover:text-stone-900 transition-colors py-1 cursor-pointer font-bold"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Quay lại Dashboard</span>
            </button>
            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 font-mono font-bold px-2 py-0.5 rounded shadow-sm">
              PDF EXPORT
            </span>
          </div>

          <div className="space-y-1">
            <h2 className="text-base font-serif font-bold text-stone-900 flex items-center gap-2">
              <Printer className="w-4 h-4 text-amber-600" />
              Cấu hình Bản in PDF
            </h2>
            <p className="text-xs text-stone-600 font-sans font-semibold leading-relaxed">
              Tùy chỉnh thông tin báo cáo đồng bộ hóa số liệu trước khi xuất bản bản cứng dành cho các cấp lãnh đạo thảo luận trực tiếp.
            </p>
          </div>

          {/* Form setup */}
          <div className="space-y-4 pt-3 border-t border-stone-100">
            <div className="space-y-1">
              <label className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block font-bold">Tiêu đề báo cáo</label>
              <textarea 
                rows={2}
                value={reportTitle}
                onChange={(e) => setReportTitle(e.target.value)}
                className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded p-2 focus:outline-none focus:border-amber-600 font-sans font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <label className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block font-bold">Người ký (Fugalo)</label>
                <input 
                  type="text" 
                  value={signeeName}
                  onChange={(e) => setSigneeName(e.target.value)}
                  className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded p-2 focus:outline-none focus:border-amber-600 font-sans font-semibold"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block font-bold">Đại diện (DLP)</label>
                <input 
                  type="text" 
                  value={partnerSignatory}
                  onChange={(e) => setPartnerSignatory(e.target.value)}
                  className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded p-2 focus:outline-none focus:border-amber-600 font-sans font-semibold"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block font-bold">Mã hiệu tài liệu</label>
              <input 
                type="text" 
                value={docRefId}
                onChange={(e) => setDocRefId(e.target.value)}
                className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded p-2 focus:outline-none focus:border-amber-600 font-sans font-semibold"
              />
            </div>
          </div>

          {/* Section filters */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <span className="text-[10px] text-stone-500 font-mono uppercase tracking-wider block font-bold">Các phần có trong báo cáo</span>
            
            <div className="space-y-2 font-sans text-xs">
              <label className="flex items-center gap-2 text-stone-705 text-stone-700 cursor-pointer select-none font-semibold">
                <input 
                  type="checkbox" 
                  checked={includeCover}
                  onChange={(e) => setIncludeCover(e.target.checked)}
                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Trang bìa chính trị & Pháp danh</span>
              </label>

              <label className="flex items-center gap-2 text-stone-705 text-stone-700 cursor-pointer select-none font-semibold">
                <input 
                  type="checkbox" 
                  checked={includeSWOT}
                  onChange={(e) => setIncludeSWOT(e.target.checked)}
                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Đánh giá SWOT & Trục Chiến Lược</span>
              </label>

              <label className="flex items-center gap-2 text-stone-705 text-stone-700 cursor-pointer select-none font-semibold">
                <input 
                  type="checkbox" 
                  checked={includeChecklist}
                  onChange={(e) => setIncludeChecklist(e.target.checked)}
                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Bảng thẩm định Due Diligence</span>
              </label>

              <label className="flex items-center gap-2 text-stone-705 text-stone-700 cursor-pointer select-none font-semibold">
                <input 
                  type="checkbox" 
                  checked={includeCalculator}
                  onChange={(e) => setIncludeCalculator(e.target.checked)}
                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Mô phỏng Tài chính thực tế</span>
              </label>

              <label className="flex items-center gap-2 text-stone-705 text-stone-700 cursor-pointer select-none font-semibold">
                <input 
                  type="checkbox" 
                  checked={includeTimeline}
                  onChange={(e) => setIncludeTimeline(e.target.checked)}
                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Lịch trình Giai đoạn (90 ngày)</span>
              </label>

              <label className="flex items-center gap-2 text-stone-705 text-stone-700 cursor-pointer select-none font-semibold">
                <input 
                  type="checkbox" 
                  checked={includeStaffing}
                  onChange={(e) => setIncludeStaffing(e.target.checked)}
                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Cơ cấu & Staffing Plan (Nhân sự)</span>
              </label>

              <label className="flex items-center gap-2 text-stone-705 text-stone-700 cursor-pointer select-none font-semibold">
                <input 
                  type="checkbox" 
                  checked={includeBudgetAndRaci}
                  onChange={(e) => setIncludeBudgetAndRaci(e.target.checked)}
                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Ngân sách Pilot & Ma trận RACI</span>
              </label>

              <label className="flex items-center gap-2 text-stone-705 text-stone-700 cursor-pointer select-none font-semibold">
                <input 
                  type="checkbox" 
                  checked={includePlaybook}
                  onChange={(e) => setIncludePlaybook(e.target.checked)}
                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Playbook 13 Tuần thực chiến</span>
              </label>

              <label className="flex items-center gap-2 text-stone-705 text-stone-700 cursor-pointer select-none font-semibold">
                <input 
                  type="checkbox" 
                  checked={includeMOU}
                  onChange={(e) => setIncludeMOU(e.target.checked)}
                  className="rounded border-stone-300 bg-white text-amber-600 focus:ring-0 focus:ring-offset-0"
                />
                <span>Bản ghi nhớ MOU chính thức</span>
              </label>
            </div>
          </div>
        </div>

        {/* PRINT ACTIONS */}
        <div className="space-y-3 pt-4 border-t border-stone-100 font-sans">
          <button
            onClick={handlePrint}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-amber-700 to-amber-600 hover:from-amber-600 hover:to-amber-500 text-white font-extrabold rounded-lg text-sm cursor-pointer shadow-md hover:shadow-lg transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Mở Hộp Thoại In (Lưu PDF)</span>
          </button>
          
          <button
            onClick={handleCopyMarkdown}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 font-bold rounded-lg text-xs cursor-pointer transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? "Đã sao chép Markdown!" : "Copy Báo Cáo dạng ký tự"}</span>
          </button>
        </div>
      </div>

      {/* RIGHT PANEL: Live preview viewport simulating physical pages */}
      <div className="flex-1 bg-stone-100 p-6 sm:p-10 overflow-y-auto flex justify-center selection:bg-amber-100 selection:text-stone-900" id="live-print-viewport">
        
        {/* Document stack layout representing physical A4 pages */}
        <div className="max-w-4xl w-full space-y-12 pb-16" id="print-document-container">
          
          {/* NOTICE FOR ON-SCREEN ONLY */}
          <div className="bg-amber-900/10 border border-amber-800/20 p-4 rounded-lg text-stone-400 text-xs flex items-center gap-3 no-print max-w-[210mm] mx-auto">
            <span className="flex-shrink-0 w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <div className="leading-normal">
              <strong>Trình mô phỏng trang A4 vật lý:</strong> Biên bản bên dưới đang hiển thị đúng theo định dạng in văn phòng tiêu chuẩn. Hãy nhấn nút <strong>"Mở Hộp Thoại In"</strong> để lưu thành tệp tin PDF độ phân giải cao hoặc gửi lệnh tới máy in cá nhân của bạn.
            </div>
          </div>

          {/* PAGE 1: COVER PAGE */}
          {includeCover && (
            <div className="print-a4-page bg-white text-stone-900 border border-stone-300 w-[210mm] min-h-[297mm] mx-auto p-[20mm] font-serif flex flex-col justify-between relative shadow-2xl">
              
              {/* Thin formal interior border line */}
              <div className="absolute inset-[10mm] border border-stone-200 pointer-events-none" />

              {/* Standard Page Header */}
              <div className="print-page-header hidden">
                <span>FUGALO CO., LTD — STRATEGIC M&A CENTER</span>
                <span>MẬT - NỘI BỘ</span>
              </div>

              {/* Top Banner Branding */}
              <div className="space-y-4 pt-12 relative z-10 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
                <div className="space-y-3 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-950 text-amber-400 font-sans font-bold text-[10px] tracking-widest uppercase rounded">
                    Fugalo × Dans la Peau Partnership JV
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs font-sans tracking-widest text-stone-500 uppercase block font-bold">BÁO CÁO THẨM ĐỊNH M&A CHÍNH THỨC</span>
                    <p className="text-xs font-sans text-stone-400 font-mono">CODE: {docRefId}</p>
                  </div>
                </div>
                <FugaloBrand size={56} className="shrink-0 scale-95 sm:scale-100 origin-center sm:origin-top-right" />
              </div>

              {/* Main Title Block */}
              <div className="space-y-6 my-auto relative z-10 py-12">
                <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 font-serif leading-tight">
                  {reportTitle}
                </h1>
                
                {/* Thin divider */}
                <div className="w-16 h-[2px] bg-amber-600 my-4" />
                
                <p className="text-sm text-stone-605 leading-relaxed font-sans font-normal max-w-xl">
                  Khảo nghiệm chi tiết khả năng liên thông tệp khách hàng thượng lưu, phân định pháp lý quyền sở hữu trí tuệ, dự phóng cơ chế ăn chia tài chính và phác thảo lộ trình 90 ngày thiết lập liên doanh đồ da cao cấp.
                </p>

                {/* Clearance appraisal badge */}
                <div className="pt-4 font-sans no-scrollbar">
                  <div className={`inline-block border rounded-lg px-4 py-2.5 ${statusBadge.color}`}>
                    <div className="text-[10px] font-mono tracking-wider font-semibold">TỶ LỆ KIỂM TRÊN DOANH NGHIỆP TRƯỚC SÁP NHẬP</div>
                    <div className="text-lg font-bold flex items-baseline gap-2 mt-0.5">
                      <span>{clearanceScore}% Clearance Rate</span>
                      <span className="text-[11px] font-normal">({statusBadge.text})</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Metadata & Signature Area */}
              <div className="border-t border-stone-200 pt-6 relative z-10 font-sans">
                <div className="grid grid-cols-2 gap-4 text-xs text-stone-500 leading-relaxed">
                  <div>
                    <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500 block mb-1">Cơ quan thực hiện</span>
                    <strong className="text-stone-800">Fugalo Co., Ltd. M&A Division</strong><br />
                    <span>Bộ phận Phát triển Môi trường Thương mại</span><br />
                    <span className="text-stone-400 font-mono">Đánh giá viên: {signeeName}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold uppercase tracking-wider text-[10px] text-stone-500 block mb-1 font-sans">Đối tác thụ kiểm</span>
                    <strong className="text-stone-800">Thương hiệu Dans la Peau</strong><br />
                    <span>Đại diện: {partnerSignatory}</span><br />
                    <span>Ngày lập biên bản: {todayStr}</span>
                  </div>
                </div>
              </div>

              {/* Standard Page Footer */}
              <div className="print-page-footer hidden">
                <span>Tài liệu mật phục vụ khảo sát nội bộ sáp nhập - Fugalo Co., Ltd © 2026</span>
                <span>Trang {pageNums.cover} / {totalReportPages}</span>
              </div>
            </div>
          )}

          {/* PAGE 2: SWOT ANALYSIS & STRATEGIC AXES */}
          {includeSWOT && (
            <div className="print-a4-page bg-white text-stone-900 border border-stone-300 w-[210mm] min-h-[297mm] mx-auto p-[20mm] font-serif flex flex-col justify-between relative shadow-2xl">
              
              {/* Standard Page Header */}
              <div className="print-page-header hidden">
                <span>FUGALO CO., LTD — STRATEGIC M&A CENTER</span>
                <span>PHẦN I: PHÂN TÍCH SWOT & TRỤC LIÊN KẾT</span>
              </div>

              <div className="space-y-8 relative z-10 flex-1">
                <div className="border-b border-stone-200 pb-4">
                  <span className="text-[10px] font-sans font-mono uppercase tracking-widest text-amber-600 block">Phần I</span>
                  <h2 className="text-xl font-bold font-serif text-stone-900">SWOT Analysis & 5 Trục Liên Kết Hoạt Động</h2>
                  <p className="text-xs text-stone-500 font-sans mt-1">
                    Bản phân định những điểm thuận lợi cốt lõi, nguy cơ đe dọa pháp lý của nhãn hiệu quốc tế và giải pháp liên kết.
                  </p>
                </div>

                {/* SWOT Box Block */}
                <div className="grid grid-cols-2 gap-4 font-sans text-xs">
                  {/* Strengths */}
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200 rounded-lg space-y-1.5 height-full">
                    <h3 className="font-bold text-emerald-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      S - Điển Mạnh (Strengths)
                    </h3>
                    <ul className="list-disc pl-4 space-y-1 text-stone-600 leading-relaxed">
                      <li>Tay nghề thủ công khâu tay saddle stitch độc bản tinh xảo từ Dans la Peau.</li>
                      <li>Vùng cung ứng và xử lý da chất lượng cao từ các dòng da Hermès danh giá.</li>
                      <li>Khả năng cá nhân hóa (Bespoke) đẳng cấp tối ưu cho các sản phẩm nhỏ lẻ.</li>
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-4 bg-orange-50/50 border border-orange-200 rounded-lg space-y-1.5 height-full">
                    <h3 className="font-bold text-orange-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      W - Điểm Yếu (Weaknesses)
                    </h3>
                    <ul className="list-disc pl-4 space-y-1 text-stone-600 leading-relaxed">
                      <li>Hồ sơ tài chính chưa kiểm toán độc lập, còn tồn dư công nợ cá nhân chưa giải phóng.</li>
                      <li>Sản lượng chế tác đơn chiếc hạn chế, khó đảm bảo tiến độ sỉ quy mô lớn.</li>
                      <li>Khả năng tiếp cận thị trường và quản trị kỹ thuật số còn thô sơ.</li>
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="p-4 bg-blue-50/50 border border-blue-200 rounded-lg space-y-1.5 height-full">
                    <h3 className="font-bold text-blue-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      O - Cơ Hội (Opportunities)
                    </h3>
                    <ul className="list-disc pl-4 space-y-1 text-stone-600 leading-relaxed">
                      <li>Nhúng thẳng dịch vụ phụ trợ da hạt tại chuỗi Showroom VIP của Fugalo (TP. Hồ Chí Minh).</li>
                      <li>Gói dịch vụ Spa Refresh tái tạo hàng hiệu, thu hút tệp khách hàng mua túi hiệu cũ.</li>
                      <li>Ra mắt dòng Capsule bền vững "Crafted for Second Life" thân thiện môi trường.</li>
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="p-4 bg-rose-55/50 border border-rose-220/80 rounded-lg space-y-1.5 height-full bg-rose-50/40">
                    <h3 className="font-bold text-rose-800 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-rose-500" />
                      T - Thách Thức (Threats)
                    </h3>
                    <ul className="list-disc pl-4 space-y-1 text-stone-600 leading-relaxed">
                      <li>Tranh chấp bảo hộ nhãn hiệu toàn cầu với Louis Vuitton Malletier (tên "Dans la Peau" trùng dòng nước hoa LV).</li>
                      <li>Giới hạn pháp nhân nếu xảy ra sự vụ tịch thu nhãn hiệu ở Mỹ hoặc EU.</li>
                      <li>Dễ bị bắt chước bởi các xưởng đồ da thủ công giá rẻ trong nước.</li>
                    </ul>
                  </div>
                </div>

                {/* 5 Strategic Axes of cooperation */}
                <div className="space-y-3 font-sans mt-4">
                  <h3 className="text-xs font-bold font-mono text-stone-800 uppercase tracking-wider">
                    5 Trục Hợp Tác Bền Vững Đề Xuất
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-[10px]">
                    <div className="p-2.5 border border-stone-200 rounded">
                      <div className="font-bold text-stone-900 mb-1">Trục 1: Co-Founder</div>
                      <p className="text-stone-500 leading-tight">Liên doanh độc lập cho dòng mới, tránh gánh nợ cũ của công ty gốc.</p>
                    </div>
                    <div className="p-2.5 border border-stone-200 rounded">
                      <div className="font-bold text-stone-900 mb-1">Trục 2: Showroom</div>
                      <p className="text-stone-500 leading-tight">Ưu tiên trải nghiệm thực địa 90 ngày tại cơ sở TP. Hồ Chí Minh, kiểm nghiệm dòng tiền.</p>
                    </div>
                    <div className="p-2.5 border border-stone-200 rounded">
                      <div className="font-bold text-stone-900 mb-1">Trục 3: Circular</div>
                      <p className="text-stone-500 leading-tight">Gia tăng doanh thu chéo từ bảo dưỡng túi hiệu cũ cao cấp.</p>
                    </div>
                    <div className="p-2.5 border border-stone-200 rounded">
                      <div className="font-bold text-stone-900 mb-1">Trục 4: IP Guard</div>
                      <p className="text-stone-500 leading-tight">Tra cứu nhãn hiệu bảo hiểm rủi ro Louis Vuitton trước khi mở rộng.</p>
                    </div>
                    <div className="p-2.5 border border-stone-200 rounded">
                      <div className="font-bold text-stone-900 mb-1">Trục 5: Audit M&A</div>
                      <p className="text-stone-500 leading-tight">Thanh tra thực tế xưởng 10.000m² và năng lực số thợ cả tại chỗ.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Standard Page Footer */}
              <div className="print-page-footer hidden">
                <span>Tài liệu mật phục vụ khảo sát nội bộ sáp nhập - Fugalo Co., Ltd © 2026</span>
                <span>Trang {pageNums.swot} / {totalReportPages}</span>
              </div>
            </div>
          )}

          {/* PAGE 3: DUE DILIGENCE CHECKLIST */}
          {includeChecklist && (
            <div className="print-a4-page bg-white text-stone-900 border border-stone-300 w-[210mm] min-h-[297mm] mx-auto p-[20mm] font-serif flex flex-col justify-between relative shadow-2xl">
              
              {/* Standard Page Header */}
              <div className="print-page-header hidden">
                <span>FUGALO CO., LTD — STRATEGIC M&A CENTER</span>
                <span>PHẦN II: KHẢO SÁT DOANH NGHIỆP DILIGENCE CHECKLIST</span>
              </div>

              <div className="space-y-6 relative z-10 flex-1 font-sans">
                <div className="border-b border-stone-200 pb-4 font-serif">
                  <span className="text-[10px] font-sans font-mono uppercase tracking-widest text-amber-600 block">Phần II</span>
                  <h2 className="text-xl font-bold text-stone-900">Bảng Thẩm Định Thực Địa Doanh Nghiệp (Due Diligence Checklist)</h2>
                  <p className="text-xs text-stone-500 font-sans mt-1">
                    Trạng thái kiểm nghiệm các chỉ tiêu pháp lý hoạt động và quản trị vận hành để bảo vệ quỹ đầu tư.
                  </p>
                </div>

                {/* Checklist Summary Scores */}
                <div className="grid grid-cols-3 gap-3 bg-stone-50 p-3 rounded-lg border border-stone-200">
                  <div className="text-center py-2 border-r border-stone-200">
                    <span className="text-[9px] text-stone-500 uppercase tracking-wider block font-semibold">Tỉ số Thẩm định</span>
                    <strong className="text-2xl font-serif text-amber-600 block mt-0.5">{clearanceScore}%</strong>
                  </div>
                  <div className="text-center py-2 border-r border-stone-200">
                    <span className="text-[9px] text-stone-500 uppercase tracking-wider block font-semibold">Đạt chuẩn (Passed)</span>
                    <strong className="text-2xl font-serif text-emerald-600 block mt-0.5">
                      {checklistItems.filter(i => i.status === "passed").length} / {checklistItems.length}
                    </strong>
                  </div>
                  <div className="text-center py-2">
                    <span className="text-[9px] text-stone-500 uppercase tracking-wider block font-semibold">Mức rủi ro trung bình</span>
                    <strong className="text-2xl font-serif text-stone-700 block mt-0.5">MEDIUM</strong>
                  </div>
                </div>

                {/* Table list of checklist items */}
                <div className="overflow-x-auto">
                  <table className="w-full text-[11px] text-left border-collapse border border-stone-200">
                    <thead>
                      <tr className="bg-stone-100 text-stone-700 border-b border-stone-200">
                        <th className="p-2 border-r border-stone-200 font-semibold w-12 text-center">STT</th>
                        <th className="p-2 border-r border-stone-200 font-semibold w-24">Phân loại</th>
                        <th className="p-2 border-r border-stone-200 font-semibold">Chỉ tiêu thẩm định</th>
                        <th className="p-2 border-r border-stone-200 font-semibold w-16 text-center">Rủi ro</th>
                        <th className="p-2 font-semibold w-24 text-center">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {checklistItems.map((item, index) => {
                        let statusColor = "text-stone-500 bg-stone-100";
                        let statusText = "Chờ duyệt";
                        if (item.status === "passed") {
                          statusColor = "text-emerald-700 bg-emerald-50 border border-emerald-200";
                          statusText = "Đạt chuẩn";
                        } else if (item.status === "failed") {
                          statusColor = "text-rose-700 bg-rose-50 border border-rose-200";
                          statusText = "Từ chối";
                        } else if (item.status === "action_required") {
                          statusColor = "text-amber-700 bg-amber-50 border border-amber-200";
                          statusText = "Cần sửa";
                        }

                        return (
                          <tr key={item.id} className="border-b border-stone-200 hover:bg-stone-50">
                            <td className="p-2 border-r border-stone-200 text-center font-mono">{index + 1}</td>
                            <td className="p-2 border-r border-stone-200 uppercase font-mono tracking-wider text-[9px] font-bold text-stone-500">
                              {item.category}
                            </td>
                            <td className="p-2 border-r border-stone-200">
                              <span className="font-medium text-stone-800">{item.vietnameseQuestion}</span>
                              <p className="text-[10px] text-stone-500 italic leading-snug mt-0.5">{item.details}</p>
                            </td>
                            <td className="p-2 border-r border-stone-200 text-center uppercase text-[9px] font-bold font-mono">
                              <span className={item.riskLevel === 'high' ? "text-rose-600" : item.riskLevel === 'medium' ? "text-amber-600" : "text-stone-500"}>
                                {item.riskLevel}
                              </span>
                            </td>
                            <td className="p-1.5 text-center">
                              <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-bold ${statusColor}`}>
                                {statusText}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="bg-amber-50 p-2.5 border border-amber-200 rounded text-[10px] leading-relaxed text-amber-900 mt-2">
                  <strong>Khuyến nghị của Kiểm toán liên thông:</strong> Bắt buộc hoàn thành thủ tục số #3 (Tranh chấp tên Dans la Peau) và #8 (Thực địa xưởng thợ cả 10.000m² tại Bình Dương hoặc xưởng chính thức) trước khi gửi bản thỏa thuận sáp nhập vốn dài hạn.
                </div>
              </div>

              {/* Standard Page Footer */}
              <div className="print-page-footer hidden">
                <span>Tài liệu mật phục vụ khảo sát nội bộ sáp nhập - Fugalo Co., Ltd © 2026</span>
                <span>Trang {pageNums.checklist} / {totalReportPages}</span>
              </div>
            </div>
          )}

          {/* PAGE 4: FINANCIAL SIMULATOR & MODEL */}
          {includeCalculator && (
            <div className="print-a4-page bg-white text-stone-900 border border-stone-300 w-[210mm] min-h-[297mm] mx-auto p-[20mm] font-serif flex flex-col justify-between relative shadow-2xl">
              
              {/* Standard Page Header */}
              <div className="print-page-header hidden">
                <span>FUGALO CO., LTD — STRATEGIC M&A CENTER</span>
                <span>PHẦN III: MÔ PHỎNG TÀI CHÍNH LIÊN DOANH</span>
              </div>

              <div className="space-y-6 relative z-10 flex-1 font-sans">
                <div className="border-b border-stone-200 pb-4 font-serif">
                  <span className="text-[10px] font-sans font-mono uppercase tracking-widest text-amber-600 block">Phần III</span>
                  <h2 className="text-xl font-bold text-stone-900">Mô phỏng Tài chính Joint Venture (Deal Simulator)</h2>
                  <p className="text-xs text-stone-500 font-sans mt-1">
                    Bản đối soát ăn chia lợi nhuận ròng dựa trên các tham số cấu hình linh hoạt phục vụ thương lượng.
                  </p>
                </div>

                <div className="p-4 border-l-4 border-amber-500 bg-stone-50 space-y-1 rounded-r-lg">
                  <div className="text-[9px] font-mono tracking-widest text-stone-500 uppercase">MÔ HÌNH HOẠT ĐỘNG CHỦ ĐẠO</div>
                  <strong className="text-sm text-stone-900 uppercase font-serif tracking-wide block">{modelLabel}</strong>
                  <p className="text-[10px] text-stone-500 italic leading-snug">
                    Hệ thống tính toán bù trừ hoàn toàn chi phí sản xuất (COGS) và tự động phân phối lợi nhuận dựa trên tỉ lệ ăn chia thỏa thuận.
                  </p>
                </div>

                {/* Simulation Inputs Table */}
                <div className="space-y-2">
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider block font-mono">
                    1. Các thông số giả định thương thảo
                  </h3>
                  <div className="grid grid-cols-4 gap-3 text-center">
                    <div className="p-2 border border-stone-200 rounded">
                      <span className="text-[9px] text-stone-500 block uppercase font-mono">Sản lượng kỳ vọng</span>
                      <strong className="text-xs text-stone-900 block mt-0.5">{volume} sản phẩm</strong>
                    </div>
                    <div className="p-2 border border-stone-200 rounded">
                      <span className="text-[9px] text-stone-500 block uppercase font-mono">Giá bán trung bình</span>
                      <strong className="text-xs text-stone-900 block mt-0.5">{formatVND(retailPrice)}</strong>
                    </div>
                    <div className="p-2 border border-stone-200 rounded">
                      <span className="text-[9px] text-stone-500 block uppercase font-mono">Chi phí sản xuất (DLP)</span>
                      <strong className="text-xs text-stone-900 block mt-0.5">{cogsPercent}% giá lẻ</strong>
                    </div>
                    <div className="p-2 border border-stone-200 rounded">
                      <span className="text-[9px] text-stone-500 block uppercase font-mono">Mức chiết khấu sỉ/hoa hồng</span>
                      <strong className="text-xs text-stone-900 block mt-0.5">{discountPercent}%</strong>
                    </div>
                  </div>
                </div>

                {/* Financial Output Table */}
                <div className="space-y-3 font-sans mt-4">
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider block font-mono">
                    2. Bảng hạch toán phân chia lợi nhuận ròng
                  </h3>
                  <div className="border border-stone-200 rounded overflow-hidden">
                    <table className="w-full text-xs text-left border-collapse">
                      <thead>
                        <tr className="bg-stone-50 text-stone-700 border-b border-stone-200 text-[11px] font-semibold">
                          <th className="p-2 w-1/3 border-r border-stone-200">Chỉ tiêu hạch toán</th>
                          <th className="p-2 w-1/3 border-r border-stone-200 text-right">Fugalo Co., Ltd (Bán & Spa)</th>
                          <th className="p-2 w-1/3 text-right">Dans la Peau (Xưởng chế tác)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-stone-200">
                          <td className="p-2.5 font-medium text-stone-800 border-r border-stone-200">Doanh thu gộp tích lũy</td>
                          <td className="p-2.5 text-right font-mono border-r border-stone-200 text-stone-600">
                            {formatVND(activeModel === "wholesale" ? totalRevenue : (activeModel === "revshare" ? totalRevenue * (discountPercent/100) : totalRevenue * 0.5))}
                          </td>
                          <td className="p-2.5 text-right font-mono text-stone-600">
                            {formatVND(activeModel === "wholesale" ? totalRevenue * (1 - discountPercent/100) : (activeModel === "revshare" ? totalRevenue * (1 - discountPercent/100) : totalRevenue * 0.5))}
                          </td>
                        </tr>
                        <tr className="border-b border-stone-200 bg-stone-50/40">
                          <td className="p-2.5 font-medium text-stone-800 border-r border-stone-200">Chi phí phân bổ dự phòng (COGS/Marketing)</td>
                          <td className="p-2.5 text-right font-mono border-r border-stone-200 text-stone-600">
                            {formatVND(activeModel === "wholesale" ? totalRevenue * (1 - discountPercent/100) + marketingCost : (activeModel === "revshare" ? marketingCost * 0.5 : marketingCost * 0.5))}
                          </td>
                          <td className="p-2.5 text-right font-mono text-stone-600">
                            {formatVND(activeModel === "wholesale" ? totalCogs : (activeModel === "revshare" ? totalCogs + marketingCost * 0.5 : totalCogs + marketingCost * 0.5))}
                          </td>
                        </tr>
                        <tr className="border-b border-stone-200 font-bold bg-stone-100">
                          <td className="p-2.5 text-stone-900 border-r border-stone-200 uppercase text-[10px] tracking-wider">Lợi nhuận ròng Thực nhận (Net Profit)</td>
                          <td className="p-2.5 text-right font-mono border-r border-stone-200 text-amber-700 text-sm">
                            {formatVND(fugaloNet)}
                          </td>
                          <td className="p-2.5 text-right font-mono text-stone-900 text-sm">
                            {formatVND(dlpNet)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* KPI Benchmarks */}
                <div className="space-y-2 mt-4">
                  <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider block font-mono">
                    3. Chỉ tiêu kiểm soát chất phẩm (Cam kết KPI)
                  </h3>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {kpiTargets.slice(0, 4).map(kpi => (
                      <div key={kpi.id} className="p-2.5 border border-stone-200 rounded flex justify-between items-center">
                        <div>
                          <strong className="text-stone-800 text-[11px] block">{kpi.vietnameseMetric}</strong>
                          <span className="text-[10px] text-stone-500">{kpi.vietnameseDescription}</span>
                        </div>
                        <span className="font-mono text-amber-700 font-bold bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/10 text-[11px]">
                          {kpi.targetValue}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Standard Page Footer */}
              <div className="print-page-footer hidden">
                <span>Tài liệu mật phục vụ khảo sát nội bộ sáp nhập - Fugalo Co., Ltd © 2026</span>
                <span>Trang {pageNums.calculator} / {totalReportPages}</span>
              </div>
            </div>
          )}

          {/* PAGE 5: 90-DAY OPERATIONAL TIMELINE */}
          {includeTimeline && (
            <div className="print-a4-page bg-white text-stone-900 border border-stone-300 w-[210mm] min-h-[297mm] mx-auto p-[20mm] font-serif flex flex-col justify-between relative shadow-2xl">
              
              {/* Standard Page Header */}
              <div className="print-page-header hidden">
                <span>FUGALO CO., LTD — STRATEGIC M&A CENTER</span>
                <span>PHẦN IV: LỘ TRÌNH VẬN HÀNH PILOT 90 NGÀY</span>
              </div>

              <div className="space-y-6 relative z-10 flex-1 font-sans">
                <div className="border-b border-stone-200 pb-4 font-serif">
                  <span className="text-[10px] font-sans font-mono uppercase tracking-widest text-amber-600 block">Phần IV</span>
                  <h2 className="text-xl font-bold text-stone-900">Lộ Trình Vận Hành Thử Nghiệm 90 Ngày</h2>
                  <p className="text-xs text-stone-500 font-sans mt-1">
                    Kịch bản triển khai thí điểm tại Showroom Bình Dương để đảm bảo chất lượng, kiểm định sức mua của các dòng ví hiệu độc quyền.
                  </p>
                </div>

                {/* Step timeline with detail design */}
                <div className="space-y-4">
                  {timelinePhases.map((phase) => (
                    <div key={phase.phaseNumber} className="border border-stone-200 rounded-lg p-3.5 space-y-2 hover:bg-stone-50/50">
                      <div className="flex items-center justify-between border-b border-stone-100 pb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-stone-950 text-white text-[10px] flex items-center justify-center font-bold">
                            {phase.phaseNumber}
                          </span>
                          <strong className="text-stone-900 text-xs font-serif uppercase tracking-wide">
                            Giai đoạn {phase.phaseNumber}: {phase.vietnameseTitle}
                          </strong>
                        </div>
                        <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-400/20">
                          {phase.duration}
                        </span>
                      </div>

                      <div className="text-[11px] grid grid-cols-5 gap-2">
                        <div className="col-span-2 text-stone-600 border-r border-stone-100 pr-2">
                          <span className="font-semibold block text-[10px] text-stone-400 font-mono uppercase">Mục tiêu</span>
                          {phase.objective}
                        </div>
                        <div className="col-span-3 space-y-1 pl-1">
                          <span className="font-semibold block text-[10px] text-stone-400 font-mono uppercase">Hành động then chốt</span>
                          <ul className="space-y-0.5 text-stone-700 list-disc pl-3">
                            {phase.tasks.map(task => (
                              <li key={task.id} className={task.completed ? "list-none flex items-center gap-1 font-medium text-stone-800" : ""}>
                                {task.completed && <Check className="w-2.5 h-2.5 text-emerald-600 flex-shrink-0" />}
                                <span className={task.completed ? "text-stone-900" : ""}>{task.text}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-[10px] text-stone-500 leading-relaxed">
                  <strong>Cam kết tiến độ:</strong> Đúng ngày 90, Ban Thẩm định Fugalo sẽ phối hợp cùng các nhà đồng sáng lập để công bố báo cáo vận hành. Nếu lượng tiêu thụ đạt trên 85% chỉ tiêu bán chéo, hai bên sẽ xúc tiến sáp nhập tài chính ở giai đoạn cuối cùng.
                </div>
              </div>

              {/* Standard Page Footer */}
              <div className="print-page-footer hidden">
                <span>Tài liệu mật phục vụ khảo sát nội bộ sáp nhập - Fugalo Co., Ltd © 2026</span>
                <span>Trang {pageNums.timeline} / {totalReportPages}</span>
              </div>
            </div>
          )}

          {/* PAGE 5B: SPECIALIZED STAFFING & HEADCOUNT PLAN */}
          {includeStaffing && (
            <div className="print-a4-page bg-white text-stone-900 border border-stone-300 w-[210mm] min-h-[297mm] mx-auto p-[20mm] font-serif flex flex-col justify-between relative shadow-2xl">
              <div className="print-page-header hidden">
                <span>FUGALO CO., LTD — STRATEGIC M&A CENTER</span>
                <span>PHẦN V: CƠ CẤU TỔ CHỨC & BỘ KHUNG NHÂN SỰ</span>
              </div>

              <div className="space-y-5 relative z-10 flex-1 font-sans">
                <div className="border-b border-stone-200 pb-3 font-serif">
                  <span className="text-[10px] font-sans font-mono uppercase tracking-widest text-amber-600 block">Phần V</span>
                  <h2 className="text-lg font-bold text-stone-900">Cơ Cấu Tổ Chức & Staffing Plan Dự Án</h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Thiết lập đội ngũ chuyên trách (Dedicated Squad) cho giai đoạn Pilot và chiến lược nhân sự mở rộng.
                  </p>
                </div>

                {/* Grid Summary */}
                <div className="grid grid-cols-3 gap-3 text-center bg-stone-50 p-2.5 rounded border border-stone-200">
                  <div>
                    <span className="text-[8px] text-stone-500 uppercase block font-mono font-bold">Nhân sự dedicated (Pilot)</span>
                    <strong className="text-xs text-stone-900 block mt-0.5">11 - 14 chuyên viên (FTE)</strong>
                  </div>
                  <div className="border-x border-stone-200">
                    <span className="text-[8px] text-stone-500 uppercase block font-mono font-bold">Giai đoạn Launch Capsule</span>
                    <strong className="text-xs text-stone-900 block mt-0.5">17 - 24 nhân lực</strong>
                  </div>
                  <div>
                    <span className="text-[8px] text-stone-500 uppercase block font-mono font-bold">Mở rộng Liên doanh (JV)</span>
                    <strong className="text-xs text-stone-900 block mt-0.5">26 - 35 nhân sự tối đa</strong>
                  </div>
                </div>

                {/* Headcount Detail Table */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-800 uppercase tracking-wider block font-mono">
                    1. Bản dự thảo định biên vai trò chủ chốt & lương tháng (Salary & Role Benchmarking)
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[9px] text-left border-collapse border border-stone-200">
                      <thead>
                        <tr className="bg-stone-50 text-stone-700 border-b border-stone-200 text-[9.5px] font-semibold">
                          <th className="p-1.5 border-r border-stone-200">Chức danh / Bộ phận</th>
                          <th className="p-1.5 border-r border-stone-200 text-center">Cấp bậc</th>
                          <th className="p-1.5 border-r border-stone-200">Trách nhiệm cốt lõi</th>
                          <th className="p-1.5 border-r border-stone-200">KPI tiêu biểu</th>
                          <th className="p-1.5 text-right w-36">Lương Gross (VND & USD)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-stone-200">
                          <td className="p-1.5 border-r border-stone-200 font-bold text-stone-950">Program Director</td>
                          <td className="p-1.5 border-r border-stone-200 text-center">Director</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600 leading-relaxed">Điều hành toàn bộ pilot; chốt gate; giữ quan hệ; chịu P&L pilot.</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600 font-medium">% Milestone; GM Pilot; DD pack</td>
                          <td className="p-1.5 text-right font-mono text-amber-700 font-bold bg-amber-500/5">70M - 120M <span className="text-[7.5px] text-amber-600 font-sans">(~$2.7k-$4.6k)</span></td>
                        </tr>
                        <tr className="border-b border-stone-200 bg-stone-50/30">
                          <td className="p-1.5 border-r border-stone-200 font-bold text-stone-900">Project PMO Manager</td>
                          <td className="p-1.5 border-r border-stone-200 text-center">Manager</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600 leading-relaxed">Master plan; RAID log; điều phối liên phòng; quản lý issue.</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600">Milestone OTIF; Issue rate</td>
                          <td className="p-1.5 text-right font-mono text-stone-850">35M - 55M <span className="text-[7.5px] text-stone-500 font-sans">(~$1.3k-$2.1k)</span></td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td className="p-1.5 border-r border-stone-200 font-bold text-stone-900">Merchandising & Product Lead</td>
                          <td className="p-1.5 border-r border-stone-200 text-center">Manager</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600 leading-relaxed">SKU strategy; price ladder; capsule design brief; samples budget.</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600">SKU Margin; Sample approve</td>
                          <td className="p-1.5 text-right font-mono text-stone-850">35M - 60M <span className="text-[7.5px] text-stone-500 font-sans">(~$1.3k-$2.3k)</span></td>
                        </tr>
                        <tr className="border-b border-stone-200 bg-stone-50/30">
                          <td className="p-1.5 border-r border-stone-200 font-bold text-stone-900">Production & QA Manager</td>
                          <td className="p-1.5 border-r border-stone-200 text-center">Manager</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600 leading-relaxed">SOP QC xưởng thủ công; xưởng audit; warranty feedback loop.</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600 text-stone-600">Defect rate; Rework %; FPY</td>
                          <td className="p-1.5 text-right font-mono text-stone-850">30M - 55M <span className="text-[7.5px] text-stone-500 font-sans">(~$1.1k-$2.1k)</span></td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td className="p-1.5 border-r border-stone-200 font-bold text-stone-900">E-commerce & Web Manager</td>
                          <td className="p-1.5 border-r border-stone-200 text-center">Manager</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600 leading-relaxed">Hạ tầng Haravan; online channel ops; UTM tracking; site merch.</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600">Looker CVR; online Revenue</td>
                          <td className="p-1.5 text-right font-mono text-stone-850">25M - 40M <span className="text-[7.5px] text-stone-500 font-sans">(~$1.0k-$1.5k)</span></td>
                        </tr>
                        <tr className="border-b border-stone-200 bg-stone-50/30">
                          <td className="p-1.5 border-r border-stone-200 font-bold text-stone-900">CRM & Growth Manager</td>
                          <td className="p-1.5 border-r border-stone-200 text-center">Manager</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600 leading-relaxed">Data capture; HubSpot automation; segment; khách hàng loyalty.</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600">Opt-in rate; CRM Revenue</td>
                          <td className="p-1.5 text-right font-mono text-stone-850">25M - 40M <span className="text-[7.5px] text-stone-500 font-sans">(~$1.0k-$1.5k)</span></td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td className="p-1.5 border-r border-stone-200 font-bold text-stone-900">Financial Controller</td>
                          <td className="p-1.5 border-r border-stone-200 text-center">Shared</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600 leading-relaxed">Pilot P&L; costing; cash burn visibility; thu hồi nợ phải thu.</td>
                          <td className="p-1.5 border-r border-stone-200 text-stone-600 font-medium">BOM Variance; TB Close</td>
                          <td className="p-1.5 text-right font-mono text-amber-700 font-bold bg-amber-500/5">30M - 50M <span className="text-[7.5px] text-amber-600 font-sans">(~$1.1k-$1.9k)</span></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Outsourcing vs In-house Logic */}
                <div className="grid grid-cols-2 gap-4 text-[10px] mt-2">
                  <div className="border border-stone-250 p-3 rounded bg-stone-50/30 space-y-1.5">
                    <strong className="text-stone-900 text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      Chiến lược Định vị Nhân sự Lõi:
                    </strong>
                    <p className="text-stone-600 leading-relaxed">
                      Giữ độc quyền in-house hoặc seconded từ Fugalo/DLP các đầu vai trò <strong>"Decision Core"</strong> để bảo vệ thương hiệu và vận tốc. Tổng lương Gross cả đội Pilot dao động khoảng <strong>378 - 636 triệu VND/tháng</strong> (tức khoảng $14.4k - $24.3k/tháng), không gồm thưởng doanh số.
                    </p>
                  </div>
                  <div className="border border-stone-250 p-3 rounded bg-stone-50/30 space-y-1.5">
                    <strong className="text-stone-900 text-xs flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                      Mạng lưới Chuyên gia thuê ngoài:
                    </strong>
                    <p className="text-stone-600 leading-relaxed">
                      Các mảng cần chuyên môn sâu và tính pháp lý cao sẽ thuê ngoài (Retainer/Contracted) gồm: <strong>Chuyên gia Sở hữu trí tuệ (rà soát xung đột tên DANS LA PEAU với Louis Vuitton Malletier ở nước ngoài)</strong>, chuyên gia thiết kế và tư vấn tối ưu hóa Thuế JV.
                    </p>
                  </div>
                </div>
              </div>

              <div className="print-page-footer hidden">
                <span>Tài liệu mật phục vụ khảo sát nội bộ sáp nhập - Fugalo Co., Ltd © 2026</span>
                <span>Trang {pageNums.staffing} / {totalReportPages}</span>
              </div>
            </div>
          )}

          {/* PAGE 5C: PILOT BUDGET & RACI PROTOCOL */}
          {includeBudgetAndRaci && (
            <div className="print-a4-page bg-white text-stone-900 border border-stone-300 w-[210mm] min-h-[297mm] mx-auto p-[20mm] font-serif flex flex-col justify-between relative shadow-2xl">
              <div className="print-page-header hidden">
                <span>FUGALO CO., LTD — STRATEGIC M&A CENTER</span>
                <span>PHẦN VI: NGÂN SÁCH PILOT & MA TRẬN PHÂN QUYỀN (RACI)</span>
              </div>

              <div className="space-y-5 relative z-10 flex-1 font-sans">
                <div className="border-b border-stone-200 pb-3 font-serif">
                  <span className="text-[10px] font-sans font-mono uppercase tracking-widest text-amber-600 block">Phần VI</span>
                  <h2 className="text-lg font-bold text-stone-900">Dự Toán Ngân Sách Pilot 90 Ngày & Ma Trận RACI</h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Bảng phân bổ chi phí dự toán rạch ròi theo hai kịch bản rủi ro và sơ đồ phân quyền để khởi tác liên phòng ban.
                  </p>
                </div>

                {/* Budget Table */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-stone-800 uppercase tracking-wider block font-mono">
                    1. Bảng phân bổ Ngân sách Vận hành 90 ngày (Dự phóng điều hành)
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[9px] text-left border-collapse border border-stone-200">
                      <thead>
                        <tr className="bg-stone-50 text-stone-700 border-b border-stone-200 font-semibold text-[9.5px]">
                          <th className="p-1.5 border-r border-stone-200 w-1/3">Hạng mục chi phí vận hành</th>
                          <th className="p-1.5 border-r border-stone-200 text-right">Kịch bản Tiết kiệm (Low Case)</th>
                          <th className="p-1.5 border-r border-stone-200 text-right">Kịch bản Tiêu chuẩn (Base/High Case)</th>
                          <th className="p-1.5 text-stone-600">Ghi chú chiến lược</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-stone-200">
                          <td className="p-1.5 border-r border-stone-200 font-medium text-stone-900">Quỹ lương cho đội chuyên trách (90 ngày)</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-700">1,13 tỷ VND</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-amber-700 font-bold bg-amber-500/5">1,91 tỷ VND</td>
                          <td className="p-1.5 text-stone-500">Dành cho bộ khung chuyên viên in-house & secondment</td>
                        </tr>
                        <tr className="border-b border-stone-200 bg-stone-50/20">
                          <td className="p-1.5 border-r border-stone-200 font-medium text-stone-900">Chi phí Chuyên gia ngoài & Tax/Accounting DD</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-700">0,35 tỷ VND</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-900">1,00 tỷ VND</td>
                          <td className="p-1.5 text-stone-500">Legal rà soát LV Case, thuế, kiểm kho QoE-lite</td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td className="p-1.5 border-r border-stone-200 font-medium text-stone-900">Hạ tầng CRM, Looker, Web HubSpot & Haravan</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-700">0,09 tỷ VND</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-900">0,27 tỷ VND</td>
                          <td className="p-1.5 text-stone-500">Ghi nhận data tích chéo, tích hợp CRM đo lường</td>
                        </tr>
                        <tr className="border-b border-stone-200 bg-stone-50/20">
                          <td className="p-1.5 border-r border-stone-200 font-medium text-stone-900">Khuôn dập, Sampling & Bao bì Pilot</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-700">0,08 tỷ VND</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-900">0,25 tỷ VND</td>
                          <td className="p-1.5 text-stone-500">Thú bông biểu trưng, túi zip kén bụi, logo mạ kim</td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td className="p-1.5 border-r border-stone-200 font-medium text-stone-900">PR, Thông cáo, Lookbook Co-branded lột tả</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-700">0,15 tỷ VND</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-900">0,45 tỷ VND</td>
                          <td className="p-1.5 text-stone-500">Quay phim xưởng Hội An kể câu chuyện saddle stitch</td>
                        </tr>
                        <tr className="border-b border-stone-200 bg-stone-50/20">
                          <td className="p-1.5 border-r border-stone-200 font-medium text-stone-900">Kênh Quảng cáo & Paid media mua sắm</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-700">0,10 tỷ VND</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-900">0,60 tỷ VND</td>
                          <td className="p-1.5 text-stone-500">Có thể điều vị giảm thiểu dựa trên khách hàng VIP</td>
                        </tr>
                        <tr className="border-b border-stone-200 font-bold bg-stone-100">
                          <td className="p-1.5 border-r border-stone-200">TỔNG NGÂN SÁCH (Không gồm PO sỉ sòng phẳng)</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-stone-900 font-semibold">1,95 tỷ VND</td>
                          <td className="p-1.5 border-r border-stone-200 text-right font-mono text-amber-700 font-bold bg-amber-500/5">4,68 tỷ VND</td>
                          <td className="p-1.5 text-stone-900 font-serif">~ $74,600 - $178,500 USD (Vốn ban đầu)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* RACI Matrix Block */}
                <div className="space-y-1.5 mt-2">
                  <span className="text-[10px] font-bold text-stone-800 uppercase tracking-wider block font-mono">
                    2. Ma trận phân công quyền hạn & Trách nhiệm (RACI Matrix)
                  </span>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[8px] text-center border-collapse border border-stone-200 text-stone-700">
                      <thead>
                        <tr className="bg-stone-50 text-stone-800 border-b border-stone-200 font-bold">
                          <th className="p-1 border-r border-stone-200 text-left w-36">Quy trình vận hành then chốt</th>
                          <th className="p-1 border-r border-stone-200">Giám đốc (PD)</th>
                          <th className="p-1 border-r border-stone-200">Vật tư / Product</th>
                          <th className="p-1 border-r border-stone-200">QA / Xưởng</th>
                          <th className="p-1 border-r border-stone-200">CRM & Growth</th>
                          <th className="p-1 border-r border-stone-200">Thương mại / POS</th>
                          <th className="p-1 border-r border-stone-200">Tài chính</th>
                          <th className="p-1">Pháp chế / Counsel</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-stone-200">
                          <td className="p-1 border-r border-stone-200 text-left font-semibold text-stone-900">Thiết kế mẫu & Duyệt rập</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-amber-600">A</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-emerald-700">R</td>
                          <td className="p-1 border-r border-stone-200">C</td>
                          <td className="p-1 border-r border-stone-200">C</td>
                          <td className="p-1 border-r border-stone-200">I</td>
                          <td className="p-1 border-r border-stone-200">I</td>
                          <td className="p-1">C</td>
                        </tr>
                        <tr className="border-b border-stone-200 bg-stone-50/20">
                          <td className="p-1 border-r border-stone-200 text-left font-semibold text-stone-900">Thị sát kiểm xưởng & Năng suất thợ</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-amber-600">A</td>
                          <td className="p-1 border-r border-stone-200">C</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-emerald-700">R</td>
                          <td className="p-1 border-r border-stone-200">I</td>
                          <td className="p-1 border-r border-stone-200">C</td>
                          <td className="p-1 border-r border-stone-200">I</td>
                          <td className="p-1">C</td>
                        </tr>
                        <tr className="border-b border-stone-200">
                          <td className="p-1 border-r border-stone-200 text-left font-semibold text-stone-900">Đồng bộ tệp CRM (M&A)</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-amber-600">A</td>
                          <td className="p-1 border-r border-stone-200">I</td>
                          <td className="p-1 border-r border-stone-200">I</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-emerald-700">R</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-emerald-700">R</td>
                          <td className="p-1 border-r border-stone-200">I</td>
                          <td className="p-1 font-bold text-emerald-700">R</td>
                        </tr>
                        <tr className="border-b border-stone-200 bg-stone-50/20">
                          <td className="p-1 border-r border-stone-200 text-left font-semibold text-stone-900">Dịch vụ bảo dưỡng & Spa Refresh</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-amber-600">A</td>
                          <td className="p-1 border-r border-stone-200">I</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-emerald-700">R</td>
                          <td className="p-1 border-r border-stone-200">I</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-emerald-700">R</td>
                          <td className="p-1 border-r border-stone-200 font-bold text-emerald-700">R</td>
                          <td className="p-1">C</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <span className="text-[7.5px] italic text-stone-400 block">* Ghi chú: A = Accountable (Chịu trách nhiệm cuối), R = Responsible (Thực hiện), C = Consulted (Tham vấn), I = Informed (Nhận thông tin).</span>
                </div>
              </div>

              <div className="print-page-footer hidden">
                <span>Tài liệu mật phục vụ khảo sát nội bộ sáp nhập - Fugalo Co., Ltd © 2026</span>
                <span>Trang {pageNums.budget} / {totalReportPages}</span>
              </div>
            </div>
          )}

          {/* PAGE 5D: 13-WEEK OPERATIONAL DEEP PLAYBOOK */}
          {includePlaybook && (
            <div className="print-a4-page bg-white text-stone-900 border border-stone-300 w-[210mm] min-h-[297mm] mx-auto p-[20mm] font-serif flex flex-col justify-between relative shadow-2xl">
              <div className="print-page-header hidden">
                <span>FUGALO CO., LTD — STRATEGIC M&A CENTER</span>
                <span>PHẦN VII: KHUNG GIAO BAN THỰC HÀNH 13 TUẦN & GATES</span>
              </div>

              <div className="space-y-4 relative z-10 flex-1 font-sans">
                <div className="border-b border-stone-200 pb-2 font-serif">
                  <span className="text-[10px] font-sans font-mono uppercase tracking-widest text-amber-600 block">Phần VII</span>
                  <h2 className="text-lg font-bold text-stone-900">Battle Playbook 13 Tuần & Các Chốt Chặn</h2>
                  <p className="text-xs text-stone-500 font-sans mt-0.5">
                    Kịch bản thực chiến triển khai từng tuần, phân phối và kiểm duyệt rủi ro bảo hộ của đối tác ngoại biên.
                  </p>
                </div>

                {/* Chronology Summary Box */}
                <div className="grid grid-cols-4 gap-2 text-[8px] leading-relaxed">
                  <div className="p-2 bg-stone-50/50 border border-stone-200 rounded">
                    <strong className="text-stone-900 block text-[8.5px] border-b border-stone-150 pb-0.5 mb-1 text-amber-600">TUẦN 1 - 3: CAO ĐIỂM DD</strong>
                    <ul className="list-disc pl-3 text-stone-600 space-y-0.5 text-[7.5px]">
                      <li>Ký NDA/clean team.</li>
                      <li>Khởi dựng Data Room.</li>
                      <li>Tra cứu trademark.</li>
                      <li>Dựng mock-up P&L.</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-stone-50/50 border border-stone-200 rounded">
                    <strong className="text-stone-900 block text-[8.5px] border-b border-stone-150 pb-0.5 mb-1 text-amber-600">TUẦN 4 - 6: PROTOTYPE</strong>
                    <ul className="list-disc pl-3 text-stone-600 space-y-0.5 text-[7.5px]">
                      <li>Sản xuất mẫu Leather V1.</li>
                      <li>Review bao bì tinh xảo.</li>
                      <li>Thiết kế GA4 Looker.</li>
                      <li>Review pháp lý LV Case.</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-stone-50/50 border border-stone-200 rounded">
                    <strong className="text-stone-900 block text-[8.5px] border-b border-stone-150 pb-0.5 mb-1 text-amber-600">TUẦN 7 - 9: TIỀN SẢN XUẤT</strong>
                    <ul className="list-disc pl-3 text-stone-600 space-y-0.5 text-[7.5px]">
                      <li>Duyệt PP Sample dập khuôn.</li>
                      <li>Sản xuất lô thử nghiệm đầu.</li>
                      <li>CRM HubSpot activation.</li>
                      <li>Sales bày B2B gifting.</li>
                    </ul>
                  </div>
                  <div className="p-2 bg-stone-50/50 border border-stone-200 rounded">
                    <strong className="text-stone-900 block text-[8.5px] border-b border-stone-150 pb-0.5 mb-1 text-amber-600">TUẦN 10 - 13: GO-LIVE</strong>
                    <ul className="list-disc pl-3 text-stone-600 space-y-0.5 text-[7.5px]">
                      <li>Bày VIP showroom TP. HCM.</li>
                      <li>Launch Capsule trực tuyến.</li>
                      <li>Hạch toán doanh số.</li>
                      <li>Biên bản M&A sáp nhập.</li>
                    </ul>
                  </div>
                </div>

                {/* Gate thresholds */}
                <div className="space-y-1.5 mt-2">
                  <span className="text-[10px] font-bold text-stone-800 uppercase tracking-wider block font-mono">
                    1. Hệ 03 Chốt chặn Gates lớn (Quyết định tiếp tục hoặc chấm dứt liên minh)
                  </span>
                  <div className="grid grid-cols-3 gap-3 text-[8.5px] leading-relaxed">
                    <div className="p-2.5 border border-amber-200 bg-amber-500/5 rounded">
                      <strong className="block text-amber-900 font-serif text-[9.5px] uppercase">GIAI ĐOẠN 30 NGÀY (GATE 1)</strong>
                      <p className="text-stone-600 mt-1 leading-relaxed">
                        Cơ bản hoàn tất Data room và pháp lý GCN ĐKDN. Lắp xong sơ bộ mô hình P&L và dải giá. Tránh hoàn toàn vấp nợ của doanh nghiệp cũ.
                      </p>
                    </div>
                    <div className="p-2.5 border border-emerald-200 bg-emerald-500/5 rounded">
                      <strong className="block text-emerald-900 font-serif text-[9.5px] uppercase">GIAI ĐOẠN 60 NGÀY (GATE 2)</strong>
                      <p className="text-stone-600 mt-1 leading-relaxed">
                        Duyệt dập khuôn rập PP sample đạt chỉ tiêu tay nghề khâu tay Saddle-Stitch. Chạy email HubSpot tracking & opt-in test tỉ lệ &gt; 25%.
                      </p>
                    </div>
                    <div className="p-2.5 border border-rose-200 bg-rose-500/5 rounded">
                      <strong className="block text-rose-900 font-serif text-[9.5px] uppercase">GIAI ĐOẠN 90 NGÀY (GATE 3)</strong>
                      <p className="text-stone-600 mt-1 leading-relaxed">
                        Lượng bán chéo đạt chuẩn GM blened &gt; 55%. Hoàn thành IP search tìm kiếm rủi ro ngoại vi sạch sẽ, rập sẵn lộ trình dập nhãn bảo hiểm.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Target design block */}
                <div className="space-y-1.5 mt-2">
                  <span className="text-[10px] font-bold text-stone-800 uppercase tracking-wider block font-mono">
                    2. Chỉ số đo lường KPI cam kết cho liên minh vận hành thử
                  </span>
                  <div className="grid grid-cols-4 gap-2 text-center text-[9px]">
                    <div className="p-2 border border-stone-200 rounded">
                      <span className="text-[7.5px] text-stone-500 block uppercase font-mono">Lao động đúng tuần</span>
                      <strong className="text-xs text-stone-900 block mt-0.5">≥ 85% Milestone</strong>
                    </div>
                    <div className="p-2 border border-stone-200 rounded">
                      <span className="text-[7.5px] text-stone-500 block uppercase font-mono">Sample đạt chuẩn vòng 2</span>
                      <strong className="text-xs text-stone-900 block mt-0.5">≥ 80% duyệt nhanh</strong>
                    </div>
                    <div className="p-2 border border-stone-200 rounded">
                      <span className="text-[7.5px] text-stone-500 block uppercase font-mono">Lỗi đầu vào QA xưởng</span>
                      <strong className="text-xs text-stone-900 block mt-0.5">≤ 2.5% loại bỏ</strong>
                    </div>
                    <div className="p-2 border border-stone-200 rounded">
                      <span className="text-[7.5px] text-stone-500 block uppercase font-mono">Spa bảo hành đóng SLA</span>
                      <strong className="text-xs text-stone-900 block mt-0.5">≤ 10 ngày xử lý</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="print-page-footer hidden">
                <span>Tài liệu mật phục vụ khảo sát nội bộ sáp nhập - Fugalo Co., Ltd © 2026</span>
                <span>Trang {pageNums.playbook} / {totalReportPages}</span>
              </div>
            </div>
          )}

          {/* PAGE 6: MEMORANDUM OF UNDERSTANDING (MOU) */}
          {includeMOU && (
            <div className="print-a4-page bg-white text-stone-900 border border-stone-300 w-[210mm] min-h-[297mm] mx-auto p-[20mm] font-serif flex flex-col justify-between relative shadow-2xl">
              
              {/* Standard Page Header */}
              <div className="print-page-header hidden">
                <span>FUGALO CO., LTD — STRATEGIC M&A CENTER</span>
                <span>BẢN GHI NHỚ HỢP TÁC CHIẾN LƯỢC ĐÍNH KÈM (MOU)</span>
              </div>

              <div className="space-y-5 relative z-10 flex-1">
                <div className="text-center space-y-3 pt-4 mb-4">
                  <div className="inline-block px-3 py-1 bg-stone-900 text-white text-[9px] font-sans font-bold uppercase tracking-widest rounded">
                    FORMAL JOINT VENTURE COOPERATION AGREEMENT
                  </div>
                  <div>
                    <h2 className="text-sm uppercase tracking-widest text-stone-500 font-sans">Cộng hòa Xã hội Chủ nghĩa Việt Nam</h2>
                    <p className="text-xs font-sans text-stone-400">Độc lập - Tự do - Hạnh phúc</p>
                    <div className="w-16 h-[1px] bg-stone-300 mx-auto mt-1" />
                  </div>
                  <h1 className="text-lg font-bold tracking-tight text-stone-900 font-serif uppercase">
                    Bản Thỏa Thuận Ghi Nhớ Hợp Tác Liên Doanh (MOU)
                  </h1>
                </div>

                <div className="space-y-4 text-[11px] leading-relaxed text-stone-800">
                  <p>
                    Căn cứ vào thế mạnh độc hữu thiết kế đồ da thủ công xuất chúng của <strong className="text-stone-950">Dans la Peau</strong> cùng hệ thống phân phối VIP bền vững của <strong className="text-stone-950">Công Ty TNHH Fugalo</strong>, hai bên cùng thống nhất sơ thảo biên bản ghi nhớ hợp tác:
                  </p>

                  <div className="space-y-2 pl-2 border-l border-stone-300">
                    <div>
                      <strong className="text-stone-900 block">ĐIỀU 1: ĐỊNH VỤ ĐỒNG SÁNG LẬP NHÁNH MỚI</strong>
                      <p className="text-stone-600">
                        Hai bên độc lập pháp lý trong giai đoạn đầu và phối hợp khai sinh nhánh: <strong>"Fugalo x Dans la Peau - Luxury Circular Care & Bespoke"</strong>. Nhánh này sẽ tập trung khai thác bảo hành, phục hồi các túi hiệu Hermès/Chanel và bán phụ tùng đồ chơi đồng hồ da độc bản.
                      </p>
                    </div>

                    <div>
                      <strong className="text-stone-900 block">ĐIỀU 2: ĐẦU TƯ THỰC ĐỊA & PILOT CHUẨN MỰC</strong>
                      <p className="text-stone-600">
                        Kỳ hạn Thử nghiệm 90 ngày. Fugalo cung ứng gian hàng trung tâm tại TP. Hồ Chí Minh. Dans la Peau cung ứng 4 phân nhóm sản phẩm thiết thực và số tay thợ lành nghề để biểu diễn thủ công tại Showroom nhằm thúc đẩy quảng cáo diện rộng.
                      </p>
                    </div>

                    <div>
                      <strong className="text-stone-900 block">ĐIỀU 3: CHIA SẺ DOANH SỐ VÀ LỢI NHUẬN</strong>
                      <p className="text-stone-600">
                        Áp dụng cơ cấu lợi nhuận {activeModel === "wholesale" ? "mua sỉ sòng phẳng chiết khấu " + discountPercent + "%" : activeModel === "revshare" ? "ăn chia hoa hồng " + discountPercent + "% trên đầu sản phẩm" : "mô phỏng " + discountPercent + "% phân chia sau khi trừ chi phí COGS tích lũy"}.
                      </p>
                    </div>
                  </div>

                  <p className="italic text-stone-500 font-sans text-[10px]">
                    *Biên bản này là tài liệu đính kèm chính thức của báo cáo số hiệu {docRefId}, cam kết giữ bảo mật cao cấp theo văn hóa thương hiệu danh gia.
                  </p>
                </div>

                {/* Signature zone */}
                <div className="mt-10 pt-6 border-t border-stone-300 flex justify-between text-xs text-stone-600 font-sans">
                  <div>
                    <span className="font-bold text-stone-800 uppercase block">ĐẠI DIỆN DANS LA PEAU</span>
                    <span className="text-[10px] text-stone-400 block mt-1">Chuẩn bị hồ sơ thụ kiểm</span>
                    <div className="h-12" />
                    <span className="italic text-stone-500">Chưa ký (Chờ duyệt M&A)</span>
                  </div>
                  
                  <div className="text-right">
                    <span className="font-bold text-stone-800 uppercase block">BOD FUGALO CO., LTD</span>
                    <span className="text-[10px] text-stone-400 block mt-1">Xác thức quy trình</span>
                    <div className="h-12" />
                    <strong className="italic text-stone-900 font-serif font-bold">{signeeName}</strong>
                  </div>
                </div>
              </div>

              {/* Standard Page Footer */}
              <div className="print-page-footer hidden">
                <span>Tài liệu mật phục vụ khảo sát nội bộ sáp nhập - Fugalo Co., Ltd © 2026</span>
                <span>Trang {pageNums.mou} / {totalReportPages}</span>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
