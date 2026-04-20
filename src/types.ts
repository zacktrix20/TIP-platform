export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type IOCType = 'ip' | 'domain' | 'url' | 'hash' | 'email';

export interface Indicator {
  id: string;
  value: string;
  type: IOCType;
  source: string;
  severity: Severity;
  confidence: number;
  description: string;
  lastSeen: string;
  analysis?: string;
  tags?: string[];
  isDuplicate?: boolean;
  // Advanced Scoring & Normalization fields
  riskScore: number; // 0-100
  sourceReputation: number; // 0-10
  activityCount: number;
  exploitability: number; // 0-10
  normalizedAt: string;
}

export interface Stats {
  total: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  byType: Record<string, number>;
  avgRiskScore: number;
}
