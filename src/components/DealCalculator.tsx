/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DollarSign, Wallet, Percent, Volume2, Info, ArrowRight, Table } from "lucide-react";

interface DealCalculatorProps {
  activeModel?: "wholesale" | "revshare" | "capsule";
  setActiveModel?: (m: "wholesale" | "revshare" | "capsule") => void;
  volume?: number;
  setVolume?: (v: number) => void;
  retailPrice?: number;
  setRetailPrice?: (p: number) => void;
  cogsPercent?: number;
  setCogsPercent?: (c: number) => void;
  discountPercent?: number;
  setDiscountPercent?: (d: number) => void;
  marketingCost?: number;
  setMarketingCost?: (m: number) => void;
}

export default function DealCalculator({
  activeModel: propActiveModel,
  setActiveModel: propSetActiveModel,
  volume: propVolume,
  setVolume: propSetVolume,
  retailPrice: propRetailPrice,
  setRetailPrice: propSetRetailPrice,
  cogsPercent: propCogsPercent,
  setCogsPercent: propSetCogsPercent,
  discountPercent: propDiscountPercent,
  setDiscountPercent: propSetDiscountPercent,
  marketingCost: propMarketingCost,
  setMarketingCost: propSetMarketingCost,
}: DealCalculatorProps = {}) {
  // Fallbacks if not provided as props
  const [localActiveModel, localSetActiveModel] = useState<"wholesale" | "revshare" | "capsule">("capsule");
  const [localVolume, localSetVolume] = useState<number>(100);
  const [localRetailPrice, localSetRetailPrice] = useState<number>(3500000); // 3.5 mil VND
  const [localCogsPercent, localSetCogsPercent] = useState<number>(25); // DLP production cost %
  const [localDiscountPercent, localSetDiscountPercent] = useState<number>(45); // Wholesale discount or Commission %
  const [localMarketingCost, localSetMarketingCost] = useState<number>(30000000); // 30 million VND

  const activeModel = propActiveModel !== undefined ? propActiveModel : localActiveModel;
  const setActiveModel = propSetActiveModel !== undefined ? propSetActiveModel : localSetActiveModel;
  const volume = propVolume !== undefined ? propVolume : localVolume;
  const setVolume = propSetVolume !== undefined ? propSetVolume : localSetVolume;
  const retailPrice = propRetailPrice !== undefined ? propRetailPrice : localRetailPrice;
  const setRetailPrice = propSetRetailPrice !== undefined ? propSetRetailPrice : localSetRetailPrice;
  const cogsPercent = propCogsPercent !== undefined ? propCogsPercent : localCogsPercent;
  const setCogsPercent = propSetCogsPercent !== undefined ? propSetCogsPercent : localSetCogsPercent;
  const discountPercent = propDiscountPercent !== undefined ? propDiscountPercent : localDiscountPercent;
  const setDiscountPercent = propSetDiscountPercent !== undefined ? propSetDiscountPercent : localSetDiscountPercent;
  const marketingCost = propMarketingCost !== undefined ? propMarketingCost : localMarketingCost;
  const setMarketingCost = propSetMarketingCost !== undefined ? propSetMarketingCost : localSetMarketingCost;

  // Outputs computation
  const totalRevenue = volume * retailPrice;
  const totalCogs = (cogsPercent / 100) * totalRevenue;

  let fugaloRevenue = 0;
  let dlpRevenue = 0;
  let fugaloCosts = 0;
  let dlpCosts = 0;

  if (activeModel === "wholesale") {
    // Wholesale model: Fugalo buys at a discount, sells at full retail.
    // Fugalo Revenue is total retail sales. 
    // Fugalo pays DLP the discounted price.
    const purchaseCost = totalRevenue * (1 - discountPercent / 100);
    fugaloRevenue = totalRevenue;
    dlpRevenue = purchaseCost;
    
    // Fugalo bears marketing costs entirely
    fugaloCosts = purchaseCost + marketingCost;
    // DLP costs are its internal COGS
    dlpCosts = totalCogs;
  } else if (activeModel === "revshare") {
    // Revenue share model: DLP sells, Fugalo takes commission % (discountPercent as commission)
    // Total pool goes to DLP first, then DLP pays commission to Fugalo.
    fugaloRevenue = totalRevenue * (discountPercent / 100);
    dlpRevenue = totalRevenue * (1 - discountPercent / 100);

    // Marketing typically split (e.g. 50/50)
    fugaloCosts = marketingCost * 0.5;
    dlpCosts = totalCogs + marketingCost * 0.5;
  } else {
    // Co-branded Capsule: 50/50 profit splitting after pooling revenue and paying COGS + Marketing
    const totalIntegratedCosts = totalCogs + marketingCost;
    const netProfitPool = Math.max(0, totalRevenue - totalIntegratedCosts);
    
    // Split profits equally
    fugaloRevenue = netProfitPool * 0.5;
    dlpRevenue = totalCogs + netProfitPool * 0.5; // DLP gets compensated for COGS + keeps half profit

    fugaloCosts = marketingCost * 0.5;
    dlpCosts = totalCogs + marketingCost * 0.5;
  }

  // Calculate Nets
  const fugaloNet = Math.round(fugaloRevenue - (activeModel === "capsule" ? 0 : fugaloCosts));
  const dlpNet = Math.round(dlpRevenue - dlpCosts);

  // Helper formatting currency
  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="deal-calculator-section">
      
      {/* 1. MODEL SWITCHER TAB */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <span className="text-xs font-mono text-amber-600 uppercase tracking-widest block font-bold mb-1">Cơ cấu chia sẻ thương mại</span>
        <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">Mô phỏng 3 Mô hình Hợp tác tiêu biểu</h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Option 1: Revenue Share */}
          <button 
            onClick={() => {
              setActiveModel("revshare");
              setDiscountPercent(25); // Default commission 25%
            }}
            className={`p-4 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
              activeModel === "revshare"
                ? "bg-amber-500/[0.03] border-amber-600 text-stone-900 shadow-sm"
                : "bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            <div className="font-bold text-sm tracking-tight flex items-center justify-between">
              <span className={activeModel === "revshare" ? "text-amber-700 font-extrabold" : "text-stone-800 font-bold"}>Mô hình 1: Revenue Share (Ăn chia)</span>
              <Percent className={`w-4 h-4 ${activeModel === "revshare" ? "text-amber-600" : "text-stone-400"}`} />
            </div>
            <p className="text-xs mt-1.5 text-stone-605 font-sans leading-relaxed font-semibold">
              Fugalo bán sản phẩm DLP cho khách của mình, nhận chiết khấu/hoa hồng 15%–30% tùy biên lợi nhuận. Thích hợp cho sản phẩm lẻ sẵn có.
            </p>
          </button>

          {/* Option 2: Wholesale */}
          <button 
            onClick={() => {
              setActiveModel("wholesale");
              setDiscountPercent(45); // Default discount 45%
            }}
            className={`p-4 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
              activeModel === "wholesale"
                ? "bg-amber-500/[0.03] border-amber-600 text-stone-900 shadow-sm"
                : "bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            <div className="font-bold text-sm tracking-tight flex items-center justify-between">
              <span className={activeModel === "wholesale" ? "text-amber-700 font-extrabold" : "text-stone-800"}>Mô hình 2: Wholesale (Mua sỉ)</span>
              <Wallet className={`w-4 h-4 ${activeModel === "wholesale" ? "text-amber-600" : "text-stone-400"}`} />
            </div>
            <p className="text-xs mt-1.5 text-stone-650 font-sans leading-relaxed font-semibold">
              Fugalo nhập thẳng đồ da DLP giá sỉ chiết khấu lớn (40%–55%), tự vận hành bán sỉ/lẻ. Thích hợp để trưng bày sẵn tại showroom.
            </p>
          </button>

          {/* Option 3: Capsule Line */}
          <button 
            onClick={() => {
              setActiveModel("capsule");
              setDiscountPercent(50); // Default profit share 50%
            }}
            className={`p-4 rounded-lg border text-left cursor-pointer transition-all duration-200 ${
              activeModel === "capsule"
                ? "bg-amber-500/[0.03] border-amber-600 text-stone-900 shadow-sm"
                : "bg-white border-stone-200 text-stone-500 hover:border-stone-300 hover:bg-stone-50"
            }`}
          >
            <div className="font-bold text-sm tracking-tight flex items-center justify-between">
              <span className={activeModel === "capsule" ? "text-amber-700 font-extrabold" : "text-stone-800 font-bold"}>Mô hình 3: Co-branded Capsule</span>
              <DollarSign className={`w-4 h-4 ${activeModel === "capsule" ? "text-amber-600" : "text-stone-400"}`} />
            </div>
            <p className="text-xs mt-1.5 text-stone-650 font-sans leading-relaxed font-semibold">
              Hai bên chung vốn thiết kế dòng sản phẩm sỉ lẻ độc quyền, bù trừ chi phí sản xuất và phân chia 50/50 lợi nhuận ròng. Đề xuất lý tưởng tối ưu!
            </p>
          </button>
        </div>
      </div>

      {/* 2. DUAL LAYOUT: SLIDERS & OUTPUT RESULTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 font-sans">
        
        {/* SLIDERS COLUMN */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6 shadow-sm">
            <span className="text-xs font-mono text-stone-500 uppercase tracking-wider block font-bold border-b border-stone-100 pb-2">Thông số đầu vào</span>

            {/* Slider 1: Average retail price */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-700 font-bold">Giá bán lẻ trung bình (VND)</span>
                <span className="text-amber-600 font-mono font-extrabold text-sm">{formatVND(retailPrice)}</span>
              </div>
              <input 
                type="range"
                min="500000"
                max="12000000"
                step="500000"
                value={retailPrice}
                onChange={(e) => setRetailPrice(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono font-bold">
                <span>500k ví card</span>
                <span>12 triệu premium box</span>
              </div>
            </div>

            {/* Slider 2: Estimated volume */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-700 font-bold">Số lượng sản xuất/tiêu thụ (Đơn vị)</span>
                <span className="text-amber-600 font-mono font-extrabold text-sm">{volume} sản phẩm</span>
              </div>
              <input 
                type="range"
                min="10"
                max="1000"
                step="10"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono font-bold">
                <span>10 (Trải nghiệm VIP lẻ)</span>
                <span>1000 (Đáp ứng đơn sỉ)</span>
              </div>
            </div>

            {/* Slider 3: Cost of Goods Sold % */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-700 font-bold">Giá vốn ước tính của DLP (% giá bán lẻ)</span>
                <span className="text-amber-600 font-mono font-extrabold text-sm">{cogsPercent}%</span>
              </div>
              <input 
                type="range"
                min="15"
                max="60"
                step="5"
                value={cogsPercent}
                onChange={(e) => setCogsPercent(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono font-bold">
                <span>15% (Chế tác cơ bản)</span>
                <span>60% (Độc bản đắt đỏ)</span>
              </div>
            </div>

            {/* Slider 4: Discount/Commission % */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-700 font-bold">
                  {activeModel === "wholesale" 
                    ? "Tỷ lệ chiết khấu sỉ cho Fugalo (%)" 
                    : activeModel === "revshare"
                    ? "Tỷ lệ hoa hồng giới thiệu (%)"
                    : "Tỷ lệ phân chia lợi nhuận ròng (%)"}
                </span>
                <span className="text-amber-600 font-mono font-extrabold text-sm">{discountPercent}%</span>
              </div>
              <input 
                type="range"
                min="15"
                max="60"
                step="5"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono font-bold">
                <span>15% (Cơ bản)</span>
                <span>60% (Độc quyền cao)</span>
              </div>
            </div>

            {/* Slider 5: Estimated marketing cost */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-stone-700 font-bold">Ngân sách tiếp thị phân bổ tổng lực</span>
                <span className="text-amber-600 font-mono font-extrabold text-sm">{formatVND(marketingCost)}</span>
              </div>
              <input 
                type="range"
                min="5000000"
                max="150000000"
                step="5000000"
                value={marketingCost}
                onChange={(e) => setMarketingCost(parseInt(e.target.value))}
                className="w-full h-1.5 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-stone-500 font-mono font-bold">
                <span>5M (Tối giản)</span>
                <span>150M (Tổng lực)</span>
              </div>
            </div>

          </div>
        </div>

        {/* SIMULATION VISU COLS */}
        <div className="lg:col-span-7">
          <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6 shadow-sm h-full flex flex-col justify-between">
            <div>
              <span className="text-xs font-mono text-stone-500 uppercase tracking-wider block font-bold border-b border-stone-100 pb-2 mb-4">Dự phóng dòng thu liên doanh</span>

              {/* Combined top KPIs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 shadow-inner">
                  <span className="text-[10px] text-stone-550 uppercase font-mono font-bold block">Doanh Thu Tổng Thụ</span>
                  <span className="text-base sm:text-lg font-extrabold text-amber-705 text-amber-700">{formatVND(totalRevenue)}</span>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 shadow-inner">
                  <span className="text-[10px] text-stone-550 uppercase font-mono font-bold block">Tổng Chi Phí (COGS + Marketing)</span>
                  <span className="text-base sm:text-lg font-extrabold text-stone-700">{formatVND(totalCogs + marketingCost)}</span>
                </div>
              </div>

              {/* Stacked visually splits chart representing average item price split */}
              <div className="mt-6 space-y-2">
                <span className="text-xs font-extrabold text-stone-800 font-sans block">Biểu đồ cơ cấu ăn chia doanh thu:</span>
                
                <div className="w-full h-8 rounded-lg overflow-hidden flex text-xs font-mono font-bold text-stone-950">
                  {/* Fugalo Share portion */}
                  <div 
                    className="bg-amber-600 text-white hover:opacity-95 transition-opacity flex items-center justify-center min-w-[50px] font-bold"
                    style={{ width: `${Math.round((activeModel === "capsule" ? (totalRevenue - (totalCogs+marketingCost))*0.5 : fugaloRevenue) / totalRevenue * 100)}%` }}
                    title={`Fugalo Share: ${formatVND((activeModel === "capsule" ? (totalRevenue - (totalCogs+marketingCost))*0.5 : fugaloRevenue))}`}
                  >
                    <span className="truncate px-1">Fugalo ({Math.round((activeModel === "capsule" ? (totalRevenue - (totalCogs+marketingCost))*0.5 : fugaloRevenue) / totalRevenue * 100)}%)</span>
                  </div>
                  {/* DLP Share portion */}
                  <div 
                    className="bg-stone-200 text-stone-800 hover:opacity-95 transition-opacity flex items-center justify-center min-w-[50px] border-l border-white font-semibold"
                    style={{ width: `${Math.round((activeModel === "capsule" ? (totalCogs + (totalRevenue - (totalCogs+marketingCost))*0.5) : dlpRevenue) / totalRevenue * 100)}%` }}
                    title={`DLP Share: ${formatVND((activeModel === "capsule" ? (totalCogs + (totalRevenue - (totalCogs+marketingCost))*0.5) : dlpRevenue))}`}
                  >
                    <span className="truncate px-1">DLP ({Math.round((activeModel === "capsule" ? (totalCogs + (totalRevenue - (totalCogs+marketingCost))*0.5) : dlpRevenue) / totalRevenue * 100)}%)</span>
                  </div>
                  {/* Marketing / Burn Pool */}
                  {activeModel !== "capsule" && (
                     <div 
                      className="bg-stone-400 hover:opacity-95 transition-opacity flex items-center justify-center min-w-[20px] text-white border-l border-white"
                      style={{ width: `${Math.round(marketingCost / totalRevenue * 100)}%` }}
                      title={`MKT Cost: ${formatVND(marketingCost)}`}
                    >
                      <span className="truncate px-1">MKT ({Math.round(marketingCost / totalRevenue * 100)}%)</span>
                    </div>
                  )}
                </div>

                <div className="flex justify-between text-[10px] text-stone-500 font-sans font-medium">
                  <span>Màu Vàng Đồng: Doanh thu Fugalo</span>
                  <span>Màu Ghi Xám: Doanh thu DLP</span>
                </div>
              </div>

              {/* Bottom splits detail cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {/* Fugalo Net Profit Box */}
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 hover:border-amber-500/20 hover:shadow-sm duration-300 transition-all">
                  <span className="text-[10px] text-amber-700 font-mono font-extrabold block uppercase">LỢI NHUẬN RÒNG FUGALO</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-xl sm:text-2xl font-serif font-extrabold ${fugaloNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatVND(fugaloNet)}
                    </span>
                  </div>
                  <ul className="text-[11px] text-stone-605 space-y-1.5 mt-3 font-sans font-semibold border-t border-stone-150 pt-3">
                    <li className="flex justify-between">
                      <span>Doanh thu nhận:</span>
                      <span className="font-mono text-stone-800 font-bold">{formatVND(activeModel === "capsule" ? (totalRevenue - (totalCogs+marketingCost))*0.5 : fugaloRevenue)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Phần chi trả mkt:</span>
                      <span className="font-mono text-stone-800 font-bold">{formatVND(activeModel === "wholesale" ? marketingCost : activeModel === "revshare" ? marketingCost*0.5 : marketingCost*0.5)}</span>
                    </li>
                  </ul>
                </div>

                {/* Dans la Peau Net Profit Box */}
                <div className="p-4 bg-stone-50 rounded-lg border border-stone-200 hover:border-amber-500/20 hover:shadow-sm duration-300 transition-all">
                  <span className="text-[10px] text-amber-700 font-mono font-extrabold block uppercase">LỢI NHUẬN RÒNG DANS LA PEAU</span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className={`text-xl sm:text-2xl font-serif font-extrabold ${dlpNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
                      {formatVND(dlpNet)}
                    </span>
                  </div>
                  <ul className="text-[11px] text-stone-605 space-y-1.5 mt-3 font-sans font-semibold border-t border-stone-150 pt-3">
                    <li className="flex justify-between">
                      <span>Bù đắp giá vốn:</span>
                      <span className="font-mono text-stone-800 font-bold">{formatVND(totalCogs)}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Phần chi mkt + mkt DLP:</span>
                      <span className="font-mono text-stone-800 font-bold">{formatVND(activeModel === "wholesale" ? 0 : marketingCost * 0.5)}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Strategic review note */}
            <div className="bg-amber-50/45 p-4 border border-amber-205/50 rounded-lg mt-6 text-xs text-stone-700 font-sans flex items-start gap-2.5 shadow-sm">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-amber-800 block uppercase text-[10px] tracking-wider mb-0.5 font-bold">Khảo sát đàm phán tối ưu:</strong>
                <p className="leading-relaxed font-semibold">
                  Dòng sản phẩm Capsule co-branded (Mô hình 3) là đề xuất an toàn nhất giúp Fugalo kéo sâu tay nghề của DLP phục vụ khách VIP mà không bị hớ bởi gánh nặng hàng tồn kho hay chi phí đầu tư thương mại quá cao từ đầu.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
