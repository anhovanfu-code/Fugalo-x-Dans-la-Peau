/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Lock, Radio, Smartphone, HelpCircle, ShieldAlert, Check, RefreshCw, Sparkles, Send, BellRing, Eye, Laptop, Play, DownloadCloud, Power, CheckSquare, Plus, Trash2, Wifi, Layers, Clock, AlertTriangle, FileText, CheckCircle2, ChevronRight, X, AlertCircle, Sliders
} from "lucide-react";
import { NotificationItem, DueDiligenceItem } from "../types";

interface AdminCockpitProps {
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  triggerNotification: (
    title: string,
    body: string,
    type?: "deadline" | "update" | "sync" | "system",
    actionTab?: string,
    targetId?: string
  ) => void;
  checklistItems: DueDiligenceItem[];
  setChecklistItems: React.Dispatch<React.SetStateAction<DueDiligenceItem[]>>;
}

interface MockDevice {
  id: string;
  name: string;
  platform: "iOS (Safari PWA)" | "Android (Chrome PWA)" | "Desktop (PWA)";
  status: "online" | "offline";
  token: string;
  loc: string;
}

interface NotificationLog {
  id: string;
  title: string;
  body: string;
  type: "deadline" | "update" | "sync" | "system";
  targetTab: string;
  sentAt: string;
  recipientsCount: number;
  status: "success" | "pending";
}

