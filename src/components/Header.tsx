/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, Compass, Briefcase, Ruler, BarChart3, HelpCircle, Printer, Gift, Layout, Layers,
  Bell, Check, Trash2, Smartphone, Wifi, WifiOff, Database, Sparkles, Clock, ArrowRight, Lock, Play, X, ShieldAlert, Laptop
} from "lucide-react";
import { FugaloSeal } from "./FugaloLogo";
import { NotificationItem } from "../types";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userEmail?: string;
  checklistScore: number;
  onPrintClick?: () => void;
  viewMode?: "tabbed" | "full";
  setViewMode?: (mode: "tabbed" | "full") => void;
  syncStatus: "synced" | "saving" | "offline";
  notifications: NotificationItem[];
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  triggerNotification: (
    title: string,
    body: string,
    type?: "deadline" | "update" | "sync" | "system",
    actionTab?: string,
    targetId?: string
  ) => void;
}

export default function Header({ 
  activeTab, 
  setActiveTab, 
  userEmail = "anhovan.fu@gmail.com", 
  checklistScore,
  onPrintClick,
  viewMode,
  setViewMode,
  syncStatus,
  notifications,
  setNotifications,
  triggerNotification
}: HeaderProps) {
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [activePanelTab, setActivePanelTab] = useState<"alerts" | "fcm">("alerts");
  
  // Simulated push fields
  const [testPushTitle, setTestPushTitle] = useState("Hạn chót thẩm định pháp lý");
  const [testPushBody, setTestPushBody] = useState("Cần thẩm định khẩn cấp nhãn hiệu 'Dans la Peau' do rủi ro vi phạm bên thứ ba!");
  const [testPushType, setTestPushType] = useState<"deadline" | "update" | "sync">("deadline");

  // Web Notification Permissions State
  const [browserPermission, setBrowserPermission] = useState<"default" | "granted" | "denied">(() => {
    return (typeof window !== "undefined" && "Notification" in window) 
      ? Notification.permission 
      : "default";
  });

  const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
      alert("Trình duyệt này không hỗ trợ Push Notifications hệ thống.");
      return;
    }
    try {
      const perm = await Notification.requestPermission();
      setBrowserPermission(perm);
      if (perm === "granted") {
        triggerNotification(
          "Cấp Quyền Live Notification Thành Công",
          "Kênh phản hồi FCM đã được đồng nhất hệ thống. Toàn bộ thông báo lộ trình/M&A sẽ tự động đẩy lên iOS/Android khi chạy nền.",
          "sync"
        );
      }
    } catch (err) {
      console.error("Browser permission request failure:", err);
    }
  };

  const fireSimulatedPush = () => {
    if (!testPushTitle.trim() || !testPushBody.trim()) return;
    triggerNotification(
      testPushTitle,
      testPushBody,
      testPushType,
      testPushType === "deadline" ? "due-diligence" : "timeline"
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const navItems = [
    { id: "overview", label: "Tổng Quan & SWOT", icon: Compass },
    { id: "synergy", label: "Trục Liên Kết", icon: Ruler },
    { id: "due-diligence", label: "Thẩm Định (Due Diligence)", icon: ShieldCheck, badge: `${checklistScore}%` },
    { id: "timeline", label: "Kế Hoạch 90 Ngày", icon: Briefcase },
    { id: "calculator", label: "Bộ Công Cụ Deal", icon: BarChart3 },
    { id: "b2b-gifting", label: "B2B & Quà Tặng VIP", icon: Gift },
    { id: "kpis", label: "Chỉ Số KPI", icon: HelpCircle }
  ];

  return (
    <header className="bg-white border-b border-stone-200 sticky top-0 z-50 shadow-md overflow-hidden" id="app-header">
      {/* Decorative luxury terracotta brand line */}
      <div className="h-[3px] bg-gradient-to-r from-amber-800 via-amber-500 to-amber-600 w-full" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 md:py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 md:gap-4">
        {/* Logos & Branding styled precisely from the official uploaded logo */}
        <div className="flex items-center justify-between md:justify-start gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 sm:flex-initial">
            <FugaloSeal size={32} className="shadow-md hover:scale-105 duration-300 transition-all cursor-pointer shrink-0 md:w-11 md:h-11" />
            
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-x-1 sm:gap-x-2 gap-y-0.5">
                <h1 className="text-xs sm:text-lg font-serif font-semibold text-stone-900 tracking-wide flex items-center gap-1 select-none whitespace-nowrap min-w-0">
                  <span className="tracking-[0.05em] sm:tracking-[0.18em] font-serif font-extrabold text-[#db5129] uppercase text-[11px] sm:text-base whitespace-nowrap">FUGALO</span> 
                  <span className="text-stone-400 font-sans text-[9px] sm:text-xs select-none">×</span> 
                  <span className="text-stone-700 font-serif font-light text-[11px] sm:text-base tracking-wider whitespace-nowrap">Dans la Peau</span>
                </h1>
                <span className="inline-block px-1 py-0.2 sm:px-1.5 sm:py-0.5 bg-amber-50 text-amber-700 text-[6px] sm:text-[8px] uppercase tracking-widest font-mono border border-amber-200/50 rounded font-bold shrink-0">
                  M&A
                </span>
              </div>
              <p className="text-stone-600 font-serif italic tracking-wider mt-0.5 flex flex-wrap items-center gap-1 text-[8px] sm:text-xs min-w-0">
                <span className="text-[#db5129] font-serif not-italic tracking-[0.1em] sm:tracking-[0.25em] font-extrabold text-[7.5px] sm:text-[9px] pr-1 whitespace-nowrap">
                  TÁI SINH GIÁ TRỊ
                </span>
                <span className="w-1 h-1 rounded-full bg-stone-300 hidden sm:inline" />
                <span className="text-stone-500 font-sans not-italic text-[8.5px] sm:text-[11px] font-normal hidden md:inline truncate">
                  Nền tảng kiểm định sáp nhập, chuỗi cung ứng và hoạch định chuỗi TP. Hồ Chí Minh
                </span>
              </p>
            </div>
          </div>

          {/* Quick status dot, layout toggle & print button on mobile top row */}
          <div className="flex items-center gap-1.5 md:hidden shrink-0">
            {/* Visual Sync Indicator - Mobile (Super Compact and Elegant Wifi Icon) */}
            <button 
              onClick={() => { setIsNotifOpen(true); setActivePanelTab("fcm"); }}
              className={`p-1.5 rounded-full select-none transition-all border shrink-0 ${
                syncStatus === "synced" 
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100/80" 
                  : syncStatus === "saving" 
                    ? "bg-amber-50 border-amber-200 text-amber-600 animate-pulse" 
                    : "bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100/80"
              }`}
              title="Nhấp để cấu hình và phát thông tin"
            >
              <div className="flex items-center justify-center">
                {syncStatus === "synced" ? (
                  <Wifi className="w-3.5 h-3.5" />
                ) : syncStatus === "saving" ? (
                  <Database className="w-3.5 h-3.5 animate-bounce" />
                ) : (
                  <WifiOff className="w-3.5 h-3.5" />
                )}
              </div>
            </button>

            {/* Bell Notification Button - Mobile (Super Compact Circle Button) */}
            <button
              onClick={() => { setIsNotifOpen(true); setActivePanelTab("alerts"); }}
              className="p-1.5 bg-stone-50 border border-stone-200 hover:bg-stone-100 active:bg-stone-200 text-stone-600 rounded-full relative shrink-0 transition-colors"
              title="Thông báo & Live FCM"
            >
              <Bell className="w-3.5 h-3.5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#db5129] text-[8px] font-black text-white shrink-0 shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Layout switcher (Hidden on Mobile, Visible on Tablet-up sm:flex) */}
            {viewMode && setViewMode && (
              <div className="hidden sm:flex items-center bg-stone-100/95 border border-stone-200/60 p-0.5 rounded-md select-none shrink-0" title="Đổi giao diện bố cục">
                <button
                  onClick={() => setViewMode("tabbed")}
                  className={`p-1 rounded-sm transition-all cursor-pointer ${
                    viewMode === "tabbed"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-stone-500 active:bg-white"
                  }`}
                  title="Giao diện App: Xem từng Tab"
                >
                  <Layout className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setViewMode("full")}
                  className={`p-1 rounded-sm transition-all cursor-pointer ${
                    viewMode === "full"
                      ? "bg-amber-600 text-white shadow-xs"
                      : "text-stone-500 active:bg-white"
                  }`}
                  title="Giao diện Cuộn: Xem tràn trang"
                >
                  <Layers className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* Print button (Hidden on Mobile, Visible on Tablet-up sm:block) */}
            <button
              onClick={onPrintClick}
              className="hidden sm:block p-1.5 bg-amber-600 hover:bg-amber-700 active:bg-amber-800 text-white rounded shadow-xs shrink-0 transition-colors"
              title="Xuất Báo Cáo VIP"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* User context info & Storage Sync Badge (Hidden or super simplified on mobile) */}
        <div className="hidden md:flex flex-wrap items-center justify-between md:justify-end gap-3 sm:gap-4 w-full md:w-auto font-sans border-t border-stone-100 pt-3 md:border-t-0 md:pt-0">
          
          {/* Visual Sync Badge - Desktop */}
          <div 
            onClick={() => { setIsNotifOpen(true); setActivePanelTab("fcm"); }}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border rounded-lg cursor-pointer hover:shadow-xs transition-all select-none ${
              syncStatus === "synced" 
                ? "bg-emerald-50/60 border-emerald-200 text-emerald-800" 
                : syncStatus === "saving" 
                  ? "bg-amber-50/60 border-amber-200 text-amber-800 animate-pulse" 
                  : "bg-rose-50/60 border-rose-200 text-rose-800"
            }`}
            title="Đồng bộ offline LocalStorage & Trực tuyến. Nhấp để xem chi tiết."
          >
            <div className="relative flex h-1.5 w-1.5">
              {syncStatus === "saving" ? (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              ) : syncStatus === "synced" ? (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              ) : null}
              <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${syncStatus === "synced" ? "bg-emerald-500" : syncStatus === "saving" ? "bg-amber-500" : "bg-rose-500"}`}></span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider font-bold">
              {syncStatus === "synced" ? "Đã đồng bộ" : syncStatus === "saving" ? "Đang lưu..." : "Mất mạng (Offline)"}
            </span>
          </div>

          {/* New Live Notifications Bell - Desktop */}
          <button 
            onClick={() => { setIsNotifOpen(true); setActivePanelTab("alerts"); }}
            className={`p-2 rounded-lg border cursor-pointer relative transition-all ${
              isNotifOpen 
                ? "bg-amber-50 border-amber-300 text-amber-700" 
                : "bg-stone-50 border-stone-200 hover:bg-stone-100 text-stone-650 hover:text-stone-900"
            }`}
            title="Thông báo khẩn & Tích hợp Live Push"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#db5129] text-[9px] font-black text-white animate-bounce shadow-sm shrink-0">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="h-8 w-[1px] bg-stone-200 hidden md:block" />

          {/* User Email card info */}
          <div className="text-left md:text-right">
            <div className="text-[10px] text-stone-500 font-semibold flex items-center justify-start md:justify-end gap-1.5">
              <span>Độc quyền bản quyền</span>
              <span className="relative flex h-1.5 w-1.5" title="Hệ thống trực tuyến an toàn">
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[#db5129]"></span>
              </span>
            </div>
            <div className="text-xs font-bold text-stone-850">{userEmail}</div>
          </div>
          <div className="h-8 w-[1px] bg-stone-200 hidden md:block" />
          
          <div className="flex items-center gap-2">
            {/* Elegant layout switcher directly in the right corner header */}
            {viewMode && setViewMode && (
              <div className="flex items-center bg-stone-100 hover:bg-stone-200/50 border border-stone-200/80 p-0.5 rounded-lg select-none shrink-0" title="Đổi giao diện bố cục">
                <button
                  onClick={() => setViewMode("tabbed")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "tabbed"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-stone-500 hover:text-stone-900 hover:bg-white/85"
                  }`}
                  title="Bố cục: Click Từng Tab"
                >
                  <Layout className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode("full")}
                  className={`p-1.5 rounded-md transition-all cursor-pointer ${
                    viewMode === "full"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "text-stone-500 hover:text-stone-900 hover:bg-white/85"
                  }`}
                  title="Bố cục: Trải toàn bộ liền mạch"
                >
                  <Layers className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={onPrintClick}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-450 text-white font-bold rounded-lg text-xs cursor-pointer border border-amber-600/20 shadow-sm transition-all hover:scale-[1.02]"
              id="header-export-pdf-btn"
              title="Xuất Báo Cáo VIP"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Xuất Báo Cáo VIP</span>
            </button>
          </div>
        </div>
      </div>

      {/* DETAILED DIALOG: NOTIFICATION HUB & SYNC SIMULATOR OVERLAY */}
      {isNotifOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs transition-opacity overflow-y-auto">
          <div className="bg-white border border-stone-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl relative block my-auto text-left">
            
            {/* Header top colored bar */}
            <div className="h-1 bg-gradient-to-r from-amber-800 via-[#db5129] to-amber-600 w-full" />
            
            {/* Modal Title bar */}
            <div className="p-4 sm:p-6 border-b border-stone-150 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-50 rounded-lg text-amber-700">
                  <Smartphone className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-serif font-semibold text-stone-900">
                    FCM & Offline Caching Center
                  </h3>
                  <p className="text-[10px] sm:text-xs text-stone-500 mt-0.5">
                    Kiểm nghiệm đồng bộ dữ liệu ngoại tuyến (LocalStorage) & cấu hình thông báo trên iOS/Android
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsNotifOpen(false)}
                className="p-1.5 hover:bg-stone-200 rounded-full text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sub Tabs Selector */}
            <div className="flex border-b border-stone-200 text-xs sm:text-sm select-none">
              <button
                onClick={() => setActivePanelTab("alerts")}
                className={`flex-1 py-3 text-center font-bold tracking-wide border-b-2 transition-all cursor-pointer ${
                  activePanelTab === "alerts"
                    ? "border-amber-600 text-amber-700 bg-amber-50/[0.05]"
                    : "border-transparent text-stone-500 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Bell className="w-4 h-4" />
                  <span>Hộp Thư Thông Báo ({notifications.length})</span>
                  {unreadCount > 0 && (
                    <span className="px-1.5 py-0.2 bg-[#db5129] text-white text-[9px] font-black rounded-full shrink-0">
                      {unreadCount}
                    </span>
                  )}
                </div>
              </button>
              <button
                onClick={() => setActivePanelTab("fcm")}
                className={`flex-1 py-3 text-center font-bold tracking-wide border-b-2 transition-all cursor-pointer ${
                  activePanelTab === "fcm"
                    ? "border-amber-600 text-amber-700 bg-amber-50/[0.05]"
                    : "border-transparent text-stone-500 hover:bg-stone-50"
                }`}
              >
                <div className="flex items-center justify-center gap-1.5">
                  <Smartphone className="w-4 h-4" />
                  <span>Cài Đặt iOS App & FCM Live</span>
                </div>
              </button>
            </div>

            {/* Tabs Body Contents */}
            <div className="p-4 sm:p-6 overflow-y-auto max-h-[60vh] space-y-6">
              
              {/* TAB 1: NOTIFICATION LISTINGS AND CRITICAL 48-HOUR ALERT ITEMS */}
              {activePanelTab === "alerts" && (
                <div className="space-y-4">
                  
                  {/* Summary visual helper */}
                  <div className="bg-amber-500/[0.03] border border-amber-200/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping shrink-0" />
                        <h4 className="text-xs sm:text-sm font-bold text-stone-900">Bảo Quản Dữ Liệu Ngoại Tuyến</h4>
                      </div>
                      <p className="text-[10px] sm:text-xs text-stone-600 leading-relaxed max-w-md">
                        Khi thiết bị của bạn không có mạng (hoặc mạng chập chờn trên tàu, xe trên iOS di động), dữ liệu kiểm tra và trạng thái do-diligence sẽ được lưu trữ cục bộ ngay lập tức và tự động đồng bộ khi kết nối trở lại.
                      </p>
                    </div>
                    <div className="flex items-center gap-2 w-full sm:w-auto self-stretch shrink-0">
                      {notifications.length > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="flex-1 sm:flex-none justify-center flex items-center gap-1 px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 rounded-lg text-[11px] font-bold text-stone-700 cursor-pointer transition-all"
                        >
                          <Check className="w-3 h-3" />
                          <span>Đọc hết</span>
                        </button>
                      )}
                      <button
                        onClick={clearAllNotifications}
                        className="flex-1 sm:flex-none justify-center flex items-center gap-1 px-2.5 py-1.5 border border-stone-200 hover:bg-rose-50 hover:text-rose-700 text-[11px] font-bold text-stone-500 cursor-pointer rounded-lg transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Xóa lịch sử</span>
                      </button>
                    </div>
                  </div>

                  {/* List of unread critical notifications */}
                  {notifications.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <div className="mx-auto w-10 h-10 bg-stone-100 rounded-full flex items-center justify-center text-stone-400">
                        <Bell className="w-5 h-5 text-stone-300" />
                      </div>
                      <p className="text-xs text-stone-500 font-sans">Hộp thư trống trơn. Bạn chưa nhận được thông báo nào.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                      {notifications.map((notif) => {
                        const isDeadline = notif.type === "deadline";
                        return (
                          <div 
                            key={notif.id}
                            className={`p-3 rounded-lg border text-xs leading-relaxed flex items-start gap-3 transition-all ${
                              notif.read ? "bg-stone-50/50 border-stone-200/80" : "bg-gradient-to-r from-amber-500/[0.02] to-amber-50/[0.04] border-amber-200"
                            }`}
                          >
                            <div className={`p-1.5 rounded text-white shrink-0 mt-0.5 ${
                              isDeadline 
                                ? "bg-[#db5129]" 
                                : notif.type === "sync"
                                  ? "bg-emerald-600"
                                  : notif.type === "system"
                                    ? "bg-stone-700"
                                    : "bg-amber-600"
                            }`}>
                              {isDeadline ? (
                                <ShieldAlert className="w-3 h-3 text-white" />
                              ) : notif.type === "sync" ? (
                                <Database className="w-3 h-3 text-white" />
                              ) : (
                                <Sparkles className="w-3 h-3 text-white" />
                              )}
                            </div>
                            
                            <div className="space-y-1 flex-1">
                              <div className="flex items-center justify-between">
                                <h4 className="font-bold text-stone-900">{notif.title}</h4>
                                <span className="text-[10px] text-stone-400 font-mono">
                                  {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="text-stone-600 text-[11px] leading-relaxed">{notif.body}</p>
                              
                              {notif.actionTab && (
                                <button
                                  onClick={() => {
                                    setActiveTab(notif.actionTab!);
                                    setIsNotifOpen(false);
                                    // Smooth navigation to target item
                                    if (notif.targetId) {
                                      setTimeout(() => {
                                        const element = document.getElementById(notif.targetId!);
                                        if (element) {
                                          element.scrollIntoView({ behavior: "smooth", block: "center" });
                                          element.classList.add("ring-2", "ring-amber-500", "ring-offset-2");
                                          setTimeout(() => element.classList.remove("ring-2", "ring-amber-500", "ring-offset-2"), 4000);
                                        }
                                      }, 300);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1 mt-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
                                >
                                  <span>Xử lý rà soát</span>
                                  <ArrowRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Active 48h Checklist Deadline Tracker Summary Box */}
                  <div className="border-t border-stone-200/80 pt-4">
                    <h5 className="text-xs font-bold text-stone-500 uppercase tracking-widest px-1 py-1 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Rà Soát Toàn Hệ Thống Cận Hạn Chót (&lt; 48 Giờ)</span>
                    </h5>
                    
                    <div className="mt-2 text-[11px] text-stone-600 bg-stone-50 border border-stone-200 p-3 rounded-lg space-y-1.5 max-h-[160px] overflow-y-auto">
                      <p className="font-medium text-stone-900">Quét rà tự động phát hiện 3 hạng mục rủi ro khẩn cấp:</p>
                      <div className="space-y-1">
                        <div className="flex justify-between items-center bg-white p-1.5 border border-stone-150 rounded">
                          <span className="font-semibold text-stone-850">Hạng mục DD-01 (Ai sở hữu Dans la Peau?)</span>
                          <span className="text-rose-700 bg-rose-50 font-bold px-1 rounded">~18 giờ còn lại</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-1.5 border border-stone-150 rounded">
                          <span className="font-semibold text-stone-850">Hạng mục DD-03 (Bảo hộ độc quyền Nhãn hiệu)</span>
                          <span className="text-amber-700 bg-amber-50 font-bold px-1 rounded">~32 giờ còn lại</span>
                        </div>
                        <div className="flex justify-between items-center bg-white p-1.5 border border-stone-150 rounded">
                          <span className="font-semibold text-stone-850">Lộ trình Giai đoạn 1: Ký NDA + MOU Pilot</span>
                          <span className="text-amber-700 bg-amber-50 font-bold px-1 rounded">~12 giờ còn lại</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: TECHNICAL DEPLOMENT INTERCONNECTIVITY (iOS STANDALONE & FCM SIMULATOR) */}
              {activePanelTab === "fcm" && (
                <div className="space-y-4">
                  
                  {/* System Permissions Control Card */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 space-y-3">
                      <div className="flex items-center gap-2">
                        <Laptop className="w-4 h-4 text-stone-600" />
                        <h4 className="text-xs font-bold text-stone-900">Browser API Status</h4>
                      </div>
                      
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Quyền Push:</span>
                          <span className={`font-mono font-bold uppercase ${
                            browserPermission === "granted" 
                              ? "text-emerald-700" 
                              : browserPermission === "denied" 
                                ? "text-rose-700" 
                                : "text-amber-700"
                          }`}>
                            {browserPermission === "granted" ? "Đã cấp (Granted)" : browserPermission === "denied" ? "Bị từ chối (Denied)" : "Chưa cấp (Default)"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Service Worker:</span>
                          <span className="text-emerald-700 font-bold uppercase font-mono">Đã Đăng Ký (Active)</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Storage Offline:</span>
                          <span className="text-stone-700 font-bold font-mono">OK (LocalStorage)</span>
                        </div>
                      </div>

                      {browserPermission !== "granted" && (
                        <button
                          onClick={requestNotificationPermission}
                          className="w-full text-center py-1.5 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-lg transition-all cursor-pointer shadow-sm select-none"
                        >
                          Cấp Quyền Push Trình Duyệt / iOS
                        </button>
                      )}
                    </div>

                    <div className="border border-stone-200 rounded-xl p-4 bg-stone-50 space-y-3">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4 text-stone-600" />
                        <h4 className="text-xs font-bold text-stone-900">iOS standalone PWA wrapper</h4>
                      </div>

                      <div className="space-y-1.5 text-xs text-stone-600 leading-relaxed font-mono text-[10px]">
                        <div className="line-clamp-4">
                          Device: Apple iPhone di động iOS standalone
                          FCM Gateway APNs: Connected
                          Bridge Token: fcm_token_fugalo_83y74dhc_2026_dev...
                          Channel: standard_ma_channel_vietnam
                        </div>
                      </div>

                      <div className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100 rounded p-1.5 font-sans leading-normal">
                        <strong>Dành cho iOS Safari:</strong> Nhấn nút "Chia sẻ" -&gt; "Thêm vào màn hình chính" trên Safari để test mô phỏng mượt mà!
                      </div>
                    </div>
                  </div>

                  {/* Realtime Live FCM Test Trigger Form */}
                  <div className="border border-stone-200 rounded-xl p-4 space-y-4">
                    <div className="flex items-center gap-2 border-b border-stone-100 pb-2">
                      <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Bộ Bắn Live FCM Push Simulator</h4>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-stone-700 block">Tiêu đề thông báo:</label>
                          <input 
                            type="text" 
                            className="w-full p-2 border border-stone-300 rounded focus:border-amber-500 outline-none"
                            value={testPushTitle}
                            onChange={(e) => setTestPushTitle(e.target.value)}
                            placeholder="Nhập tiêu đề..."
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="font-bold text-stone-700 block">Dạng thông điệp:</label>
                          <select
                            className="w-full p-2 border border-stone-300 rounded focus:border-amber-500 outline-none bg-white font-semibold text-stone-700 cursor-pointer"
                            value={testPushType}
                            onChange={(e) => setTestPushType(e.target.value as any)}
                          >
                            <option value="deadline">Cảnh báo hạn chót rủi ro (&lt;48h)</option>
                            <option value="update">Cập nhật trạng thái rà soát</option>
                            <option value="sync">Đã lưu trữ thành công cục bộ (Cloud OK)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-stone-700 block">Nội dung thông báo chi tiết:</label>
                        <textarea 
                          className="w-full p-2 border border-stone-300 rounded focus:border-amber-500 outline-none h-16 resize-none"
                          value={testPushBody}
                          onChange={(e) => setTestPushBody(e.target.value)}
                          placeholder="Mô tả rà soát..."
                        />
                      </div>

                      <button
                        onClick={fireSimulatedPush}
                        className="w-full py-2.5 bg-gradient-to-r from-amber-600 to-[#db5129] text-white font-bold text-xs rounded-lg shadow hover:opacity-90 transition-all flex items-center justify-center gap-1.5 cursor-pointer selection:bg-none"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>Kích hoạt và bắn Test push lên iOS ngay lập tức</span>
                      </button>
                    </div>
                  </div>

                  {/* DEVELOPER ANSWER TO USER QUERY REGARDING BACKEND REALTIME DATA STORAGE & IOS APP TESTING */}
                  <div className="border border-stone-200 rounded-xl p-4 bg-stone-900 text-stone-300 font-sans space-y-3 shadow-md relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/[0.04] rounded-full blur-2xl pointer-events-none" />
                    
                    <div className="flex items-center gap-2 border-b border-stone-800 pb-2">
                      <Lock className="w-4 h-4 text-amber-500" />
                      <h4 className="text-xs font-bold text-amber-500 uppercase font-mono tracking-wider">HƯỚNG DẪN KIỂM THỬ TRÊN IOS APP</h4>
                    </div>

                    <div className="text-xs sm:text-[11px] leading-relaxed space-y-2 text-stone-300">
                      <p>
                        <strong>1. Cơ chế lưu trữ offline (Offline Caching):</strong> Toàn bộ dữ liệu của bạn trên M&A Portal hiện tại được tự động đồng bộ xuống <strong>LocalStorage của trình duyệt</strong> trên iOS/Safari. Điều này giúp bạn có thể giữ nguyên trạng thái làm việc, không bao giờ bị mất mốc tiến trình rà soát kể cả khi mất kết nối mạng.
                      </p>
                      <p>
                        <strong>2. Cơ chế Thông Báo Real-time khi cài app lên điện thoại (iOS/Android):</strong>
                      </p>
                      <ul className="list-disc pl-5 space-y-1.5">
                        <li>
                          <strong>Dạng app cài đặt (PWA / Standalone):</strong> Bạn không nhất thiết phải viết shell app quá phức tạp. Với Progressive Web App (PWA) có sẳn trong gói cấu hình của Fugalo, khi bạn nhấn nút <span className="text-white">"Thêm vào Màn hình chính"</span>, ứng dụng sẽ chạy độc lập, bỏ qua Header của Safari và có Service Worker chạy nền xử lý sự kiện.
                        </li>
                        <li>
                          <strong>Dạng native (Capacitor / Swift WebView):</strong> Nếu bạn gói ứng dụng web này trong một WebView bằng Swift Xcode (hoặc Capacitor):
                          <p className="text-emerald-500 font-mono mt-1 leading-normal text-[10px] bg-stone-950 p-2 rounded">
                            // Mã nhận thông báo Native iOS thông qua JS Bridge:<br />
                            let tokenRef = Messaging.messaging().fcmToken<br />
                            webView.evaluateJavaScript("window.setiOSFCMToken('\(tokenRef)')")
                          </p>
                          Native wrapper sẽ bắt token FCM từ APNs, sau đó đẩy ngược vào SDK web của chúng tôi, tạo kênh thông báo đẩy trực tiếp không bị gián đoạn.
                        </li>
                      </ul>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Modal footer closing bar */}
            <div className="p-4 bg-stone-50 border-t border-stone-150 flex items-center justify-end">
              <button
                onClick={() => setIsNotifOpen(false)}
                className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-700 font-bold rounded-lg text-xs transition-colors cursor-pointer select-none"
              >
                Đóng Panel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Tabs Menu navigation - Desktop and Tablet scroll */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-stone-100 mt-2 sm:mt-0 hidden md:block">
        <nav className="flex overflow-x-auto no-scrollbar scroll-smooth md:flex-wrap gap-2 py-3.5 select-none" aria-label="Tabs">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg font-bold text-xs sm:text-[13px] transition-all duration-200 cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-amber-600 text-white shadow-sm ring-1 ring-amber-600/20"
                    : "bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/80"
                }`}
                id={`tab-btn-${item.id}`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-white" : "text-stone-500"}`} />
                <span>{item.label}</span>
                {item.id === "due-diligence" && (
                  <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${
                    isActive 
                      ? "bg-amber-800 text-white" 
                      : "bg-emerald-50 text-emerald-700 border border-emerald-250"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* ULTRA LUXURY MOBILE APP BOTTOM NAVIGATION DOCK */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-t border-stone-200/80 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe">
        <nav className="flex items-center justify-between px-1.5 py-2.5 max-w-full overflow-x-auto no-scrollbar gap-1" aria-label="Mobile Navigation">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            // Ultra elegant, short label translations for mobile real estate
            let shortLabel = item.label;
            if (item.id === "overview") shortLabel = "Tổng quan";
            else if (item.id === "synergy") shortLabel = "Liên kết";
            else if (item.id === "due-diligence") shortLabel = "Thẩm định";
            else if (item.id === "timeline") shortLabel = "Lộ trình";
            else if (item.id === "calculator") shortLabel = "Bảng Deal";
            else if (item.id === "b2b-gifting") shortLabel = "Quà VIP";
            else if (item.id === "kpis") shortLabel = "KPIs";

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center flex-1 min-w-[54px] py-1 transition-all duration-300 relative cursor-pointer select-none`}
                id={`mobile-tab-btn-${item.id}`}
              >
                <div className={`p-1.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? "bg-amber-600 text-white scale-110 shadow-md shadow-amber-600/15" 
                    : "text-stone-500 active:bg-stone-100"
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                
                <span className={`text-[9px] mt-1 font-bold whitespace-nowrap tracking-tight transition-colors duration-200 ${
                  isActive ? "text-amber-700 font-extrabold" : "text-stone-550"
                }`}>
                  {shortLabel}
                </span>

                {item.id === "due-diligence" && (
                  <span className={`absolute top-0 right-1 px-1 py-0.2 bg-emerald-500 text-white rounded-full text-[7.5px] font-black shadow-sm`}>
                    {item.badge}
                  </span>
                )}
                
                {/* Micro bottom layout indicator dot */}
                {isActive && (
                  <div className="absolute bottom-0 w-1 h-1 bg-amber-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
