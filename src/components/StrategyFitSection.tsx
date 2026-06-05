/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SYNERGY_AXES } from "../data";
import { Trophy, HelpCircle, Layers, ArrowRight, Zap, Target, Quote } from "lucide-react";

export default function StrategyFitSection() {
  const [selectedAxis, setSelectedAxis] = useState<number>(0);
  const [customWeights, setCustomWeights] = useState<number[]>(SYNERGY_AXES.map(a => a.score));

  const updateWeight = (index: number, val: number) => {
    const updated = [...customWeights];
    updated[index] = val;
    setCustomWeights(updated);
  };

  // Calculate Weighted index
  const averageIndex = Math.round(customWeights.reduce((acc, curr) => acc + curr, 0) / SYNERGY_AXES.length);

  return (
    <div className="space-y-8 animate-fade-in" id="strategy-fit-section">
      
      {/* SECTION INTRO */}
      <div className="text-stone-700 space-y-2">
        <h3 className="text-xl font-serif font-bold text-stone-900">5 Trục Kết Hợp Chiến Lược</h3>
        <p className="text-xs font-medium text-stone-600">
          Phân tích chi tiết khả năng cộng sinh thương mại giữa tệp khách hàng, lòng tin của <span className="text-amber-700 font-bold">Fugalo</span> và tay nghề, chế tác thủ công của <span className="text-amber-700 font-bold">Dans la Peau</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT COLUMN: INTERACTIVE SCORECARD ROAD */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-white border border-stone-200 rounded-xl p-4 sm:p-6 space-y-4 shadow-md">
            <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block font-bold">Bảng trọng số & Đánh giá</span>
            <div className="space-y-3">
              {SYNERGY_AXES.map((axis, idx) => {
                const isSelected = selectedAxis === idx;
                return (
                  <div 
                    key={idx}
                    onClick={() => setSelectedAxis(idx)}
                    className={`p-4 rounded-lg border transition-all duration-200 cursor-pointer ${
                      isSelected 
                        ? "bg-amber-500/[0.03] border-amber-500 shadow-sm" 
                        : "bg-stone-50/50 border-stone-200 hover:border-stone-300 hover:bg-stone-50/80"
                    }`}
                    id={`synergy-axis-${idx}`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] uppercase font-mono tracking-wider text-amber-700 font-extrabold">Trục #{idx + 1}</span>
                        <h4 className="text-sm font-bold text-stone-900">{axis.axis}</h4>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-mono text-stone-550">Độ khả thi: </span>
                        <span className="text-sm font-mono font-bold text-amber-600">{customWeights[idx]}%</span>
                      </div>
                    </div>

                    {/* Miniature score bar */}
                    <div className="w-full bg-stone-100 h-1.5 rounded overflow-hidden mt-3">
                      <div 
                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-full transition-all duration-500" 
                        style={{ width: `${customWeights[idx]}%` }}
                      />
                    </div>

                    {/* Weight Adjustment block (only visible when expanded or selected) */}
                    {isSelected && (
                      <div className="mt-4 pt-4 border-t border-stone-200/60 space-y-2 font-sans" onClick={(e) => e.stopPropagation()}>
                        <div className="flex justify-between items-center text-xs text-stone-500">
                          <span className="font-medium">Năng lực thực hiện thực tế (Pilot)</span>
                          <span className="font-mono text-amber-705 font-bold">{customWeights[idx]} / 100</span>
                        </div>
                        <input 
                          type="range"
                          min="30"
                          max="100"
                          value={customWeights[idx]}
                          onChange={(e) => updateWeight(idx, parseInt(e.target.value))}
                          className="w-full h-1.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: ACTIVE SYNERGY SPOTLIGHT & SPIDER VISUALIZATION */}
        <div className="lg:col-span-5 space-y-6">
          {/* Spotlight Card */}
          <div className="bg-white border border-stone-200 rounded-xl p-6 relative overflow-hidden shadow-md h-full flex flex-col justify-between">
            <div className="absolute top-0 right-0 p-3 opacity-15">
              <Zap className="w-16 h-16 text-amber-500" />
            </div>

            <div className="space-y-5">
              <div className="flex items-center gap-1 text-xs text-amber-750 font-mono uppercase tracking-wider font-bold">
                <Target className="w-4 h-4 text-amber-600" />
                <span>Chi tiết trục cộng sinh số #{selectedAxis + 1}</span>
              </div>

              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900 leading-tight">
                  {SYNERGY_AXES[selectedAxis].axis}
                </h3>
                <p className="text-xs text-stone-500 font-sans mt-1 font-medium">
                  Đánh giá khả năng tối đa hóa giá trị vòng đời cho tệp khách xa xỉ.
                </p>
              </div>

              {/* Contrib boxes */}
              <div className="space-y-3 font-sans text-xs">
                <div className="p-3 bg-stone-50 rounded border border-stone-200">
                  <span className="text-amber-755 font-bold block mb-1 font-serif tracking-wider">Fugalo Đóng Góp:</span>
                  <p className="text-stone-650 font-medium leading-relaxed">{SYNERGY_AXES[selectedAxis].fugaloContrib}</p>
                </div>
                <div className="p-3 bg-stone-50 rounded border border-stone-200">
                  <span className="text-amber-755 font-bold block mb-1 font-serif tracking-wider">Dans la Peau Đóng Góp:</span>
                  <p className="text-stone-650 font-medium leading-relaxed">{SYNERGY_AXES[selectedAxis].dlpContrib}</p>
                </div>
              </div>

              {/* Opportunity area */}
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg relative">
                <Quote className="absolute top-2 right-2 w-7 h-7 text-amber-200/50" />
                <span className="text-[10px] font-mono uppercase text-amber-750 font-extrabold block mb-1">Cơ Hội Thương Mại Lớn:</span>
                <p className="text-xs text-stone-800 leading-relaxed font-sans italic font-medium">
                  "{SYNERGY_AXES[selectedAxis].opportunity}"
                </p>
              </div>
            </div>

            {/* Total Convergence factor summary */}
            <div className="mt-8 pt-5 border-t border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-stone-500 font-mono block uppercase font-bold">CHỈ SỐ HỘI TỤ ĐỒNG BỘ</span>
                <span className="text-xs text-stone-600 font-semibold">Tỷ lệ tương thích chung</span>
              </div>
              <div className="h-14 w-14 rounded-full border-2 border-stone-200 flex items-center justify-center bg-stone-50 shadow-inner relative">
                {/* Simulated circle border based on average score */}
                <div 
                  className={`absolute inset-0 rounded-full border-2 border-amber-500/20 pointer-events-none`}
                  style={{ clipPath: `polygon(0 0, 100% 0, 100% 100%, 0 100%)` }}
                />
                <span className="text-sm font-mono font-bold text-amber-600">{averageIndex}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
