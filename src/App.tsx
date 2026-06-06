/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { DUE_DILIGENCE_DB, COOPERATION_TIMELINE, KPI_BENCHMARKS } from "./data";
import { DueDiligenceItem, TimelinePhase, KPITargetItem, NotificationItem } from "./types";
import Header from "./components/Header";
import OverviewSection from "./components/OverviewSection";
import StrategyFitSection from "./components/StrategyFitSection";
import DueDiligenceSection from "./components/DueDiligenceSection";
import TimelineSection from "./components/TimelineSection";
import DealCalculator from "./components/DealCalculator";
import KPITracker from "./components/KPITracker";
import ProposalMaker from "./components/ProposalMaker";
import PrintExecutiveReport from "./components/PrintExecutiveReport";
import B2BGiftingCalculator from "./components/B2BGiftingCalculator";
import AdminCockpit from "./components/AdminCockpit";
import { Sparkles, FileSpreadsheet, ArrowRight, DownloadCloud, Landmark, ShieldCheck, Settings } from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState<string>("overview");
  const [viewMode, setViewMode] = useState<"tabbed" | "full">("tabbed"); // Defaults to 'tabbed' for an elegant, compact and professional app interface
  
  // Storage Synchronization Status
  const [syncStatus, setSyncStatus] = useState<"synced" | "saving" | "offline">("synced");

  // Notifications State (persisted inside LocalStorage)
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const cached = localStorage.getItem("fugalo_notifications_v2");
      return cached ? JSON.parse(cached) : [
        {
          id: "sys-welcome",
          title: "Chào mừng bạn đến với M&A Portal",
          body: "Tính năng Offline Caching và Cấu hình FCM Push Notifications đã được kích hoạt trực thuộc nền tảng Fugalo.",
          timestamp: new Date().toISOString(),
          read: false,
          type: "system"
        }
      ];
    } catch (_) {
      return [];
    }
  });

  // Master states loaded with LocalStorage caching
  const [checklistItems, setChecklistItems] = useState<DueDiligenceItem[]>(() => {
    try {
      const cached = localStorage.getItem("fugalo_checklist_v2");
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (_) {}

    // First launch - set dynamic local mock deadlines (within or near 48 hours for immediate testing)
    const now = new Date();
    return DUE_DILIGENCE_DB.map((item) => {
      if (item.id === "leg-01") {
        // 18 hours in future (critical high risk) - fits within 48h
        const d = new Date(now.getTime() + 18 * 60 * 60 * 1000);
        return { ...item, deadline: d.toISOString() };
      }
      if (item.id === "leg-03") {
        // 32 hours in future - fits within 48h
        const d = new Date(now.getTime() + 32 * 60 * 60 * 1000);
        return { ...item, deadline: d.toISOString() };
      }
      if (item.id === "prod-01") {
        // 45 hours in future - fits within 48h
        const d = new Date(now.getTime() + 45 * 60 * 60 * 1000);
        return { ...item, deadline: d.toISOString() };
      }
      if (item.id === "fin-01") {
        // 5 days in future - outside 48h
        const d = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
        return { ...item, deadline: d.toISOString() };
      }
      return item;
    });
  });

  const [timelinePhases, setTimelinePhases] = useState<TimelinePhase[]>(() => {
    try {
      const cached = localStorage.getItem("fugalo_timeline_v2");
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (_) {}

    const now = new Date();
    return COOPERATION_TIMELINE.map((phase) => {
      if (phase.phaseNumber === 1) {
        return {
          ...phase,
          tasks: phase.tasks.map((task, idx) => {
            if (idx === 0) {
              // 12 hours from now - critical
              const d = new Date(now.getTime() + 12 * 60 * 60 * 1000);
              return { ...task, deadline: d.toISOString() };
            }
            if (idx === 1) {
              // 28 hours from now - critical
              const d = new Date(now.getTime() + 28 * 60 * 60 * 1000);
              return { ...task, deadline: d.toISOString() };
            }
            if (idx === 2) {
              // 4 days from now - not critical
              const d = new Date(now.getTime() + 4 * 24 * 60 * 60 * 1000);
              return { ...task, deadline: d.toISOString() };
            }
            return task;
          })
        };
      }
      return phase;
    });
  });

  const [kpiTargets, setKpiTargets] = useState<KPITargetItem[]>(() => {
    try {
      const cached = localStorage.getItem("fugalo_kpis_v2");
      if (cached) return JSON.parse(cached);
    } catch (_) {}
    return KPI_BENCHMARKS;
  });

  const [showProposalDraft, setShowProposalDraft] = useState<boolean>(false);
  const [showPrintReport, setShowPrintReport] = useState<boolean>(false);

  // Keep track of previous items for change-detection triggers
  const [prevChecklistItems, setPrevChecklistItems] = useState<DueDiligenceItem[]>(checklistItems);
  const [prevTimelinePhases, setPrevTimelinePhases] = useState<TimelinePhase[]>(timelinePhases);

  // Synchronized financial modeling inputs for matching report calculators
  const [activeModel, setActiveModel] = useState<"wholesale" | "revshare" | "capsule">("capsule");
  const [volume, setVolume] = useState<number>(100);
  const [retailPrice, setRetailPrice] = useState<number>(3500000); // 3.5m VND
  const [cogsPercent, setCogsPercent] = useState<number>(25);
  const [discountPercent, setDiscountPercent] = useState<number>(45);
  const [marketingCost, setMarketingCost] = useState<number>(30000000); // 30m VND

  // --- HISTORY MANAGER FOR DUE DILIGENCE CHECKLIST ---
  const [checklistPast, setChecklistPast] = useState<DueDiligenceItem[][]>([]);
  const [checklistFuture, setChecklistFuture] = useState<DueDiligenceItem[][]>([]);
  const isChecklistUndoingRedoing = React.useRef(false);

  const updateChecklistWithHistory = (newItems: DueDiligenceItem[] | ((prev: DueDiligenceItem[]) => DueDiligenceItem[])) => {
    if (isChecklistUndoingRedoing.current) {
      if (typeof newItems === "function") {
        setChecklistItems(newItems);
      } else {
        setChecklistItems(newItems);
      }
      return;
    }
    setChecklistItems((current) => {
      const resolved = typeof newItems === "function" ? newItems(current) : newItems;
      // Capture current checklist state in history
      setChecklistPast(prev => [...prev.slice(-29), current]);
      setChecklistFuture([]);
      return resolved;
    });
  };

  const handleChecklistUndo = () => {
    if (checklistPast.length === 0) return;
    isChecklistUndoingRedoing.current = true;
    const current = checklistItems;
    const previous = checklistPast[checklistPast.length - 1];
    setChecklistItems(previous);
    setChecklistFuture(prev => [current, ...prev]);
    setChecklistPast(prev => prev.slice(0, -1));
    setTimeout(() => {
      isChecklistUndoingRedoing.current = false;
    }, 50);
  };

  const handleChecklistRedo = () => {
    if (checklistFuture.length === 0) return;
    isChecklistUndoingRedoing.current = true;
    const current = checklistItems;
    const next = checklistFuture[0];
    setChecklistItems(next);
    setChecklistPast(prev => [...prev, current]);
    setChecklistFuture(prev => prev.slice(1));
    setTimeout(() => {
      isChecklistUndoingRedoing.current = false;
    }, 50);
  };

  // --- HISTORY MANAGER FOR DEAL CALCULATOR ---
  interface CalculatorState {
    activeModel: "wholesale" | "revshare" | "capsule";
    volume: number;
    retailPrice: number;
    cogsPercent: number;
    discountPercent: number;
    marketingCost: number;
  }

  const [calcPast, setCalcPast] = useState<CalculatorState[]>([]);
  const [calcFuture, setCalcFuture] = useState<CalculatorState[]>([]);
  const isCalcUndoingRedoing = React.useRef(false);
  const lastSavedCalcState = React.useRef<CalculatorState | null>(null);

  useEffect(() => {
    if (isCalcUndoingRedoing.current) return;
    const currentState: CalculatorState = {
      activeModel,
      volume,
      retailPrice,
      cogsPercent,
      discountPercent,
      marketingCost
    };
    if (!lastSavedCalcState.current) {
      lastSavedCalcState.current = currentState;
      return;
    }
    if (
      lastSavedCalcState.current.activeModel === activeModel &&
      lastSavedCalcState.current.volume === volume &&
      lastSavedCalcState.current.retailPrice === retailPrice &&
      lastSavedCalcState.current.cogsPercent === cogsPercent &&
      lastSavedCalcState.current.discountPercent === discountPercent &&
      lastSavedCalcState.current.marketingCost === marketingCost
    ) {
      return;
    }
    const timer = setTimeout(() => {
      setCalcPast(prev => {
        if (prev.length > 0) {
          const last = prev[prev.length - 1];
          if (
            last.activeModel === lastSavedCalcState.current?.activeModel &&
            last.volume === lastSavedCalcState.current?.volume &&
            last.retailPrice === lastSavedCalcState.current?.retailPrice &&
            last.cogsPercent === lastSavedCalcState.current?.cogsPercent &&
            last.discountPercent === lastSavedCalcState.current?.discountPercent &&
            last.marketingCost === lastSavedCalcState.current?.marketingCost
          ) {
            return prev;
          }
        }
        return [...prev.slice(-29), lastSavedCalcState.current!];
      });
      setCalcFuture([]);
      lastSavedCalcState.current = currentState;
    }, 800);
    return () => clearTimeout(timer);
  }, [activeModel, volume, retailPrice, cogsPercent, discountPercent, marketingCost]);

  const handleCalcUndo = () => {
    if (calcPast.length === 0) return;
    isCalcUndoingRedoing.current = true;
    const current: CalculatorState = {
      activeModel,
      volume,
      retailPrice,
      cogsPercent,
      discountPercent,
      marketingCost
    };
    const previous = calcPast[calcPast.length - 1];
    setActiveModel(previous.activeModel);
    setVolume(previous.volume);
    setRetailPrice(previous.retailPrice);
    setCogsPercent(previous.cogsPercent);
    setDiscountPercent(previous.discountPercent);
    setMarketingCost(previous.marketingCost);
    setCalcFuture(prev => [current, ...prev]);
    setCalcPast(prev => prev.slice(0, -1));
    lastSavedCalcState.current = previous;
    setTimeout(() => {
      isCalcUndoingRedoing.current = false;
    }, 100);
  };

  const handleCalcRedo = () => {
    if (calcFuture.length === 0) return;
    isCalcUndoingRedoing.current = true;
    const current: CalculatorState = {
      activeModel,
      volume,
      retailPrice,
      cogsPercent,
      discountPercent,
      marketingCost
    };
    const next = calcFuture[0];
    setActiveModel(next.activeModel);
    setVolume(next.volume);
    setRetailPrice(next.retailPrice);
    setCogsPercent(next.cogsPercent);
    setDiscountPercent(next.discountPercent);
    setMarketingCost(next.marketingCost);
    setCalcPast(prev => [...prev, current]);
    setCalcFuture(prev => prev.slice(1));
    lastSavedCalcState.current = next;
    setTimeout(() => {
      isCalcUndoingRedoing.current = false;
    }, 100);
  };

  // trigger notification helper definition
  const triggerNotification = (
    title: string,
    body: string,
    type: "deadline" | "update" | "sync" | "system" = "update",
    actionTab?: string,
    targetId?: string
  ) => {
    const newNotif: NotificationItem = {
      id: Math.random().toString(36).substring(2, 9),
      title,
      body,
      timestamp: new Date().toISOString(),
      read: false,
      type,
      actionTab,
      targetId
    };

    setNotifications((prev) => [newNotif, ...prev]);

    // Native Browser Notification Dispatch
    if ("Notification" in window && Notification.permission === "granted") {
      try {
        new Notification(title, {
          body,
          icon: "/favicon.ico",
        });
      } catch (err) {
        console.warn("Desktop/iOS Native Web Push alert suppressed inside container:", err);
      }
    }

    // Gentle iOS PWA-compliant device haptic feedback simulation
    try {
      if ("vibrate" in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
    } catch (_) {}
  };

  // Caching Persistors & Network state binders
  useEffect(() => {
    setSyncStatus("saving");
    const timer = setTimeout(() => {
      setSyncStatus(navigator.onLine ? "synced" : "offline");
    }, 600);

    try {
      localStorage.setItem("fugalo_checklist_v2", JSON.stringify(checklistItems));
    } catch (_) {}

    return () => clearTimeout(timer);
  }, [checklistItems]);

  useEffect(() => {
    setSyncStatus("saving");
    const timer = setTimeout(() => {
      setSyncStatus(navigator.onLine ? "synced" : "offline");
    }, 600);

    try {
      localStorage.setItem("fugalo_timeline_v2", JSON.stringify(timelinePhases));
    } catch (_) {}

    return () => clearTimeout(timer);
  }, [timelinePhases]);

  useEffect(() => {
    try {
      localStorage.setItem("fugalo_kpis_v2", JSON.stringify(kpiTargets));
    } catch (_) {}
  }, [kpiTargets]);

  useEffect(() => {
    try {
      localStorage.setItem("fugalo_notifications_v2", JSON.stringify(notifications));
    } catch (_) {}
  }, [notifications]);

  // Handle live network listeners
  useEffect(() => {
    const handleOnline = () => setSyncStatus("synced");
    const handleOffline = () => setSyncStatus("offline");
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Reactive task status update alerts (Integrates FCM triggers for status updates)
  useEffect(() => {
    checklistItems.forEach((item) => {
      const prev = prevChecklistItems.find((p) => p.id === item.id);
      if (prev && prev.status !== item.status) {
        let statusLabel = "";
        switch (item.status) {
          case "passed": statusLabel = "ĐẠT CHUẨN"; break;
          case "failed": statusLabel = "BẤT THƯỜNG / RỦI RO"; break;
          case "action_required": statusLabel = "CẦN HÀNH ĐỘNG"; break;
          default: statusLabel = "CHƯA RÕ";
        }
        triggerNotification(
          "Cập Nhật M&A Due Diligence",
          `Hạng mục "${item.vietnameseQuestion}" sang trạng thái: ${statusLabel}`,
          "update",
          "due-diligence",
          item.id
        );
      }
    });
    setPrevChecklistItems(checklistItems);
  }, [checklistItems]);

  useEffect(() => {
    timelinePhases.forEach((phase) => {
      const prevPhase = prevTimelinePhases.find((p) => p.phaseNumber === phase.phaseNumber);
      if (prevPhase) {
        phase.tasks.forEach((task) => {
          const prevTask = prevPhase.tasks.find((t) => t.id === task.id);
          if (prevTask && prevTask.completed !== task.completed) {
            triggerNotification(
              "Tiến độ Pilot Lộ trình",
              `Lộ trình "${task.text}" đã chuyển sang: ${task.completed ? "HOÀN THÀNH" : "CHƯA HOÀN THÀNH"}`,
              "update",
              "timeline",
              task.id
            );
          }
        });
      }
    });
    setPrevTimelinePhases(timelinePhases);
  }, [timelinePhases]);

  // Background scanner (Scans deadline occurrences and alerts if critical <= 48 hours)
  useEffect(() => {
    const runBackgroundDeadlineCheck = () => {
      const now = new Date();
      const fortyEightHours = 48 * 60 * 60 * 1000;
      
      // Check Due Diligence Item deadlines
      checklistItems.forEach((item) => {
        if (item.status !== "passed" && item.deadline) {
          const deadlineDate = new Date(item.deadline);
          const diff = deadlineDate.getTime() - now.getTime();
          if (diff > 0 && diff <= fortyEightHours) {
            const cacheKey = `notified_deadline_crit_${item.id}`;
            const alreadyNotified = localStorage.getItem(cacheKey);
            if (!alreadyNotified) {
              const hours = Math.round(diff / (1000 * 60 * 60));
              triggerNotification(
                "Cảnh Báo Hạn Chót 48h",
                `Yêu cầu rà soát: "${item.vietnameseQuestion}" sắp tới hạn chót trong ${hours} giờ nữa!`,
                "deadline",
                "due-diligence",
                item.id
              );
              localStorage.setItem(cacheKey, "true");
            }
          }
        }
      });

      // Check Tasks list deadlines inside roadmaps
      timelinePhases.forEach((phase) => {
        phase.tasks.forEach((task) => {
          if (!task.completed && task.deadline) {
            const deadlineDate = new Date(task.deadline);
            const diff = deadlineDate.getTime() - now.getTime();
            if (diff > 0 && diff <= fortyEightHours) {
              const cacheKey = `notified_deadline_crit_${task.id}`;
              const alreadyNotified = localStorage.getItem(cacheKey);
              if (!alreadyNotified) {
                const hours = Math.round(diff / (1000 * 60 * 60));
                triggerNotification(
                  "Lộ Trình Pilot khẩn cấp",
                  `Nhiệm vụ "${task.text}" sẽ hết hạn trong ${hours} giờ nữa!`,
                  "deadline",
                  "timeline",
                  task.id
                );
                localStorage.setItem(cacheKey, "true");
              }
            }
          }
        });
      });
    };

    runBackgroundDeadlineCheck();
    // Scan every 30 seconds
    const interval = setInterval(runBackgroundDeadlineCheck, 30000);
    return () => clearInterval(interval);
  }, [checklistItems, timelinePhases]);

  // Handle active tab change and support smooth scroll in continuous view mode
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    if (viewMode === "full") {
      const element = document.getElementById(`${tabId}-section`);
      if (element) {
        // Leave buffer for sticky header
        const yOffset = -220; 
        const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  };

  // Compute calculated values
  const getRiskWeight = (level: "high" | "medium" | "low") => {
    if (level === "high") return 3;
    if (level === "medium") return 2;
    return 1;
  };

  const totalPossibleWeight = checklistItems.reduce((acc, curr) => acc + getRiskWeight(curr.riskLevel), 0);
  const currentPassedWeight = checklistItems.reduce((acc, curr) => {
    if (curr.status === "passed") {
      return acc + getRiskWeight(curr.riskLevel);
    }
    return acc;
  }, 0);

  const clearanceScore = totalPossibleWeight > 0 ? Math.round((currentPassedWeight / totalPossibleWeight) * 100) : 0;

  // Calculate 90-day progress percentage based on all sub-tasks in timeline phases
  const totalTimelineTasks = timelinePhases.reduce((acc, phase) => acc + phase.tasks.length, 0);
  const completedTimelineTasks = timelinePhases.reduce(
    (acc, phase) => acc + phase.tasks.filter(task => task.completed).length,
    0
  );
  const overallTimelineProgress = totalTimelineTasks > 0 
    ? Math.round((completedTimelineTasks / totalTimelineTasks) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-800 selection:bg-amber-100 selection:text-stone-900 font-sans" id="app-root">
      
      {/* HEADER COMPONENT */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleTabChange} 
        checklistScore={clearanceScore}
        userEmail="anhovan.fu@gmail.com" 
        onPrintClick={() => setShowPrintReport(true)}
        viewMode={viewMode}
        setViewMode={setViewMode}
        syncStatus={syncStatus}
        notifications={notifications}
        setNotifications={setNotifications}
        triggerNotification={triggerNotification}
      />

      {/* OVERALL 90-DAY PROJECT ROADMAP PROGRESS BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-5" id="project-overall-progress">
        <div className="bg-white border border-stone-200/60 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xs animate-fade-in">
          <div className="flex items-center gap-3.5 w-full md:w-auto self-start md:self-center">
            <div className="p-3 bg-amber-50 border border-amber-100 text-amber-700 rounded-xl shrink-0">
              <ShieldCheck className="w-5 h-5 text-amber-500 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono uppercase tracking-[0.12em] text-stone-500 font-extrabold">Lộ Trình Tác Chiến Giai Đoạn Pilot</span>
                <span className="text-[9px] bg-emerald-50 border border-emerald-200/40 text-emerald-800 font-mono font-extrabold px-1.5 py-0.5 rounded tracking-wide uppercase">90 Ngày</span>
              </div>
              <h4 className="text-sm font-bold text-stone-900 mt-1">Tiến độ hợp tác Fugalo x Dans la Peau</h4>
            </div>
          </div>

          <div className="flex-1 w-full max-w-lg space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-stone-600 font-medium font-sans">Tỷ lệ hoàn thành nhiệm vụ</span>
              <span className="font-mono text-amber-600 font-extrabold text-sm">
                {overallTimelineProgress}% <span className="text-stone-400 font-sans font-normal">({completedTimelineTasks}/{totalTimelineTasks} nhiệm vụ)</span>
              </span>
            </div>
            <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden border border-stone-200/30">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-500"
                style={{ width: `${overallTimelineProgress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-24 sm:py-10 space-y-12">
        
        {/* Dynamic section injection or rendering of all sections in stacked layout */}
        {viewMode === "tabbed" ? (
          <div className="space-y-6">
            {activeTab === "overview" && (
              <OverviewSection 
                dealParams={{
                  activeModel,
                  volume,
                  retailPrice,
                  cogsPercent,
                  discountPercent,
                  marketingCost
                }}
              />
            )}
            
            {activeTab === "synergy" && <StrategyFitSection />}
            
            {activeTab === "due-diligence" && (
              <DueDiligenceSection 
                items={checklistItems} 
                setItems={updateChecklistWithHistory} 
                clearanceScore={clearanceScore} 
                onUndo={handleChecklistUndo}
                onRedo={handleChecklistRedo}
                canUndo={checklistPast.length > 0}
                canRedo={checklistFuture.length > 0}
              />
            )}
            
            {activeTab === "timeline" && (
              <TimelineSection 
                timeline={timelinePhases} 
                setTimeline={setTimelinePhases} 
              />
            )}
            
            {activeTab === "calculator" && (
              <DealCalculator 
                activeModel={activeModel}
                setActiveModel={setActiveModel}
                volume={volume}
                setVolume={setVolume}
                retailPrice={retailPrice}
                setRetailPrice={setRetailPrice}
                cogsPercent={cogsPercent}
                setCogsPercent={setCogsPercent}
                discountPercent={discountPercent}
                setDiscountPercent={setDiscountPercent}
                marketingCost={marketingCost}
                setMarketingCost={setMarketingCost}
                onUndo={handleCalcUndo}
                onRedo={handleCalcRedo}
                canUndo={calcPast.length > 0}
                canRedo={calcFuture.length > 0}
              />
            )}

            {activeTab === "b2b-gifting" && (
              <B2BGiftingCalculator />
            )}
            
            {activeTab === "kpis" && (
              <KPITracker 
                kpis={kpiTargets} 
                setKpis={setKpiTargets} 
              />
            )}

            {activeTab === "admin" && (
              <AdminCockpit 
                notifications={notifications}
                setNotifications={setNotifications}
                triggerNotification={triggerNotification}
                checklistItems={checklistItems}
                setChecklistItems={updateChecklistWithHistory}
              />
            )}
          </div>
        ) : (
          /* CONTINUOUS UNIFIED MAIN LAYOUT */
          <div className="space-y-16">
            {/* Overview & SWOT section */}
            <div id="overview-section" className="space-y-4 pt-4 border-t border-stone-200/40">
              <div className="flex items-center gap-2 pb-2">
                <span className="text-[10px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold text-amber-700">PHẦN 1</span>
                <span className="text-xs text-stone-500 font-sans uppercase tracking-widest font-bold">Tổng Quan & Phân Tích SWOT Hoạt Động</span>
              </div>
              <OverviewSection 
                dealParams={{
                  activeModel,
                  volume,
                  retailPrice,
                  cogsPercent,
                  discountPercent,
                  marketingCost
                }}
              />
            </div>

            {/* Strategic fit alignment section */}
            <div id="synergy-section" className="space-y-4 pt-10 border-t border-stone-200">
              <div className="flex items-center gap-2 pb-2">
                <span className="text-[10px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold text-amber-700">PHẦN 2</span>
                <span className="text-xs text-stone-500 font-sans uppercase tracking-widest font-bold">Trục Liên Kết Cộng Hưởng (Strategic Synergy)</span>
              </div>
              <StrategyFitSection />
            </div>

            {/* Due diligence item checks section */}
            <div id="due-diligence-section" className="space-y-4 pt-10 border-t border-stone-200">
              <div className="flex items-center gap-2 pb-2">
                <span className="text-[10px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold text-amber-700">PHẦN 3</span>
                <span className="text-xs text-stone-500 font-sans uppercase tracking-widest font-bold">Thẩm Định & Rủi Ro Pháp Lý (Due Diligence Checklist)</span>
              </div>
              <DueDiligenceSection 
                items={checklistItems} 
                setItems={updateChecklistWithHistory} 
                clearanceScore={clearanceScore} 
                onUndo={handleChecklistUndo}
                onRedo={handleChecklistRedo}
                canUndo={checklistPast.length > 0}
                canRedo={checklistFuture.length > 0}
              />
            </div>

            {/* Timeline phase and implementation section */}
            <div id="timeline-section" className="space-y-4 pt-10 border-t border-stone-200">
              <div className="flex items-center gap-2 pb-2">
                <span className="text-[10px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold text-amber-700">PHẦN 4</span>
                <span className="text-xs text-stone-500 font-sans uppercase tracking-widest font-bold">Kế Hoạch Tác Chiến 90 Ngày Giai Đoạn Pilot</span>
              </div>
              <TimelineSection 
                timeline={timelinePhases} 
                setTimeline={setTimelinePhases} 
              />
            </div>

            {/* Deal modeling and simulation calculator section */}
            <div id="calculator-section" className="space-y-4 pt-10 border-t border-stone-200">
              <div className="flex items-center gap-2 pb-2">
                <span className="text-[10px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold text-amber-700">PHẦN 5</span>
                <span className="text-xs text-stone-500 font-sans uppercase tracking-widest font-bold">Bộ Mô Phỏng Lợi Nhuận Gộp (Financial Deal Modeling)</span>
              </div>
              <DealCalculator 
                activeModel={activeModel}
                setActiveModel={setActiveModel}
                volume={volume}
                setVolume={setVolume}
                retailPrice={retailPrice}
                setRetailPrice={setRetailPrice}
                cogsPercent={cogsPercent}
                setCogsPercent={setCogsPercent}
                discountPercent={discountPercent}
                setDiscountPercent={setDiscountPercent}
                marketingCost={marketingCost}
                setMarketingCost={setMarketingCost}
                onUndo={handleCalcUndo}
                onRedo={handleCalcRedo}
                canUndo={calcPast.length > 0}
                canRedo={calcFuture.length > 0}
              />
            </div>

            {/* Corporate gifting model section added dynamically */}
            <div id="b2b-gifting-section" className="space-y-4 pt-10 border-t border-stone-200">
              <div className="flex items-center gap-2 pb-2">
                <span className="text-[10px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold text-amber-700">PHẦN 6</span>
                <span className="text-xs text-stone-500 font-sans uppercase tracking-widest font-bold">Dự Phóng Hợp Tác B2B & Quà Tặng Doanh Nghiệp VIP</span>
              </div>
              <B2BGiftingCalculator />
            </div>

            {/* KPI benchmarking target section */}
            <div id="kpis-section" className="space-y-4 pt-10 border-t border-stone-200">
              <div className="flex items-center gap-2 pb-2">
                <span className="text-[10px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold text-amber-700">PHẦN 7</span>
                <span className="text-xs text-stone-500 font-sans uppercase tracking-widest font-bold">Bảng Chỉ Số Đóng Gói Doanh Hóa & KPIs Trọng Tâm</span>
              </div>
              <KPITracker 
                kpis={kpiTargets} 
                setKpis={setKpiTargets} 
              />
            </div>

            {/* Admin Cockpit section */}
            <div id="admin-section" className="space-y-4 pt-10 border-t border-stone-200">
              <div className="flex items-center gap-2 pb-2">
                <span className="text-[10px] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded font-mono font-bold text-amber-700">PHẦN 8</span>
                <span className="text-xs text-stone-500 font-sans uppercase tracking-widest font-bold">Cổng Quản Trị Viên & Hộp Điều Khiển FCM Live (PWA Controls)</span>
              </div>
              <AdminCockpit 
                notifications={notifications}
                setNotifications={setNotifications}
                triggerNotification={triggerNotification}
                checklistItems={checklistItems}
                setChecklistItems={updateChecklistWithHistory}
              />
            </div>
          </div>
        )}

        {/* BOTTOM FIXED EXECUTIVE PROPOSAL CENTER */}
        <div className="pt-8 border-t border-stone-200" id="executive-proposal-base">
          <div className="bg-white border border-stone-200/80 rounded-xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md relative overflow-hidden">
            {/* Decorative terracotta background gradient flare */}
            <div className="absolute top-0 left-0 w-48 h-48 bg-amber-500/[0.02] rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-2 max-w-xl text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start">
                <span className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
                <span className="text-xs font-mono uppercase tracking-widest text-amber-600 font-bold">EXECUTIVE EXPORT SERVICE</span>
              </div>
              <h3 className="text-xl font-serif font-semibold text-stone-900">Soạn Thảo Biên Bản Ghi Nhớ & Đề Xuất Đối Tác</h3>
              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                Sau khi tinh chỉnh các chỉ số hoặc hoàn tất thẩm định, bạn có thể xem thử và xuất biên bản ghi nhớ (MOU) tinh tế bằng tiếng Việt để chính thức bàn thảo thương lượng với ban sáng lập Dans la Peau.
              </p>
            </div>

            <button
              onClick={() => setShowProposalDraft(!showProposalDraft)}
              className="flex items-center gap-2 px-5 py-3.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-white font-bold rounded-lg text-sm transition-all shadow-md hover:shadow-lg cursor-pointer shrink-0"
              id="draft-proposal-toggle"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>{showProposalDraft ? "Thu gọn bản đề xuất" : "Xem Bản Đề Xuất Đóng Gói (MOU)"}</span>
            </button>
          </div>
        </div>

        {/* Conditional rendering of proposal template */}
        {showProposalDraft && (
          <div className="pt-2">
            <ProposalMaker clearanceScore={clearanceScore} />
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-stone-200 bg-stone-100 pt-8 pb-28 md:py-8 text-xs text-stone-600 font-sans animate-fade-in" id="app-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            
            {/* Left side: System / disclaimer info */}
            <div className="max-w-md text-center md:text-left space-y-1">
              <p className="font-semibold text-stone-800">
                Fugalo x Dans la Peau Portal
              </p>
              <p className="text-[10px] text-stone-500 leading-relaxed">
                Ứng dụng thẩm định rủi ro và mô phỏng tài chính liên thông phục vụ khảo sát sáp nhập nội bộ. Đảm bảo an ninh dữ liệu.
              </p>
            </div>

            {/* Right side: Copyright & under it the Admin trigger */}
            <div className="flex flex-col items-center md:items-end gap-1.5 md:text-right mt-2 md:mt-0">
              <p className="text-stone-750 font-medium">
                Hệ thống Bản quyền © 2026 <span className="text-stone-900 font-semibold font-serif animate-pulse">Fugalo Co., Ltd</span>. Mọi quyền được bảo lưu.
              </p>
              
              <button
                onClick={() => {
                  if (viewMode === "tabbed") {
                    setActiveTab("admin");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    // Smooth scroll down to the bottom admin section
                    const element = document.getElementById("admin-section");
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth", block: "start" });
                    }
                  }
                }}
                className="group inline-flex items-center gap-1.5 text-[10px] md:text-xs font-sans font-medium tracking-wide text-stone-400 hover:text-amber-600 transition-colors cursor-pointer"
                id="footer-admin-trigger"
                title="Bảng Điều Hành Admin & PWA Controls"
              >
                <Settings className="w-3.5 h-3.5 text-stone-400 group-hover:text-amber-600 group-hover:rotate-45 transition-transform duration-300" />
                <span>Cổng Quản Trị Hệ Thống</span>
              </button>
            </div>

          </div>
        </div>
      </footer>

      {/* PRINT CENTER / PDF REPORT EXPORTER MODAL Overlay */}
      {showPrintReport && (
        <PrintExecutiveReport 
          checklistItems={checklistItems}
          timelinePhases={timelinePhases}
          kpiTargets={kpiTargets}
          clearanceScore={clearanceScore}
          dealParams={{
            activeModel,
            volume,
            retailPrice,
            cogsPercent,
            discountPercent,
            marketingCost
          }}
          onClose={() => setShowPrintReport(false)}
        />
      )}
    </div>
  );
}
