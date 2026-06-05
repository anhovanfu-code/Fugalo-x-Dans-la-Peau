/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { BRAND_PROFILES } from "../data";
import { AlertCircle, ArrowUpRight, CheckCircle2, ShieldAlert, Sparkles, TrendingUp, Info, Wallet, DollarSign, ArrowRight, ShieldCheck, Star } from "lucide-react";

interface OverviewSectionProps {
  dealParams?: {
    activeModel: "wholesale" | "revshare" | "capsule";
    volume: number;
    retailPrice: number;
    cogsPercent: number;
    discountPercent: number;
    marketingCost: number;
  };
}

export default function OverviewSection({ dealParams }: OverviewSectionProps = {}) {
  const [userRating, setUserRating] = useState({
    trustScore: 4,
    productionVeracity: 3,
    customerOverlapping: 4,
    legalSecurity: 3
  });

  const handleRatingChange = (key: keyof typeof userRating, value: number) => {
    setUserRating(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Calculate dynamic partnership readiness index based on actual rating input
  const totalReadiness = Math.round(
    ((userRating.trustScore + userRating.productionVeracity + userRating.customerOverlapping + userRating.legalSecurity) / 20) * 100
  );

  const getVerdict = (score: number) => {
    if (score >= 80) {
      return {
        title: "Tối ưu: Thành lập Liên doanh (Joint Venture) & Ký kết Capsule",
        desc: "Các chỉ số thẩm định ban đầu rất tích cực. Đề xuất phát triển gấp dòng co-branded 'Fugalo x Dans la Peau' và lập pháp nhân liên thông mới để bảo đảm quyền lợi.",
        color: "text-emerald-800 bg-emerald-50 border-emerald-200"
      };
    } else if (score >= 60) {
      return {
        title: "An toàn: Thử nghiệm Pilot 90 Ngày & Độc quyền hạn chế",
        desc: "Tiếp tục lộ trình thận trọng. Đi từ Thử nghiệm thương mại (Pilot 90 ngày) trước khi bàn chuyện góp vốn hoặc san sẻ cổ phần thương hiệu gốc.",
        color: "text-amber-800 bg-amber-50 border-amber-200"
      };
    } else {
      return {
        title: "Cảnh báo cao: Chỉ làm Đại lý phân phối thông thường (Wholesale / Revenue Share)",
        desc: "Rủi ro pháp lý và năng lực sản xuất thực tế chưa được chứng minh. Tuyệt đối không bàn chuyện góp vốn hoặc đồng sáng lập. Chỉ thực hiện nhập sỉ bán sỉ.",
        color: "text-rose-800 bg-rose-50 border-rose-200"
      };
    }
  };

  const currentVerdict = getVerdict(totalReadiness);

  // Synchronized inputs from DealCalculator falling back to default capsule values
  const activeModel = dealParams?.activeModel ?? "capsule";
  const volume = dealParams?.volume ?? 100;
  const retailPrice = dealParams?.retailPrice ?? 3500000;
  const cogsPercent = dealParams?.cogsPercent ?? 25;
  const discountPercent = dealParams?.discountPercent ?? 45;
  const marketingCost = dealParams?.marketingCost ?? 30000000;

  // Outputs computation for dynamic dashboard representation
  const totalRevenue = volume * retailPrice;
  const totalCogs = (cogsPercent / 100) * totalRevenue;

  let investmentRequired = 0;
  let expectedCashFlow = 0;
  let modelLabel = "";

  if (activeModel === "wholesale") {
    const purchaseCost = totalRevenue * (1 - discountPercent / 100);
    investmentRequired = purchaseCost + marketingCost;
    expectedCashFlow = totalRevenue - purchaseCost - marketingCost;
    modelLabel = "Mua Sỉ (Wholesale)";
  } else if (activeModel === "revshare") {
    investmentRequired = marketingCost * 0.5;
    expectedCashFlow = (totalRevenue * (discountPercent / 100)) - (marketingCost * 0.5);
    modelLabel = "Chia Sẻ Doanh Thu (Revenue Share)";
  } else {
    // capsule
    const totalIntegratedCosts = totalCogs + marketingCost;
    const netProfitPool = Math.max(0, totalRevenue - totalIntegratedCosts);
    investmentRequired = (totalCogs * 0.5) + (marketingCost * 0.5); // Shared seed costs
    expectedCashFlow = netProfitPool * 0.5; // Profit split
    modelLabel = "Đồng Thương Hiệu Capsule (Co-branded)";
  }

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Math.round(num));
  };

  return (
    <div className="space-y-8 animate-fade-in" id="overview-section">
      {/* 1. KEY RECOMMENDATION VERDICT BANNER */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-md">
        {/* Decorative gold background blur */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.015] rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-amber-600 text-xs font-mono tracking-widest uppercase font-bold">
              <Sparkles className="w-4 h-4 animate-pulse text-amber-550" />
              <span>Kết luận chiến lược hàng đầu</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Fugalo <span className="text-amber-600">không nên</span> bước vào ngay với danh nghĩa "Đồng sáng lập Dans la Peau"
            </h2>
            <p className="text-stone-700 text-sm sm:text-base leading-relaxed">
              Vì Dans la Peau đã là thương hiệu hoạt động lâu đời (từ 2017). Cách tiếp cận khôn ngoan và an toàn hơn là: 
              <strong className="text-stone-900 font-bold"> Đề xuất đồng sáng lập một nhánh chuyên biệt / liên doanh mới</strong> mang tính cộng hương, ví dụ: 
              <span className="text-amber-700 italic font-semibold"> "Fugalo x Dans la Peau – Luxury Leather Care, Bespoke & Circular Craft"</span>.
            </p>
          </div>
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex flex-col justify-center items-center h-full min-w-[180px] self-start md:self-auto shadow-sm text-center">
            <span className="text-xs text-stone-500 font-mono font-medium">CHỈ SỐ SẴN SÀNG</span>
            <span className="text-4xl font-extrabold text-amber-600 my-1 font-serif">{totalReadiness}%</span>
            <span className="text-[10px] text-stone-450 max-w-[150px]">Dựa trên cấu hình tham số hiện tại</span>
          </div>
        </div>

        {/* Dynamic Verdict box based on interactive sliders */}
        <div className={`mt-6 p-4 rounded-lg border flex gap-3 ${currentVerdict.color}`}>
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-current" />
          <div>
            <div className="text-sm font-bold uppercase tracking-wider">{currentVerdict.title}</div>
            <p className="text-xs mt-1 text-stone-750 leading-normal font-medium">{currentVerdict.desc}</p>
          </div>
        </div>
      </div>

      {/* QUICK FINANCIAL SNAPSHOT WIDGET FROM DEAL CALCULATOR */}
      <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-sm relative overflow-hidden" id="financial-snapshot-widget">
        <div className="absolute top-0 left-0 w-32 h-32 bg-amber-500/[0.01] rounded-full blur-2xl pointer-events-none" />
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-stone-100 pb-4 mb-4">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider font-extrabold flex items-center gap-1">
              <Wallet className="w-3.5 h-3.5" />
              <span>BẢNG ĐIỀU KHIỂN TÀI CHÍNH M&A NHANH (LIVE DEAL METRICS)</span>
            </span>
            <h4 className="text-sm font-bold text-stone-900">
              Chỉ số Dòng vốn & Kỳ vọng từ Phương án: <span className="text-amber-600 font-extrabold">{modelLabel}</span>
            </h4>
          </div>
          <span className="text-[10px] text-stone-500 font-mono bg-stone-50 border border-stone-200 px-2 py-1 rounded font-bold uppercase tracking-wide">
            Cập nhật từ DealCalculator ({volume} sản phẩm)
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Item 1: Expected total investment */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex flex-col justify-between">
            <div className="text-[10px] text-stone-500 font-mono font-bold uppercase tracking-wider">Tổng mức đầu tư dự kiến</div>
            <div className="text-xl sm:text-2xl font-serif font-extrabold text-stone-900 my-1">
              {formatVND(investmentRequired)}
            </div>
            <p className="text-[11px] text-stone-605 leading-tight font-medium">
              {activeModel === "wholesale" 
                ? "Bao gồm vốn mua sỉ đứt + 100% chi phí tiếp thị" 
                : activeModel === "revshare"
                ? "Gồm 50% chi phí tiếp thị thử nghiệm"
                : "Gồm 50% chi phí sản xuất (COGS) + 50% tiếp thị"}
            </p>
          </div>

          {/* Item 2: Expected return cash flow */}
          <div className="bg-emerald-50/20 border border-emerald-200 rounded-lg p-4 flex flex-col justify-between">
            <div className="text-[10px] text-emerald-850 font-mono font-bold uppercase tracking-wider">Dòng tiền kỳ vọng (Fugalo Net)</div>
            <div className="text-xl sm:text-2xl font-serif font-extrabold text-emerald-700 my-1">
              {formatVND(expectedCashFlow)}
            </div>
            <p className="text-[11px] text-emerald-800 leading-tight font-semibold">
              Kỳ vọng lợi nhuận ròng thu về dựa trên giả định bán sạch {volume} sản phẩm thử nghiệm.
            </p>
          </div>

          {/* Item 3: Total Sales Revenue Pool */}
          <div className="bg-stone-50 border border-stone-200 rounded-lg p-4 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div className="text-[10px] text-stone-500 font-mono font-bold uppercase tracking-wider">Quy mô doanh thu tổng vụ</div>
            <div className="text-xl sm:text-2xl font-serif font-extrabold text-amber-700 my-1">
              {formatVND(totalRevenue)}
            </div>
            <p className="text-[11px] text-stone-605 leading-tight font-medium">
              Doanh thu từ mốc giá bán lẻ {formatVND(retailPrice)} / sp.
            </p>
          </div>
        </div>
      </div>

      {/* 2. BRAND SIDE-BY-SIDE PROFILE PANELS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fugalo Profiler */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 hover:border-amber-500/20 transition-all duration-300" id="brand-fugalo">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-stone-100">
            <div>
              <span className="text-[10px] font-mono text-amber-600 uppercase tracking-widest font-bold">Luxury Resale & Partner</span>
              <h3 className="text-xl font-serif font-semibold text-stone-900 mt-1">{BRAND_PROFILES.fugalo.name}</h3>
            </div>
            <span className="text-xs font-mono text-stone-600 bg-stone-50 px-2.5 py-1 rounded border border-stone-200">
              {BRAND_PROFILES.fugalo.established}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono text-stone-500 uppercase tracking-wider font-semibold">Định vị giá trị</h4>
              <p className="text-stone-700 text-sm mt-1">{BRAND_PROFILES.fugalo.positioning}</p>
            </div>
            <div>
              <h4 className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-2 font-semibold">Điểm mạnh cốt lõi (Đóng góp)</h4>
              <ul className="space-y-2">
                {BRAND_PROFILES.fugalo.coreStrengths.map((st, i) => (
                  <li key={i} className="flex gap-2 text-xs text-stone-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-stone-50 rounded border border-stone-200 text-xs">
              <span className="font-bold text-amber-705 block mb-1">Vai trò trong liên doanh:</span>
              <p className="text-stone-600 leading-normal">{BRAND_PROFILES.fugalo.roleInPartnership}</p>
            </div>
          </div>
        </div>

        {/* Dans la Peau Profiler */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 hover:border-amber-500/20 transition-all duration-300" id="brand-dlp">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-stone-100">
            <div>
              <span className="text-[10px] font-mono text-amber-600 uppercase tracking-widest font-bold">Artisanal Workshop</span>
              <h3 className="text-xl font-serif font-semibold text-stone-900 mt-1">{BRAND_PROFILES.dansLaPeau.name}</h3>
            </div>
            <span className="text-xs font-mono text-stone-600 bg-stone-50 px-2.5 py-1 rounded border border-stone-200">
              {BRAND_PROFILES.dansLaPeau.established}
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-xs font-mono text-stone-500 uppercase tracking-wider font-semibold">Định vị giá trị</h4>
              <p className="text-stone-700 text-sm mt-1">{BRAND_PROFILES.dansLaPeau.positioning}</p>
            </div>
            <div>
              <h4 className="text-xs font-mono text-stone-500 uppercase tracking-wider mb-2 font-semibold">Điểm mạnh cốt lõi (Đóng góp)</h4>
              <ul className="space-y-2">
                {BRAND_PROFILES.dansLaPeau.coreStrengths.map((st, i) => (
                  <li key={i} className="flex gap-2 text-xs text-stone-700 leading-relaxed">
                     <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                    <span>{st}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-3 bg-stone-50 rounded border border-stone-200 text-xs">
              <span className="font-bold text-amber-705 block mb-1">Vai trò trong liên doanh:</span>
              <p className="text-stone-600 leading-normal">{BRAND_PROFILES.dansLaPeau.roleInPartnership}</p>
            </div>
          </div>
        </div>
      </div>

      {/* COMP_TABLE: MARKET STATUS & COMPETITOR COMPARISON TABLE */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm" id="competitor-comparison-table">
        <div className="flex items-center gap-2 mb-2 pb-3 border-b border-stone-100">
          <Star className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-base font-serif font-bold text-stone-900">Bảng So Sánh Vị Thế Thị Trường & Đối Thủ</h3>
            <p className="text-xs text-stone-500 font-medium font-sans">
              So sánh trực quan sức mạnh chế tác, rủi ro, và rào cản tài chính của Dans la Peau so với các đối thủ ngoài luồng.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans tracking-tight border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200">
                <th className="py-3 px-4 font-extrabold text-stone-600 uppercase font-mono tracking-wider w-[22%]">Tiêu chuẩn so sánh</th>
                <th className="py-3 px-4 font-extrabold text-amber-800 bg-amber-500/[0.04] border-x border-stone-200 uppercase font-mono tracking-wider w-[26%]">Đối tác (Dans la Peau)</th>
                <th className="py-3 px-4 font-extrabold text-stone-600 uppercase font-mono tracking-wider w-[26%]">May Da Local đại trà</th>
                <th className="py-3 px-4 font-extrabold text-stone-600 uppercase font-mono tracking-wider w-[26%]">Hiệu Xa Xỉ Nhập Ngoài</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              <tr>
                <td className="py-3 px-4 font-extrabold text-stone-800 bg-stone-50/50">Kỹ thuật Chế tác</td>
                <td className="py-3 px-4 text-stone-700 bg-amber-500/[0.015] border-x border-stone-200 font-semibold">
                  <span className="text-emerald-700 font-bold">Khâu tay thủ công (Saddle-stitch)</span> đỉnh cao từ thợ cả, tỉ mỉ từng đường cạnh chỉ rập lỗ nỉ.
                </td>
                <td className="py-3 px-4 text-stone-500 font-medium">
                  Rập sẵn may máy hàng loạt đại trà, viền chỉ mỏng dễ sờn, sơn cạnh công nghiệp nhanh bong tróc.
                </td>
                <td className="py-3 px-4 text-stone-500 font-medium">
                  Chế tác cao cấp kết hợp may máy thượng hạng của các nhà mốt Paris / Milan có kiểm định nghiêm ngặt.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-extrabold text-stone-800 bg-stone-50/50">Cá nhân hóa (Bespoke)</td>
                <td className="py-3 px-4 text-stone-700 bg-amber-500/[0.015] border-x border-stone-200 font-semibold">
                  <span className="text-emerald-700 font-bold">Linh hoạt cực cao</span>: Khắc nổi chữ viết monogram nhiệt tức thì; tinh chỉnh rập theo size máy, dây đeo.
                </td>
                <td className="py-3 px-4 text-stone-500 font-medium">
                  Không hỗ trợ hoặc hạn chế mẫu mã. Chỉ bán khuôn hàng có sẵn bằng da ép hoặc giả da.
                </td>
                <td className="py-3 px-4 text-stone-500 font-medium">
                  Tính phí bespoke đắt đỏ độc bản (thêm vài ngàn USD) và thời gian xếp hàng chế tác chờ hàng quý.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-extrabold text-stone-800 bg-stone-50/50">Dịch vụ Hậu mãi (Spa)</td>
                <td className="py-3 px-4 text-stone-700 bg-amber-500/[0.015] border-x border-stone-200 font-semibold">
                  Bảo hành <span className="font-bold">1 năm bản hãng</span>; đối tác liên thông dịch vụ phục hồi chăm sóc da của Fugalo nhanh gọn 7-10 ngày.
                </td>
                <td className="py-3 px-4 text-stone-500 font-medium">
                  Mua đứt bán đoạn không bảo dưỡng hoặc bảo hành tượng trưng ngắn ngủi 1 tháng.
                </td>
                <td className="py-3 px-4 text-stone-500 font-medium">
                  Gửi sửa sang Châu Âu vô cùng gian nan, chờ đợi từ 3-6 tháng, chí phí cao ngoại hạng.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-extrabold text-stone-800 bg-stone-50/50">Tầm giá sản phẩm</td>
                <td className="py-3 px-4 text-stone-700 bg-amber-500/[0.015] border-x border-stone-200 font-semibold">
                  <span className="text-amber-700 font-extrabold">Từ 980k đến 16.8M VND</span>. Phân khúc giá tối ưu cực lớn so với giá trị thực của da cao cấp.
                </td>
                <td className="py-3 px-4 text-stone-500 font-medium">
                  Từ 300k đến 2M VND. Giá rẻ dễ tiếp cận nhưng thiếu uy hiếp xa xỉ, không bền.
                </td>
                <td className="py-3 px-4 text-stone-500 font-medium">
                  Từ 40M đến hơn 500M VND. Biên lợi nhuận chịu phí gánh nặng giá trị thương hiệu ảo cao.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-4 font-extrabold text-stone-800 bg-stone-50/50">Pháp lý & Thương hiệu</td>
                <td className="py-3 px-4 text-rose-800 bg-amber-500/[0.015] border-x border-stone-200 font-semibold">
                  <span className="flex items-center gap-1 text-rose-700 font-bold">
                    <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                    <span>Rủi ro bảo hộ nhãn hiệu</span>
                  </span>
                  Do trùng lắp tên với Louis Vuitton group ở phạm vi fragrance/cosmetics.
                </td>
                <td className="py-3 px-4 text-stone-500 font-medium">
                  Sạch sẽ pháp lý, đăng ký nhãn độc lập dễ dàng nhưng không có câu chuyện lịch sử.
                </td>
                <td className="py-3 px-4 text-stone-500 font-semibold text-emerald-700">
                  Pháp lý toàn cầu, bảo hộ nhãn quốc tế chặt chẽ, sở hữu câu chuyện thương hiệu trăm năm.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* 3. INTERACTIVE READINESS SLIDERS */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-stone-900 mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-amber-600" />
          Bộ chấm Điểm Khả năng Liên kết Sơ bộ
        </h3>
        <p className="text-xs text-stone-500 mb-6 font-medium">
          Kéo thanh trượt dựa trên kết quả khảo sát thực tế ban đầu để tự động cập nhật Chỉ số sẵn sàng hợp tác.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-sans">
          {/* Slider 1 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-700 font-semibold">Mức độ tương thích văn hóa & Lòng tin</span>
              <span className="text-amber-600 font-mono font-bold text-sm">{userRating.trustScore}/5</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={userRating.trustScore}
              onChange={(e) => handleRatingChange("trustScore", parseInt(e.target.value))}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500" 
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-medium">
              <span>Chưa tin tưởng</span>
              <span>Đồng lòng cao</span>
            </div>
          </div>

          {/* Slider 2 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-700 font-semibold font-medium">Xác thực năng lực sản xuất (Xưởng 10k m²)</span>
              <span className="text-amber-600 font-mono font-bold text-sm">{userRating.productionVeracity}/5</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={userRating.productionVeracity}
              onChange={(e) => handleRatingChange("productionVeracity", parseInt(e.target.value))}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500" 
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-medium">
              <span>Ảo/Chưa rõ</span>
              <span>Xác thực 100%</span>
            </div>
          </div>

          {/* Slider 3 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-700 font-semibold">Độ Trùng khít tập khách hàng cao cấp (Overlapping)</span>
              <span className="text-amber-600 font-mono font-bold text-sm">{userRating.customerOverlapping}/5</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={userRating.customerOverlapping}
              onChange={(e) => handleRatingChange("customerOverlapping", parseInt(e.target.value))}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500" 
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-medium">
              <span>Ít mua chéo</span>
              <span>Độc bản cực khớp</span>
            </div>
          </div>

          {/* Slider 4 */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-700 font-semibold font-medium">Mức độ an toàn pháp lý thương hiệu (Brand Trademark)</span>
              <span className="text-amber-600 font-mono font-bold text-sm">{userRating.legalSecurity}/5</span>
            </div>
            <input 
              type="range" 
              min="1" 
              max="5" 
              value={userRating.legalSecurity}
              onChange={(e) => handleRatingChange("legalSecurity", parseInt(e.target.value))}
              className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500" 
            />
            <div className="flex justify-between text-[10px] text-stone-500 font-medium">
              <span>Rủi ro cao (LV tranh chấp)</span>
              <span>Bảo hộ sạch sẽ</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. INTEGRATION SWOT MATRIX */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-serif font-bold text-stone-900 mb-1">Ma trận SWOT Cộng Hưởng (Fugalo × Dans la Peau)</h3>
        <p className="text-xs text-stone-500 mb-6 font-medium">Phản ánh thực tế định hướng kinh doanh kết hợp mô hình circular luxury.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="p-5 bg-emerald-50/50 border border-emerald-250/20 rounded-lg">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wider mb-3">
              <div className="w-2h-3 bg-emerald-600 rounded-full w-2 h-2" />
              <span>Điểm Mạnh (Strengths)</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-700 leading-relaxed">
              <li className="flex gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Thương hiệu phụ trợ thủ công có lịch sử (từ 2017) giúp bảo chứng uy tín cho sản phẩm.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Bespoke 1-1 tăng trải nghiệm thượng lưu cho khách VIP mua đồng hồ/túi hiệu của Fugalo.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Năng lực dập tên dập chữ cá nhân hóa tức thì tại chỗ kích thích cảm xúc sở hữu độc bản.</span>
              </li>
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="p-5 bg-amber-50/40 border border-amber-200/50 rounded-lg">
            <div className="flex items-center gap-2 text-amber-805 font-bold text-xs uppercase tracking-wider mb-3">
              <div className="w-2 h-2 rounded-full bg-amber-600" />
              <span>Điểm Yếu (Weaknesses)</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-700 leading-relaxed">
              <li className="flex gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>Lịch sử đóng cửa một số chi nhánh (như Hà Nội) cho thấy sự bấp bênh trong phân phối địa lý.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>Etsy và mảng wholesale trực tuyến hiện đang trống hàng hoặc ngừng bán, hạn chế dòng thu quốc tế.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-amber-600 font-bold">•</span>
                <span>Quá phụ thuộc vào tay nghề thợ cả; khó chuẩn hóa khi có đơn hàng lớn đột biến.</span>
              </li>
            </ul>
          </div>

          {/* Opportunities */}
          <div className="p-5 bg-sky-50/30 border border-sky-200/50 rounded-lg">
            <div className="flex items-center gap-2 text-sky-800 font-bold text-xs uppercase tracking-wider mb-3">
              <div className="w-2 h-2 rounded-full bg-sky-600" />
              <span>Cơ Hội (Opportunities)</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-700 leading-relaxed">
              <li className="flex gap-1.5">
                <span className="text-sky-600 font-bold">•</span>
                <span>Đón đầu làn sóng Luxury Resale mạnh mẽ tại Đông Nam Á với tệp khách VIP chuộng uy tín.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-sky-600 font-bold">•</span>
                <span>Ra mắt dòng sản phẩm capsule độc quyền “Tái Sinh Giá Trị – Circular Luxury Line” có biên lợi nhuận gộp vượt trội.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-sky-600 font-bold">•</span>
                <span>Tận dụng kỹ thuật da cao cấp để dấn thân sâu hơn vào mảng SPA bảo dưỡng đồ xa xỉ.</span>
              </li>
            </ul>
          </div>

          {/* Threats */}
          <div className="p-5 bg-rose-50/30 border border-rose-200/50 rounded-lg">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wider mb-3">
              <div className="w-2 h-2 rounded-full bg-rose-600" />
              <span>Rủi Ro (Threats)</span>
            </div>
            <ul className="space-y-2 text-xs text-stone-700 leading-relaxed">
              <li className="flex gap-1.5">
                <span className="text-rose-605 font-bold">•</span>
                <span>Tranh chấp sở hữu trí tuệ: Nhãn hiệu “DANS LA PEAU” đã được đăng ký phạm vi rộng bởi tập đoàn Louis Vuitton tại Mỹ.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-rose-605 font-bold">•</span>
                <span>Pháp lý upcycling: Rủi ro kiện tụng nếu cắt ghép logo vải cũ của hãng xa xỉ để bán hàng thương mại công khai.</span>
              </li>
              <li className="flex gap-1.5">
                <span className="text-rose-605 font-bold">•</span>
                <span>Rủi ro gánh nợ liên đới, hàng tồn kho quá hạn từ cấu trúc pháp lý cũ của Dans la Peau nếu hãm phanh chậm.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
