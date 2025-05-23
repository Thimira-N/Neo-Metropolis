// Common interfaces for the application

// Basic Citizen Profile
export interface Citizen {
  id: string;
  name: string;
  age: number;
  nationality: string;
  dateOfBirth: string;
  address: string;
  email: string;
  phone: string;
  createdAt: string;
  updatedAt: string;
}

// Crime record
export interface Crime {
  id: string;
  type: string;
  description: string;
  date: string;
  location: string;
  status: 'open' | 'closed' | 'under-investigation';
}

// Criminal extends Citizen with additional crime data
export interface Criminal extends Citizen {
  crimeHistory: Crime[];
  threatLevel: 'low' | 'medium' | 'high' | 'critical';
  status: 'at-large' | 'in-custody' | 'released';
  lastSeen?: string;
  associates?: string[]; // IDs of associated criminals
}

// Emergency Type and Status definitions
export type EmergencyType = 'cyber' | 'physical' | 'infrastructure' | 'medical' | 'fire';
export type EmergencyStatus = 'pending' | 'in-progress' | 'resolved';
export type EmergencyPriority = 1 | 2 | 3 | 4 | 5; // 1 is highest priority

// Emergency Request
export interface EmergencyRequest {
  id: string;
  title: string;
  description: string;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  type: EmergencyType;
  priority: EmergencyPriority;
  status: EmergencyStatus;
  reportedTime: string;
  assignedAgentId?: string;
  resolvedTime?: string;
  affectedCitizens?: string[]; // IDs of affected citizens
  relatedCrimeIds?: string[]; // IDs of related crimes
}

// Agent Status
export type AgentStatus = 'available' | 'busy' | 'off-duty';

// Agent
export interface Agent {
  id: string;
  name: string;
  badge: string;
  status: AgentStatus;
  specialization: string[];
  assignedRequestIds: string[]; // IDs of assigned emergency requests
  lastActive: string;
  location?: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
}

// System Status Update
export interface StatusUpdate {
  id: string;
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  priority: number; // Lower number = higher priority
  source: string; // System component that generated the update
  acknowledged: boolean;
}

// City Infrastructure
export interface Infrastructure {
  id: string;
  name: string;
  type: 'power' | 'water' | 'transportation' | 'communication' | 'security';
  status: 'operational' | 'degraded' | 'offline';
  affectedAreas: string[];
  lastUpdated: string;
}

// Analytics Metric
export interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  previousValue?: number;
  change?: number;
  trend: 'up' | 'down' | 'stable';
}

// Date Range for Analytics
export interface DateRange {
  start: Date;
  end: Date;
}

// Analytics Report
export interface AnalyticsReport {
  id: string;
  title: string;
  dateRange: DateRange;
  createdAt: string;
  metrics: Metric[];
  charts: {
    type: 'bar' | 'line' | 'pie' | 'radar';
    title: string;
    data: any; // Chart-specific data structure
  }[];
}