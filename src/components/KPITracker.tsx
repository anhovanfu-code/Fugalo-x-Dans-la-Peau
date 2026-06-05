/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { KPITargetItem } from "../types";
import { Activity, Percent, Clock, ThumbsUp, Briefcase, Heart, AlertCircle } from "lucide-react";

interface KPITrackerProps {
  kpis: KPITargetItem[];
  setKpis: React.Dispatch<React.SetStateAction<KPITargetItem[]>>;
}

export default function KPITracker({ kpis, setKpis }: KPITrackerProps) {

  const handleUpdateValue = (id: string, newVal: number) => {
    setKpis(prev => prev.map(item => {
      if (item.id === id) {
        let newStatus: KPITargetItem["status"] = "not_reached";
        
        // Custom verification threshold rules
        if (id === "kpi-01") { // Cross Sell target 10-15
          if (newVal >= 10) newStatus = "achieved";
          else if (newVal >= 7) newStatus = "warning";
        } else if (id === "kpi-02") { // Gross Margin hover 40%
          if (newVal >= 40) newStatus = "achieved";
          else if (newVal >= 30) newStatus = "warning";
        } else if (id === "kpi-03") { // delivery timely rate 90
          if (newVal >= 90) newStatus = "achieved";
          else if (newVal >= 80) newStatus = "warning";
        } else if (id === "kpi-04") { // Defect rate < 5%
          if (newVal <= 5) newStatus = "achieved";
          else if (newVal <= 8) newStatus = "warning";
        } else if (id === "kpi-05") { // corp contract >= 1
          if (newVal >= 1) newStatus = "achieved";
          else if (newVal >= 0.5) newStatus = "warning";
        }

        return { ...item, currentValue: newVal, status: newStatus };
      }
      return item;
    }));
  };

  // Compute overall dynamic Partnership health index
  const totalWeight = kpis.reduce((acc, curr) => {
    let score = 0;
    if (curr.status === "achieved") score = 100;
    else if (curr.status === "warning") score = 50;
    return acc + (score * curr.scoreMultiplier);
  }, 0);

  const roundedHealth = Math.round(totalWeight);

  const getKPIIcon = (id: string) => {
    switch (id) {
      case "kpi-01":
        return <Percent className="w-5 h-5 text-amber-600" />;
      case "kpi-02":
        return <Activity className="w-5 h-5 text-emerald-600" />;
      case "kpi-03":
        return <Clock className="w-5 h-5 text-sky-600" />;
      case "kpi-04":
        return <ThumbsUp className="w-5 h-5 text-amber-600" />;
      default:
        return <Briefcase className="w-5 h-5 text-amber-600" />;
    }
  };

  const getStatusBadge = (status: KPITargetItem["status"]) => {
    switch (status) {
      case "achieved":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shadow-sm">Đạt chuẩn</span>;
      case "warning":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shadow-sm">Cận Biên</span>;
      default:
        return <span className="bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase shadow-sm">Chưa đạt</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="kpi-tracker-section">
      
      {/* 1. HEALTH METER DASHBOARD */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 sm:p-8 relative overflow-hidden shadow-sm">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="max-w-3xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-700 text-xs font-mono uppercase tracking-widest font-extrabold">
              <Heart className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>Chỉ số đo lường sức khỏe liên kết</span>
            </div>
            <h3 className="text-2xl font-serif font-bold text-stone-900 tracking-tight leading-tight">
              Kế hoạch Kiểm định Sức bán trước khi bàn Vốn góp
            </h3>
            <p className="text-stone-600 text-sm font-sans leading-relaxed font-semibold">
              Các chỉ số này phải được ghi nhận thực tế trong thời gian chạy thử 90 ngày. Fugalo chỉ đàm phán mua cổ phiếu hoặc rót tiền khi 
              <strong className="text-stone-900 font-bold"> Sức khỏe liên kết đạt trên 80%</strong>.
            </p>
          </div>

          <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100 flex flex-col items-center justify-center min-w-[200px] text-center shadow-inner">
            <span className="text-[10px] font-mono text-emerald-800 uppercase tracking-wider font-extrabold">CHỈ SỐ SỨC KHỎE (KPI METRIC)</span>
            <span className="text-4xl sm:text-5xl font-extrabold text-emerald-700 my-1 font-serif">{roundedHealth}%</span>
            <span className="text-[10px] text-emerald-600 leading-normal max-w-[170px] font-semibold">Ghi nhận trọng số KPI sau thử thách</span>
          </div>
        </div>

        {/* Dynamic Warning Alert if health is low */}
        {roundedHealth < 80 && (
          <div className="mt-6 p-4 bg-amber-50 border border-amber-200/60 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-xs text-stone-700 leading-relaxed font-sans font-semibold">
              <strong className="text-amber-800 font-bold">Chú ý:</strong> Sức khỏe liên kết hiện đang dưới ngưỡng an toàn (80%). Vui lòng hỗ trợ Dans la Peau cải thiện thời gian giao hàng (Lead time) hoặc gia tăng tỷ lệ bán hàng chéo tại showroom của mình để nâng cao chỉ số liên kết thương mại.
            </p>
          </div>
        )}
      </div>

      {/* 2. SPECIFIC INTERACTIVE KPI CARD GRID */}
      <div className="space-y-4">
        <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block font-bold">Bản tinh chỉnh KPI mô phỏng</span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {kpis.map((item) => (
            <div 
              key={item.id}
              className="bg-white border border-stone-200 rounded-xl p-5 hover:border-amber-600/30 transition-all font-sans shadow-sm"
              id={`kpi-widget-${item.id}`}
            >
              <div className="flex justify-between items-start gap-4 pb-3 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-stone-50 border border-stone-200 rounded-lg shadow-inner">
                    {getKPIIcon(item.id)}
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-stone-900">{item.vietnameseMetric}</h4>
                    <span className="text-[10px] font-mono text-stone-400 font-bold tracking-tight block">{item.metric}</span>
                  </div>
                </div>
                {getStatusBadge(item.status)}
              </div>

              {/* Descriptions */}
              <p className="text-xs text-stone-600 mt-3 leading-relaxed font-sans font-medium min-h-[40px]">
                {item.vietnameseDescription}
              </p>

              {/* Slider for Current value simulating */}
              <div className="mt-5 space-y-2 pt-4 border-t border-stone-105 border-stone-100">
                <div className="flex justify-between text-xs font-sans">
                  <span className="text-stone-500 font-semibold">Giá trị đạt thử nghiệm:</span>
                  <span className="font-mono text-amber-600 font-extrabold text-sm">
                    {item.currentValue} {item.unit}
                  </span>
                </div>

                {item.id === "kpi-05" ? (
                  // Step binary slider for Corp Contract
                  <input 
                    type="range"
                    min="0"
                    max="5"
                    step="1"
                    value={item.currentValue}
                    onChange={(e) => handleUpdateValue(item.id, parseInt(e.target.value))}
                    className="w-full h-1.5 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
                  />
                ) : (
                  // Smooth percentage/unit range slider
                  <input 
                    type="range"
                    min={item.id === "kpi-04" ? "0" : "0"}
                    max={item.id === "kpi-04" ? "15" : "100"}
                    step={item.id === "kpi-04" ? "0.5" : "5"}
                    value={item.currentValue}
                    onChange={(e) => handleUpdateValue(item.id, parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-stone-200 rounded appearance-none cursor-pointer accent-amber-600"
                  />
                )}

                <div className="flex justify-between text-[10px] text-stone-500 font-mono font-bold">
                  <span>Mục tiêu cam kết: {item.targetValue}</span>
                  <span>Trọng lực: {item.scoreMultiplier * 100}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
