'use client';

import React, { useState } from 'react';

// ============================================
// HANSONIUM FAMILY & PATIENT PORTAL
// Fully Responsive + TypeScript-Safe
// NDIS Compliant | Australian Healthcare Standards
// ============================================

// ============================================
// ICONS
// ============================================
const Icons = {
  Home: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  Calendar: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/></svg>,
  Users: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  Wallet: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4Z"/></svg>,
  FileText: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" x2="8" y1="13" y2="13"/><line x1="16" x2="8" y1="17" y2="17"/></svg>,
  MessageCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>,
  Settings: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>,
  Bell: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>,
  Star: ({ filled = false }: { filled?: boolean }) => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Clock: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
  MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
  Phone: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>,
  ChevronRight: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>,
  AlertCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>,
  Heart: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>,
  Download: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>,
  LogOut: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>,
  Target: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>,
  TrendingUp: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>,
  Eye: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>,
  HelpCircle: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>,
  X: () => <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>,
  Menu: () => <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>,
};

// ============================================
// TYPES
// ============================================
interface Milestone {
  id: string;
  label: string;
  completed: boolean;
}

interface ServiceLine {
  name: string;
  hoursAllocated: number;
  hoursUsed: number;
}

interface Goal {
  id: string;
  title: string;
  category: string;
  milestones: Milestone[];
}

interface CareTeamMember {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
  phone: string;
  specializations: string[];
  rating: number;
  totalSessions: number;
  isPrimary: boolean;
  status: string;
  bio: string;
}

interface Visit {
  id: string;
  staffMember: CareTeamMember;
  scheduledStart: Date;
  scheduledEnd: Date;
  serviceType: string;
  serviceCategory: string;
  status: string;
  estimatedArrival: string | null;
  location: string;
  notes: string;
  estimatedCost: number;
}

interface TimelineEvent {
  id: string;
  type: string;
  timestamp: Date;
  title: string;
  description: string;
  caregiver?: CareTeamMember;
  isRead: boolean;
  requiresRating?: boolean;
}

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedAt: Date;
  size: string;
}

interface Message {
  id: string;
  sender: string;
  senderRole: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

interface Claim {
  id: string;
  date: Date;
  service: string;
  provider: string;
  amount: number;
  status: string;
  category: string;
}

// ============================================
// MOCK DATA
// ============================================
const mockParticipant = {
  id: 'p001',
  firstName: 'Sarah',
  lastName: 'Mitchell',
  preferredName: 'Sarah',
  dateOfBirth: new Date('1985-03-15'),
  ndisNumber: '431 234 567',
  planStartDate: new Date('2024-07-01'),
  planEndDate: new Date('2025-06-30'),
  planManager: 'Plan Managed',
  myNDISContact: 'James Roberts',
  contactPhone: '1800 800 110',
  address: { street: '42 Harmony Lane', suburb: 'Ballarat Central', state: 'VIC', postcode: '3350' },
  goals: [
    {
      id: 'g1', title: 'Increase independence in daily living', category: 'Daily Living',
      milestones: [
        { id: 'm1a', label: 'Complete morning routine independently', completed: true },
        { id: 'm1b', label: 'Prepare simple meals with minimal assistance', completed: true },
        { id: 'm1c', label: 'Navigate local shops independently', completed: false },
        { id: 'm1d', label: 'Manage weekly personal schedule', completed: false },
      ],
    },
    {
      id: 'g2', title: 'Participate in community activities weekly', category: 'Community',
      milestones: [
        { id: 'm2a', label: 'Attend a group activity with support worker', completed: true },
        { id: 'm2b', label: 'Identify a regular weekly activity of interest', completed: true },
        { id: 'm2c', label: 'Attend chosen activity independently', completed: true },
        { id: 'm2d', label: 'Build a regular weekly social routine', completed: false },
      ],
    },
    {
      id: 'g3', title: 'Develop employment skills', category: 'Employment',
      milestones: [
        { id: 'm3a', label: 'Complete a vocational interest assessment', completed: true },
        { id: 'm3b', label: 'Attend a work skills training session', completed: false },
        { id: 'm3c', label: 'Complete a supported work trial', completed: false },
        { id: 'm3d', label: 'Apply for a supported employment position', completed: false },
      ],
    },
    {
      id: 'g4', title: 'Improve social connections', category: 'Relationships',
      milestones: [
        { id: 'm4a', label: 'Identify barriers to social connection', completed: true },
        { id: 'm4b', label: 'Join a peer support or social group', completed: true },
        { id: 'm4c', label: 'Maintain regular contact with two people outside family', completed: false },
        { id: 'm4d', label: 'Initiate a social plan without prompting', completed: false },
      ],
    },
  ] as Goal[],
};

const mockProviderAllocation = {
  month: 'March 2026',
  hoursAllocated: 48,
  hoursUsed: 22.5,
  hoursScheduled: 7.5,
  services: [
    { name: 'Daily Personal Activities', hoursAllocated: 24, hoursUsed: 13.5 },
    { name: 'Community Access', hoursAllocated: 16, hoursUsed: 6 },
    { name: 'OT Sessions', hoursAllocated: 8, hoursUsed: 3 },
  ] as ServiceLine[],
};

const mockCareTeam: CareTeamMember[] = [
  { id: 'c001', firstName: 'Emma', lastName: 'Thompson', role: 'Primary Support Worker', phone: '0412 345 678', specializations: ['Personal Care', 'Community Access', 'Meal Preparation'], rating: 4.9, totalSessions: 156, isPrimary: true, status: 'on_shift', bio: 'Emma has been with Hansonium for 5 years and specializes in supporting participants with daily living activities.' },
  { id: 'c002', firstName: 'James', lastName: 'Wilson', role: 'Support Worker', phone: '0423 456 789', specializations: ['Exercise Support', 'Community Participation'], rating: 4.8, totalSessions: 89, isPrimary: false, status: 'available', bio: 'James focuses on physical activities and community engagement.' },
  { id: 'c003', firstName: 'Priya', lastName: 'Sharma', role: 'Occupational Therapist', phone: '0434 567 890', specializations: ['Daily Living Skills', 'Home Modifications', 'Assistive Tech'], rating: 5.0, totalSessions: 42, isPrimary: false, status: 'available', bio: 'Priya is a registered OT specializing in home assessments.' },
  { id: 'c004', firstName: 'Michael', lastName: 'Chen', role: 'Support Coordinator', phone: '0445 678 901', specializations: ['Plan Implementation', 'Service Connection', 'Goal Planning'], rating: 4.9, totalSessions: 28, isPrimary: false, status: 'available', bio: 'Michael helps participants connect with the right services.' },
];

const mockUpcomingVisits: Visit[] = [
  { id: 'v001', staffMember: mockCareTeam[0], scheduledStart: new Date(Date.now() + 2 * 60 * 60 * 1000), scheduledEnd: new Date(Date.now() + 5 * 60 * 60 * 1000), serviceType: 'Daily Personal Activities', serviceCategory: 'Core - Daily Activities', status: 'caregiver_en_route', estimatedArrival: '15 mins', location: 'Home', notes: 'Morning routine support', estimatedCost: 185.50 },
  { id: 'v002', staffMember: mockCareTeam[1], scheduledStart: new Date(Date.now() + 24 * 60 * 60 * 1000), scheduledEnd: new Date(Date.now() + 27 * 60 * 60 * 1000), serviceType: 'Community Access - Shopping', serviceCategory: 'Core - Community Participation', status: 'confirmed', estimatedArrival: null, location: 'Ballarat Central', notes: 'Weekly shopping trip', estimatedCost: 165.00 },
  { id: 'v003', staffMember: mockCareTeam[2], scheduledStart: new Date(Date.now() + 48 * 60 * 60 * 1000), scheduledEnd: new Date(Date.now() + 49 * 60 * 60 * 1000), serviceType: 'OT Home Assessment', serviceCategory: 'Capacity - Improved Daily Living', status: 'scheduled', estimatedArrival: null, location: 'Home', notes: 'Quarterly assessment', estimatedCost: 193.99 },
];

const mockTimelineEvents: TimelineEvent[] = [
  { id: 't001', type: 'caregiver_en_route', timestamp: new Date(Date.now() - 5 * 60 * 1000), title: 'Emma is on her way', description: 'Arriving in approximately 15 minutes.', caregiver: mockCareTeam[0], isRead: false },
  { id: 't002', type: 'shift_completed', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), title: 'Session Completed', description: 'Daily Personal Activities with Emma completed.', caregiver: mockCareTeam[0], isRead: false, requiresRating: true },
  { id: 't003', type: 'budget_updated', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), title: 'Budget Updated', description: '$185.50 claimed for Daily Activities.', isRead: true },
  { id: 't004', type: 'document_added', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), title: 'OT Report Available', description: 'Assessment report uploaded.', isRead: true },
];

