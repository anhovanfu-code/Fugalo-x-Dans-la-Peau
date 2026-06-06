/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface DueDiligenceItem {
  id: string;
  category: "legal" | "financial" | "production" | "brand" | "ip";
  question: string;
  vietnameseQuestion: string;
  details: string;
  status: "pending" | "passed" | "failed" | "action_required";
  notes?: string;
  riskLevel: "high" | "medium" | "low";
  deadline?: string; // Optional ISO date or string for background deadlines
}

export interface TimelinePhase {
  phaseNumber: number;
  title: string;
  vietnameseTitle: string;
  duration: string;
  objective: string;
  tasks: Array<{
    id: string;
    text: string;
    completed: boolean;
    deadline?: string; // Optional ISO date
  }>;
  status: "upcoming" | "active" | "completed";
}

export interface DealSimulatorState {
  retailPrice: number;
  projectedQuantity: number;
  productionCost: number; // For wholesale/capsule
  marketingShareFugalo: number; // Percent of marketing paid by Fugalo
  marketingShareDLP: number; // Percent of marketing paid by DLP
  revenueSharePercent: number; // Fugalo's share (e.g. 25% - 35%)
  wholesalePricePercent: number; // DLP wholesale discount to Fugalo (e.g. 50% of retail)
}

export interface KPITargetItem {
  id: string;
  metric: string;
  description: string;
  vietnameseMetric: string;
  vietnameseDescription: string;
  targetValue: string;
  currentValue: number;
  unit: string;
  status: "not_reached" | "warning" | "achieved";
  scoreMultiplier: number;
}

export interface AdvisorItem {
  role: string;
  timeline: string;
  scope: string;
  budget: string;
}

export interface DataRoomFolder {
  id: string;
  name: string;
  vietnameseName: string;
  requiredDocuments: string[];
  whatToCheck: string;
  redFlags: string;
}

export interface WeeklyMilestone {
  week: number;
  focus: string;
  output: string;
  stopCondition: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  timestamp: string; // ISO string
  read: boolean;
  type: "deadline" | "update" | "sync" | "system";
  actionTab?: string;
  targetId?: string;
}

export interface PresetSKU {
  id: string;
  name: string;
  targetRetail: number;
  costEstimate: number;
  marginTarget: number;
  leadTime: string;
  role: string;
}

