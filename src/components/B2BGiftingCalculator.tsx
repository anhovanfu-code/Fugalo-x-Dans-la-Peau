/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Briefcase, Gift, Target, Percent, Coins, Users, 
  TrendingUp, BarChart3, Info, Wallet, DollarSign,
  ArrowRight, ShieldCheck, CheckCircle2, ChevronRight, HelpCircle
} from "lucide-react";
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  Cell,
  PieChart,
  Pie
} from "recharts";

export default function B2BGiftingCalculator() {
  const [selectedScenario, setSelectedScenario] = useState<"standard" | "aggressive" | "conservative">("standard");

  // Global Funnel Settings
  const [totalLeads, setTotalLeads] = useState<number>(100);
  const [conversionRate, setConversionRate] = useState<number>(10); // 10% from Lead to Closed Won
  const [cogsPercent, setCogsPercent] = useState<number>(35); // Cost of Goods Sold %
  const [revShareFugalo, setRevShareFugalo] = useState<number>(50); // Fugalo split percentage (e.g. 50%)

  // Custom Package Sizing (VND)
  const [starterPrice, setStarterPrice] = useState<number>(35000000); // 35M VND (Range 20M - 50M)
  const [premiumPrice, setPremiumPrice] = useState<number>(100000000); // 100M VND (Range 50M - 150M)
  const [vipPrice, setVipPrice] = useState<number>(300000000); // 300M VND (Range 150M - 500M)
  const [signaturePrice, setSignaturePrice] = useState<number>(750000000); // 750M VND (Range 500M - 1500M)

  // Package Lead allocation distribution % (Must sum to 100%)
  const [starterDist, setStarterDist] = useState<number>(40);
  const [premiumDist, setPremiumDist] = useState<number>(30);
  const [vipDist, setVipDist] = useState<number>(20);
  const [signatureDist, setSignatureDist] = useState<number>(10);

  const applyScenario = (mode: "standard" | "aggressive" | "conservative") => {
    setSelectedScenario(mode);
    if (mode === "standard") {
      setTotalLeads(100);
      setConversionRate(10);
      setCogsPercent(35);
      setStarterDist(40);
      setPremiumDist(30);
      setVipDist(20);
      setSignatureDist(10);
    } else if (mode === "aggressive") {
      setTotalLeads(250);
      setConversionRate(18);
      setCogsPercent(30);
      setStarterDist(25);
      setPremiumDist(30);
      setVipDist(25);
      setSignatureDist(20);
    } else if (mode === "conservative") {
      setTotalLeads(50);
      setConversionRate(5);
      setCogsPercent(40);
      setStarterDist(60);
      setPremiumDist(25);
      setVipDist(10);
      setSignatureDist(5);
    }
  };

  // Auto-normalization helper for lead allocation
  const handleDistChange = (pkg: "starter" | "premium" | "vip" | "signature", value: number) => {
    const newVal = Math.max(0, Math.min(100, value));
    if (pkg === "starter") {
      setStarterDist(newVal);
      // Allocate remaining equally or proportionally
      const remain = 100 - newVal;
      const totalOthers = premiumDist + vipDist + signatureDist;
      if (totalOthers > 0) {
        setPremiumDist(Math.round((premiumDist / totalOthers) * remain));
        setVipDist(Math.round((vipDist / totalOthers) * remain));
        setSignatureDist(100 - newVal - Math.round((premiumDist / totalOthers) * remain) - Math.round((vipDist / totalOthers) * remain));
      }
    } else if (pkg === "premium") {
      setPremiumDist(newVal);
      const remain = 100 - newVal;
      const totalOthers = starterDist + vipDist + signatureDist;
      if (totalOthers > 0) {
        setStarterDist(Math.round((starterDist / totalOthers) * remain));
        setVipDist(Math.round((vipDist / totalOthers) * remain));
        setSignatureDist(100 - newVal - Math.round((starterDist / totalOthers) * remain) - Math.round((vipDist / totalOthers) * remain));
      }
    } else if (pkg === "vip") {
      setVipDist(newVal);
      const remain = 100 - newVal;
      const totalOthers = starterDist + premiumDist + signatureDist;
      if (totalOthers > 0) {
        setStarterDist(Math.round((starterDist / totalOthers) * remain));
        setPremiumDist(Math.round((premiumDist / totalOthers) * remain));
        setSignatureDist(100 - newVal - Math.round((starterDist / totalOthers) * remain) - Math.round((premiumDist / totalOthers) * remain));
      }
    } else {
      setSignatureDist(newVal);
      const remain = 100 - newVal;
      const totalOthers = starterDist + premiumDist + vipDist;
      if (totalOthers > 0) {
        setStarterDist(Math.round((starterDist / totalOthers) * remain));
        setPremiumDist(Math.round((premiumDist / totalOthers) * remain));
        setVipDist(100 - newVal - Math.round((starterDist / totalOthers) * remain) - Math.round((premiumDist / totalOthers) * remain));
      }
    }
  };

  // Intermediate calculations
  const expectedTotalClosedDeals = (totalLeads * (conversionRate / 100));
  
  const starterClosed = expectedTotalClosedDeals * (starterDist / 100);
  const premiumClosed = expectedTotalClosedDeals * (premiumDist / 100);
  const vipClosed = expectedTotalClosedDeals * (vipDist / 100);
  const signatureClosed = expectedTotalClosedDeals * (signatureDist / 100);

  const starterRev = starterClosed * starterPrice;
  const premiumRev = premiumClosed * premiumPrice;
  const vipRev = vipClosed * vipPrice;
  const signatureRev = signatureClosed * signaturePrice;

  const totalGrossRevenue = starterRev + premiumRev + vipRev + signatureRev;
  const totalCogs = totalGrossRevenue * (cogsPercent / 100);
  const totalNetProfitPool = Math.max(0, totalGrossRevenue - totalCogs);

  const fugaloRevenueShare = totalNetProfitPool * (revShareFugalo / 100);
  const dlpRevenueShare = totalNetProfitPool * ((100 - revShareFugalo) / 100);

  const formatVND = (num: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Math.round(num));
  };

  // Recharts Bar Data for package comparison
  const packagesChartData = [
    {
      name: "Starter (20-50M)",
      "Doanh thu (M VND)": Math.round(starterRev / 1000000),
      "Lợi nhuận ròng (M VND)": Math.round((starterRev * (1 - cogsPercent / 100)) / 1000000),
      "Số HĐ dự kiến": Number(starterClosed.toFixed(1))
    },
    {
      name: "Premium (50-150M)",
      "Doanh thu (M VND)": Math.round(premiumRev / 1000000),
      "Lợi nhuận ròng (M VND)": Math.round((premiumRev * (1 - cogsPercent / 100)) / 1000000),
      "Số HĐ dự kiến": Number(premiumClosed.toFixed(1))
    },
    {
      name: "VIP (150-500M)",
      "Doanh thu (M VND)": Math.round(vipRev / 1000000),
      "Lợi nhuận ròng (M VND)": Math.round((vipRev * (1 - cogsPercent / 100)) / 1000000),
      "Số HĐ dự kiến": Number(vipClosed.toFixed(1))
    },
    {
      name: "Signature (500M+)",
      "Doanh thu (M VND)": Math.round(signatureRev / 1000000),
      "Lợi nhuận ròng (M VND)": Math.round((signatureRev * (1 - cogsPercent / 100)) / 1000000),
      "Số HĐ dự kiến": Number(signatureClosed.toFixed(1))
    }
  ];

  // Recharts Pie Data for Share split
  const pieShareData = [
    { name: "Fugalo Revenue Share", value: Math.round(fugaloRevenueShare / 1000000), color: "#d97706" },
    { name: "Dans la Peau Share", value: Math.round(dlpRevenueShare / 1000000), color: "#78716c" }
  ];

  return (
    <div className="space-y-8 animate-fade-in font-sans" id="b2b-gifting-calculator">
      
      {/* 1. SECTION INTRO DUCTION HEADER BAR */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-mono text-amber-700 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-600 animate-pulse" />
              <span>CÔNG CỤ PHÂN TÍCH QUÀ TẶNG DOANH NGHIỆP (B2B CORP CALCULATOR)</span>
            </span>
            <h2 className="text-2xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Bảng Tính Chỉ Số Gifting Phú Gia & Hợp Tác Doanh Nghiệp
            </h2>
            <p className="text-stone-605 text-sm leading-relaxed font-semibold">
              Kênh quà tặng doanh nghiệp B2B (Corporate Gifting) mang lại doanh thu lớn với biên lợi nhuận tuyệt hảo cho liên minh 
              <strong className="text-stone-900 font-extrabold"> Fugalo x Dans la Peau</strong>. Sử dụng mô hình dưới đây để phản ánh 
              tỷ lệ chuyển đổi đơn hàng, cơ cấu phân bổ của 4 gói giải pháp cốt lõi, từ đó tính toán doanh thu tổng và phần chia lợi nhuận thực tế.
            </p>
          </div>
          <div className="bg-stone-50 border border-stone-205 p-4 rounded-xl text-center min-w-[200px] shadow-sm">
            <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider block font-bold">Biên Lợi Nhuận Gộp Mục Tiêu</span>
            <span className="text-3xl font-serif font-extrabold text-stone-900 my-1 block">{(100 - cogsPercent)}%</span>
            <span className="text-[10px] text-emerald-700 font-mono font-semibold uppercase tracking-wide">
              {cogsPercent > 40 ? "Cần tối ưu COGS thợ" : "Mức biên lý tưởng"}
            </span>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC SCORECARD OF TOP CALCULATING TARGETS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5" id="b2b-calc-results-scorecard">
        {/* Total revenue */}
        <div className="bg-stone-900 border border-stone-850 rounded-xl p-5 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/[0.04] rounded-full blur-xl pointer-events-none" />
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-stone-400 font-bold uppercase tracking-wider">Doanh thu gộp ước tính</span>
              <Coins className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-serif font-extrabold text-amber-400 my-1">
              {formatVND(totalGrossRevenue)}
            </div>
          </div>
          <p className="text-[11px] text-stone-400 font-medium leading-relaxed pt-2 border-t border-stone-800">
            Dựa trên <span className="font-bold text-white">{expectedTotalClosedDeals.toFixed(1)}</span> hợp đồng B2B chốt thành công.
          </p>
        </div>

        {/* Expected Net profits pool */}
        <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider">Tổng Lợi Nhuận Ròng (Net Profit)</span>
              <TrendingUp className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-serif font-extrabold text-emerald-700 my-1">
              {formatVND(totalNetProfitPool)}
            </div>
          </div>
          <p className="text-[11px] text-stone-605 font-medium leading-relaxed pt-2 border-t border-stone-105">
            Chi phí sản xuất & gia công ước tính: {formatVND(totalCogs)} ({cogsPercent}%).
          </p>
        </div>

        {/* Fugalo Share Split */}
        <div className="bg-amber-50/40 border border-amber-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-amber-800 font-bold uppercase tracking-wider">Phần chia Fugalo ({revShareFugalo}%)</span>
              <Wallet className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl font-serif font-extrabold text-amber-800 my-1">
              {formatVND(fugaloRevenueShare)}
            </div>
          </div>
          <p className="text-[11px] text-amber-700 font-semibold leading-relaxed pt-2 border-t border-amber-200/50">
            Fugalo đảm nhận tệp khách VIP sáp nhập, phòng trưng bày, dịch vụ khách hàng 5 sao.
          </p>
        </div>

        {/* Dans la Peau Share Split */}
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono text-stone-500 font-bold uppercase tracking-wider">Phần chia Dans la Peau ({100 - revShareFugalo}%)</span>
              <Briefcase className="w-4 h-4 text-stone-600" />
            </div>
            <div className="text-2xl font-serif font-extrabold text-stone-800 my-1">
              {formatVND(dlpRevenueShare)}
            </div>
          </div>
          <p className="text-[11px] text-stone-605 font-medium leading-relaxed pt-2 border-t border-stone-200">
            Atelier đảm nhận sản xuất, nguyên liệu da cao cấp, gia công kỹ thuật khâu khố cao độ.
          </p>
        </div>
      </div>

      {/* 3. CORE TWO COLUMN CONTROL WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side Panel: Interactive Inputs & Controls (8 cols on desktop) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-6">
            <h4 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider border-b border-stone-105 pb-3">
              Tham Số Đầu Vào Chiến Dịch
            </h4>

            {/* Scenario Toggler (Radio Toggle Group) */}
            <div className="space-y-3 p-4 bg-stone-50 border border-stone-200 rounded-xl">
              <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest block font-bold">Kịch Bản Tăng Trưởng / B2B Growth Scenarios</span>
              <div className="grid grid-cols-1 gap-2">
                {[
                  {
                    id: "conservative",
                    label: "Conservative (Bảo thủ)",
                    description: "Mô phỏng quy mô an toàn, hạn chế tối đa chi phí. Tối ưu hóa thủ công nhỏ.",
                    leads: 50,
                    conv: 5,
                    cogs: 40,
                    badgeColor: "bg-stone-100 text-stone-700 border-stone-250"
                  },
                  {
                    id: "standard",
                    label: "Standard (Cơ bản)",
                    description: "Baseline hoạt động tối ưu của liên minh với tệp golf & khách VIP ban đầu.",
                    leads: 100,
                    conv: 10,
                    cogs: 35,
                    badgeColor: "bg-amber-50 text-amber-800 border-amber-200"
                  },
                  {
                    id: "aggressive",
                    label: "Aggressive (Tích cực)",
                    description: "Đẩy mạnh dịch vụ VIP, tặng phẩm custom cho Private Banking & chuỗi resort Pháp.",
                    leads: 250,
                    conv: 18,
                    cogs: 30,
                    badgeColor: "bg-stone-900 text-amber-400 border-stone-800"
                  }
                ].map((scen) => (
                  <label
                    key={scen.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer select-none ${
                      selectedScenario === scen.id
                        ? "border-amber-600 bg-white shadow-sm ring-1 ring-amber-600/30"
                        : "border-stone-200 bg-white hover:bg-stone-50/50"
                    }`}
                  >
                    <input
                      type="radio"
                      name="growth-scenario"
                      value={scen.id}
                      checked={selectedScenario === scen.id}
                      onChange={() => applyScenario(scen.id as "standard" | "aggressive" | "conservative")}
                      className="mt-1 w-4 h-4 text-amber-600 border-stone-300 focus:ring-amber-500 focus:ring-2"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-stone-900">{scen.label}</span>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border ${scen.badgeColor}`}>
                          {scen.leads} Leads @ {scen.conv}%
                        </span>
                      </div>
                      <p className="text-[10px] text-stone-500 mt-1 leading-normal font-medium">{scen.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Total leads input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-stone-750 font-bold flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-stone-500" />
                  <span>Quy mô Leads Doanh Nghiệp (Leads)</span>
                </label>
                <span className="text-xs font-mono font-bold text-amber-600 tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                  {totalLeads} Doanh nghiệp
                </span>
              </div>
              <input 
                type="range" 
                min="10" 
                max="500" 
                step="5"
                value={totalLeads} 
                onChange={(e) => setTotalLeads(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-stone-100 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-stone-500 block font-sans">
                Tổng số lượng liên hệ B2B thu thập được qua marketing, network hoặc offline golf club.
              </span>
            </div>

            {/* Target Conversion Rate input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-stone-750 font-bold flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-stone-500" />
                  <span>Tỷ Lệ Chuyển Đổi Mục Tiêu (Conversion)</span>
                </label>
                <span className="text-xs font-mono font-bold text-amber-600 tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                  {conversionRate}%
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="50" 
                step="0.5"
                value={conversionRate} 
                onChange={(e) => setConversionRate(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-stone-100 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-stone-500 block font-sans">
                Tỷ lệ từ Lead ban đầu chuyển thành Hợp đồng chốt thành công ký kết (Closed Won).
              </span>
            </div>

            {/* Cost of Goods Sold input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-stone-750 font-bold flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-stone-500" />
                  <span>Cơ cấu nguyên liệu & gia công thợ (COGS)</span>
                </label>
                <span className="text-xs font-mono font-bold text-amber-600 tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                  {cogsPercent}%
                </span>
              </div>
              <input 
                type="range" 
                min="15" 
                max="65" 
                step="1"
                value={cogsPercent} 
                onChange={(e) => setCogsPercent(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-stone-100 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-stone-500 block font-sans">
                Bao gồm vật tư da cao cấp nhập Pháp, thợ may tay yên cương (saddle-stitch), hộp dựng.
              </span>
            </div>

            {/* Fugalo Share distribution split */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs text-stone-750 font-bold flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-stone-500" />
                  <span>Mô hình phân chia lợi nhuận (Fugalo vs DLP)</span>
                </label>
                <span className="text-xs font-mono font-bold text-amber-600 tracking-wider bg-amber-50 px-2 py-0.5 rounded">
                  {revShareFugalo} F / {100 - revShareFugalo} D
                </span>
              </div>
              <input 
                type="range" 
                min="20" 
                max="80" 
                step="5"
                value={revShareFugalo} 
                onChange={(e) => setRevShareFugalo(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer h-1.5 bg-stone-100 rounded-lg appearance-none"
              />
              <span className="text-[10px] text-stone-500 block font-sans">
                Điều chỉnh tỷ lệ phân chia dòng tiền ròng sau khi trừ các chi phí sản xuất cố định.
              </span>
            </div>

            {/* Custom Packaging Distribution allocations */}
            <div className="space-y-4 pt-3 border-t border-stone-100">
              <span className="text-[11px] font-mono text-stone-500 uppercase tracking-widest block font-bold">CƠ CẤU PHÂN BỔ 4 GÓI (%)</span>
              
              {/* Starter % allocation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-700 font-semibold flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500" />
                    Starter Distributor Allocation
                  </span>
                  <span className="font-mono font-bold">{starterDist}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={starterDist} 
                  onChange={(e) => handleDistChange("starter", Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer h-1"
                />
              </div>

              {/* Premium % allocation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-700 font-semibold flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500" />
                    Premium Distributor Allocation
                  </span>
                  <span className="font-mono font-bold">{premiumDist}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={premiumDist} 
                  onChange={(e) => handleDistChange("premium", Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer h-1"
                />
              </div>

              {/* VIP % allocation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-700 font-semibold flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-sky-500" />
                    VIP Gifting Allocation
                  </span>
                  <span className="font-mono font-bold">{vipDist}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={vipDist} 
                  onChange={(e) => handleDistChange("vip", Number(e.target.value))}
                  className="w-full accent-sky-500 cursor-pointer h-1"
                />
              </div>

              {/* Signature % allocation */}
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-stone-700 font-semibold flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-rose-500" />
                    Signature Allocation
                  </span>
                  <span className="font-mono font-bold">{signatureDist}%</span>
                </div>
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={signatureDist} 
                  onChange={(e) => handleDistChange("signature", Number(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-1"
                />
              </div>

              <div className="bg-stone-50 p-2.5 rounded text-[10px] text-stone-600 font-mono text-center border font-bold">
                TỔNG QUY ĐỔI CƠ CẤU: {starterDist + premiumDist + vipDist + signatureDist}%
              </div>
            </div>

          </div>
        </div>

        {/* Right Side Panel: Output Reports, Charts & Breakdown Table (7 cols on desktop) */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CHARTS CONTAINER CONTAINER */}
          <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-105 pb-3">
              <div className="space-y-0.5">
                <h4 className="text-sm font-serif font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-600" />
                  <span>Dự báo Doanh Thu & Lợi Nhuận B2B (Revenue Forecast Chart)</span>
                </h4>
                <p className="text-[11px] text-stone-500 font-medium">Biểu đồ quy mô giá trị hợp đồng lũy kế theo nhóm phân khúc gói.</p>
              </div>
              <span className="text-[10px] font-mono text-amber-700 bg-amber-50 px-2.5 py-1 rounded font-bold uppercase select-none">
                Đơn vị: Triệu VND (Million VND)
              </span>
            </div>

            {/* BAR CHART RECHARTS */}
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={packagesChartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f3" />
                  <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#78716c", fontWeight: 500 }} />
                  <YAxis tick={{ fontSize: 10, fill: "#78716c", fontWeight: 500 }} />
                  <Tooltip 
                    contentStyle={{ 
                      fontSize: "11px", 
                      fontFamily: "Inter, sans-serif", 
                      borderRadius: "8px",
                      border: "1px solid #e7e5e4"
                    }} 
                  />
                  <Legend wrapperStyle={{ fontSize: "11px", fontWeight: 550, marginTop: "5px" }} />
                  <Bar dataKey="Doanh thu (M VND)" fill="#d97706" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Lợi nhuận ròng (M VND)" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* SELECTION DETAILS BREAKDOWN TABLE */}
            <div className="space-y-3 pt-4 border-t border-stone-100">
              <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block font-bold">Bảng đặc tả cấu hình 4 gói quà tặng doanh nghiệp</span>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-sans tracking-tight border-collapse">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-200">
                      <th className="py-2.5 px-3 font-extrabold text-[#78716c] uppercase font-mono tracking-wider text-[10px]">Phân khúc</th>
                      <th className="py-2.5 px-3 font-extrabold text-[#78716c] uppercase font-mono tracking-wider text-[10px]">Tầm Giá HĐ</th>
                      <th className="py-2.5 px-3 font-extrabold text-[#78716c] uppercase font-mono tracking-wider text-[10px] text-center">Tỷ lệ</th>
                      <th className="py-2.5 px-3 font-extrabold text-[#78716c] uppercase font-mono tracking-wider text-[10px] text-right">Số HĐ chốt</th>
                      <th className="py-2.5 px-3 font-extrabold text-stone-900 uppercase font-mono tracking-wider text-[10px] text-right bg-amber-500/[0.04]">Ước tính Doanh Thu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {/* Starter row */}
                    <tr>
                      <td className="py-2.5 px-3 font-extrabold text-stone-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        Starter Packages
                      </td>
                      <td className="py-2.5 px-3 text-stone-500">20 - 50 triệu / đơn (Sỉ nhỏ)</td>
                      <td className="py-2.5 px-3 text-stone-605 text-center font-bold">{starterDist}%</td>
                      <td className="py-2.5 px-3 text-stone-500 text-right font-mono">{starterClosed.toFixed(1)} hđ</td>
                      <td className="py-2.5 px-3 text-stone-800 font-extrabold text-right bg-amber-500/[0.015] font-mono">{formatVND(starterRev)}</td>
                    </tr>

                    {/* Premium row */}
                    <tr>
                      <td className="py-2.5 px-3 font-extrabold text-stone-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        Premium Packages
                      </td>
                      <td className="py-2.5 px-3 text-stone-500">50 - 150 triệu / đơn (Bộ quà)</td>
                      <td className="py-2.5 px-3 text-stone-605 text-center font-bold">{premiumDist}%</td>
                      <td className="py-2.5 px-3 text-stone-500 text-right font-mono">{premiumClosed.toFixed(1)} hđ</td>
                      <td className="py-2.5 px-3 text-stone-800 font-extrabold text-right bg-amber-500/[0.015] font-mono">{formatVND(premiumRev)}</td>
                    </tr>

                    {/* VIP row */}
                    <tr>
                      <td className="py-2.5 px-3 font-extrabold text-stone-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-sky-500" />
                        VIP Packages
                      </td>
                      <td className="py-2.5 px-3 text-stone-500">150 - 500 triệu / đơn (Bespoke)</td>
                      <td className="py-2.5 px-3 text-stone-605 text-center font-bold">{vipDist}%</td>
                      <td className="py-2.5 px-3 text-stone-500 text-right font-mono">{vipClosed.toFixed(1)} hđ</td>
                      <td className="py-2.5 px-3 text-stone-800 font-extrabold text-right bg-amber-500/[0.015] font-mono">{formatVND(vipRev)}</td>
                    </tr>

                    {/* Signature row */}
                    <tr>
                      <td className="py-2.5 px-3 font-extrabold text-stone-800 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-rose-500" />
                        Signature Series
                      </td>
                      <td className="py-2.5 px-3 text-stone-500">Trên 500 triệu (Độc quyền BST)</td>
                      <td className="py-2.5 px-3 text-stone-605 text-center font-bold">{signatureDist}%</td>
                      <td className="py-2.5 px-3 text-stone-500 text-right font-mono">{signatureClosed.toFixed(1)} hđ</td>
                      <td className="py-2.5 px-3 text-stone-800 font-extrabold text-right bg-amber-500/[0.015] font-mono">{formatVND(signatureRev)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* GENERAL ADVISORY FOOTNOTE FROM ROADMAPS */}
            <div className="p-3.5 bg-stone-50 hover:bg-stone-100 border border-stone-200/60 rounded-xl transition-all duration-200 text-[11px] leading-relaxed text-stone-605 flex items-start gap-2.5 font-medium">
              <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <p>
                <strong className="text-[10px] text-stone-850 block font-extrabold uppercase tracking-wider mb-0.5">Lời khuyên chiến lược kinh doanh B2B:</strong>
                Gói <span className="font-bold text-amber-700">Signature Series</span> mang lại biên lợi nhuận cực lớn dẫu số lượng hợp đồng chốt được ít hơn. Hãy tận dụng quan hệ đối ngoại của ban lãnh đạo Fugalo để gửi trực tiếp catalog cao cấp tới các Câu lạc bộ Luxury Golf, Các ngân hàng tư nhân (Private Banking), và quỹ địa ốc lớn nhất TP.HCM/Bình Dương nhằm khai thác phân khúc VIP này.
              </p>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