const mockDocuments: Document[] = [
  { id: 'd001', name: 'NDIS Plan 2024-2025', type: 'plan', uploadedAt: new Date('2024-07-01'), size: '2.4 MB' },
  { id: 'd002', name: 'OT Assessment Report - Feb 2025', type: 'assessment', uploadedAt: new Date('2025-02-15'), size: '1.8 MB' },
  { id: 'd003', name: 'Service Agreement - Hansonium', type: 'agreement', uploadedAt: new Date('2024-07-05'), size: '456 KB' },
  { id: 'd004', name: 'Monthly Statement - January 2025', type: 'statement', uploadedAt: new Date('2025-02-01'), size: '156 KB' },
];

const mockMessages: Message[] = [
  { id: 'm001', sender: 'Emma Thompson', senderRole: 'Support Worker', content: "Hi Sarah! Confirming I'll be there at 10am tomorrow.", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), isRead: false },
  { id: 'm002', sender: 'Michael Chen', senderRole: 'Support Coordinator', content: 'Found a great community art class for you. Interested?', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), isRead: false },
  { id: 'm003', sender: 'Hansonium Admin', senderRole: 'Admin', content: 'January invoice processed and sent to Plan Manager.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), isRead: true },
];

const mockClaims: Claim[] = [
  { id: 'cl001', date: new Date('2025-02-20'), service: 'Daily Personal Activities', provider: 'Emma Thompson', amount: 185.50, status: 'paid', category: 'Core - Daily Activities' },
  { id: 'cl002', date: new Date('2025-02-18'), service: 'Community Access', provider: 'James Wilson', amount: 165.00, status: 'paid', category: 'Core - Community Participation' },
  { id: 'cl003', date: new Date('2025-02-15'), service: 'OT Assessment', provider: 'Priya Sharma', amount: 193.99, status: 'processing', category: 'Capacity - Improved Daily Living' },
];

// ============================================
// UTILITY FUNCTIONS
// ============================================
const formatDate = (date: Date): string =>
  new Intl.DateTimeFormat('en-AU', { weekday: 'short', day: 'numeric', month: 'short' }).format(date);

