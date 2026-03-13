// ============================================
// HANSONIUM FAMILY PORTAL - TYPE DEFINITIONS
// ============================================

// Statistical Linkage Key (Australian DSS Standard)
export interface SLK {
  key: string;
  generatedAt: Date;
}

// Participant (NDIS terminology - the person receiving care)
export interface Participant {
  id: string;
  slk_id: string;
  firstName: string;
  lastName: string;
  preferredName?: string;
  dateOfBirth: Date;
  ndisNumber: string;
  profileImage?: string;
  
  // Contact Information
  phone?: string;
  email?: string;
  address: Address;
  
  // NDIS Plan Details
  planStartDate: Date;
  planEndDate: Date;
  planManager?: string;
  
  // Budget Information
  budget: NDISBudget;
  
  // Care Details
  careTeam: CareTeamMember[];
  emergencyContacts: EmergencyContact[];
  
  // Preferences
  preferences: ParticipantPreferences;
  
  // Status
  status: 'active' | 'inactive' | 'pending';
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  street: string;
  suburb: string;
  state: string;
  postcode: string;
  country: string;
}

// NDIS Budget Categories
export interface NDISBudget {
  total: number;
  used: number;
  remaining: number;
  
  // Category breakdown
  coreSupport: BudgetCategory;
  capacityBuilding: BudgetCategory;
  capital: BudgetCategory;
  
  // Last updated
  lastUpdated: Date;
}

export interface BudgetCategory {
  allocated: number;
  used: number;
  remaining: number;
  percentage: number;
}

// Care Team Member
export interface CareTeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  profileImage?: string;
  phone?: string;
  email?: string;
  specializations: string[];
  rating: number;
  totalSessions: number;
  isPrimary: boolean;
  status: 'available' | 'on_shift' | 'unavailable';
}

// Emergency Contact
export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

// Participant Preferences
export interface ParticipantPreferences {
  communicationMethod: 'phone' | 'email' | 'sms' | 'app';
  notificationsEnabled: boolean;
  reminderTime: number; // minutes before visit
  language: string;
  accessibility: AccessibilitySettings;
}

export interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
}

// Shift / Visit Information
export interface Shift {
  id: string;
  staffId: string;
  staffMember: CareTeamMember;
  participantId: string;
  
  // Timing
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  
  // Location
  location: Address;
  gpsCoords?: {
    lat: number;
    lng: number;
  };
  
  // Status
  status: ShiftStatus;
  
  // Service Details
  serviceType: string;
  serviceCategory: 'core_support' | 'capacity_building' | 'capital';
  notes?: string;
  
  // DEX Compliance
  dexScore?: DEXScore;
  
  // Rating
  familyRating?: FamilyRating;
  
  // Cost
  estimatedCost: number;
  actualCost?: number;
}

export type ShiftStatus = 
  | 'scheduled'
  | 'confirmed'
  | 'caregiver_en_route'
  | 'caregiver_arrived'
  | 'in_progress'
  | 'completed'
  | 'cancelled'
  | 'no_show';

// DEX Score (Data Exchange - Australian Government Reporting)
export interface DEXScore {
  circumstance: number; // 1-5
  goals: number; // 1-5
  satisfaction: number; // 1-5
  overall: number;
  capturedAt: Date;
  notes?: string;
}

// Family Rating for a session
export interface FamilyRating {
  id: string;
  shiftId: string;
  rating: number; // 1-5
  feedback?: string;
  wouldRecommend: boolean;
  categories: {
    punctuality: number;
    professionalism: number;
    care_quality: number;
    communication: number;
  };
  submittedAt: Date;
  escalated: boolean;
  escalationReason?: string;
}

// Timeline Event (for the transparency feed)
export interface TimelineEvent {
  id: string;
  type: TimelineEventType;
  timestamp: Date;
  title: string;
  description: string;
  shift?: Shift;
  caregiver?: CareTeamMember;
  metadata?: Record<string, unknown>;
  isRead: boolean;
}

export type TimelineEventType = 
  | 'shift_scheduled'
  | 'caregiver_assigned'
  | 'caregiver_en_route'
  | 'caregiver_arrived'
  | 'shift_started'
  | 'shift_completed'
  | 'rating_requested'
  | 'rating_submitted'
  | 'document_added'
  | 'budget_updated'
  | 'plan_reminder'
  | 'message_received'
  | 'alert';

// Document
export interface Document {
  id: string;
  name: string;
  type: 'care_plan' | 'assessment' | 'report' | 'invoice' | 'other';
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Message / Communication
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'family' | 'caregiver' | 'admin' | 'system';
  content: string;
  timestamp: Date;
  isRead: boolean;
  attachments?: Document[];
}

// Notification
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
  actionLabel?: string;
}

// Calendar Event
export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'shift' | 'appointment' | 'reminder' | 'plan_review';
  shift?: Shift;
  color?: string;
}

// Dashboard Statistics
export interface DashboardStats {
  upcomingVisits: number;
  thisWeekVisits: number;
  thisMonthVisits: number;
  averageRating: number;
  totalCaregivers: number;
  budgetUtilization: number;
  planDaysRemaining: number;
  unreadMessages: number;
  pendingRatings: number;
}

// Helper function to generate SLK
export function generateSLK(firstName: string, lastName: string, dob: Date): string {
  // Australian DSS Statistical Linkage Key algorithm
  // Format: 2 letters of first name + 3 letters of surname + DOB components
  
  const cleanName = (name: string): string => 
    name.toUpperCase().replace(/[^A-Z]/g, '');
  
  const first = cleanName(firstName);
  const last = cleanName(lastName);
  
  // Get 2 characters from first name (padded with 2s if too short)
  const firstPart = (first.substring(0, 2) + '22').substring(0, 2);
  
  // Get 2nd, 3rd, and 5th characters from surname (or 2s if missing)
  const getChar = (str: string, pos: number): string => 
    pos < str.length ? str[pos] : '2';
  
  const lastPart = getChar(last, 1) + getChar(last, 2) + getChar(last, 4);
  
  // DOB components
  const day = dob.getDate().toString().padStart(2, '0');
  const month = (dob.getMonth() + 1).toString().padStart(2, '0');
  const year = dob.getFullYear().toString();
  
  return `${lastPart}${firstPart}${day}${month}${year}`;
}
