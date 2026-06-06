/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DueDiligenceItem } from "../types";
import { ADVISORY_TEAM, DATA_ROOM_FOLDERS } from "../data";
import { 
  FileText, Shield, HelpCircle, Landmark, CheckSquare, 
  AlertTriangle, Filter, MessageSquare, AlertCircle, RefreshCw, XOctagon,
  FolderOpen, Briefcase, Coins, ShieldCheck, Info, ChevronRight, Check, ShieldAlert,
  Download
} from "lucide-react";

interface DueDiligenceSectionProps {
  items: DueDiligenceItem[];
  setItems: React.Dispatch<React.SetStateAction<DueDiligenceItem[]>>;
  clearanceScore: number;
}

export default function DueDiligenceSection({ items, setItems, clearanceScore }: DueDiligenceSectionProps) {
  const [subTab, setSubTab] = useState<"checklist" | "dataroom" | "advisors">("checklist");
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>("all");
  const [activeRiskFilter, setActiveRiskFilter] = useState<string>("all");
  const [editingNotesId, setEditingNotesId] = useState<string | null>(null);
  const [tempNotes, setTempNotes] = useState<string>("");
  
  // Data room states
  const [selectedFolderId, setSelectedFolderId] = useState<string>("dr-corporate");
  const [checkedDocuments, setCheckedDocuments] = useState<string[]>([]);

  const toggleDocumentCheck = (docText: string) => {
    setCheckedDocuments(prev => 
      prev.includes(docText)
        ? prev.filter(d => d !== docText)
        : [...prev, docText]
    );
  };

  const updateItemStatus = (id: string, newStatus: DueDiligenceItem["status"]) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, status: newStatus };
      }
      return item;
    }));
  };

  const handleStartEditingNotes = (id: string, currentNotes: string) => {
    setEditingNotesId(id);
    setTempNotes(currentNotes || "");
  };

  const handleSaveNotes = (id: string) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, notes: tempNotes };
      }
      return item;
    }));
    setEditingNotesId(null);
  };

  const handleResetChecklist = () => {
    setItems(prev => prev.map(item => ({ ...item, status: "pending", notes: "" })));
    setCheckedDocuments([]);
  };

  const handleExportCSV = () => {
    const headers = [
      "Mã số (ID)",
      "Danh mục thẩm định (Category)",
      "Câu hỏi thẩm định gốc (English Question)",
      "Câu hỏi Việt hóa (Vietnamese Question)",
      "Trọng tâm rà soát (Audit Focus Details)",
      "Mức độ rủi ro (Risk)",
      "Trạng thái đánh giá (Status)",
      "Ghi chú kiểm tra (Evaluator Notes)",
    ];

    const rows = items.map(item => {
      const statusLabel = 
        item.status === "passed" ? "Đạt chuẩn" :
        item.status === "failed" ? "Bất thường" :
        item.status === "pending" ? "Chưa rõ" : "Cần hành động";

      const categoryLabel = getCategoryVietnameseLabel(item.category);

      return [
        item.id,
        categoryLabel,
        item.question,
        item.vietnameseQuestion,
        item.details,
        item.riskLevel.toUpperCase(),
        statusLabel,
        item.notes || ""
      ];
    });

    const csvContent = [
      headers.join(","),
      ...rows.map(row => 
        row.map(val => {
          const cleaned = String(val).replace(/"/g, '""');
          return `"${cleaned}"`;
        }).join(",")
      )
    ].join("\n");

    // Prepend UTF-8 BOM so Excel opens with correct encoding for Vietnamese language characters
    const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `fugalo_danh_muc_tham_dinh_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filter items
  const filteredItems = items.filter(item => {
    const matchesCategory = activeCategoryFilter === "all" || item.category === activeCategoryFilter;
    const matchesRisk = activeRiskFilter === "all" || item.riskLevel === activeRiskFilter;
    return matchesCategory && matchesRisk;
  });

  const getRiskBadgeColor = (risk: DueDiligenceItem["riskLevel"]) => {
    switch (risk) {
      case "high":
        return "bg-rose-50 text-rose-800 border border-rose-200/80";
      case "medium":
        return "bg-amber-50 text-amber-805 border border-amber-200/80";
      default:
        return "bg-stone-100 text-stone-600 border border-stone-200";
    }
  };

  const getCategoryIcon = (category: DueDiligenceItem["category"]) => {
    switch (category) {
      case "legal":
        return <Landmark className="w-4 h-4 text-emerald-600" />;
      case "financial":
        return <FileText className="w-4 h-4 text-amber-600" />;
      case "production":
        return <Shield className="w-4 h-4 text-sky-600" />;
      default:
        return <HelpCircle className="w-4 h-4 text-purple-600" />;
    }
  };

  const getCategoryVietnameseLabel = (cat: DueDiligenceItem["category"]) => {
    switch (cat) {
      case "legal": return "Pháp lý & Sở hữu";
      case "financial": return "Tình trạng Tài chính";
      case "production": return "Năng lực Sản xuất";
      case "brand": return "Tài sản Thương hiệu";
      case "ip": return "Sở hữu trí tuệ (IP)";
      default: return cat;
    }
  };

  const selectedFolder = DATA_ROOM_FOLDERS.find(f => f.id === selectedFolderId) || DATA_ROOM_FOLDERS[0];

  return (
    <div className="space-y-8 animate-fade-in" id="due-diligence-section">
      
      {/* 1. TOP HEADER SUMMARY */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="text-xs font-mono text-amber-600 uppercase tracking-widest font-bold">Thẩm định thực tế (Due Diligence)</span>
            <h3 className="text-xl font-serif font-bold text-stone-900">Danh Mục Soát Xét & Đội Ngũ Thẩm Định</h3>
            <p className="text-xs text-stone-500 font-sans max-w-xl font-medium">
              Fugalo tuyệt đối không góp vốn hay nhận danh nghĩa đồng sáng lập khi chưa hoàn thành 100% việc kiểm nghiệm hồ sơ năng lực này.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 shrink-0 self-start sm:self-center">
            <button 
              onClick={handleExportCSV}
              className="flex items-center gap-2 px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors shadow-sm animate-fade-in animate-duration-150"
              title="Xuất dạnh sách hiện tại ra định dạng CSV"
              id="export-csv-btn"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Xuất CSV</span>
            </button>
            <button 
              onClick={handleResetChecklist}
              className="flex items-center gap-2 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 hover:border-stone-300 text-stone-700 hover:text-stone-900 rounded-lg text-xs font-semibold cursor-pointer transition-colors shadow-sm animate-fade-in animate-duration-150"
              id="reset-checklist-btn"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Đặt lại tất cả</span>
            </button>
          </div>
        </div>

        {/* Real-time score display */}
        <div className="mt-6 p-4 bg-stone-50 border border-stone-200 rounded-lg space-y-3 shadow-inner">
          <div className="flex justify-between items-center text-xs">
            <span className="text-stone-700 font-bold font-sans tracking-wide">TIẾN ĐỘ THẨM ĐỊNH THÀNH CÔNG (CLEARANCE RATE)</span>
            <span className="font-mono text-amber-600 font-extrabold text-lg">{clearanceScore}%</span>
          </div>
          <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-600 via-amber-400 to-emerald-500 transition-all duration-500"
              style={{ width: `${clearanceScore}%` }}
            />
          </div>
          <div className="flex flex-wrap gap-4 text-[10px] text-stone-500 pt-1 font-mono font-medium">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-stone-400" />
              <span>Pending = 0đ</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-rose-500" />
              <span>Failed / Action Needed = 0đ</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded bg-emerald-500" />
              <span>Passed = Điểm Trọng Số (High x3, Med x2, Low x1)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. CRITICAL LEGAL RED FLAGS QUICK PANEL */}
      <div className="bg-white border-2 border-rose-200 rounded-xl p-6 shadow-sm relative overflow-hidden" id="legal-redflags-quickpanel">
        <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/[0.01] rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-rose-100 pb-4 mb-5">
          <div className="space-y-1.5 text-center md:text-left">
            <span className="text-[10px] bg-rose-100 text-rose-800 font-mono font-extrabold px-2.5 py-1 rounded uppercase tracking-wider inline-flex items-center gap-1.5 animate-pulse">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Khung Điểm Đỏ Pháp Lý Khố (Critical Legal Red Flags)</span>
            </span>
            <h3 className="text-base font-serif font-bold text-stone-900 mt-1">
              Điểm Đỏ Cần Rà Soát Trước Khi Ký Kết Biên Bản Ghi Nhớ (MOU)
            </h3>
            <p className="text-xs text-stone-500 font-semibold font-sans">
              Danh sách 5 rủi ro cốt lõi có thể phá vỡ thương vụ. Lãnh đạo đề xuất đàm phán giải phóng nghĩa vụ hoặc lập cơ chế phòng vệ trước khi chuyển tiền.
            </p>
          </div>
          <span className="text-xs font-mono text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded font-bold uppercase shadow-sm">
            Bắt buộc Thẩm tra (Sử dụng ngoài)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Flag 1 */}
          <div className="p-4 bg-rose-50/40 border border-rose-200/60 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all duration-200">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-widest block font-extrabold">RỦI RO IP 01</span>
              <h4 className="text-xs font-extrabold text-stone-900 leading-snug">Xung đột Nhãn hiệu Quốc tế (WIPO)</h4>
              <p className="text-[11px] text-stone-605 font-medium leading-relaxed">
                Tên <span className="font-bold">“Dans la Peau”</span> đã bị tập đoàn LVMH đăng ký bảo hộ trước cho nhóm fragrance và mỹ phẩm toàn cầu.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-rose-100 text-[10px] text-rose-800 font-semibold flex items-center gap-1.5">
              <XOctagon className="w-3.5 h-3.5" />
              <span>Nguy cơ kẹt thương hiệu ngoại</span>
            </div>
          </div>

          {/* Flag 2 */}
          <div className="p-4 bg-rose-50/40 border border-rose-200/60 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all duration-200">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-widest block font-extrabold">RỦI RO ASSET 02</span>
              <h4 className="text-xs font-extrabold text-stone-900 leading-snug">Quyền Sở Hữu Domain & Social</h4>
              <p className="text-[11px] text-stone-605 font-medium leading-relaxed">
                Tài khoản fanpage và domain <span className="font-bold">danslapeau.com</span> hiện do một cá nhân đứng tên, chưa chuyển nhượng chính thức về pháp nhân.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-rose-100 text-[10px] text-rose-800 font-semibold flex items-center gap-1.5">
              <XOctagon className="w-3.5 h-3.5" />
              <span>Rủi ro bảo hộ tài sản ảo</span>
            </div>
          </div>

          {/* Flag 3 */}
          <div className="p-4 bg-rose-50/40 border border-rose-200/60 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all duration-200">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-widest block font-extrabold">RỦI RO CONTRACT 03</span>
              <h4 className="text-xs font-extrabold text-stone-900 leading-snug">Hạn thuê Showroom Thảo Điền</h4>
              <p className="text-[11px] text-stone-605 font-medium leading-relaxed">
                Showroom Thảo Điền chủ lực chỉ còn dưới 6 tháng hạn thuê, chưa có cam kết văn bản gia hạn giữ giá từ chủ đất.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-rose-100 text-[10px] text-rose-800 font-semibold flex items-center gap-1.5">
              <XOctagon className="w-3.5 h-3.5" />
              <span>Rủi ro gãy điểm phân phối</span>
            </div>
          </div>

          {/* Flag 4 */}
          <div className="p-4 bg-rose-50/40 border border-rose-200/60 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all duration-200">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-widest block font-extrabold">RỦI RO LAW 04</span>
              <h4 className="text-xs font-extrabold text-stone-900 leading-snug">Pháp Lý Upcycling Vải Bạt Cũ</h4>
              <p className="text-[11px] text-stone-605 font-medium leading-relaxed">
                Chế tác cắt ghép vải bạt (Monogram) từ túi cũ Hermès, LV rách để làm phụ kiện có nguy cơ phạm luật kiểu dáng công nghiệp quốc tế tại VN.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-rose-100 text-[10px] text-rose-800 font-semibold flex items-center gap-1.5">
              <XOctagon className="w-3.5 h-3.5" />
              <span>Nguy cơ kiện tụng bản quyền</span>
            </div>
          </div>

          {/* Flag 5 */}
          <div className="p-4 bg-rose-50/40 border border-rose-200/60 rounded-xl flex flex-col justify-between hover:shadow-sm transition-all duration-200">
            <div className="space-y-1.5">
              <span className="text-[10px] font-mono font-bold text-rose-700 uppercase tracking-widest block font-extrabold">RỦI RO TAX 05</span>
              <h4 className="text-xs font-extrabold text-stone-900 leading-snug">Thuế và Công Nợ Tồn Đọng</h4>
              <p className="text-[11px] text-stone-605 font-medium leading-relaxed">
                Sổ sách P&L báo cáo biên lợi nhuận gộp danh nghĩa cao nhưng sao kê ngân hàng cho thấy dòng tiền âm, nợ đọng nhà cung cấp thô chưa khóa kỹ.
              </p>
            </div>
            <div className="mt-3 pt-3 border-t border-rose-100 text-[10px] text-rose-800 font-semibold flex items-center gap-1.5">
              <XOctagon className="w-3.5 h-3.5" />
              <span>Tránh gánh nợ liên đới ẩn</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MULTI-LEVEL SUBTABS SYSTEM */}
      <div className="flex flex-wrap gap-2 border-b border-stone-200 pb-2.5">
        <button
          onClick={() => setSubTab("checklist")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
            subTab === "checklist"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm font-extrabold"
              : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900"
          }`}
        >
          <CheckSquare className="w-4 h-4" />
          <span>1. Tiêu chuẩn Hiện trường ({items.length})</span>
        </button>
        <button
          onClick={() => setSubTab("dataroom")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
            subTab === "dataroom"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm font-extrabold"
              : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900"
          }`}
        >
          <FolderOpen className="w-4 h-4" />
          <span>2. Hồ sơ Data Room cần yêu cầu ({DATA_ROOM_FOLDERS.length})</span>
        </button>
        <button
          onClick={() => setSubTab("advisors")}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
            subTab === "advisors"
              ? "bg-amber-600 text-white border-amber-600 shadow-sm font-extrabold"
              : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50 hover:text-stone-900"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>3. Đội ngũ Cố vấn khuyên thuê ({ADVISORY_TEAM.length})</span>
        </button>
      </div>

      {subTab === "checklist" ? (
        /* ORIGINAL CHECKLISTS VIEW */
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 border border-stone-200 rounded-lg shadow-sm">
            <div className="flex items-center gap-2 text-stone-600 text-xs font-semibold">
              <Filter className="w-4 h-4 text-amber-600" />
              <span>Bộ lọc danh mục hiểm họa:</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                { id: "all", label: "Tất cả" },
                { id: "legal", label: "Pháp Lý" },
                { id: "financial", label: "Tài Chính" },
                { id: "production", label: "Sản Xuất" },
                { id: "brand", label: "Tài sản Brand" },
                { id: "ip", label: "Rủi ro IP" }
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setActiveCategoryFilter(f.id)}
                  className={`px-3 py-1.5 rounded text-xs transition-all duration-200 cursor-pointer border ${
                    activeCategoryFilter === f.id 
                      ? "bg-amber-600 text-white font-bold border-amber-600 shadow-sm" 
                      : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-50 hover:text-stone-900"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* List of Due Diligence Questions */}
          <div className="space-y-4">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center bg-white border border-stone-200 rounded-xl text-stone-500 text-sm font-medium shadow-sm">
                Không có đầu mục thẩm định nào tương ứng bộ lọc hiện tại.
              </div>
            ) : (
              filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="bg-white border border-stone-200 rounded-xl p-5 hover:border-amber-500/20 hover:shadow-md transition-all duration-300 font-sans"
                  id={`dd-card-${item.id}`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-3 border-b border-stone-100">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="flex items-center gap-1 bg-stone-50 px-2 py-0.5 rounded text-[10px] text-stone-500 font-mono border border-stone-200">
                          {getCategoryIcon(item.category)}
                          <span>{getCategoryVietnameseLabel(item.category)}</span>
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${getRiskBadgeColor(item.riskLevel)}`}>
                          {item.riskLevel} Risk
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2 mt-1">
                        {item.vietnameseQuestion}
                      </h4>
                      <p className="text-[11px] font-mono text-stone-400 italic uppercase">{item.question}</p>
                    </div>

                    {/* Operational Status selector buttons */}
                    <div className="flex items-center gap-1 shrink-0 self-start sm:self-center">
                      <button
                        onClick={() => updateItemStatus(item.id, "passed")}
                        className={`px-2.5 py-1 text-xs rounded border cursor-pointer transition-all ${
                          item.status === "passed"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-300 font-bold shadow-sm"
                            : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        Đạt chuẩn
                      </button>
                      <button
                        onClick={() => updateItemStatus(item.id, "failed")}
                        className={`px-2.5 py-1 text-xs rounded border cursor-pointer transition-all ${
                          item.status === "failed"
                            ? "bg-rose-50 text-rose-700 border-rose-300 font-bold shadow-sm"
                            : "bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        Bất thường
                      </button>
                      <button
                        onClick={() => updateItemStatus(item.id, "pending")}
                        className={`px-2.5 py-1 text-xs rounded border cursor-pointer transition-all ${
                          item.status === "pending"
                            ? "bg-stone-100 text-stone-700 border-stone-300 font-bold"
                            : "bg-stone-50 text-stone-400 border-stone-200 hover:bg-stone-100"
                        }`}
                      >
                        Chưa rõ
                      </button>
                    </div>
                  </div>

                  {/* Question details description */}
                  <div className="mt-3 text-xs text-stone-700 leading-relaxed bg-stone-50 p-3 rounded border border-stone-200/80 font-sans font-medium">
                    <span className="font-bold text-amber-700 block mb-0.5">Trọng tâm thẩm tra:</span>
                    {item.details}
                  </div>

                  {/* Editable notes area inside card */}
                  <div className="mt-4 pt-4 border-t border-stone-100">
                    {editingNotesId === item.id ? (
                      <div className="space-y-3">
                        <div className="flex gap-1.5 items-center text-xs text-stone-500 font-medium">
                          <MessageSquare className="w-3.5 h-3.5 text-amber-600" />
                          <span>Ghi chú hiện trường thẩm định:</span>
                        </div>
                        <textarea
                          value={tempNotes}
                          onChange={(e) => setTempNotes(e.target.value)}
                          placeholder="Nhập ghi chú quan sát thực tế (Doanh thu thực nhận, biên lai nguyên liệu, mâu thuẫn nhãn hiệu...)"
                          className="w-full text-xs text-stone-800 bg-stone-50 border border-stone-200 rounded p-2 focus:outline-none focus:border-amber-500 font-medium"
                          rows={2}
                        />
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => setEditingNotesId(null)}
                            className="px-2 py-1 bg-stone-100 text-stone-600 hover:text-stone-800 rounded text-xs cursor-pointer font-semibold"
                          >
                            Hủy
                          </button>
                          <button
                            onClick={() => handleSaveNotes(item.id)}
                            className="px-2.5 py-1 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-50 hover:to-amber-450 text-white font-bold rounded text-xs cursor-pointer shadow-sm"
                          >
                            Lưu lại
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-4">
                        <div className="text-xs text-stone-500 italic font-medium">
                          {item.notes ? (
                            <span className="text-stone-700 flex items-start gap-1 not-italic">
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                              <span><strong>Ghi chú:</strong> {item.notes}</span>
                            </span>
                          ) : (
                            "Chưa có ghi chú quan trắc."
                          )}
                        </div>
                        <button
                          onClick={() => handleStartEditingNotes(item.id, item.notes || "")}
                          className="text-[11px] text-amber-600 hover:text-amber-700 font-bold shrink-0 cursor-pointer"
                        >
                          {item.notes ? "Sửa ghi chú" : "+ Viết ghi chú"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      ) : subTab === "dataroom" ? (
        /* INTERACTIVE DATA ROOM EXPLORER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in font-sans">
          
          {/* Left panel: Directory listing */}
          <div className="lg:col-span-4 space-y-2">
            <span className="text-xs font-mono text-stone-500 uppercase tracking-wider block font-bold">Thư mục Tài liệu gốc (Data Room index)</span>
            <div className="space-y-2">
              {DATA_ROOM_FOLDERS.map(folder => {
                const isSelected = folder.id === selectedFolderId;
                return (
                  <div
                    key={folder.id}
                    onClick={() => setSelectedFolderId(folder.id)}
                    className={`p-3 rounded-lg border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected
                        ? "bg-amber-500/[0.04] border-amber-600 shadow-sm"
                        : "bg-white border-stone-200 hover:bg-stone-50"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderOpen className={`w-4 h-4 shrink-0 ${isSelected ? "text-amber-600" : "text-stone-400"}`} />
                      <div className="text-xs">
                        <h4 className="font-extrabold text-stone-800 leading-tight">{folder.vietnameseName}</h4>
                        <span className="text-[9px] font-mono text-stone-400 uppercase tracking-widest">{folder.name}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-stone-400" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right panel: Active directory contents */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6 shadow-sm">
              <div className="border-b border-stone-100 pb-4">
                <div className="flex items-center gap-2.5">
                  <FolderOpen className="w-5 h-5 text-amber-600" />
                  <h3 className="text-lg font-serif font-bold text-stone-900 leading-tight">
                    {selectedFolder.vietnameseName}
                  </h3>
                </div>
                <p className="text-[10px] font-mono text-stone-400 mt-1 uppercase tracking-widest">{selectedFolder.name}</p>
              </div>

              {/* Required Documents check list */}
              <div className="space-y-3">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Danh sách Hồ sơ yêu cầu cung cấp:</span>
                <div className="space-y-2.5">
                  {selectedFolder.requiredDocuments.map((doc, dIdx) => {
                    const isChecked = checkedDocuments.includes(doc);
                    return (
                      <div
                        key={dIdx}
                        onClick={() => toggleDocumentCheck(doc)}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                          isChecked
                            ? "bg-emerald-50/40 border-emerald-200 text-emerald-950"
                            : "bg-stone-50/50 border-stone-200 text-stone-700 hover:bg-stone-50"
                        }`}
                      >
                        <div className="shrink-0 mt-0.5">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                            isChecked ? "bg-emerald-600 border-emerald-600 text-white" : "border-stone-300 bg-white"
                          }`}>
                            {isChecked && <Check className="w-3 h-3 stroke-[3px]" />}
                          </div>
                        </div>
                        <span className={`text-xs font-semibold ${isChecked ? "line-through text-stone-400 italic" : ""}`}>
                          {doc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Audit focus */}
              <div className="p-4 bg-amber-50/20 border border-amber-200 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-800 uppercase tracking-wider font-extrabold">
                  <Info className="w-3.5 h-3.5" />
                  <span>Trọng tâm rà soát cơ bản:</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-semibold">
                  {focusedFolderInfo(selectedFolder.id)}
                </p>
              </div>

              {/* Red flags warning */}
              <div className="p-4 bg-rose-50/30 border border-rose-200 rounded-lg space-y-1">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-rose-800 uppercase tracking-wider font-extrabold">
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  <span>Dấu hiệu đỏ cảnh báo nguy cơ (Red flags):</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed font-semibold">
                  {focusedFolderRedFlags(selectedFolder.id)}
                </p>
              </div>
            </div>
          </div>

        </div>
      ) : (
        /* ADVISORS NETWORK VIEW */
        <div className="space-y-6 animate-fade-in font-sans">
          <div className="bg-amber-50/10 border border-amber-200 rounded-xl p-5 flex items-start gap-3.5">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed font-medium text-stone-700">
              <strong className="text-xs font-serif font-bold text-stone-900 block mb-0.5">Khuyến nghị Thuê Ngoài cho Thẩm Định Doanh Nghiệp</strong>
              Do quy mô tài sản sở hữu trí tuệ đặc thù phức tạp và mạng lưới sản xuất thủ công, đại diện Fugalo (<strong className="text-stone-900 font-extrabold">Hồ Văn An</strong>) nên phê duyệt ngân sách đầu tư thuê các cố vấn sau đây để bảo đảm rà soát kín kẽ trước bất kỳ quyết sách góp vốn trực tiếp nào.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {ADVISORY_TEAM.map((advisor, idx) => (
              <div
                key={idx}
                className="bg-white border border-stone-200 rounded-xl p-5 hover:shadow-md transition-all duration-300 space-y-4 shadow-sm flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-3 border-b border-stone-100 pb-2.5">
                    <span className="bg-amber-50 text-amber-700 border border-amber-200 font-mono text-[10px] font-extrabold px-2.5 py-0.5 rounded-lg uppercase tracking-wide">
                      {advisor.timeline}
                    </span>
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700">
                      <Coins className="w-3.5 h-3.5" />
                      <span>Chi phí: {advisor.budget}</span>
                    </div>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 font-serif flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-stone-400 shrink-0" />
                    <span>{advisor.role}</span>
                  </h4>
                </div>

                <div className="bg-stone-50/50 p-3 rounded-lg border border-stone-200 text-xs text-stone-700 font-medium leading-relaxed">
                  <strong className="text-[10px] font-mono text-stone-400 block uppercase mb-1 font-bold">Nội dung hành động kỹ trị:</strong>
                  {advisor.scope}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

// Helpers for Data Room folder notes
function focusedFolderInfo(id: string) {
  switch (id) {
    case "dr-corporate":
      return "Xác minh tư cách pháp nhân thực tế sở hữu cửa hàng Thảo Điền & Hội An. Ai thực sự là chủ sở hữu hoặc chịu trách nhiệm trả nợ, mượn nợ cho các bên liên quan nhằm tránh gánh nợ liên đới.";
    case "dr-finance":
      return "Đối soát doanh thu, đối chứng trực tiếp tiền gửi ngân hàng với các hóa đơn GTGT. Thực kiểm định lượng tồn kho da thô (da Epsom, Togo, Swift) xem có bị hư hỏng giảm giá hay không.";
    case "dr-ip":
      return "Kiểm tra tình trạng đăng ký nhãn hiệu 'Dans la Peau' tại Cục Sở hữu Trí tuệ Việt Nam. Bảo đảm không bị kẹt hay có nguy cơ bị xử phạt nhãn hiệu do trùng lắp hương mỹ phẩm xa xỉ.";
    case "dr-channels":
      return "Xác minh các nguồn thu có thực sự lặp lại từ khách VIP (repeat buyer) không hay hoàn toàn phụ thuộc vào chi phí quảng cáo rầm rộ hoặc khách du lịch vãng lai nhất thời.";
    case "dr-production":
      return "Xác thực năng lực chế tác xưởng 10.000m². Kiểm chứng bộ định mức tiêu hao nguyên vật liệu thực tế của thợ chế chế tác để tính chuẩn giá trị dôi dư (BOM scrap rate).";
    default:
      return "Soát hóa đơn, chứng từ gốc, giấy tờ cá nhân xác thực đại diện pháp luật đầy đủ.";
  }
}

function focusedFolderRedFlags(id: string) {
  switch (id) {
    case "dr-corporate":
      return "Giấy phép thuê showroom Thảo Điền còn dưới 6 tháng mà không cam kết gia hạn; mâu thuẫn đồng sáng lập cũ chưa được giải quyết dứt điểm về mặt văn bản pháp luật.";
    case "dr-finance":
      return "Sổ sách P&L báo cáo biên lợi nhuận bộp 60% nhưng sao kê ngân hàng cho thấy dòng tiền âm liên tục; nợ nhà cung cấp khóa đồng lâu năm chưa thanh toán bị phong tỏa.";
    case "dr-ip":
      return "Nhãn hiệu 'Dans la Peau' bị từ chối cấp văn bằng bảo hộ; fanpage hơn 50.000 clicks nhưng đang nằm dưới danh nghĩa tài khoản cá nhân của một nhân viên ngoài luồng.";
    case "dr-channels":
      return "Trả lại hàng / Hoàn đổi vượt quá mốc 10% do chất lượng sơn cạnh bị bong nứt; chi phí tìm kiếm một khách hàng (CAC) vượt ngưỡng giá trị đơn hàng trung bình thu về.";
    case "dr-production":
      return "Không cung cấp được hóa đơn chứng minh nguồn gốc da hạt sỉ (Epsom; Swift) nhập từ Ý/Pháp; xưởng 10.000m² thực chất chỉ là bãi đất trống bị mượn danh nghĩa xối khống.";
    default:
      return "Bất kỳ chứng từ giả tạo mạo danh, mập mờ, thiếu trung thực nào.";
  }
}
