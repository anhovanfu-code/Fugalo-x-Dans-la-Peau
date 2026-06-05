/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { KPITargetItem } from "../types";
import { Activity, Percent, Clock, ThumbsUp, Briefcase, Heart, AlertCircle, TrendingUp, Sparkles, LineChart as ChartIcon, Info } from "lucide-react";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from "recharts";

const KPI_90DAY_FORECAST_DATA = [
  { day: "Mở đầu", "Tốc độ Bán Chéo (%)": 3, "Biên Lợi Nhuận Gộp (%)": 32, "Giao Hàng Đúng Hạn (%)": 72, "Tỉ Lệ Lỗi (A/B %)": 6.8 },
  { day: "Ngày 15", "Tốc độ Bán Chéo (%)": 4.5, "Biên Lợi Nhuận Gộp (%)": 36, "Giao Hàng Đúng Hạn (%)": 76, "Tỉ Lệ Lỗi (A/B %)": 5.4 },
  { day: "Ngày 30", "Tốc độ Bán Chéo (%)": 7, "Biên Lợi Nhuận Gộp (%)": 40, "Giao Hàng Đúng Hạn (%)": 82, "Tỉ Lệ Lỗi (A/B %)": 4.2 },
  { day: "Ngày 45", "Tốc độ Bán Chéo (%)": 9.5, "Biên Lợi Nhuận Gộp (%)": 44, "Giao Hàng Đúng Hạn (%)": 87, "Tỉ Lệ Lỗi (A/B %)": 3.1 },
  { day: "Ngày 60", "Tốc độ Bán Chéo (%)": 11.5, "Biên Lợi Nhuận Gộp (%)": 48, "Giao Hàng Đúng Hạn (%)": 91, "Tỉ Lệ Lỗi (A/B %)": 2.2 },
  { day: "Ngày 75", "Tốc độ Bán Chéo (%)": 13, "Biên Lợi Nhuận Gộp (%)": 52, "Giao Hàng Đúng Hạn (%)": 94, "Tỉ Lệ Lỗi (A/B %)": 1.6 },
  { day: "Ngày 90 (Mục tiêu)", "Tốc độ Bán Chéo (%)": 15, "Biên Lợi Nhuận Gộp (%)": 55, "Giao Hàng Đúng Hạn (%)": 96, "Tỉ Lệ Lỗi (A/B %)": 1.0 }
];

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

      {/* 2. RECHARTS 90-DAY KPI GROWTH FORECAST GRAPH */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-4" id="kpi-recharts-chart-panel">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-600 text-xs font-mono uppercase tracking-widest font-extrabold">
              <ChartIcon className="w-4 h-4 text-amber-600" />
              <span>DỰ BÁO TIẾN TRÌNH KHẢO SÁT CHẠY THỬ 90 NGÀY (TREND FORECAST)</span>
            </div>
            <h3 className="text-base font-serif font-bold text-stone-900 leading-snug">
              Lộ trình Tăng trưởng Chỉ số KPI trong Giai đoạn Pilot
            </h3>
            <p className="text-xs text-stone-500 font-semibold font-sans">
              Thể hiện trực quan biểu đồ xu hướng bứt phá của 4 chỉ số chính qua từng chặng 15 ngày, từ lúc khởi động cho đến khi đóng cổng đánh giá.
            </p>
          </div>
          <span className="text-[10px] bg-stone-50 text-stone-500 border border-stone-200 px-2.5 py-1 rounded font-bold uppercase tracking-wider font-mono shadow-inner">
            Dữ liệu mô phỏng tuyến tính (Linear Model)
          </span>
        </div>

        {/* RECHARTS COMPONENT */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={KPI_90DAY_FORECAST_DATA}
              margin={{ top: 10, right: 20, left: -20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0efe9" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#78716c', fontSize: 10, fontWeight: 500 }}
                axisLine={{ stroke: '#e7e5e4' }}
              />
              <YAxis 
                tick={{ fill: '#78716c', fontSize: 10, fontWeight: 500 }}
                axisLine={{ stroke: '#e7e5e4' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #e7e5e4', 
                  borderRadius: '8px', 
                  fontSize: '11px',
                  fontFamily: 'Inter, sans-serif',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)'
                }} 
              />
              <Legend 
                verticalAlign="bottom" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', fontWeight: 550, color: '#444' }}
              />
              <Line 
                type="monotone" 
                dataKey="Tốc độ Bán Chéo (%)" 
                stroke="#d97706" 
                strokeWidth={3} 
                activeDot={{ r: 6 }} 
              />
              <Line 
                type="monotone" 
                dataKey="Biên Lợi Nhuận Gộp (%)" 
                stroke="#10b981" 
                strokeWidth={2.5} 
              />
              <Line 
                type="monotone" 
                dataKey="Giao Hàng Đúng Hạn (%)" 
                stroke="#0284c7" 
                strokeWidth={2} 
              />
              <Line 
                type="monotone" 
                dataKey="Tỉ Lệ Lỗi (A/B %)" 
                stroke="#e11d48" 
                strokeWidth={1.5} 
                strokeDasharray="4 4"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg text-[11px] text-stone-605 font-sans leading-relaxed flex items-start gap-2.5">
          <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <p className="font-semibold">
            <strong className="text-stone-800 font-bold uppercase text-[10px] tracking-wider block mb-0.5">Ý nghĩa chiến lược:</strong>
            Độ dốc của các đường thể hiện sự đồng pha bứt phá. Khi <span className="font-bold text-amber-700">Tốc độ bán chéo (Vàng đồng)</span> tăng lên mốc 15% và <span className="font-bold text-emerald-700">Biên lợi nhuận gộp (Xanh lục)</span> duy trì vững chắc từ 55%, cùng lúc kiểm soát <span className="font-bold text-rose-600">vết lỗi chỉ dưới 1% (Đường đứt đỏ)</span>, ban điều hành sẽ chính thức giải ngân nguồn vốn góp thành lập liên kết cổ đông bền chặt.
          </p>
        </div>
      </div>

      {/* 3. SPECIFIC INTERACTIVE KPI CARD GRID */}
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