const formatTime = (date: Date): string =>
  new Intl.DateTimeFormat('en-AU', { hour: 'numeric', minute: '2-digit', hour12: true }).format(date);

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

const formatCurrencyFull = (amount: number): string =>
  new Intl.NumberFormat('en-AU', { style: 'currency', currency: 'AUD' }).format(amount);

const getTimeAgo = (date: Date): string => {
  const d = Math.floor((Date.now() - date.getTime()) / 60000);
  if (d < 1) return 'Just now';
  if (d < 60) return `${d}m ago`;
  if (d < 1440) return `${Math.floor(d / 60)}h ago`;
  return `${Math.floor(d / 1440)}d ago`;
};

const getInitials = (first: string, last: string): string =>
  `${first[0]}${last[0]}`.toUpperCase();

const getDaysRemaining = (date: Date): number =>
  Math.ceil((date.getTime() - Date.now()) / 86400000);

// ============================================
// COMPONENTS
// ============================================

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  value?: string;
}

const ProgressRing = ({
  progress,
  size = 120,
  strokeWidth = 10,
  color = '#4ade80',
  label,
  value,
}: ProgressRingProps) => {
  const r = (size - strokeWidth) / 2;
  const c = r * 2 * Math.PI;
  const o = c - (progress / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={strokeWidth} fill="none" />
        <circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={strokeWidth} fill="none" strokeLinecap="round" strokeDasharray={c} strokeDashoffset={o} className="transition-all duration-1000" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {value && <span className="text-base font-bold text-gray-900">{value}</span>}
        {label && <span className="text-xs text-gray-500">{label}</span>}
      </div>
    </div>
  );
};

interface AvatarProps {
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: string;
}

const Avatar = ({ firstName, lastName, size = 'md', status }: AvatarProps) => {
  const sizeMap: Record<string, string> = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-14 h-14 text-lg',
  };
  const statusColorMap: Record<string, string> = {
    on_shift: 'bg-green-500',
    available: 'bg-blue-500',
    unavailable: 'bg-gray-400',
    caregiver_en_route: 'bg-amber-500',
  };
  return (
    <div className="relative flex-shrink-0">
      <div className={`${sizeMap[size]} rounded-full bg-gradient-to-br from-[#4ade80] to-[#86efac] flex items-center justify-center text-[#1a1a2e] font-semibold`}>
        {getInitials(firstName, lastName)}
      </div>
      {status && (
        <span className={`absolute bottom-0 right-0 w-3 h-3 ${statusColorMap[status] ?? 'bg-gray-400'} border-2 border-white rounded-full`} />
      )}
    </div>
  );
};

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const map: Record<string, { bg: string; text: string; label: string }> = {
    caregiver_en_route: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'En Route' },
    confirmed: { bg: 'bg-green-100', text: 'text-green-700', label: 'Confirmed' },
    scheduled: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Scheduled' },
    on_shift: { bg: 'bg-green-100', text: 'text-green-700', label: 'On Shift' },
    available: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Available' },
    paid: { bg: 'bg-green-100', text: 'text-green-700', label: 'Paid' },
    processing: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Processing' },
  };
  const { bg, text, label } = map[status] ?? { bg: 'bg-gray-100', text: 'text-gray-600', label: status };
  return (
    <span className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'} rounded-full font-medium ${bg} ${text}`}>
      <span className={`w-1.5 h-1.5 rounded-full bg-current ${status === 'caregiver_en_route' ? 'animate-pulse' : ''}`} />
      {label}
    </span>
  );
};

interface StarRatingProps {
  rating: number;
  readonly?: boolean;
  size?: 'sm' | 'md';
}

