/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { DollarSign, Wallet, Percent, Volume2, Info, ArrowRight, Table, TrendingUp, Layers, Undo, Redo, Columns, Check, GitCompare, RefreshCw } from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart,
  Line,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

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
  onUndo?: () => void;
  onRedo?: () => void;
  canUndo?: boolean;
  canRedo?: boolean;
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
  onUndo,
  onRedo,
  canUndo = false,
  canRedo = false
}: DealCalculatorProps = {}) {
  // Fallbacks if not provided as props
  const [localActiveModel, localSetActiveModel] = useState<"wholesale" | "revshare" | "capsule">("capsule");
  const [localVolume, localSetVolume] = useState<number>(100);
  const [localRetailPrice, localSetRetailPrice] = useState<number>(3500000); // 3.5 mil VND
  const [localCogsPercent, localSetCogsPercent] = useState<number>(25); // DLP production cost %
  const [localDiscountPercent, localSetDiscountPercent] = useState<number>(45); // Wholesale discount or Commission %
  const [localMarketingCost, localSetMarketingCost] = useState<number>(30000000); // 30 million VND
  const [chartView, setChartView] = useState<"compare" | "projection">("projection"); // Default to projection Line Chart
  
  // Split View States
  const [isSplitView, setIsSplitView] = useState<boolean>(false);
  const [syncParams, setSyncParams] = useState<boolean>(true);
  const [modelB, setModelB] = useState<"wholesale" | "revshare" | "capsule">("wholesale");
  const [volumeB, setVolumeB] = useState<number>(100);
  const [retailPriceB, setRetailPriceB] = useState<number>(3500000);
  const [cogsPercentB, setCogsPercentB] = useState<number>(25);
  const [discountPercentB, setDiscountPercentB] = useState<number>(30); // 30% default revshare/wholesale commission
  const [marketingCostB, setMarketingCostB] = useState<number>(30000000);

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

  const effVolumeB = syncParams ? volume : volumeB;
  const effRetailPriceB = syncParams ? retailPrice : retailPriceB;
  const effCogsPercentB = syncParams ? cogsPercent : cogsPercentB;
  const effMarketingCostB = syncParams ? marketingCost : marketingCostB;

  // Formula solver helper
  const calculateResult = (
    modelType: "wholesale" | "revshare" | "capsule",
    vol: number,
    price: number,
    cogsPct: number,
    discPct: number,
    mktCost: number
  ) => {
    const totalRev = vol * price;
    const totalCogsVal = (cogsPct / 100) * totalRev;

    let fugRev = 0;
    let dlpRev = 0;
    let fugCost = 0;
    let dlpCost = 0;

    if (modelType === "wholesale") {
      const purchaseCost = totalRev * (1 - discPct / 100);
      fugRev = totalRev;
      dlpRev = purchaseCost;
      fugCost = purchaseCost + mktCost;
      dlpCost = totalCogsVal;
    } else if (modelType === "revshare") {
      fugRev = totalRev * (discPct / 100);
      dlpRev = totalRev * (1 - discPct / 100);
      fugCost = mktCost * 0.5;
      dlpCost = totalCogsVal + mktCost * 0.5;
    } else {
      // capsule
      const totalIntegratedCosts = totalCogsVal + mktCost;
      const netProfitPool = Math.max(0, totalRev - totalIntegratedCosts);
      fugRev = netProfitPool * 0.5;
      dlpRev = totalCogsVal + netProfitPool * 0.5;
      fugCost = mktCost * 0.5;
      dlpCost = totalCogsVal + mktCost * 0.5;
    }

    const fNet = Math.round(fugRev - (modelType === "capsule" ? 0 : fugCost));
    const dNet = Math.round(dlpRev - dlpCost);

    return {
      totalRevenue: totalRev,
      totalCogs: totalCogsVal,
      fugaloRevenue: fugRev,
      dlpRevenue: dlpRev,
      fugaloCosts: fugCost,
      dlpCosts: dlpCost,
      fugaloNet: fNet,
      dlpNet: dNet
    };
  };

  // Outputs computation
  const totalRevenue = volume * retailPrice;
  const totalCogs = (cogsPercent / 100) * totalRevenue;

  const resA = calculateResult(activeModel, volume, retailPrice, cogsPercent, discountPercent, marketingCost);
  const fugaloRevenue = resA.fugaloRevenue;
  const dlpRevenue = resA.dlpRevenue;
  const fugaloCosts = resA.fugaloCosts;
  const dlpCosts = resA.dlpCosts;
  const fugaloNet = resA.fugaloNet;
  const dlpNet = resA.dlpNet;

  // Dynamic model computation for charts to support visual comparing
  const computeModelNets = (modelType: "wholesale" | "revshare" | "capsule") => {
    const totRev = volume * retailPrice;
    const totCogs = (cogsPercent / 100) * totRev;

    let fugRev = 0;
    let dlpRev = 0;
    let fugCost = 0;
    let dlpCost = 0;

    if (modelType === "wholesale") {
      const disc = activeModel === "wholesale" ? discountPercent : 45;
      const purchaseCost = totRev * (1 - disc / 100);
      fugRev = totRev;
      dlpRev = purchaseCost;
      fugCost = purchaseCost + marketingCost;
      dlpCost = totCogs;
    } else if (modelType === "revshare") {
      const disc = activeModel === "revshare" ? discountPercent : 30;
      fugRev = totRev * (disc / 100);
      dlpRev = totRev * (1 - disc / 100);
      fugCost = marketingCost * 0.5;
      dlpCost = totCogs + marketingCost * 0.5;
    } else {
      // capsule
      const totalIntegratedCosts = totCogs + marketingCost;
      const netProfitPool = Math.max(0, totRev - totalIntegratedCosts);
      fugRev = netProfitPool * 0.5;
      dlpRev = totCogs + netProfitPool * 0.5;
      fugCost = marketingCost * 0.5;
      dlpCost = totCogs + marketingCost * 0.5;
    }

    const fNet = Math.round(fugRev - (modelType === "capsule" ? 0 : fugCost));
    const dNet = Math.round(dlpRev - dlpCost);

    return {
      fNet,
      dNet,
      totalNet: fNet + dNet,
    };
  };

  const chartData = [
    {
      name: "RevShare (Ăn chia)",
      "Fugalo (Vàng đồng)": computeModelNets("revshare").fNet,
      "Dans la Peau (Xám)": computeModelNets("revshare").dNet,
      "Tổng cộng": computeModelNets("revshare").totalNet,
    },
    {
      name: "Wholesale (Sỉ)",
      "Fugalo (Vàng đồng)": computeModelNets("wholesale").fNet,
      "Dans la Peau (Xám)": computeModelNets("wholesale").dNet,
      "Tổng cộng": computeModelNets("wholesale").totalNet,
    },
    {
      name: "Capsule (Liên hợp)",
      "Fugalo (Vàng đồng)": computeModelNets("capsule").fNet,
      "Dans la Peau (Xám)": computeModelNets("capsule").dNet,
      "Tổng cộng": computeModelNets("capsule").totalNet,
    },
  ];

  const computeMonthlyProjection = () => {
    const seasonality = [
      { month: "Tháng 1", multiplier: 0.9, mktMult: 1.0 },
      { month: "Tháng 2", multiplier: 0.7, mktMult: 0.8 },
      { month: "Tháng 3", multiplier: 0.85, mktMult: 0.9 },
      { month: "Tháng 4", multiplier: 0.95, mktMult: 1.0 },
      { month: "Tháng 5", multiplier: 1.0, mktMult: 1.0 },
      { month: "Tháng 6", multiplier: 1.15, mktMult: 1.15 },
      { month: "Tháng 7", multiplier: 0.8, mktMult: 0.8 },
      { month: "Tháng 8", multiplier: 0.9, mktMult: 0.9 },
      { month: "Tháng 9", multiplier: 1.05, mktMult: 1.0 },
      { month: "Tháng 10", multiplier: 1.25, mktMult: 1.2 },
      { month: "Tháng 11", multiplier: 1.45, mktMult: 1.35 },
      { month: "Tháng 12", multiplier: 1.7, mktMult: 1.5 },
    ];

    return seasonality.map((item) => {
      const monthlyVol = volume * item.multiplier;
      const monthlyMkt = (marketingCost / 12) * item.mktMult;
      const monthlyRev = monthlyVol * retailPrice;
      const monthlyCogs = (cogsPercent / 100) * monthlyRev;

      let fNet = 0;
      let dNet = 0;

      if (activeModel === "wholesale") {
        const purchaseCost = monthlyRev * (1 - discountPercent / 100);
        const fCost = purchaseCost + monthlyMkt;
        const dCost = monthlyCogs;
        fNet = Math.round(monthlyRev - fCost);
        dNet = Math.round(purchaseCost - dCost);
      } else if (activeModel === "revshare") {
        const fRev = monthlyRev * (discountPercent / 100);
        const dRev = monthlyRev * (1 - discountPercent / 100);
        const fCost = monthlyMkt * 0.5;
        const dCost = monthlyCogs + monthlyMkt * 0.5;
        fNet = Math.round(fRev - fCost);
        dNet = Math.round(dRev - dCost);
      } else {
        // capsule
        const totalIntegratedCosts = monthlyCogs + monthlyMkt;
        const netProfitPool = Math.max(0, monthlyRev - totalIntegratedCosts);
        const fRev = netProfitPool * 0.5;
        const dRev = monthlyCogs + netProfitPool * 0.5;
        const fCost = monthlyMkt * 0.5;
        const dCost = monthlyCogs + monthlyMkt * 0.5;
        fNet = Math.round(fRev - fCost);
        dNet = Math.round(dRev - dCost);
      }

      return {
        month: item.month,
        "Lợi nhuận Fugalo": fNet,
        "Lợi nhuận DLP": dNet,
        "Tổng Lợi nhuận": fNet + dNet,
      };
    });
  };

  const monthlyProjectionData = computeMonthlyProjection();

  const resB = calculateResult(
    modelB,
    effVolumeB,
    effRetailPriceB,
    effCogsPercentB,
    discountPercentB,
    effMarketingCostB
  );

  const computeMonthlyProjectionB = () => {
    const seasonality = [
      { month: "Tháng 1", multiplier: 0.9, mktMult: 1.0 },
      { month: "Tháng 2", multiplier: 0.7, mktMult: 0.8 },
      { month: "Tháng 3", multiplier: 0.85, mktMult: 0.9 },
      { month: "Tháng 4", multiplier: 0.95, mktMult: 1.0 },
      { month: "Tháng 5", multiplier: 1.0, mktMult: 1.0 },
      { month: "Tháng 6", multiplier: 1.15, mktMult: 1.15 },
      { month: "Tháng 7", multiplier: 0.8, mktMult: 0.8 },
      { month: "Tháng 8", multiplier: 0.9, mktMult: 0.9 },
      { month: "Tháng 9", multiplier: 1.05, mktMult: 1.0 },
      { month: "Tháng 10", multiplier: 1.25, mktMult: 1.2 },
      { month: "Tháng 11", multiplier: 1.45, mktMult: 1.35 },
      { month: "Tháng 12", multiplier: 1.7, mktMult: 1.5 },
    ];

    return seasonality.map((item) => {
      // Scenario A Fugalo Net
      const volA = volume * item.multiplier;
      const mktA = (marketingCost / 12) * item.mktMult;
      const revA = volA * retailPrice;
      const cogsA = (cogsPercent / 100) * revA;
      let fNetA = 0;
      if (activeModel === "wholesale") {
        const purchaseCost = revA * (1 - discountPercent / 100);
        fNetA = Math.round(revA - (purchaseCost + mktA));
      } else if (activeModel === "revshare") {
        fNetA = Math.round((revA * (discountPercent / 100)) - (mktA * 0.5));
      } else {
        const totalIntegratedCosts = cogsA + mktA;
        const netProfitPool = Math.max(0, revA - totalIntegratedCosts);
        fNetA = Math.round((netProfitPool * 0.5) - (mktA * 0.5));
      }

      // Scenario B Fugalo Net
      const volB_ = effVolumeB * item.multiplier;
      const mktB_ = (effMarketingCostB / 12) * item.mktMult;
      const revB = volB_ * effRetailPriceB;
      const cogsB = (effCogsPercentB / 100) * revB;
      let fNetB = 0;
      if (modelB === "wholesale") {
        const purchaseCost = revB * (1 - discountPercentB / 100);
        fNetB = Math.round(revB - (purchaseCost + mktB_));
      } else if (modelB === "revshare") {
        fNetB = Math.round((revB * (discountPercentB / 100)) - (mktB_ * 0.5));
      } else {
        const totalIntegratedCosts = cogsB + mktB_;
        const netProfitPool = Math.max(0, revB - totalIntegratedCosts);
        fNetB = Math.round((netProfitPool * 0.5) - (mktB_ * 0.5));
      }

      return {
        month: item.month,
        "Lợi nhuận Kịch bản A": fNetA,
        "Lợi nhuận Kịch bản B": fNetB,
      };
    });
  };

  // Helper formatting currency
  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(num);
  };

  return (
    <div className="space-y-8 animate-fade-in" id="deal-calculator-section">
      
      {/* 1. MODEL SWITCHER TAB */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <span className="text-xs font-mono text-amber-600 uppercase tracking-widest block font-bold">Cơ cấu chia sẻ thương mại</span>
            <h3 className="text-xl font-serif font-bold text-stone-900">Mô phỏng 3 Mô hình Hợp tác tiêu biểu</h3>
          </div>
          
          {/* Action Toolbar for Split View and Undo/Redo */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 rounded-lg text-xs font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors shadow-sm"
              title="Hoàn tác chỉnh sửa tài chính gần đây"
              id="calculator-undo-btn"
            >
              <Undo className="w-3.5 h-3.5" />
              <span>Hoàn tác</span>
            </button>
            <button
               onClick={onRedo}
               disabled={!canRedo}
               className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-50 hover:bg-stone-100 disabled:opacity-40 disabled:hover:bg-stone-50 border border-stone-200 text-stone-700 hover:text-stone-900 rounded-lg text-xs font-semibold cursor-pointer disabled:cursor-not-allowed transition-colors shadow-sm"
               title="Làm lại điều chỉnh vừa hủy"
               id="calculator-redo-btn"
            >
               <Redo className="w-3.5 h-3.5" />
               <span>Làm lại</span>
            </button>
            <button
              onClick={() => setIsSplitView(!isSplitView)}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 border rounded-lg text-xs font-bold cursor-pointer transition-all ${
                isSplitView 
                  ? "bg-amber-600 border-amber-700 text-white shadow-md" 
                  : "bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100/50"
              }`}
              id="split-view-toggle-btn"
              title="Kích hoạt so sánh song hành 2 kịch bản"
            >
              <Columns className="w-4 h-4" />
              <span>Chế độ So Sánh (Split View)</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Option 1: Revenue Share */}
          <button 
            onClick={() => {
              setActiveModel("revshare");
              setDiscountPercent(30); // Default commission 30% (in the 25% - 35% range)
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
              Fugalo bán sản phẩm DLP cho khách của mình, nhận chiết khấu/hoa hồng 25%–35% tùy biên lợi nhuận. Thích hợp cho sản phẩm lẻ sẵn có.
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
      {!isSplitView ? (
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
                  <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">Doanh Thu Tổng Thụ</span>
                  <span className="text-base sm:text-lg font-extrabold text-amber-700">{formatVND(totalRevenue)}</span>
                </div>
                <div className="p-3.5 bg-stone-50 rounded-lg border border-stone-200 shadow-inner">
                  <span className="text-[10px] text-stone-500 uppercase font-mono font-bold block">Tổng Chi Phí (COGS + Marketing)</span>
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
                  <ul className="text-[11px] text-stone-600 space-y-1.5 mt-3 font-sans font-semibold border-t border-stone-200 pt-3">
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
                  <ul className="text-[11px] text-stone-600 space-y-1.5 mt-3 font-sans font-semibold border-t border-stone-200 pt-3">
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

              {/* CHART SHIFTER AND GRAPHICS CONTAINER */}
              <div className="border-t border-stone-200/60 pt-5 mt-6 space-y-4">
                
                {/* Segemented Chart Switcher Tabs */}
                <div className="flex border-b border-stone-100 pb-1.5 items-center justify-between">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setChartView("projection")}
                      className={`text-xs font-bold pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                        chartView === "projection"
                          ? "border-amber-600 text-stone-900"
                          : "border-transparent text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-amber-600" />
                      <span>Xu hướng Lợi nhuận 1 Năm (Biểu đồ Đường)</span>
                    </button>
                    <button
                      onClick={() => setChartView("compare")}
                      className={`text-xs font-bold pb-2 border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                        chartView === "compare"
                          ? "border-amber-600 text-stone-900"
                          : "border-transparent text-stone-500 hover:text-stone-800"
                      }`}
                    >
                      <Layers className="w-3.5 h-3.5 text-stone-500" />
                      <span>So sánh 3 Hợp tác (Cột)</span>
                    </button>
                  </div>
                  <span className="text-[9px] text-[#db5129] font-mono font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200/50 uppercase tracking-wider hidden sm:inline-block">
                    Dữ liệu thời gian thực
                  </span>
                </div>

                {chartView === "projection" ? (
                  <div className="h-56 w-full text-xs" id="deal-monthly-projection-chart animate-fade-in">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={monthlyProjectionData}
                        margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                        <XAxis 
                          dataKey="month" 
                          stroke="#78716c" 
                          fontSize={9} 
                          fontWeight="semibold"
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#78716c" 
                          fontSize={8} 
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Tr`}
                        />
                        <Tooltip 
                          formatter={(value: any) => [formatVND(value as number), ""]}
                          contentStyle={{ background: "#fafaf9", border: "1px solid #e7e5e4", borderRadius: "8px", fontSize: "10.5px" }}
                          labelStyle={{ fontWeight: "bold", color: "#1c1917" }}
                        />
                        <Legend 
                          iconSize={8}
                          iconType="circle"
                          wrapperStyle={{ fontSize: '9.5px', paddingTop: '4px' }}
                        />
                        <Line 
                          type="monotone" 
                          name="Lợi nhuận Fugalo dự toán" 
                          dataKey="Lợi nhuận Fugalo" 
                          stroke="#db5129" 
                          strokeWidth={2.5}
                          dot={{ r: 2.5, strokeWidth: 1.5 }}
                          activeDot={{ r: 4.5 }}
                        />
                        <Line 
                          type="monotone" 
                          name="Lợi nhuận DLP (Sản xuất)" 
                          dataKey="Lợi nhuận DLP" 
                          stroke="#78716c" 
                          strokeWidth={2}
                          dot={{ r: 2.5, strokeWidth: 1.5 }}
                          activeDot={{ r: 4.5 }}
                        />
                        <Line 
                          type="monotone" 
                          name="Tổng Lợi nhuận Hợp tác" 
                          dataKey="Tổng Lợi nhuận" 
                          stroke="#d97706" 
                          strokeWidth={1.5}
                          strokeDasharray="4 4"
                          dot={{ r: 2 }}
                          activeDot={{ r: 4 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                ) : (
                  <div className="h-56 w-full text-xs" id="deal-models-comparison-chart animate-fade-in">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={chartData}
                        margin={{ top: 15, right: 10, left: -20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                        <XAxis 
                          dataKey="name" 
                          stroke="#78716c" 
                          fontSize={9} 
                          fontWeight="semibold"
                          tickLine={false} 
                          axisLine={false}
                        />
                        <YAxis 
                          stroke="#78716c" 
                          fontSize={8} 
                          tickLine={false}
                          axisLine={false}
                          tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Tr`}
                        />
                        <Tooltip 
                          formatter={(value: any) => [formatVND(value as number), ""]}
                          contentStyle={{ background: "#fafaf9", border: "1px solid #e7e5e4", borderRadius: "8px", fontSize: "10.5px" }}
                          labelStyle={{ fontWeight: "bold", color: "#1c1917" }}
                        />
                        <Legend 
                          iconSize={8}
                          iconType="circle"
                          wrapperStyle={{ fontSize: '9.5px', paddingTop: '4px' }}
                        />
                        <Bar name="Lợi nhuận rọ̀ng Fugalo" dataKey="Fugalo (Vàng đồng)" fill="#db5129" radius={[4, 4, 0, 0]} />
                        <Bar name="Lợi nhuận ròng DLP" dataKey="Dans la Peau (Xám)" fill="#78716c" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>

            {/* Strategic review note */}
            <div className="bg-amber-50/45 p-4 border border-amber-200 rounded-lg mt-6 text-xs text-stone-700 font-sans flex items-start gap-2.5 shadow-sm">
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
      ) : (
        /* PREMIUM SPLIT VIEW COMPARISON LAYOUT */
        <div className="space-y-8 font-sans animate-fade-in text-stone-800">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* COLUMN A: MODEL A */}
            <div className="bg-white border-2 border-amber-500/20 rounded-xl p-6 space-y-6 shadow-sm relative">
              <span className="absolute top-4 right-4 bg-amber-600 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">Kịch bản A</span>
              <div className="border-b border-stone-100 pb-3">
                <span className="text-xs font-mono text-amber-600 uppercase font-extrabold">CẤU HÌNH THƯƠNG MẠI CHỦ ĐẠO</span>
                <h4 className="text-base font-serif font-bold text-stone-900 mt-1">
                  {activeModel === "wholesale" ? "Mua sỉ (Wholesale)" : activeModel === "revshare" ? "Ăn chia (RevShare)" : "Capsule liên doanh"}
                </h4>
              </div>

              {/* Baseline Inputs Controls */}
              <div className="space-y-5">
                {/* Selector A */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-605 block">Mô hình Hợp tác A:</span>
                  <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-lg">
                    {["wholesale", "revshare", "capsule"].map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setActiveModel(m as any);
                          setDiscountPercent(m === "wholesale" ? 45 : m === "revshare" ? 30 : 50);
                        }}
                        className={`py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                          activeModel === m 
                            ? "bg-amber-600 text-white" 
                            : "text-stone-500 hover:text-stone-800"
                        }`}
                      >
                        {m === "wholesale" ? "Wholesale" : m === "revshare" ? "RevShare" : "Capsule"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price A */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-505 font-bold">Giá bán lẻ trung bình:</span>
                    <span className="text-amber-650 font-mono font-extrabold">{formatVND(retailPrice)}</span>
                  </div>
                  <input 
                    type="range"
                    min="500000"
                    max="12000000"
                    step="500000"
                    value={retailPrice}
                    onChange={(e) => setRetailPrice(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                {/* Volume A */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-505 font-bold">Sản lượng bán lẻ (Đơn vị):</span>
                    <span className="text-amber-650 font-mono font-extrabold">{volume} sản phẩm</span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={volume}
                    onChange={(e) => setVolume(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                {/* COGS A */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-505 font-bold">Giá vốn COGS (% bán lẻ):</span>
                    <span className="text-amber-650 font-mono font-extrabold">{cogsPercent}%</span>
                  </div>
                  <input 
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={cogsPercent}
                    onChange={(e) => setCogsPercent(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                {/* Discount A */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-505 font-bold">Tỷ lệ hưởng lợi/Chiết sỉ:</span>
                    <span className="text-amber-650 font-mono font-extrabold">{discountPercent}%</span>
                  </div>
                  <input 
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={discountPercent}
                    onChange={(e) => setDiscountPercent(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
                  />
                </div>

                {/* Marketing A */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-505 font-bold">Ngân sách tiếp thị (A):</span>
                    <span className="text-amber-650 font-mono font-extrabold">{formatVND(marketingCost)}</span>
                  </div>
                  <input 
                    type="range"
                    min="5000000"
                    max="150000000"
                    step="5000000"
                    value={marketingCost}
                    onChange={(e) => setMarketingCost(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
                  />
                </div>
              </div>

              {/* Summary KPIs A */}
              <div className="pt-4 border-t border-stone-100 bg-amber-50/40 p-4 rounded-lg space-y-3">
                <div className="text-xs flex justify-between font-bold text-stone-700">
                  <span>Doanh thu gộp kịch bản A:</span>
                  <span className="font-mono text-amber-700">{formatVND(totalRevenue)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border border-stone-150">
                    <span className="text-[10px] uppercase text-stone-400 block font-mono">Fugalo lãi ròng:</span>
                    <span className={`text-sm font-extrabold ${fugaloNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatVND(fugaloNet)}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-150">
                    <span className="text-[10px] uppercase text-stone-400 block font-mono">DLP lãi ròng:</span>
                    <span className={`text-sm font-extrabold ${dlpNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatVND(dlpNet)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* COLUMN B: MODEL B */}
            <div className={`bg-white border-2 rounded-xl p-6 space-y-6 shadow-sm relative transition-all ${syncParams ? "border-stone-200" : "border-amber-500/10"}`}>
              <span className="absolute top-4 right-4 bg-stone-800 text-white font-mono text-[9px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">Kịch bản B</span>
              <div className="border-b border-stone-100 pb-3 flex justify-between items-center pr-12">
                <div>
                  <span className="text-xs font-mono text-amber-650 uppercase font-extrabold">CẤU HÌNH THƯƠNG MẠI ĐỐI CHỨNG</span>
                  <h4 className="text-base font-serif font-bold text-stone-900 mt-1">
                    {modelB === "wholesale" ? "Mua sỉ (Wholesale)" : modelB === "revshare" ? "Ăn chia (RevShare)" : "Capsule liên doanh"}
                  </h4>
                </div>
                
                {/* Sync baseline checkbox */}
                <label className="flex items-center gap-1.5 cursor-pointer bg-amber-50 px-2 py-1 rounded border border-amber-200 text-[10px] font-bold text-amber-800 leading-none select-none">
                  <input 
                    type="checkbox" 
                    checked={syncParams} 
                    onChange={(e) => setSyncParams(e.target.checked)}
                    className="rounded border-amber-300 text-amber-600 focus:ring-0"
                  />
                  <span>Đồng bộ thông số chính (A)</span>
                </label>
              </div>

              {/* Baseline Inputs Controls */}
              <div className="space-y-5">
                {/* Selector B */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-stone-505 block">Mô hình Hợp tác B:</span>
                  <div className="grid grid-cols-3 gap-1 bg-stone-100 p-1 rounded-lg">
                    {["wholesale", "revshare", "capsule"].map((m) => (
                      <button
                        key={m}
                        onClick={() => {
                          setModelB(m as any);
                          setDiscountPercentB(m === "wholesale" ? 40 : m === "revshare" ? 25 : 50);
                        }}
                        className={`py-1 rounded text-xs font-bold cursor-pointer transition-colors ${
                          modelB === m 
                            ? "bg-stone-800 text-white" 
                            : "text-stone-505 hover:text-stone-800"
                        }`}
                      >
                        {m === "wholesale" ? "Wholesale" : m === "revshare" ? "RevShare" : "Capsule"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price B */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-505 font-bold">Giá bán lẻ trung bình:</span>
                    <span className="text-stone-700 font-mono font-bold">
                      {formatVND(effRetailPriceB)} {syncParams && <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded leading-none">Đính kèm (A)</span>}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="500000"
                    max="12000000"
                    step="500000"
                    disabled={syncParams}
                    value={effRetailPriceB}
                    onChange={(e) => setRetailPriceB(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed accent-stone-700"
                  />
                </div>

                {/* Volume B */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-505 font-bold">Sản lượng bán lẻ (Đơn vị):</span>
                    <span className="text-stone-700 font-mono font-bold">
                      {effVolumeB} sản phẩm {syncParams && <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded leading-none">Đính kèm (A)</span>}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    disabled={syncParams}
                    value={effVolumeB}
                    onChange={(e) => setVolumeB(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed accent-stone-700"
                  />
                </div>

                {/* COGS B */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-505 font-bold">Giá vốn COGS (% bán lẻ):</span>
                    <span className="text-stone-700 font-mono font-bold">
                      {effCogsPercentB}% {syncParams && <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded leading-none">Đính kèm (A)</span>}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    disabled={syncParams}
                    value={effCogsPercentB}
                    onChange={(e) => setCogsPercentB(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed accent-stone-700"
                  />
                </div>

                {/* Discount B */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-505 font-bold">Tỷ lệ hưởng lợi/Chiết sỉ:</span>
                    <span className="text-stone-700 font-mono font-bold">{discountPercentB}%</span>
                  </div>
                  <input 
                    type="range"
                    min="15"
                    max="60"
                    step="5"
                    value={discountPercentB}
                    onChange={(e) => setDiscountPercentB(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-250 rounded appearance-none cursor-pointer accent-stone-700"
                  />
                </div>

                {/* Marketing B */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-stone-505 font-bold">Ngân sách tiếp thị (B):</span>
                    <span className="text-stone-700 font-mono font-bold">
                      {formatVND(effMarketingCostB)} {syncParams && <span className="text-[9px] text-emerald-600 bg-emerald-50 px-1 py-0.5 rounded leading-none">Đính kèm (A)</span>}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="5000000"
                    max="150000000"
                    step="5000000"
                    disabled={syncParams}
                    value={effMarketingCostB}
                    onChange={(e) => setMarketingCostB(parseInt(e.target.value))}
                    className="w-full h-1 bg-stone-200 rounded appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed accent-stone-700"
                  />
                </div>
              </div>

              {/* Summary KPIs B */}
              <div className="pt-4 border-t border-stone-100 bg-slate-50 p-4 rounded-lg space-y-3">
                <div className="text-xs flex justify-between font-bold text-slate-700">
                  <span>Doanh thu gộp kịch bản B:</span>
                  <span className="font-mono text-slate-700">{formatVND(effVolumeB * effRetailPriceB)}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded border border-stone-150">
                    <span className="text-[10px] uppercase text-stone-400 block font-mono">Fugalo lãi ròng (B):</span>
                    <span className={`text-sm font-extrabold ${resB.fugaloNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatVND(resB.fugaloNet)}</span>
                  </div>
                  <div className="p-2 bg-white rounded border border-stone-150">
                    <span className="text-[10px] uppercase text-stone-400 block font-mono">DLP lãi ròng (B):</span>
                    <span className={`text-sm font-extrabold ${resB.dlpNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>{formatVND(resB.dlpNet)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* COMBINED COMPARATIVE PROJECTED LINE CHART IN SPLIT VIEW */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-stone-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-amber-600" />
                  <span>Xu hướng Biến động Lợi nhuận Kỳ vọng của Fugalo trong vòng 1 năm (Kịch bản A vs B)</span>
                </h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed font-semibold">
                  Mô hình hóa biến động doanh số và tối ưu theo từng tháng dựa trên tích hợp tham số chiết khấu, sản lượng bán lẻ và ngân sách marketing chu kỳ 12 tháng.
                </p>
              </div>
              <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-mono font-bold uppercase tracking-wider">
                Trực quan hóa Song Hành
              </span>
            </div>

            {/* Recharts Multiline Chart */}
            <div className="h-64 w-full text-xs" id="split-view-comparative-line-chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={computeMonthlyProjectionB()}
                  margin={{ top: 15, right: 15, left: -20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f4" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#78716c" 
                    fontSize={9.5} 
                    fontWeight="semibold"
                    tickLine={false} 
                    axisLine={false}
                  />
                  <YAxis 
                    stroke="#78716c" 
                    fontSize={8.5} 
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(val) => `${(val / 1000000).toFixed(0)}Tr`}
                  />
                  <Tooltip 
                    formatter={(value: any) => [formatVND(value as number), ""]}
                    contentStyle={{ background: "#fafaf9", border: "1px solid #e7e5e4", borderRadius: "8px", fontSize: "11px" }}
                    labelStyle={{ fontWeight: "bold", color: "#1c1917" }}
                  />
                  <Legend 
                    iconSize={8}
                    iconType="circle"
                    wrapperStyle={{ fontSize: '10px', paddingTop: '6px' }}
                  />
                  <Line 
                    type="monotone" 
                    name="Lợi nhuận Fugalo (Kịch bản A)" 
                    dataKey="Lợi nhuận Kịch bản A" 
                    stroke="#d97706" 
                    strokeWidth={3}
                    dot={{ r: 3, strokeWidth: 1.5 }}
                    activeDot={{ r: 5 }}
                  />
                  <Line 
                    type="monotone" 
                    name="Lợi nhuận Fugalo (Kịch bản B đối chứng)" 
                    dataKey="Lợi nhuận Kịch bản B" 
                    stroke="#475569" 
                    strokeWidth={3}
                    strokeDasharray="4 4"
                    dot={{ r: 3, strokeWidth: 1.5 }}
                    activeDot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Split View Strategic Takeaway Box */}
            <div className="bg-stone-50 border border-stone-200 p-4 rounded-lg text-xs leading-relaxed text-stone-700 flex gap-2.5 items-start shadow-sm">
              <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-850 uppercase text-[10px] tracking-wider block font-bold mb-0.5">Báo cáo chênh lệch liên minh thương mại:</strong>
                <p className="font-semibold">
                  Chênh lệch tổng lợi nhuận ròng giữa Kịch bản A ({formatVND(fugaloNet)}) và Kịch bản B ({formatVND(resB.fugaloNet)}) cho thấy khoảng cách hoạt động đạt {formatVND(Math.abs(fugaloNet - resB.fugaloNet))}. Hãy chọn tỷ lệ chiết khấu để cán cân sản xuất và lợi tức luôn tối ưu!
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