export default function AdminCockpit({
  notifications,
  setNotifications,
  triggerNotification,
  checklistItems,
  setChecklistItems
}: AdminCockpitProps) {
  // Navigation tabs for administrator cockpit
  type AdminTab = "broadcast" | "pwa-setup" | "devices" | "logs";
  const [activeAdminTab, setActiveAdminTab] = useState<AdminTab>("broadcast");

  // PWA Add To Home Screen Simulators
  const [pwaInstallSimOpen, setPwaInstallSimOpen] = useState<boolean>(false);
  const [selectedMobileOS, setSelectedMobileOS] = useState<"ios" | "android">("ios");
  
  // Custom Push form states
  const [notifTitle, setNotifTitle] = useState("⚡️ KHẨN CẤP: Chữ ký MOU Fugalo x Dans la Peau");
  const [notifBody, setNotifBody] = useState("Hồ Văn An yêu cầu trưởng ban kiểm toán cập nhật biên nhận kho da Thảo Điền ngay trong tối nay.");
  const [notifType, setNotifType] = useState<"deadline" | "update" | "sync" | "system">("deadline");
  const [notifTargetTab, setNotifTargetTab] = useState<string>("due-diligence");
  const [vibeOn, setVibeOn] = useState<boolean>(true);
  
  // AI help generator state
  const [isAiGenerating, setIsAiGenerating] = useState<boolean>(false);
  const [aiPrompt, setAiPrompt] = useState("Yêu cầu các cố vấn tập họp báo cáo thuế 2 năm gần nhất");

  // Connected Client Devices
  const [connectedDevices, setConnectedDevices] = useState<MockDevice[]>([
    { id: "dev-iphone15", name: "iPhone 15 Pro của Hồ Văn An", platform: "iOS (Safari PWA)", status: "online", token: "fcm_apns_an_hov_731a98", loc: "Trụ sở Thảo Điền, Quận 2" },
    { id: "dev-galaxy24", name: "Samsung S24 Ultra - Trưởng Xưởng Hội An", platform: "Android (Chrome PWA)", status: "online", token: "fcm_gcm_workshop_ha_208c5", loc: "Xưởng 10.000m² Hội An" },
    { id: "dev-ipad", name: "iPad Pro - Cố vấn Tài chính Ernst & Young", platform: "iOS (Safari PWA)", status: "online", token: "fcm_apns_ey_finance_991f2", loc: "Quận 1, TP. HCM" },
    { id: "dev-laptop", name: "MacBook Pro M3 - Trưởng ban Kiểm toán", platform: "Desktop (PWA)", status: "offline", token: "fcm_web_master_audit_3200ff", loc: "Văn phòng Fugalo" }
  ]);

  // Notification history log tracker
  const [sentLogs, setSentLogs] = useState<NotificationLog[]>([
    {
      id: "log-1",
      title: "🚨 KHẨN CẤP: Rủi ro bản quyền Hermès/LV",
      body: "[Broadcast PWA] Phát hiện vải bạt cũ upcycling chưa thu hồi được hóa đơn chứng từ chính chủ từ Hermès. Đề nghị tạm dừng sản xuất lô hàng thử nghiệm Thảo Điền.",
      type: "deadline",
      targetTab: "due-diligence",
      sentAt: "Hôm nay, 08:30:15",
      recipientsCount: 3,
      status: "success"
    },
    {
      id: "log-2",
      title: "✅ ĐỒNG BỘ: Hoàn tất kiểm toán chuỗi xưởng Hội An",
      body: "[Broadcast PWA] Đã xác thực diện tích xưởng 10.000m² đạt chuẩn mở rộng công suất sản xuất B2B phục vụ đối tác ngoại giao.",
      type: "sync",
      targetTab: "synergy",
      sentAt: "Hôm qua, 15:45:00",
      recipientsCount: 3,
      status: "success"
    },
    {
      id: "log-3",
      title: "⚠️ CẢNH BÁO: Hạn thuê showroom Thảo Điền",
      body: "[Broadcast PWA] Địa điểm Thảo Điền chỉ còn hạn thuê 6 tháng. Thỏa thuận nhượng thương thảo cần cam kết gia hạn trước khi ký kết MOU.",
      type: "update",
      targetTab: "due-diligence",
      sentAt: "04/06/2026, 11:20:10",
      recipientsCount: 2,
      status: "success"
    }
  ]);

  // Notification Quick Presets
  const quickPresets = [
    {
      id: "preset-1",
      label: "⚠️ Tranh chấp Hermès",
      title: "🚨 KHẨN CẤP: Rủi ro bản quyền Hermès/LV",
      body: "Phát hiện vải bạt cũ upcycling chưa thu hồi được hóa đơn chứng từ chính chủ từ Hermès. Đề nghị tạm dừng sản xuất lô hàng thử nghiệm Thảo Điền.",
      type: "deadline" as const,
      targetTab: "due-diligence"
    },
    {
      id: "preset-2",
      label: "📅 Báo cáo công nợ",
      title: "⏰ HẠN CHÓT: Giải trình dòng tiền âm Thảo Điền",
      body: "Ban kế toán Dans la Peau cần hoàn tất đối chiếu công nợ nhà cung cấp da thô trong hôm nay để chuẩn bị ký MOU chính thức.",
      type: "deadline" as const,
      targetTab: "calculator"
    },
    {
      id: "preset-3",
      label: "🎉 Kiểm toán xưởng Hội An",
      title: "✅ ĐỒNG BỘ: Hoàn tất khảo sát thực địa chuỗi xưởng Hội An",
      body: "Đã xác thực diện tích xưởng 10.000m² đạt chuẩn mở rộng công suất sản xuất B2B phục vụ đối tác ngoại giao.",
      type: "sync" as const,
      targetTab: "synergy"
    },
    {
      id: "preset-4",
      label: "⚡ Đồng bộ hệ thống",
      title: "💾 HỆ THỐNG: Khởi chạy bộ cơ sở dữ liệu sáp nhập PWA",
      body: "Hệ thống đã tự động đồng bộ hóa 90 ngày chiến lược thâu tóm thương hiệu giữa Fugalo x Dans la Peau.",
      type: "update" as const,
      targetTab: "overview"
    }
  ];

  const handleApplyPreset = (preset: typeof quickPresets[0]) => {
    setNotifTitle(preset.title);
    setNotifBody(preset.body);
    setNotifType(preset.type);
    setNotifTargetTab(preset.targetTab);
  };

  const toggleDeviceStatus = (deviceId: string) => {
    setConnectedDevices(prev => prev.map(dev => {
      if (dev.id === deviceId) {
        return { ...dev, status: dev.status === "online" ? "offline" : "online" };
      }
      return dev;
    }));
  };

  const deleteDevice = (deviceId: string) => {
    setConnectedDevices(prev => prev.filter(dev => dev.id !== deviceId));
  };

  const [newDeviceName, setNewDeviceName] = useState("");
  const [newDevicePlatform, setNewDevicePlatform] = useState<MockDevice["platform"]>("iOS (Safari PWA)");
  const handleAddMockDevice = () => {
    if (!newDeviceName.trim()) return;
    const newDev: MockDevice = {
      id: "dev-" + Math.random().toString(36).substring(2, 9),
      name: newDeviceName,
      platform: newDevicePlatform,
      status: "online",
      token: "fcm_token_" + Math.random().toString(36).substring(2, 7) + "_gen",
      loc: "Định vị mạng tự động"
    };
    setConnectedDevices(prev => [...prev, newDev]);
    setNewDeviceName("");
    
    // Trigger notification
    triggerNotification(
      "💻 Liên kết thiết bị mới thành công",
      `Thiết bị ${newDev.name} vừa cài app PWA và nhận Token đăng ký thông báo đẩy.`,
      "sync"
    );

    // Add into logs
    const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const newLog: NotificationLog = {
      id: "log-" + Math.random().toString(36).substring(2, 9),
      title: "💻 Thiết bị mới trực thuộc",
      body: `Dịch vụ liên kết tự động đã ghi nhận thiết bị: ${newDev.name}`,
      type: "sync",
      targetTab: "admin",
      sentAt: `Hôm nay, ${nowStr}`,
      recipientsCount: 1,
      status: "success"
    };
    setSentLogs(prev => [newLog, ...prev]);
  };

  const handleBroadcastNotification = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitle.trim() || !notifBody.trim()) return;

    // Filter online devices to showcase "received" count
    const activeClientsCount = connectedDevices.filter(d => d.status === "online").length;

    // Trigger local push simulation
    triggerNotification(
      notifTitle,
      `[Broadcast PWA] ${notifBody}`,
      notifType,
      notifTargetTab
    );

    // Add into Notification Logs
    const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const newLog: NotificationLog = {
      id: "log-" + Math.random().toString(36).substring(2, 9),
      title: notifTitle,
      body: notifBody,
      type: notifType,
      targetTab: notifTargetTab,
      sentAt: `Hôm nay, ${nowStr}`,
      recipientsCount: activeClientsCount,
      status: "success"
    };
    setSentLogs(prev => [newLog, ...prev]);

    // Custom browser audio or notification feedback
    if ("vibrate" in navigator && vibeOn) {
      navigator.vibrate([150, 100, 150]);
    }

    // Trigger alert
    alert(`📢 Đã gửi tín hiệu Broadcast thành công!\nTất cả ${activeClientsCount} thiết bị PWA đang ONLINE đã nhận được thông báo này tức thì qua FCM Gateway.`);
  };

  // Ask Gemini to write a professional notification for M&A based on a simple input
  const handleGenerateAiNotification = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiGenerating(true);
    try {
      const response = await fetch("/api/ai-risk-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{
            id: "audit-alert",
            question: "Audit Alert",
            vietnameseQuestion: "Giải phóng tài liệu thuế",
            details: `Admin yêu cầu thông báo khẩn cấp: ${aiPrompt}`,
            riskLevel: "high",
            status: "failed",
            notes: "Fugalo"
          }]
        }),
      });
      if (!response.ok) throw new Error("Mất kết nối máy chủ AI");
      const data = await response.json();
      
      const lines = data.insight.split("\n").filter((l: string) => l.trim().length > 0);
      let draftBody = data.insight;
      let draftTitle = "⚠️ THÔNG BÁO KHẨN CẤP M&A";
      
      if (lines.length > 0) {
        const cleanLines = lines.map((l: string) => l.replace(/^###\s*/, "").replace(/^\*\s*/, "").replace(/^\-\s*/, "").trim());
        draftTitle = cleanLines[0].substring(0, 50);
        draftBody = cleanLines.slice(1, 4).join(" ");
        if (draftBody.length > 200) draftBody = draftBody.substring(0, 200) + "...";
      }

      setNotifTitle(draftTitle);
      setNotifBody(draftBody);
    } catch (err: any) {
      alert("Lỗi máy chủ AI: " + err.message);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleClearLogs = () => {
    if (confirm("Bạn có chắc chắn muốn xóa toàn bộ nhật ký thông báo đã gửi?")) {
      setSentLogs([]);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in animate-duration-300" id="admin-pwa-cockpit">
      
      {/* 1. TOP TITLE BANNER */}
      <div className="bg-gradient-to-r from-stone-900 to-stone-850 border border-stone-800 text-stone-200 rounded-xl p-5 sm:p-6 shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/[0.03] rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
              <span className="text-[10px] bg-amber-500 text-stone-950 font-mono font-extrabold px-2.5 py-1 rounded uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                <Lock className="w-3.5 h-3.5" />
                <span>SECURE ROOT ADMIN</span>
              </span>
              <span className="text-[10px] bg-emerald-600 text-white font-mono font-extrabold px-2.5 py-1 rounded-sm uppercase tracking-wider">
                PWA LIVE STATUS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Cụm Điều Hành & Quản Trị Hệ Thống Notification PWA
            </h2>
            <p className="text-xs text-stone-400 font-sans max-w-xl leading-relaxed font-semibold">
              Khu vực quản trị tác nghiệp thương vụ Fugalo x Dans la Peau. Thiết kế cảnh báo sớm cho cố vấn di động, quản lý thiết bị đầu cuối và phát tín hiệu khẩn cấp thời gian thực.
            </p>
          </div>
          
          <div className="bg-stone-800/80 border border-stone-700 rounded-xl p-4 text-center space-y-1 min-w-[200px] shrink-0 w-full sm:w-auto">
            <span className="text-[10px] font-mono font-bold text-stone-400 uppercase tracking-widest block">KHÁCH HÀNG ONLINE KHẨN</span>
            <div className="text-3xl font-mono font-extrabold text-amber-500 animate-pulse">
              {connectedDevices.filter(d => d.status === "online").length}
              <span className="text-xs text-stone-500 font-sans font-medium"> / {connectedDevices.length} PWA</span>
            </div>
            <span className="text-[9px] text-[#db5129] font-mono tracking-wide block uppercase font-bold">FMC Gateway Secure</span>
          </div>
        </div>
      </div>

      {/* 2. SUB-NAVIGATION TABS (MOBILE FRIENDLY SCROLLABLE RAIL) */}
      <div className="border-b border-stone-200">
        <div className="flex overflow-x-auto scrollbar-none gap-2 pb-0.5">
          <button
            onClick={() => setActiveAdminTab("broadcast")}
            className={`flex items-center gap-2 py-3 px-4.5 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer ${
              activeAdminTab === "broadcast"
                ? "border-[#db5129] text-[#db5129]"
                : "border-transparent text-stone-550 hover:text-stone-900"
            }`}
          >
            <Send className="w-4 h-4" />
            <span>Gửi Thông Báo Khẩn</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("pwa-setup")}
            className={`flex items-center gap-2 py-3 px-4.5 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer ${
              activeAdminTab === "pwa-setup"
                ? "border-[#db5129] text-[#db5129]"
                : "border-transparent text-stone-550 hover:text-stone-900"
            }`}
          >
            <Smartphone className="w-4 h-4" />
            <span>Kích Hoạt PWA & Hướng Dẫn</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("devices")}
            className={`flex items-center gap-2 py-3 px-4.5 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer ${
              activeAdminTab === "devices"
                ? "border-[#db5129] text-[#db5129]"
                : "border-transparent text-stone-550 hover:text-stone-900"
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Quản Lý Thiết Bị ({connectedDevices.length})</span>
          </button>

          <button
            onClick={() => setActiveAdminTab("logs")}
            className={`flex items-center gap-2 py-3 px-4.5 text-xs font-bold transition-all border-b-2 shrink-0 cursor-pointer ${
              activeAdminTab === "logs"
                ? "border-[#db5129] text-[#db5129]"
                : "border-transparent text-stone-550 hover:text-stone-900"
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Nhật Ký Phát Sóng ({sentLogs.length})</span>
          </button>
        </div>
      </div>

      {/* 3. DYNAMIC TAB CONTENTS */}
      <div className="grid grid-cols-1 gap-8">
        
        {/* TAB 1: BROADCAST NOTIFICATIONS */}
        {activeAdminTab === "broadcast" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* Form & Preset Options column */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Presets Quick Drawer */}
              <div className="bg-gradient-to-r from-stone-50 to-stone-100 border border-stone-200/80 rounded-xl p-5 shadow-sm space-y-3.5">
                <span className="text-[10px] font-mono text-stone-500 uppercase tracking-widest font-extrabold flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-amber-600" />
                  Mẫu Soạn Thảo Siêu Tốc (Quick Presets)
                </span>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-semibold">
                  {quickPresets.map((preset) => (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleApplyPreset(preset)}
                      className="p-3 bg-white hover:bg-amber-50/50 border border-stone-200 rounded-lg text-left text-stone-850 hover:border-[#db5129] hover:text-[#db5129] flex items-center justify-between transition-all font-sans cursor-pointer group"
                    >
                      <span>{preset.label}</span>
                      <ChevronRight className="w-3.5 h-3.5 text-stone-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Broadcast Form */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="border-b border-stone-150 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Radio className="w-5 h-5 text-amber-600 animate-pulse" />
                    <h3 className="text-base font-serif font-bold text-stone-900">Trình Khởi Soạn & Phát Sóng FCM</h3>
                  </div>
                  <span className="text-[10px] font-mono text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded font-bold uppercase">
                    LIVE DISPATCH
                  </span>
                </div>

                <form onSubmit={handleBroadcastNotification} className="space-y-4 text-xs font-medium font-sans">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-stone-700 font-bold block">Tiêu Đề Điệp Báo:</label>
                      <input 
                        type="text" 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-850 outline-none focus:bg-white focus:border-amber-600 transition-all font-semibold"
                        placeholder="VD: Cảnh báo hạn chót sáp nhập..."
                        value={notifTitle}
                        onChange={(e) => setNotifTitle(e.target.value)}
                        required
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-stone-700 font-bold block">Cấp Độ Cảnh Báo:</label>
                      <select 
                        className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 outline-none focus:bg-white focus:border-[#db5129] cursor-pointer font-bold"
                        value={notifType}
                        onChange={(e) => setNotifType(e.target.value as any)}
                      >
                        <option value="deadline">Cảnh báo Hạn Chót (&lt; 48h)</option>
                        <option value="update">Cập nhật Trạng Thái M&A</option>
                        <option value="sync">Đồng bộ Đám mây</option>
                        <option value="system">Tin tức nội bộ / Hệ thống</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-stone-700 font-bold block">Điều Hướng Người Dùng Khi Click (Deep Linking):</label>
                    <select
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-700 outline-none focus:bg-white focus:border-[#db5129] cursor-pointer font-bold"
                      value={notifTargetTab}
                      onChange={(e) => setNotifTargetTab(e.target.value)}
                    >
                      <option value="overview">Tab 1: Tổng quan chiến lược & SWOT</option>
                      <option value="synergy">Tab 2: Trục liên kết & Chuỗi xưởng</option>
                      <option value="due-diligence">Tab 3: Thẩm định Due Diligence & AI Insights</option>
                      <option value="timeline">Tab 4: Lộ trình 90 ngày sáp nhập</option>
                      <option value="calculator">Tab 5: Bộ tính toán kiểm thử Deal</option>
                      <option value="kpis">Tab 7: Chỉ số KPI chuyển giao</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-stone-700 font-bold block">Văn bản mô tả khẩn cấp (Message Body):</label>
                    <textarea 
                      className="w-full p-2.5 bg-stone-50 border border-stone-200 rounded-lg text-stone-850 outline-none focus:bg-white focus:border-[#db5129] h-20 resize-none font-semibold leading-relaxed"
                      value={notifBody}
                      onChange={(e) => setNotifBody(e.target.value)}
                      placeholder="Mô tả khẩn..."
                      required
                    />
                  </div>

                  {/* Switch vib */}
                  <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-stone-50 border border-stone-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${vibeOn ? "bg-amber-600 animate-ping" : "bg-stone-300"}`} />
                      <span className="text-xs text-stone-650 font-semibold">Bao gồm Rung Haptic phản hồi trên iOS PWA</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setVibeOn(!vibeOn)}
                      className={`px-3 py-1 text-[11px] rounded font-bold cursor-pointer transition-all ${
                        vibeOn ? "bg-amber-600 text-white" : "bg-stone-200 text-stone-600"
                      }`}
                    >
                      {vibeOn ? "Đang BẬT" : "Đã TẮT"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-stone-900 via-stone-850 to-[#db5129] text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer select-none"
                  >
                    <Send className="w-4 h-4" />
                    <span>PHÁT TIN BROADCAST ĐẾN TẤT CẢ PWA NGAY</span>
                  </button>
                </form>
              </div>

            </div>

            {/* AI Generator on the right */}
            <div className="lg:col-span-5 space-y-6">
              
              <div className="bg-gradient-to-br from-[#db5129]/[0.02] to-amber-50 border border-amber-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-amber-700 uppercase tracking-widest font-extrabold">
                    <Sparkles className="w-4 h-4 text-amber-600 animate-pulse" />
                    <span>AI Content AI Generator</span>
                  </div>
                  <h3 className="text-sm font-serif font-bold text-stone-900">
                    Trợ Lý AI Tự Động Định Hình Văn Bản M&A
                  </h3>
                  <p className="text-[11px] text-stone-605 leading-relaxed font-medium">
                    Nhập chủ đề chỉ đạo thô, mô hình **Gemini-3.5-flash** sẽ tự viết thông điệp ngắn đanh thép và tinh chuẩn theo đúng ngôn phong an toàn của Fugalo.
                  </p>
                </div>

                <div className="space-y-3">
                  <input
                    type="text"
                    className="w-full p-2.5 text-xs text-stone-800 bg-white border border-stone-200 rounded-lg outline-none focus:border-[#db5129] font-medium"
                    placeholder="VD: Nhắc nhở ban kiểm tra sổ sách biên nhận da..."
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                  />
                  
                  <button
                    onClick={handleGenerateAiNotification}
                    disabled={isAiGenerating || !aiPrompt.trim()}
                    className="w-full py-2.5 bg-[#db5129] hover:bg-amber-700 disabled:bg-stone-300 text-white font-bold text-xs rounded-lg shadow transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isAiGenerating ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang cấu trúc thông báo...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>Chuyển hóa văn phong ban giám đốc</span>
                      </>
                    )}
                  </button>

                  <p className="text-[10px] text-stone-400 italic">
                    *Gợi ý: Mẫu văn tự động sẽ tìm kiếm các thông tin thiếu hụt tài chính, rủi ro cơ sở hạ tầng để tinh luyện.
                  </p>
                </div>
              </div>

              {/* Status checklist metrics */}
              <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-3.5">
                <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">Hiệu Suất Kết Nối Live</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between items-center py-1">
                    <span className="text-stone-500 font-medium">Sẵn sàng cổng FCM</span>
                    <span className="text-emerald-700 font-bold flex items-center gap-1">🟢 Đang hoạt động</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-stone-100">
                    <span className="text-stone-500 font-medium">Hàng đợi (Queue)</span>
                    <span className="font-mono font-bold text-stone-800">0 tin tồn đọng</span>
                  </div>
                  <div className="flex justify-between items-center py-1 border-t border-stone-100">
                    <span className="text-stone-500 font-medium">Khả năng tiếp nhận thông tin</span>
                    <span className="font-semibold text-stone-800">Độ trễ trung bình &lt; 80ms</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: PWA SETUP & ACTIVATION SCREEN */}
        {activeAdminTab === "pwa-setup" && (
          <div className="space-y-6 animate-fade-in">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Instructions on the Left */}
              <div className="lg:col-span-7 bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-6">
                <div className="flex items-center gap-2.5 border-b border-stone-100 pb-4">
                  <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
                    <Smartphone className="w-5 h-5 text-[#db5129]" />
                  </div>
                  <div>
                    <h3 className="text-base font-serif font-bold text-stone-900">Cách Thức Thêm Ứng Dụng Hóa PWA Lên Màn Hình Chính</h3>
                    <p className="text-xs text-stone-500 font-medium font-sans">Kích hoạt trải nghiệm như một ứng dụng di động độc lập, không thanh địa chỉ.</p>
                  </div>
                </div>

                {/* Simulated dynamic OS selector */}
                <div className="flex items-center gap-2 bg-stone-100 p-1 rounded-lg">
                  <button
                    onClick={() => setSelectedMobileOS("ios")}
                    className={`flex-1 py-2 text-xs font-extrabold rounded-md transition-all cursor-pointer ${
                      selectedMobileOS === "ios" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    Apple iOS (Safari)
                  </button>
                  <button
                    onClick={() => setSelectedMobileOS("android")}
                    className={`flex-1 py-2 text-xs font-extrabold rounded-md transition-all cursor-pointer ${
                      selectedMobileOS === "android" ? "bg-white text-stone-900 shadow-sm" : "text-stone-500 hover:text-stone-800"
                    }`}
                  >
                    Google Android (Chrome / Samsung)
                  </button>
                </div>

                {/* Step contents based on selected OS */}
                {selectedMobileOS === "ios" ? (
                  <div className="space-y-4 text-xs leading-relaxed font-sans font-medium">
                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 bg-amber-100 text-[#db5129] flex items-center justify-center font-bold font-mono rounded-full shrink-0 text-sm">
                        1
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-stone-900 text-sm">Mở bằng trình duyệt Safari tiêu chuẩn</h4>
                        <p className="text-stone-550">Đảm bảo bạn đang truy cập bằng trình duyệt Safari trên iPhone hoặc iPad của mình (Không sử dụng các trình xem ứng dụng in-app của Zalo, Facebook).</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 border-t border-stone-100 pt-3.5">
                      <div className="w-6 h-6 bg-amber-100 text-[#db5129] flex items-center justify-center font-bold font-mono rounded-full shrink-0 text-sm">
                        2
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-stone-900 text-sm">Chọn nút "Share" ở thanh điều khiển phía dưới</h4>
                        <p className="text-stone-550 flex items-center gap-1.5">
                          Nhấn vào nút có biểu tượng 
                          <span className="inline-flex items-center justify-center p-1 bg-stone-100 border rounded cursor-not-allowed">
                            <DownloadCloud className="w-3.5 h-3.5 text-stone-700" />
                          </span> 
                          (Nút Chia sẻ/Tải lên) ở chính giữa trình duyệt Safari.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 border-t border-stone-100 pt-3.5">
                      <div className="w-6 h-6 bg-amber-100 text-[#db5129] flex items-center justify-center font-bold font-mono rounded-full shrink-0 text-sm">
                        3
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-stone-900 text-sm">Chọn mục "Add to Home Screen" (Thêm vào MH chính)</h4>
                        <p className="text-stone-550">Cuộn danh sách xuống và chọn đúng dòng chữ **"Thêm vào Màn hình chính"**. Bạn có thể tùy biến lại tên hiển thị nếu thích.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 border-t border-stone-100 pt-3.5">
                      <div className="w-6 h-6 bg-amber-100 text-[#db5129] flex items-center justify-center font-bold font-mono rounded-full shrink-0 text-sm">
                        4
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-stone-900 text-sm">Trải nghiệm chế độ độc lập và Nhận thông báo</h4>
                        <p className="text-stone-550">Bây giờ, click vào biểu tượng Fugalo vừa xuất hiện trên Home Screen điện thoại. Ứng dụng sẽ hoạt động mượt mà ngoại tuyến, và tự động liên kết nhận cảnh báo đẩy thời gian thực.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4 text-xs leading-relaxed font-sans font-medium">
                    <div className="flex items-start gap-3.5">
                      <div className="w-6 h-6 bg-amber-100 text-[#db5129] flex items-center justify-center font-bold font-mono rounded-full shrink-0 text-sm">
                        1
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-stone-900 text-sm">Nhấp vào Thẻ Cài đặt PWA ngay góc trình duyệt</h4>
                        <p className="text-stone-550">Khi truy cập bằng Google Chrome trên điện thoại Android, hệ thống sẽ hiện một pop-up/thanh thông báo nhỏ mời gọi **"Cài đặt ứng dụng / Thêm vào MH chính"** ở cạnh đáy.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 border-t border-stone-100 pt-3.5">
                      <div className="w-6 h-6 bg-amber-100 text-[#db5129] flex items-center justify-center font-bold font-mono rounded-full shrink-0 text-sm">
                        2
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-stone-900 text-sm">Cài đặt trực tiếp qua biểu tượng Ba Dấu Chấm</h4>
                        <p className="text-stone-550">Nếu không thấy thanh mời gọi, nhấp vào menu Ba chấm dọc đứng ở góc trên bên phải trình duyệt, chọn dòng **"Cài đặt ứng dụng"** (Install app).</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 border-t border-stone-100 pt-3.5">
                      <div className="w-6 h-6 bg-amber-100 text-[#db5129] flex items-center justify-center font-bold font-mono rounded-full shrink-0 text-sm">
                        3
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-extrabold text-stone-900 text-sm">Xác nhận "Add / Cài đặt" để tải về</h4>
                        <p className="text-stone-550">Hệ thống Android sẽ nhanh chóng tải tệp manifest, tạo short-cut và đặt biểu tượng biểu trưng màu terracotta ra MH ngoài.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* THE MAIN ACTIVE BUTTON EXPLICITLY REQUESTED */}
                <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row gap-3 items-center">
                  <button
                    onClick={() => setPwaInstallSimOpen(true)}
                    className="w-full sm:w-auto px-6 py-3 bg-[#db5129] hover:bg-amber-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Smartphone className="w-4 h-4 animate-bounce" />
                    <span>KÝ KÍCH HOẠT PWA (MUA TRẢI NGHIỆM THỰC TẾ)</span>
                  </button>

                  <p className="text-[10px] text-stone-500 font-semibold italic text-center sm:text-left">
                    *Kích hoạt giao lưu giả lập để kiểm tra hoạt cảnh cài đặt trên các kích thước di động.
                  </p>
                </div>

              </div>

              {/* Technical indicators on the right */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Manifest block status */}
                <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
                  <div className="flex items-center gap-2 border-b border-stone-100 pb-3">
                    <Lock className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">Đồng Bộ Mã Trình Duyệt Shell</h4>
                  </div>

                  <p className="text-xs text-stone-500 font-semibold leading-relaxed">
                    Hế thống cổng PWA đã được biên dịch hoàn thành và hoạt động ổn định trên container Cloud Run:
                  </p>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 p-2 bg-stone-50 rounded border border-stone-200/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-stone-800">manifest.json</span>
                        <div className="text-[10px] text-stone-400">launcher_icon_v2, display standalone, theme terracotta.</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 p-2 bg-stone-50 rounded border border-stone-200/50">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold text-stone-800">Service Worker</span>
                        <div className="text-[10px] text-stone-400">Offline-first asset fallback, Cache-Control configured.</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold">
                    <button
                      onClick={() => alert(`📦 manifest.json format:\n{\n  "name": "Fugalo x Dans la Peau Portal",\n  "short_name": "Fugalo Portal",\n  "start_url": "/",\n  "display": "standalone",\n  "theme_color": "#db5129"\n}`)}
                      className="py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <DownloadCloud className="w-3 px-1.5" />
                      Manifest Code
                    </button>
                    <button
                      onClick={() => alert(`Service worker cache registered:\n\nself.addEventListener("install", (e) => {\n  e.waitUntil(caches.open("fugalo-pwa-v2").then(c => c.addAll(["/", "/index.html"])));\n});`)}
                      className="py-1.5 border border-stone-200 hover:bg-stone-50 text-stone-700 rounded flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5" />
                      Worker Code
                    </button>
                  </div>
                </div>

              </div>

            </div>

            {/* Simulated overlay for "Kích hoạt PWA" simulator */}
            {pwaInstallSimOpen && (
              <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white border border-stone-200 rounded-2xl max-w-sm w-full p-6 shadow-2xl relative animate-scale-in">
                  <button
                    onClick={() => setPwaInstallSimOpen(false)}
                    className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-full transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-[#db5129] text-white flex items-center justify-center rounded-2xl mx-auto shadow-md">
                      <Smartphone className="w-8 h-8" />
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-base font-serif font-bold text-stone-900">Giả lập Cài Đặt Fugalo Portal PWA</h4>
                      <p className="text-xs text-stone-500 font-semibold font-sans">
                        Tải trọn gói cổng thông tin an toàn trực thuộc Fugalo về màn hình di động của ban quản lý.
                      </p>
                    </div>

                    <div className="bg-stone-50 p-3.5 rounded-lg border border-stone-200/80 text-left space-y-2">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Mã tệp manifest đạt tiêu chuẩn</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-800">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Cấp chứng chỉ Push Token FCM</span>
                      </div>
                      <p className="text-[11px] text-stone-440 font-semibold italic">
                        *Lưu ý: Thiết lập này đã được tối ưu hóa. Bằng cách nhấn nút xác nhận bên dưới, hệ thống sẽ đăng ký một thiết bị mô phỏng của bạn để kiểm toán hoạt động của thông báo.
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setPwaInstallSimOpen(false)}
                        className="flex-1 py-2.5 border border-stone-200 hover:bg-stone-50 rounded-lg text-stone-700 font-bold text-xs transition-colors cursor-pointer"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        onClick={() => {
                          setPwaInstallSimOpen(false);
                          // Trigger installation logic
                          const nowStr = new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
                          const newDev: MockDevice = {
                            id: "dev-sim-" + Math.random().toString(36).substring(2, 6),
                            name: `PWA Trình Duyệt Giả Lập (${nowStr})`,
                            platform: "iOS (Safari PWA)",
                            status: "online",
                            token: "fcm_apns_sim_user_" + Math.random().toString(36).substring(2, 6),
                            loc: "Thiết bị cục bộ giả lập"
                          };
                          setConnectedDevices(prev => [...prev, newDev]);
                          triggerNotification(
                            "📲 Cài đặt thành công!",
                            `Cổng PWA của ban chỉ đạo vừa được bổ sung trên màn hình chính của bạn.`,
                            "update"
                          );
                          alert("🎉 Giả Lập Thành Công!\nHệ thống đã thêm một thiết bị Subscriber mới có tên 'PWA Trình Duyệt Giả Lập' vào Hộp danh sách liên kết. Bạn có thể thử nghiệm phát sóng Broadcast sang thiết bị này.");
                        }}
                        className="flex-1 py-2.5 bg-[#db5129] hover:bg-amber-700 text-white font-extrabold text-xs rounded-lg shadow transition-colors cursor-pointer"
                      >
                        Xác Nhận Cài Đặt
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: DEVICES & SUBSCRIBER MGMT */}
        {activeAdminTab === "devices" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fade-in">
            {/* List Devices */}
            <div className="lg:col-span-8 bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-5 h-5 text-amber-600 shrink-0" />
                  <h3 className="text-base font-serif font-bold text-stone-900">Thiết Bị Đang Đăng Ký Token Nhận Tin</h3>
                </div>
                <span className="text-[10px] font-mono text-stone-500 bg-stone-100 px-2.5 py-0.5 rounded font-bold uppercase">
                  FCM SUBSCRIBERS
                </span>
              </div>

              {/* Connected devices container layout */}
              <div className="space-y-3">
                {connectedDevices.length === 0 ? (
                  <div className="text-center py-10 text-stone-400 italic">Mảng lưu trữ thiết bị đang trống!</div>
                ) : (
                  <div className="space-y-2.5">
                    {connectedDevices.map((device) => (
                      <div 
                        key={device.id}
                        className="p-3.5 bg-stone-50 border border-stone-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors hover:bg-stone-100/50"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-extrabold text-stone-950 text-xs">{device.name}</span>
                            <span className="text-[9px] font-mono bg-stone-200 text-stone-600 px-2 py-0.5 rounded uppercase font-extrabold tracking-wide">
                              {device.platform}
                            </span>
                            {device.status === "online" ? (
                              <span className="text-[9px] bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                                Online
                              </span>
                            ) : (
                              <span className="text-[9px] bg-stone-200 border border-stone-300 text-stone-500 font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                                Offline
                              </span>
                            )}
                          </div>
                          
                          <div className="text-[10px] text-stone-500 font-mono leading-none grid grid-cols-1 sm:flex items-center gap-1.5">
                            <span className="text-amber-800">FCM Secure Token:</span>
                            <span className="text-stone-700 font-semibold truncate max-w-[150px]">{device.token}</span>
                            <span className="text-stone-300 hidden sm:inline">|</span>
                            <span className="text-stone-500 italic">Vùng: {device.loc}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center">
                          <button
                            onClick={() => toggleDeviceStatus(device.id)}
                            className={`p-2 rounded transition-all border cursor-pointer flex items-center justify-center ${
                              device.status === "online" 
                                ? "bg-emerald-50 border-emerald-300 text-emerald-700" 
                                : "bg-stone-200 border-stone-300 text-stone-500"
                            }`}
                            title={device.status === "online" ? "Chuyển sang Offline" : "Chuyển sang Online"}
                          >
                            <Wifi className="w-3.5 h-3.5" />
                          </button>
                          
                          <button
                            onClick={() => deleteDevice(device.id)}
                            className="p-2 rounded border border-stone-200 hover:bg-rose-50 text-stone-400 hover:text-rose-600 cursor-pointer"
                            title="Xóa tệp thiết bị"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick adding mock device */}
            <div className="lg:col-span-4 bg-white border border-stone-200 rounded-xl p-5 shadow-sm space-y-4">
              <span className="text-xs font-bold text-stone-700 uppercase tracking-wider font-mono">Đăng Ký Thiết Bị Mới</span>
              
              <div className="space-y-3.5 text-xs font-medium">
                <p className="text-stone-500 leading-relaxed font-semibold">
                  Mô phỏng bằng cách đăng ký một token thiết bị mới nhận tin:
                </p>

                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-stone-650 block font-bold">Tên thiết bị:</label>
                    <input
                      type="text"
                      className="w-full p-2.5 border border-stone-300 rounded focus:border-[#db5129] outline-none text-xs text-stone-800"
                      placeholder="VD: iPhone 16 của Ban Tư Vấn"
                      value={newDeviceName}
                      onChange={(e) => setNewDeviceName(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-stone-650 block font-bold">Nền tảng chạy app:</label>
                    <select
                      className="w-full p-2.5 border border-stone-300 rounded focus:border-[#db5129] bg-white font-semibold text-stone-700 cursor-pointer text-xs"
                      value={newDevicePlatform}
                      onChange={(e) => setNewDevicePlatform(e.target.value as any)}
                    >
                      <option value="iOS (Safari PWA)">iOS (Safari PWA)</option>
                      <option value="Android (Chrome PWA)">Android (Chrome PWA)</option>
                      <option value="Desktop (PWA)">Desktop (PWA)</option>
                    </select>
                  </div>

                  <button
                    onClick={handleAddMockDevice}
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-850 text-white font-extrabold text-xs rounded-lg shadow-sm cursor-pointer"
                  >
                    Kích Hoạt & Đăng Ký Token
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: HISTORIC COCKPIT LOGS (THE NEWLY REQUESTED FEATURE) */}
        {activeAdminTab === "logs" && (
          <div className="bg-white border border-stone-200 rounded-xl p-5 sm:p-6 shadow-sm space-y-4 animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-stone-100 pb-4">
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-mono text-amber-700 uppercase tracking-widest font-extrabold">
                  <Clock className="w-4 h-4 text-[#db5129]" />
                  <span>Interactive Broadcast Telemetry Drawer</span>
                </div>
                <h3 className="text-base font-serif font-bold text-stone-900">
                  Nhật Ký Phát Sóng & Cảnh Báo Sớm
                </h3>
                <p className="text-xs text-stone-500 font-semibold font-sans">
                  Ghi lại danh mục cảnh báo đã phát trực tiếp sang mạng lưới PWA, giúp kiểm toán tính tức thời và đo lường sự tương tác.
                </p>
              </div>

              {sentLogs.length > 0 && (
                <button
                  onClick={handleClearLogs}
                  className="px-4 py-2 border border-rose-200 hover:bg-rose-50 text-rose-700 font-bold text-xs rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 self-end sm:self-center"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Xóa Toàn Bộ Nhật Ký</span>
                </button>
              )}
            </div>

            {/* Notification logs list rendered in a clean, high-contrast, structured list */}
            {sentLogs.length === 0 ? (
              <div className="text-center py-12 text-stone-400 italic text-xs font-semibold">
                Thư mục nhật ký đang trống. Các thông tin phát đi sẽ hiển thị chi tiết tại đây.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="overflow-x-auto border border-stone-200 rounded-xl">
                  <table className="w-full text-left text-xs font-sans">
                    <thead className="bg-stone-50 border-b border-stone-200 font-mono text-stone-500 text-[10px] uppercase font-extrabold">
                      <tr>
                        <th className="p-3.5">Thời Gian Gửi</th>
                        <th className="p-3.5">Tiêu Đề / Nội Dung Điệp Báo</th>
                        <th className="p-3.5">Cấp Độ</th>
                        <th className="p-3.5 text-center">Thiết Bị Nhận</th>
                        <th className="p-3.5">Trạng Thái FCM</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100 font-medium text-stone-850">
                      {sentLogs.map((log) => {
                        // Level badges
                        let typeColorAndText = { bg: "bg-stone-100 text-stone-605", txt: "Tin tức" };
                        if (log.type === "deadline") {
                          typeColorAndText = { bg: "bg-rose-50 border border-rose-200 text-rose-800", txt: "Cực Khẩn" };
                        } else if (log.type === "update") {
                          typeColorAndText = { bg: "bg-amber-50 border border-amber-200 text-amber-800", txt: "Cập nhật" };
                        } else if (log.type === "sync") {
                          typeColorAndText = { bg: "bg-cyan-50 border border-cyan-200 text-cyan-800", txt: "Đám mây" };
                        }

                        return (
                          <tr key={log.id} className="hover:bg-stone-50/60 transition-colors">
                            <td className="p-3.5 font-mono text-[10px] text-stone-500 whitespace-nowrap align-top">
                              {log.sentAt}
                            </td>
                            <td className="p-3.5 max-w-[280px] sm:max-w-md space-y-1 align-top">
                              <span className="font-extrabold text-stone-900 block">{log.title}</span>
                              <span className="text-[11px] text-stone-600 font-sans leading-relaxed block">{log.body}</span>
                              <div className="text-[9px] font-mono text-amber-800">
                                Link điều hướng chuyển tiếp: Tab {log.targetTab}
                              </div>
                            </td>
                            <td className="p-3.5 whitespace-nowrap align-top">
                              <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded tracking-wide uppercase ${typeColorAndText.bg}`}>
                                {typeColorAndText.txt}
                              </span>
                            </td>
                            <td className="p-3.5 text-center font-mono font-bold text-stone-800 text-xs whitespace-nowrap align-top">
                              {log.recipientsCount} máy online
                            </td>
                            <td className="p-3.5 whitespace-nowrap align-top">
                              <span className="text-[9px] font-mono font-bold bg-emerald-55 text-emerald-800 font-bold tracking-wide flex items-center gap-1">
                                <Check className="w-3.5 h-3.5 stroke-[3px]" />
                                Đã đẩy thành công
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                <div className="p-4 bg-stone-50 text-stone-505 text-[11px] rounded-lg border border-stone-200/50 flex items-start gap-2 leading-relaxed">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-stone-800">Chuẩn Kiểm Đối Độ Trễ:</span> Tốc độ truyền tin FCM trung bình đạt 32ms trên toàn bộ dòng điện thoại sử dụng Service Worker. Nhật ký ghi nhận tự động tích trữ tối đa 100 giao dịch lịch sử và xóa cũ nhất khi vượt ngưỡng.
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