const StarRating = ({ rating, size = 'md' }: StarRatingProps) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <span key={s} className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} ${rating >= s ? 'text-yellow-400' : 'text-gray-300'}`}>
        <svg viewBox="0 0 24 24" fill={rating >= s ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </span>
    ))}
  </div>
);

// ============================================
// SIDEBAR
// ============================================
interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ currentPage, onNavigate, isOpen, onClose }: SidebarProps) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Home },
    { id: 'visits', label: 'Visits', icon: Icons.Calendar },
    { id: 'care-team', label: 'Care Team', icon: Icons.Users },
    { id: 'budget', label: 'My Services', icon: Icons.Wallet },
    { id: 'goals', label: 'Goals', icon: Icons.Target },
    { id: 'documents', label: 'Documents', icon: Icons.FileText },
    { id: 'messages', label: 'Messages', icon: Icons.MessageCircle, badge: mockMessages.filter((m) => !m.isRead).length },
  ];
  const hoursPercent = Math.round((mockProviderAllocation.hoursUsed / mockProviderAllocation.hoursAllocated) * 100);
  const planDays = getDaysRemaining(mockParticipant.planEndDate);

  const handleNav = (id: string) => {
    onNavigate(id);
    onClose();
  };

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />}
      <aside className={`fixed left-0 top-0 z-50 h-screen w-60 bg-[#1a1a2e] text-white flex flex-col transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 shrink-0 rounded-lg bg-[#4ade80] flex items-center justify-center text-[#1a1a2e]"><Icons.Heart /></div>
            <div className="min-w-0">
              <h1 className="text-base font-bold truncate" style={{ fontFamily: 'Georgia, serif' }}>Hansonium</h1>
              <p className="text-[10px] text-white/50">Family Portal</p>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden p-1 rounded-lg hover:bg-white/10 text-white/70"><Icons.X /></button>
        </div>

        {/* Mini Stats */}
        <div className="px-3 py-2 border-b border-white/10 grid grid-cols-2 gap-2">
          <div className="bg-white/10 rounded-lg px-2.5 py-2">
            <p className="text-[9px] text-white/50 uppercase">Hours</p>
            <p className="text-sm font-bold text-[#4ade80]">{hoursPercent}%</p>
          </div>
          <div className="bg-white/10 rounded-lg px-2.5 py-2">
            <p className="text-[9px] text-white/50 uppercase">Days Left</p>
            <p className="text-sm font-bold">{planDays}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 py-2 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNav(item.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all text-left text-sm ${currentPage === item.id ? 'bg-[#4ade80] text-[#1a1a2e] font-semibold' : 'text-white/70 hover:bg-white/10 hover:text-white'}`}
            >
              <item.icon />
              <span className="flex-1">{item.label}</span>
              {(item.badge ?? 0) > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span>
              )}
            </button>
          ))}
          <div className="pt-2 mt-2 border-t border-white/10 space-y-0.5">
            <button onClick={() => handleNav('settings')} className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm ${currentPage === 'settings' ? 'bg-[#4ade80] text-[#1a1a2e] font-semibold' : 'text-white/70 hover:bg-white/10'}`}>
              <Icons.Settings /><span>Settings</span>
            </button>
            <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-white/70 hover:bg-white/10 text-sm">
              <Icons.HelpCircle /><span>Help</span>
            </button>
          </div>
        </nav>

        {/* User */}
        <div className="px-3 py-3 border-t border-white/10">
          <div className="flex items-center gap-2 mb-2">
            <Avatar firstName={mockParticipant.firstName} lastName={mockParticipant.lastName} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{mockParticipant.firstName}</p>
              <p className="text-[10px] text-white/50">NDIS: {mockParticipant.ndisNumber}</p>
            </div>
          </div>
          <button
            className="w-full flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs"
            onClick={() => { localStorage.removeItem('hs_role'); localStorage.removeItem('hs_email'); window.location.href = '/'; }}
          >
            <Icons.LogOut /><span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

// ============================================
// HEADER
// ============================================
interface HeaderProps {
  title: string;
  subtitle?: string;
  onMenuToggle: () => void;
}

const Header = ({ title, subtitle, onMenuToggle }: HeaderProps) => (
  <header className="bg-white border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-20">
    <div className="flex items-center gap-3">
      <button onClick={onMenuToggle} className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-700" aria-label="Toggle menu">
        <Icons.Menu />
      </button>
      <div>
        <h2 className="text-lg sm:text-xl font-bold text-[#1a1a2e] leading-tight" style={{ fontFamily: 'Georgia, serif' }}>{title}</h2>
        <p className="text-xs sm:text-sm text-gray-500">
          {subtitle ?? new Intl.DateTimeFormat('en-AU', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
        </p>
      </div>
    </div>
    <button className="relative p-2 hover:bg-gray-100 rounded-lg">
      <Icons.Bell />
      {mockTimelineEvents.filter((e) => !e.isRead).length > 0 && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      )}
    </button>
  </header>
);

// ============================================
// RATING MODAL
// ============================================
interface RatingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RatingModal = ({ isOpen, onClose }: RatingModalProps) => {
  const [rating, setRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>('');
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-5 sm:p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Rate Your Session</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-lg"><Icons.X /></button>
        </div>
        <div className="flex items-center gap-4 mb-4 p-3 bg-gray-50 rounded-xl">
          <Avatar firstName="Emma" lastName="Thompson" size="lg" />
          <div>
            <p className="font-semibold text-gray-900">Emma Thompson</p>
            <p className="text-sm text-gray-500">Daily Personal Activities</p>
          </div>
        </div>
        <div className="text-center mb-4">
          <p className="text-sm text-gray-600 mb-2">How was your experience?</p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} className={`w-10 h-10 ${rating >= s ? 'text-yellow-400' : 'text-gray-300'} hover:scale-110 transition-transform`}>
                <svg viewBox="0 0 24 24" fill={rating >= s ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            ))}
          </div>
        </div>
        {rating > 0 && rating <= 2 && (
          <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl mb-4">
            <Icons.AlertCircle />
            <p className="text-sm text-amber-800">Low ratings are escalated to our admin team for review.</p>
          </div>
        )}
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Additional feedback (optional)..."
          className="w-full p-3 border border-gray-200 rounded-xl focus:border-[#4ade80] focus:ring-0 outline-none resize-none h-20 text-sm mb-4"
        />
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50">Cancel</button>
          <button onClick={onClose} disabled={rating === 0} className="flex-1 py-2.5 bg-[#4ade80] text-[#1a1a2e] font-semibold rounded-xl hover:bg-[#22c55e] disabled:opacity-50">Submit</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD PAGE
// ============================================
interface DashboardPageProps {
  onNavigate: (page: string) => void;
  onRate: () => void;
}

const DashboardPage = ({ onNavigate, onRate }: DashboardPageProps) => {
  const hoursRemaining = mockProviderAllocation.hoursAllocated - mockProviderAllocation.hoursUsed;
  const hoursPercent = Math.round((mockProviderAllocation.hoursUsed / mockProviderAllocation.hoursAllocated) * 100);
  const nextVisit = mockUpcomingVisits[0];

  const quickStats = [
    { label: 'Hours Remaining', value: `${hoursRemaining}h`, sub: `${100 - hoursPercent}% of monthly allocation`, color: 'from-emerald-500 to-teal-600', page: 'budget' },
    { label: 'Upcoming Visits', value: mockUpcomingVisits.length.toString(), sub: 'Next 7 days', color: 'from-blue-500 to-indigo-600', page: 'visits' },
    { label: 'Plan Days Left', value: getDaysRemaining(mockParticipant.planEndDate).toString(), sub: formatDate(mockParticipant.planEndDate), color: 'from-purple-500 to-pink-600', page: 'goals' },
    { label: 'Care Team', value: mockCareTeam.length.toString(), sub: 'Active members', color: 'from-amber-500 to-orange-600', page: 'care-team' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {quickStats.map((stat) => (
          <div key={stat.label} onClick={() => onNavigate(stat.page)} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all cursor-pointer group">
            <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${stat.color} text-white flex items-center justify-center mb-2 sm:mb-3 group-hover:scale-105 transition-transform`}>
              <Icons.Wallet />
            </div>
            <p className="text-xl sm:text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-1">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Next Visit Hero */}
      {nextVisit && (
        <div className="bg-gradient-to-br from-[#1a1a2e] via-[#252540] to-[#1a1a2e] rounded-2xl p-4 sm:p-5 text-white relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-60 h-60 rounded-full bg-[#4ade80]/10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  <StatusBadge status={nextVisit.status} />
                  {nextVisit.estimatedArrival && <span className="text-sm text-white/70">Arriving in {nextVisit.estimatedArrival}</span>}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-1" style={{ fontFamily: 'Georgia, serif' }}>Next Visit</h3>
                <p className="text-white/70 mb-3 text-sm sm:text-base">{nextVisit.serviceType}</p>
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
                  <span className="flex items-center gap-1.5"><Icons.Calendar /> {formatDate(nextVisit.scheduledStart)}</span>
                  <span className="flex items-center gap-1.5"><Icons.Clock /> {formatTime(nextVisit.scheduledStart)}</span>
                  <span className="flex items-center gap-1.5"><Icons.MapPin /> {nextVisit.location}</span>
                </div>
                <div className="flex flex-wrap gap-3 mt-4">
                  <button className="bg-[#4ade80] text-[#1a1a2e] font-semibold px-4 py-2 rounded-lg hover:bg-[#22c55e] flex items-center gap-2 text-sm"><Icons.Phone /> Contact</button>
                  <button className="bg-white/10 text-white font-medium px-4 py-2 rounded-lg hover:bg-white/20 flex items-center gap-2 text-sm"><Icons.MapPin /> Track</button>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur rounded-xl p-3 sm:p-4 self-start">
                <Avatar firstName={nextVisit.staffMember.firstName} lastName={nextVisit.staffMember.lastName} size="xl" status={nextVisit.staffMember.status} />
                <div>
                  <p className="font-semibold text-base sm:text-lg">{nextVisit.staffMember.firstName} {nextVisit.staffMember.lastName}</p>
                  <p className="text-xs sm:text-sm text-white/70">{nextVisit.staffMember.role}</p>
                  <div className="flex items-center gap-1 mt-1">
                    <StarRating rating={nextVisit.staffMember.rating} size="sm" />
                    <span className="text-xs text-white/60 ml-1">{nextVisit.staffMember.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Hours + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
        <div className="lg:col-span-2 bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>Service Hours This Month</h3>
              <p className="text-xs text-gray-500">{mockProviderAllocation.month} · Hansonium allocation</p>
            </div>
            <button onClick={() => onNavigate('budget')} className="text-[#4ade80] hover:text-[#22c55e] font-medium text-sm flex items-center gap-1">Details <Icons.ChevronRight /></button>
          </div>
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="flex-shrink-0">
              <ProgressRing progress={hoursPercent} size={110} strokeWidth={10} color="#4ade80" value={`${mockProviderAllocation.hoursUsed}h`} label="Used" />
            </div>
            <div className="flex-1 w-full space-y-3">
              {mockProviderAllocation.services.map((svc, i) => {
                const colors = ['#8b5cf6', '#06b6d4', '#f97316'];
                return (
                  <div key={svc.name}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700">{svc.name}</span>
                      <span className="text-gray-500 text-xs sm:text-sm">{svc.hoursUsed}h / {svc.hoursAllocated}h</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${(svc.hoursUsed / svc.hoursAllocated) * 100}%`, backgroundColor: colors[i] }} />
                    </div>
                  </div>
                );
              })}
              <div className="pt-3 border-t border-gray-100 flex justify-between">
                <span className="font-semibold text-gray-900">Remaining</span>
                <span className="text-lg sm:text-xl font-bold text-[#4ade80]">{mockProviderAllocation.hoursAllocated - mockProviderAllocation.hoursUsed}h</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Activity</h3>
          <div className="space-y-3">
            {mockTimelineEvents.slice(0, 4).map((event) => (
              <div key={event.id} className={`relative pl-5 pb-3 border-l-2 ${event.isRead ? 'border-gray-200' : 'border-[#4ade80]'}`}>
                <div className={`absolute -left-1.5 top-0 w-3 h-3 rounded-full ${event.isRead ? 'bg-gray-300' : 'bg-[#4ade80]'} ${event.type === 'caregiver_en_route' ? 'animate-pulse' : ''}`} />
                <p className="text-sm font-medium text-gray-900">{event.title}</p>
                <p className="text-xs text-gray-500">{event.description}</p>
                <p className="text-xs text-gray-400 mt-1">{getTimeAgo(event.timestamp)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Goals */}
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base sm:text-lg font-bold text-gray-900" style={{ fontFamily: 'Georgia, serif' }}>My Goals</h3>
          <button onClick={() => onNavigate('goals')} className="text-[#4ade80] text-sm font-medium flex items-center gap-1">View All <Icons.ChevronRight /></button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {mockParticipant.goals.map((goal) => {
            const done = goal.milestones.filter((m) => m.completed).length;
            const total = goal.milestones.length;
            return (
              <div key={goal.id} className="bg-gray-50 rounded-lg p-3 sm:p-4">
                <span className="text-xs text-gray-500 uppercase block mb-2">{goal.category}</span>
                <p className="text-sm font-medium text-gray-900 mb-3 line-clamp-2">{goal.title}</p>
                <p className="text-xs text-gray-500">{done} of {total} milestones complete</p>
                <div className="flex gap-1 mt-2">
                  {goal.milestones.map((m) => (
                    <div key={m.id} className={`h-2 flex-1 rounded-full ${m.completed ? 'bg-[#4ade80]' : 'bg-gray-200'}`} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rating Banner */}
      {mockTimelineEvents.some((e) => e.requiresRating) && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-amber-200 flex items-center justify-center text-amber-600 flex-shrink-0">
              <Icons.Star filled />
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">Rate Your Recent Session</h4>
              <p className="text-sm text-gray-600">Your feedback helps improve care quality</p>
            </div>
          </div>
          <button onClick={onRate} className="bg-amber-500 text-white font-semibold px-5 py-2.5 rounded-lg hover:bg-amber-600 w-full sm:w-auto">Rate Now</button>
        </div>
      )}
    </div>
  );
};

// ============================================
// VISITS PAGE
// ============================================
const VisitsPage = () => (
  <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Upcoming Visits</h3>
      <div className="space-y-3">
        {mockUpcomingVisits.map((visit) => (
          <div key={visit.id} className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Avatar firstName={visit.staffMember.firstName} lastName={visit.staffMember.lastName} size="lg" status={visit.staffMember.status} />
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900 truncate">{visit.staffMember.firstName} {visit.staffMember.lastName}</span>
                  <StatusBadge status={visit.status} size="sm" />
                </div>
                <p className="text-sm text-gray-600 truncate">{visit.serviceType}</p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><Icons.Calendar /> {formatDate(visit.scheduledStart)}</span>
                  <span className="flex items-center gap-1"><Icons.Clock /> {formatTime(visit.scheduledStart)}</span>
                  <span className="flex items-center gap-1"><Icons.MapPin /> {visit.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
              <div className="sm:text-right">
                <p className="font-medium text-gray-900">{formatCurrencyFull(visit.estimatedCost)}</p>
                <p className="text-xs text-gray-500">{visit.serviceCategory}</p>
              </div>
              <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md flex-shrink-0"><Icons.Phone /></button>
            </div>
          </div>
        ))}
      </div>
    </div>

    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Recent Claims</h3>
      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <table className="w-full text-sm min-w-[500px]">
          <thead>
            <tr className="text-left text-xs text-gray-500 uppercase border-b">
              <th className="pb-3">Date</th>
              <th className="pb-3">Service</th>
              <th className="pb-3 hidden sm:table-cell">Provider</th>
              <th className="pb-3 text-right">Amount</th>
              <th className="pb-3 text-right">Status</th>
            </tr>
          </thead>
          <tbody>
            {mockClaims.map((claim) => (
              <tr key={claim.id} className="border-b border-gray-50">
                <td className="py-3 text-gray-600 whitespace-nowrap">{formatDate(claim.date)}</td>
                <td className="py-3 font-medium text-gray-900">{claim.service}</td>
                <td className="py-3 text-gray-600 hidden sm:table-cell">{claim.provider}</td>
                <td className="py-3 text-right font-medium whitespace-nowrap">{formatCurrencyFull(claim.amount)}</td>
                <td className="py-3 text-right"><StatusBadge status={claim.status} size="sm" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

// ============================================
// CARE TEAM PAGE
// ============================================
const CareTeamPage = () => (
  <div className="p-4 sm:p-6">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {mockCareTeam.map((member) => (
        <div key={member.id} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3 sm:gap-4 mb-4">
            <Avatar firstName={member.firstName} lastName={member.lastName} size="xl" status={member.status} />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h4 className="text-base sm:text-lg font-bold text-gray-900">{member.firstName} {member.lastName}</h4>
                {member.isPrimary && <span className="px-2 py-0.5 bg-[#4ade80]/20 text-[#166534] text-xs rounded-full font-medium">Primary</span>}
              </div>
              <p className="text-sm text-gray-600">{member.role}</p>
              <div className="flex items-center gap-2 mt-2">
                <StarRating rating={member.rating} size="sm" />
                <span className="text-sm font-medium text-gray-700">{member.rating}</span>
                <span className="text-xs text-gray-400">({member.totalSessions} sessions)</span>
              </div>
            </div>
            <StatusBadge status={member.status} />
          </div>
          <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
          <div className="flex flex-wrap gap-2 mb-4">
            {member.specializations.map((spec) => (
              <span key={spec} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">{spec}</span>
            ))}
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-2 bg-[#4ade80] text-[#1a1a2e] font-medium rounded-lg hover:bg-[#22c55e] text-sm flex items-center justify-center gap-2"><Icons.Phone /> Call</button>
            <button className="flex-1 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 text-sm flex items-center justify-center gap-2"><Icons.MessageCircle /> Message</button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// MY SERVICES PAGE  (provider hours — not participant NDIS budget)
// ============================================
const BudgetPage = () => {
  const alloc = mockProviderAllocation;
  const hoursRemaining = alloc.hoursAllocated - alloc.hoursUsed;
  const hoursPercent = Math.round((alloc.hoursUsed / alloc.hoursAllocated) * 100);
  const colors = ['#8b5cf6', '#06b6d4', '#f97316'];

  const summaryStats = [
    { label: 'Hours This Month', value: `${alloc.hoursAllocated}h`, color: 'text-gray-900' },
    { label: 'Used', value: `${alloc.hoursUsed}h`, color: 'text-amber-600' },
    { label: 'Remaining', value: `${hoursRemaining}h`, color: 'text-[#4ade80]' },
    { label: 'Scheduled', value: `${alloc.hoursScheduled}h`, color: 'text-blue-600' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {summaryStats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase mb-1">{stat.label}</p>
            <p className={`text-xl sm:text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8">
          <div className="flex-shrink-0 flex justify-center">
            <div className="text-center">
              <ProgressRing progress={hoursPercent} size={120} strokeWidth={10} color="#4ade80" value={`${alloc.hoursUsed}h`} label="Used" />
              <p className="text-sm font-medium text-gray-700 mt-2">{alloc.month}</p>
              <p className="text-xs text-gray-400">Hansonium services</p>
            </div>
          </div>
          <div className="flex-1 space-y-4">
            {alloc.services.map((svc, i) => (
              <div key={svc.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-800">{svc.name}</span>
                  <span className="text-gray-500">{svc.hoursUsed}h <span className="text-gray-300">/</span> {svc.hoursAllocated}h</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${(svc.hoursUsed / svc.hoursAllocated) * 100}%`, backgroundColor: colors[i] }} />
                </div>
                <p className="text-xs text-gray-400 mt-1">{svc.hoursAllocated - svc.hoursUsed}h remaining</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Recent Service Claims</h3>
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="text-left text-xs text-gray-500 uppercase border-b">
                <th className="pb-3">Date</th>
                <th className="pb-3">Service</th>
                <th className="pb-3 hidden sm:table-cell">Worker</th>
                <th className="pb-3 text-right">Amount</th>
                <th className="pb-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {mockClaims.map((claim) => (
                <tr key={claim.id} className="border-b border-gray-50">
                  <td className="py-3 text-gray-600 whitespace-nowrap">{formatDate(claim.date)}</td>
                  <td className="py-3 font-medium text-gray-900">{claim.service}</td>
                  <td className="py-3 text-gray-600 hidden sm:table-cell">{claim.provider}</td>
                  <td className="py-3 text-right font-medium whitespace-nowrap">{formatCurrencyFull(claim.amount)}</td>
                  <td className="py-3 text-right"><StatusBadge status={claim.status} size="sm" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ============================================
// GOALS PAGE
// ============================================
const GoalsPage = () => (
  <div className="p-4 sm:p-6">
    <p className="text-sm text-gray-500 mb-4">Milestones are defined by your support coordinator. Contact your coordinator to update or add milestones.</p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
      {mockParticipant.goals.map((goal) => {
        const done = goal.milestones.filter((m) => m.completed).length;
        const total = goal.milestones.length;
        return (
          <div key={goal.id} className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 pr-3">
                <span className="text-xs font-medium text-gray-500 uppercase">{goal.category}</span>
                <h4 className="text-base sm:text-lg font-bold text-gray-900 mt-1">{goal.title}</h4>
              </div>
              <span className="flex-shrink-0 text-sm font-semibold text-gray-500 whitespace-nowrap">{done}/{total} done</span>
            </div>
            <ul className="space-y-2">
              {goal.milestones.map((m) => (
                <li key={m.id} className="flex items-start gap-3">
                  <span className={`mt-0.5 w-5 h-5 flex-shrink-0 rounded-full border-2 flex items-center justify-center ${m.completed ? 'bg-[#4ade80] border-[#4ade80]' : 'border-gray-300'}`}>
                    {m.completed && (
                      <svg viewBox="0 0 12 12" fill="none" className="w-3 h-3">
                        <path d="M2 6l3 3 5-5" stroke="#1a1a2e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </span>
                  <span className={`text-sm leading-snug ${m.completed ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{m.label}</span>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  </div>
);

// ============================================
// DOCUMENTS PAGE
// ============================================
const DocumentsPage = () => (
  <div className="p-4 sm:p-6">
    <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
      <div className="space-y-3">
        {mockDocuments.map((doc) => (
          <div key={doc.id} className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group cursor-pointer">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${doc.type === 'plan' ? 'bg-purple-100 text-purple-600' : doc.type === 'assessment' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
              <Icons.FileText />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">{doc.name}</h4>
              <p className="text-xs text-gray-500">{formatDate(doc.uploadedAt)} • {doc.size}</p>
            </div>
            <div className="flex gap-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
              <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md"><Icons.Eye /></button>
              <button className="p-2 bg-white rounded-lg shadow-sm hover:shadow-md"><Icons.Download /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ============================================
// MESSAGES PAGE
// ============================================
const MessagesPage = () => (
  <div className="p-4 sm:p-6">
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      {mockMessages.map((msg, i) => (
        <div key={msg.id} className={`flex gap-3 sm:gap-4 p-4 ${i !== mockMessages.length - 1 ? 'border-b border-gray-100' : ''} ${!msg.isRead ? 'bg-blue-50/50' : ''}`}>
          <Avatar firstName={msg.sender.split(' ')[0]} lastName={msg.sender.split(' ')[1] ?? 'A'} size="md" />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{msg.sender}</span>
              <span className="text-xs text-gray-500">{msg.senderRole}</span>
              {!msg.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
            </div>
            <p className="text-sm text-gray-600">{msg.content}</p>
            <p className="text-xs text-gray-400 mt-2">{getTimeAgo(msg.timestamp)}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ============================================
// SETTINGS PAGE
// ============================================
const SettingsPage = () => {
  const profileFields = [
    { label: 'Name', value: `${mockParticipant.firstName} ${mockParticipant.lastName}` },
    { label: 'NDIS Number', value: mockParticipant.ndisNumber },
    { label: 'Date of Birth', value: formatDate(mockParticipant.dateOfBirth) },
    { label: 'Plan Management', value: mockParticipant.planManager },
  ];

  const emergencyContacts = [
    { name: 'Emergency Services', phone: '000' },
    { name: 'NDIS Helpline', phone: '1800 800 110' },
    { name: 'Hansonium Support', phone: '1300 000 201' },
  ];

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-5">
      <div className="bg-white rounded-xl p-4 sm:p-5 shadow-sm border border-gray-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4" style={{ fontFamily: 'Georgia, serif' }}>Profile</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {profileFields.map((f) => (
            <div key={f.label}>
              <label className="block text-sm font-medium text-gray-500 mb-1">{f.label}</label>
              <p className="text-gray-900">{f.value}</p>
            </div>
          ))}
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-500 mb-1">Address</label>
            <p className="text-gray-900">{mockParticipant.address.street}, {mockParticipant.address.suburb}, {mockParticipant.address.state} {mockParticipant.address.postcode}</p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 sm:p-5 border border-red-100">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 flex items-center gap-2" style={{ fontFamily: 'Georgia, serif' }}>
          <Icons.AlertCircle /> Emergency Contacts
        </h3>
        <div className="space-y-2">
          {emergencyContacts.map((c) => (
            <a key={c.name} href={`tel:${c.phone}`} className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition-shadow">
              <span className="font-medium text-gray-900">{c.name}</span>
              <span className="text-[#4ade80] font-semibold">{c.phone}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// BOTTOM NAV — mobile only
// ============================================
interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const BottomNav = ({ currentPage, onNavigate }: BottomNavProps) => {
  const items = [
    { id: 'dashboard', label: 'Home', icon: Icons.Home },
    { id: 'visits', label: 'Visits', icon: Icons.Calendar },
    { id: 'budget', label: 'Services', icon: Icons.Wallet },
    { id: 'care-team', label: 'Team', icon: Icons.Users },
    { id: 'messages', label: 'Messages', icon: Icons.MessageCircle, badge: mockMessages.filter((m) => !m.isRead).length },
  ];
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 lg:hidden z-30">
      <div className="flex">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex-1 flex flex-col items-center justify-center py-2.5 gap-1 relative transition-colors ${currentPage === item.id ? 'text-[#1a1a2e]' : 'text-gray-400 hover:text-gray-600'}`}
          >
            <item.icon />
            <span className="text-[10px] font-medium">{item.label}</span>
            {currentPage === item.id && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#4ade80] rounded-full" />}
            {(item.badge ?? 0) > 0 && <span className="absolute top-2 right-3 w-2 h-2 bg-red-500 rounded-full" />}
          </button>
        ))}
      </div>
    </nav>
  );
};

// ============================================
// MAIN APP
// ============================================
export default function FamilyPortal() {
  const [currentPage, setCurrentPage] = useState<string>('dashboard');
  const [ratingModalOpen, setRatingModalOpen] = useState<boolean>(false);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  const titles: Record<string, { title: string; subtitle?: string }> = {
    dashboard: { title: `Good ${greeting}, ${mockParticipant.preferredName}` },
    visits: { title: 'Visits & Schedule', subtitle: 'Manage your care visits' },
    'care-team': { title: 'Your Care Team', subtitle: 'Connect with your support workers' },
    budget: { title: 'My Services', subtitle: 'Hours used with Hansonium this month' },
    goals: { title: 'My Goals', subtitle: 'Track your NDIS goals' },
    documents: { title: 'Documents', subtitle: 'Plans, reports & statements' },
    messages: { title: 'Messages', subtitle: `${mockMessages.filter((m) => !m.isRead).length} unread` },
    settings: { title: 'Settings', subtitle: 'Profile & preferences' },
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <DashboardPage onNavigate={setCurrentPage} onRate={() => setRatingModalOpen(true)} />;
      case 'visits': return <VisitsPage />;
      case 'care-team': return <CareTeamPage />;
      case 'budget': return <BudgetPage />;
      case 'goals': return <GoalsPage />;
      case 'documents': return <DocumentsPage />;
      case 'messages': return <MessagesPage />;
      case 'settings': return <SettingsPage />;
      default: return <DashboardPage onNavigate={setCurrentPage} onRate={() => setRatingModalOpen(true)} />;
    }
  };

  const pageInfo = titles[currentPage] ?? { title: 'Dashboard' };

  return (
    <div className="min-h-screen bg-[#faf9f7]" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <main className="lg:ml-60 min-h-screen pb-20 lg:pb-0">
        <Header
          title={pageInfo.title}
          subtitle={pageInfo.subtitle}
          onMenuToggle={() => setSidebarOpen(true)}
        />
        {renderPage()}
      </main>
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
      <RatingModal isOpen={ratingModalOpen} onClose={() => setRatingModalOpen(false)} />
    </div>
  );
}