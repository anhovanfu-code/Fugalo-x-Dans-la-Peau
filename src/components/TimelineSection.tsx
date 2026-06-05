/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { TimelinePhase } from "../types";
import { COOPERATION_TIMELINE, WEEKLY_MILESTONES } from "../data";
import { 
  Calendar, CheckCircle, Circle, ArrowRight, Play, Award, 
  HelpCircle, ChevronRight, CheckCircle2, ShieldAlert, Flag, Compass, ClipboardList 
} from "lucide-react";

interface TimelineSectionProps {
  timeline: TimelinePhase[];
  setTimeline: React.Dispatch<React.SetStateAction<TimelinePhase[]>>;
}

export default function TimelineSection({ timeline, setTimeline }: TimelineSectionProps) {
  const [subTab, setSubTab] = useState<"phases" | "weeks">("phases");
  const [activePhaseIndex, setActivePhaseIndex] = useState<number>(0);
  const [completedWeeks, setCompletedWeeks] = useState<number[]>([]);

  const toggleWeek = (weekNum: number) => {
    setCompletedWeeks(prev => 
      prev.includes(weekNum) 
        ? prev.filter(w => w !== weekNum) 
        : [...prev, weekNum]
    );
  };

  const toggleTask = (phaseIdx: number, taskId: string) => {
    setTimeline(prev => prev.map((phase, pIdx) => {
      if (pIdx === phaseIdx) {
        const updatedTasks = phase.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, completed: !t.completed };
          }
          return t;
        });

        // Determine phase status automatically based on tasks
        const allDone = updatedTasks.every(t => t.completed);
        const someDone = updatedTasks.some(t => t.completed);
        let newStatus: TimelinePhase["status"] = "upcoming";
        
        if (allDone) {
          newStatus = "completed";
        } else if (someDone || pIdx === 0) {
          newStatus = "active";
        }

        return { ...phase, tasks: updatedTasks, status: newStatus };
      }
      return phase;
    }));
  };

  const handleUpdateDuration = (phaseIdx: number, newDuration: string) => {
    setTimeline(prev => prev.map((phase, pIdx) => {
      if (pIdx === phaseIdx) {
        return { ...phase, duration: newDuration };
      }
      return phase;
    }));
  };

  // Compute stats for focused phase
  const focusedPhase = timeline[activePhaseIndex];
  const totalTasks = focusedPhase.tasks.length;
  const completedTasks = focusedPhase.tasks.filter(t => t.completed).length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Render status badge
  const getStatusBadge = (status: TimelinePhase["status"]) => {
    switch (status) {
      case "completed":
        return <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono uppercase">Completed</span>;
      case "active":
        return <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono uppercase">Active-In-Progress</span>;
      default:
        return <span className="bg-stone-100 text-stone-500 border border-stone-200 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider font-mono uppercase">Upcoming</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in" id="timeline-section">
      
      {/* HEADER SECTION */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <div className="space-y-1">
          <span className="text-xs font-mono text-amber-600 uppercase tracking-widest block font-bold">Chronological Schedule</span>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900">Thiết Kế Lộ Trình Hợp Tác & Tiến Độ 13 Tuần</h3>
          <p className="text-xs text-stone-600 font-sans max-w-2xl font-medium leading-relaxed mt-1">
            Quá trình hợp tác phi rủi ro: từ Thí điểm 90 ngày cốt lõi → Thiết lập Capsule co-branded → Nhận phân phối độc quyền dòng sản phẩm có điều kiện → Góp vốn liên doanh dài hạn.
          </p>
        </div>

        {/* SUBTAB SELECTION */}
        <div className="flex gap-2 mt-5 border-t border-stone-100 pt-5">
          <button
            onClick={() => setSubTab("phases")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
              subTab === "phases"
                ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>1. Lộ trình 4 Giai đoạn Vĩ mô</span>
          </button>
          <button
            onClick={() => setSubTab("weeks")}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg cursor-pointer transition-all border ${
              subTab === "weeks"
                ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                : "bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100 hover:text-stone-900"
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            <span>2. Kế hoạch Chi tiết Hằng Tuần (13 Tuần)</span>
          </button>
        </div>

        {/* Celebratory Banner if Phase 1 Pilot is fully checked */}
        {subTab === "phases" && activePhaseIndex === 0 && progressPercent === 100 && (
          <div className="mt-5 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 animate-pulse">
            <Award className="w-5 h-5 text-emerald-600 shrink-0" />
            <div className="text-xs">
              <strong className="text-emerald-800 block uppercase font-bold">CHÚC MỪNG: THÍ ĐIỂM (PILOT) ĐÃ SẴN SÀNG!</strong>
              <p className="text-stone-700 font-sans mt-0.5 font-medium">
                Mọi chỉ số hoạt động 90 ngày của Fugalo x Dans la Peau đã sẵn sàng chuyển sang <strong className="text-stone-900 font-bold">Giai đoạn 2 (Bộ sưu tập Capsule co-branded)</strong>. Hãy nhấn sang Giai đoạn 2 bên dưới để lên kế hoạch.
              </p>
            </div>
          </div>
        )}
      </div>

      {subTab === "phases" ? (
        /* ROADMAP GRID */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT COMPONENT - TIMELINE STEPS RAIL */}
          <div className="lg:col-span-4 space-y-3">
            <span className="text-xs font-mono text-stone-500 uppercase tracking-widest block font-bold">Sắp thứ tự thực hiện</span>
            <div className="relative border-l border-stone-200 pl-4 ml-2 space-y-4 font-sans">
              {timeline.map((phase, idx) => {
                const isActive = idx === activePhaseIndex;
                return (
                  <div 
                    key={idx}
                    onClick={() => setActivePhaseIndex(idx)}
                    className={`relative p-3.5 rounded-lg border transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-amber-500/[0.03] border-amber-500 shadow-sm"
                        : "bg-white border-stone-200 hover:bg-stone-50"
                    }`}
                    id={`timeline-step-${idx}`}
                  >
                    {/* Timeline bullet dot */}
                    <div className={`absolute -left-[24px] top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      isActive 
                        ? "bg-amber-500 border-amber-500 text-white" 
                        : phase.status === "completed"
                        ? "bg-emerald-500 border-emerald-500 text-white"
                        : "bg-white border-stone-300"
                    }`}>
                      {phase.status === "completed" && (
                        <CheckCircle2 className="w-2.5 h-2.5 text-white font-bold" />
                      )}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider font-extrabold">Giai đoạn {phase.phaseNumber}</span>
                        {getStatusBadge(phase.status)}
                      </div>
                      <h4 className="text-xs font-extrabold text-stone-800">{phase.title}</h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500 mt-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        <span>{phase.duration}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COMPONENT - ACTIVE STAGE FOCUS */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-stone-200 rounded-xl p-6 space-y-6 shadow-sm">
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-amber-700 font-bold uppercase tracking-wider">CHỈ ĐẠO CHI TIẾT</span>
                    <ChevronRight className="w-4 h-4 text-stone-400" />
                    <span className="text-xs text-stone-500 font-bold">{focusedPhase.vietnameseTitle}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-serif font-bold text-stone-900 tracking-tight mt-0.5">
                    {focusedPhase.title}
                  </h3>
                </div>
                <div className="flex items-center gap-2 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
                  <span className="text-xs text-stone-500 font-medium font-sans">Tiến độ việc:</span>
                  <span className="font-mono text-amber-600 text-xs font-bold">{completedTasks}/{totalTasks} ({progressPercent}%)</span>
                </div>
              </div>

              {/* Objective */}
              <div className="space-y-1.5 font-sans">
                <span className="text-xs font-mono text-stone-500 uppercase tracking-wider block font-bold">MỤC TIÊU CỐT LÕI:</span>
                <p className="text-xs text-stone-700 leading-relaxed bg-amber-50/[0.05] border border-amber-200 p-3 rounded-lg border-l-2 border-l-amber-600 font-medium">
                  {focusedPhase.objective}
                </p>
              </div>

              {/* Adjustable Calendar / Duration Simulator */}
              <div className="space-y-2 bg-stone-50 p-4 rounded-lg border border-stone-200 font-sans">
                <span className="text-xs font-mono text-stone-500 uppercase tracking-wider block font-bold">MỐC THỜI GIAN DỰ KIẾN (CHỈNH SỬA):</span>
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-amber-600 shrink-0" />
                  <input 
                    type="text" 
                    value={focusedPhase.duration}
                    onChange={(e) => handleUpdateDuration(activePhaseIndex, e.target.value)}
                    className="bg-white border border-stone-200 text-xs text-stone-800 rounded px-2.5 py-1.5 w-full max-w-sm focus:outline-none focus:border-amber-500 font-medium shadow-sm" 
                    placeholder="Ví dụ: Ngày 1 - 90, Tháng thứ 4 - 5"
                  />
                  <span className="text-[10px] text-stone-400 italic font-medium">Mặc định: {COOPERATION_TIMELINE[activePhaseIndex].duration}</span>
                </div>
              </div>

              {/* Tasks checklist list */}
              <div className="space-y-3 font-sans">
                <span className="text-xs font-mono text-stone-500 uppercase tracking-wider block font-bold">DANH SÁCH BƯỚC CẦN HOÀN THÀNH:</span>
                <div className="space-y-2">
                  {focusedPhase.tasks.map((task) => (
                    <div 
                      key={task.id}
                      onClick={() => toggleTask(activePhaseIndex, task.id)}
                      className={`flex items-start gap-3 p-3.5 rounded-lg border transition-all duration-150 cursor-pointer ${
                        task.completed 
                          ? "bg-emerald-50/50 border-emerald-200 text-emerald-950" 
                          : "bg-stone-50/50 border-stone-200 text-stone-600 hover:border-stone-300 hover:bg-stone-50"
                      }`}
                      id={`task-item-${task.id}`}
                    >
                      <div className="shrink-0 mt-0.5">
                        {task.completed ? (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        ) : (
                          <Circle className="w-4 h-4 text-stone-400" />
                        )}
                      </div>
                      <span className={`text-xs leading-relaxed font-medium ${task.completed ? "line-through text-stone-400 italic" : "text-stone-800"}`}>
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Simulated Phase Navigator button */}
              <div className="pt-4 border-t border-stone-100 flex justify-between">
                <button
                  disabled={activePhaseIndex === 0}
                  onClick={() => setActivePhaseIndex(prev => prev - 1)}
                  className={`px-3 py-1.5 rounded bg-stone-50 border border-stone-200 text-xs text-stone-700 font-bold cursor-pointer select-none ${
                    activePhaseIndex === 0 ? "opacity-30 cursor-not-allowed" : "hover:bg-stone-100 shadow-sm"
                  }`}
                >
                  Giai đoạn trước
                </button>
                <button
                  disabled={activePhaseIndex === timeline.length - 1}
                  onClick={() => setActivePhaseIndex(prev => prev + 1)}
                  className={`px-3 py-1.5 rounded bg-amber-600 text-white font-bold text-xs cursor-pointer select-none border border-amber-600 shadow-sm ${
                    activePhaseIndex === timeline.length - 1 ? "opacity-30 cursor-not-allowed" : "hover:bg-amber-500"
                  }`}
                >
                  Giai đoạn kế tiếp
                </button>
              </div>

            </div>
          </div>

        </div>
      ) : (
        /* tactical 13-WEEK OPERATIONS CHRONOLOGY */
        <div className="space-y-6 animate-fade-in">
          <div className="bg-amber-50/20 border border-amber-200/80 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="space-y-1">
              <h4 className="text-sm font-serif font-bold text-stone-900">Chi tiết Tiến Độ 13 Tuần Pilot & Diligence</h4>
              <p className="text-xs text-stone-600 font-sans font-medium leading-relaxed max-w-2xl">
                Bàn giao kế hoạch hành động chi tiết từng tuần theo Critical Path giao kèo. Cho phép đánh dấu kiểm soát từng tuần để tính toán tổng độ sẵn sàng.
              </p>
            </div>
            <div className="bg-white px-3 py-1.5 rounded-lg border border-stone-200 font-mono text-xs font-bold text-amber-650 shrink-0 shadow-sm">
              Tuần đã duyệt: {completedWeeks.length} / 13 ({Math.round((completedWeeks.length / 13) * 100)}%)
            </div>
          </div>

          <div className="space-y-4">
            {WEEKLY_MILESTONES.map((wm) => {
              const isDone = completedWeeks.includes(wm.week);
              return (
                <div 
                  key={wm.week}
                  onClick={() => toggleWeek(wm.week)}
                  className={`bg-white border rounded-xl overflow-hidden shadow-sm transition-all duration-200 hover:border-amber-500/20 cursor-pointer ${
                    isDone ? "border-emerald-250 bg-emerald-50/[0.01]" : "border-stone-200"
                  }`}
                >
                  {/* Top Bar of week card */}
                  <div className={`px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b ${
                    isDone ? "bg-emerald-50/30 border-emerald-100" : "bg-stone-50/50 border-stone-100"
                  }`}>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 font-mono text-[11px] font-extrabold uppercase tracking-wider rounded-md border ${
                        isDone
                          ? "bg-emerald-100 text-emerald-850 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}>
                        TUẦN {wm.week < 10 ? `0${wm.week}` : wm.week}
                      </span>
                      <span className="text-xs font-serif font-extrabold text-stone-900">
                        {wm.week <= 5 ? "Giai đoạn Sửa soạn & Due Diligence" : wm.week <= 11 ? "Thực thi Thực nghiệm Pilot" : "Chốt báo cáo & Quyết nghị Vốn"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {isDone ? (
                        <span className="flex items-center gap-1 text-emerald-700 font-bold font-sans">
                          <CheckCircle className="w-4 h-4" />
                          <span>ĐÃ DUYỆT HOÀN TẤT</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-stone-400 font-bold font-sans">
                          <Circle className="w-4 h-4" />
                          <span>ĐANG THỰC HIỆN</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body text details */}
                  <div className="p-5 font-sans space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      {/* Left: Core Actions */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-extrabold block">TÂM ĐIỂM HÀNH ĐỘNG HÀNG NGÀY:</span>
                        <p className="text-stone-800 leading-relaxed font-semibold">{wm.focus}</p>
                      </div>

                      {/* Right: Deliverables */}
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wider font-extrabold block">SẢN PHẨM PHẢI BAN HÀNH (DELIVERABLE):</span>
                        <div className="bg-stone-50 border border-stone-200 p-3 rounded text-stone-700 leading-relaxed font-semibold font-sans">
                          {wm.output}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Warning condition: Stop Condition */}
                    <div className="pt-3 border-t border-stone-100/50 flex items-start gap-2.5 text-xs text-rose-800 bg-rose-50/20 px-3 py-2.5 rounded border border-rose-100">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div className="space-y-0.5">
                        <strong className="font-bold text-[10px] tracking-wider uppercase font-mono block text-rose-800">RÀO CẢN DỪNG ĐÀM PHÁN (GATE STOP CONDITION):</strong>
                        <span className="leading-relaxed font-sans font-medium">{wm.stopCondition}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
}

