// ============================================
// HANSONIUM FAMILY PORTAL - FIREBASE UTILITIES
// ============================================

import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  Timestamp,
  limit,
  DocumentData,
  QueryDocumentSnapshot
} from 'firebase/firestore';
import { useState, useEffect } from 'react';
import type { 
  Participant, 
  Shift, 
  CareTeamMember, 
  TimelineEvent, 
  Document as DocumentType,
  Notification 
} from '../types';

// Firebase app would be initialized in a separate config file
// import { db } from './firebase-config';

// ============================================
// DATA CONVERTERS
// ============================================

const convertTimestamp = (timestamp: Timestamp | Date | null): Date => {
  if (!timestamp) return new Date();
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

const participantConverter = {
  toFirestore: (participant: Participant) => {
    return {
      ...participant,
      dateOfBirth: Timestamp.fromDate(participant.dateOfBirth),
      planStartDate: Timestamp.fromDate(participant.planStartDate),
      planEndDate: Timestamp.fromDate(participant.planEndDate),
      budget: {
        ...participant.budget,
        lastUpdated: Timestamp.fromDate(participant.budget.lastUpdated),
      },
      createdAt: Timestamp.fromDate(participant.createdAt),
      updatedAt: Timestamp.fromDate(participant.updatedAt),
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Participant => {
    const data = snapshot.data();
    return {
      ...data,
      id: snapshot.id,
      dateOfBirth: convertTimestamp(data.dateOfBirth),
      planStartDate: convertTimestamp(data.planStartDate),
      planEndDate: convertTimestamp(data.planEndDate),
      budget: {
        ...data.budget,
        lastUpdated: convertTimestamp(data.budget.lastUpdated),
      },
      createdAt: convertTimestamp(data.createdAt),
      updatedAt: convertTimestamp(data.updatedAt),
    } as Participant;
  },
};

const shiftConverter = {
  toFirestore: (shift: Shift) => {
    return {
      ...shift,
      scheduledStart: Timestamp.fromDate(shift.scheduledStart),
      scheduledEnd: Timestamp.fromDate(shift.scheduledEnd),
      actualStart: shift.actualStart ? Timestamp.fromDate(shift.actualStart) : null,
      actualEnd: shift.actualEnd ? Timestamp.fromDate(shift.actualEnd) : null,
    };
  },
  fromFirestore: (snapshot: QueryDocumentSnapshot<DocumentData>): Shift => {
    const data = snapshot.data();
    return {
      ...data,
      id: snapshot.id,
      scheduledStart: convertTimestamp(data.scheduledStart),
      scheduledEnd: convertTimestamp(data.scheduledEnd),
      actualStart: data.actualStart ? convertTimestamp(data.actualStart) : undefined,
      actualEnd: data.actualEnd ? convertTimestamp(data.actualEnd) : undefined,
    } as Shift;
  },
};

// ============================================
// CUSTOM HOOKS
// ============================================

/**
 * Hook to fetch and subscribe to participant data
 */
export function useParticipant(participantId: string) {
  const [participant, setParticipant] = useState<Participant | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!participantId) return;

    // In production, this would be:
    // const docRef = doc(db, 'participants', participantId).withConverter(participantConverter);
    // const unsubscribe = onSnapshot(docRef, (snapshot) => {
    //   if (snapshot.exists()) {
    //     setParticipant(snapshot.data());
    //   }
    //   setLoading(false);
    // }, (err) => {
    //   setError(err);
    //   setLoading(false);
    // });
    // return () => unsubscribe();

    // Mock implementation for development
    const t = setTimeout(() => { setLoading(false); setParticipant(null); }, 0);
    return () => clearTimeout(t);
  }, [participantId]);

  return { participant, loading, error };
}

/**
 * Hook to fetch upcoming shifts for a participant
 */
export function useUpcomingShifts(participantId: string, limitCount: number = 10) {
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!participantId) return;

    // In production:
    // const shiftsRef = collection(db, 'shifts');
    // const q = query(
    //   shiftsRef,
    //   where('participantId', '==', participantId),
    //   where('scheduledStart', '>=', Timestamp.now()),
    //   orderBy('scheduledStart', 'asc'),
    //   limit(limitCount)
    // ).withConverter(shiftConverter);
    
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const shiftsData = snapshot.docs.map(doc => doc.data());
    //   setShifts(shiftsData);
    //   setLoading(false);
    // }, (err) => {
    //   setError(err);
    //   setLoading(false);
    // });
    
    // return () => unsubscribe();

    const t = setTimeout(() => { setLoading(false); setShifts([]); }, 0);
    return () => clearTimeout(t);
  }, [participantId, limitCount]);

  return { shifts, loading, error };
}

/**
 * Hook to fetch care team members for a participant
 */
export function useCareTeam(participantId: string) {
  const [careTeam, setCareTeam] = useState<CareTeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!participantId) return;

    // In production:
    // const careTeamRef = collection(db, 'participants', participantId, 'careTeam');
    // const q = query(careTeamRef, orderBy('isPrimary', 'desc'));
    
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const teamData = snapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data()
    //   })) as CareTeamMember[];
    //   setCareTeam(teamData);
    //   setLoading(false);
    // }, (err) => {
    //   setError(err);
    //   setLoading(false);
    // });
    
    // return () => unsubscribe();

    const t = setTimeout(() => { setLoading(false); setCareTeam([]); }, 0);
    return () => clearTimeout(t);
  }, [participantId]);

  return { careTeam, loading, error };
}

/**
 * Hook to fetch timeline events (transparency feed)
 */
export function useTimelineEvents(participantId: string, limitCount: number = 20) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!participantId) return;

    // In production:
    // const eventsRef = collection(db, 'participants', participantId, 'timeline');
    // const q = query(
    //   eventsRef,
    //   orderBy('timestamp', 'desc'),
    //   limit(limitCount)
    // );
    
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const eventsData = snapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data(),
    //     timestamp: convertTimestamp(doc.data().timestamp)
    //   })) as TimelineEvent[];
    //   setEvents(eventsData);
    //   setLoading(false);
    // }, (err) => {
    //   setError(err);
    //   setLoading(false);
    // });
    
    // return () => unsubscribe();

    const t = setTimeout(() => { setLoading(false); setEvents([]); }, 0);
    return () => clearTimeout(t);
  }, [participantId, limitCount]);

  return { events, loading, error };
}

/**
 * Hook to fetch documents for a participant
 */
export function useDocuments(participantId: string) {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!participantId) return;

    // In production:
    // const docsRef = collection(db, 'participants', participantId, 'documents');
    // const q = query(docsRef, orderBy('uploadedAt', 'desc'));
    
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const docsData = snapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data(),
    //     uploadedAt: convertTimestamp(doc.data().uploadedAt)
    //   })) as DocumentType[];
    //   setDocuments(docsData);
    //   setLoading(false);
    // }, (err) => {
    //   setError(err);
    //   setLoading(false);
    // });
    
    // return () => unsubscribe();

    const t = setTimeout(() => { setLoading(false); setDocuments([]); }, 0);
    return () => clearTimeout(t);
  }, [participantId]);

  return { documents, loading, error };
}

/**
 * Hook to fetch notifications
 */
export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    // In production:
    // const notificationsRef = collection(db, 'users', userId, 'notifications');
    // const q = query(
    //   notificationsRef,
    //   orderBy('timestamp', 'desc'),
    //   limit(50)
    // );
    
    // const unsubscribe = onSnapshot(q, (snapshot) => {
    //   const notificationsData = snapshot.docs.map(doc => ({
    //     id: doc.id,
    //     ...doc.data(),
    //     timestamp: convertTimestamp(doc.data().timestamp)
    //   })) as Notification[];
    //   setNotifications(notificationsData);
    //   setUnreadCount(notificationsData.filter(n => !n.isRead).length);
    //   setLoading(false);
    // });
    
    // return () => unsubscribe();

    const t = setTimeout(() => { setLoading(false); }, 0);
    return () => clearTimeout(t);
  }, [userId]);

  return { notifications, unreadCount, loading };
}

/**
 * Hook to track caregiver location in real-time
 */
export function useCaregiverLocation(shiftId: string) {
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [eta, setEta] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('unknown');

  useEffect(() => {
    if (!shiftId) return;

    // In production, this would subscribe to real-time location updates:
    // const locationRef = doc(db, 'shifts', shiftId, 'tracking', 'current');
    // const unsubscribe = onSnapshot(locationRef, (snapshot) => {
    //   if (snapshot.exists()) {
    //     const data = snapshot.data();
    //     setLocation(data.coordinates);
    //     setEta(data.eta);
    //     setStatus(data.status);
    //   }
    // });
    // return () => unsubscribe();

  }, [shiftId]);

  return { location, eta, status };
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Calculate NDIS budget utilization
 */
export function calculateBudgetUtilization(budget: {
  total: number;
  used: number;
  remaining: number;
}): {
  percentage: number;
  status: 'healthy' | 'warning' | 'critical';
  message: string;
} {
  const percentage = Math.round((budget.used / budget.total) * 100);
  
  if (percentage < 70) {
    return {
      percentage,
      status: 'healthy',
      message: 'Your budget is on track'
    };
  } else if (percentage < 90) {
    return {
      percentage,
      status: 'warning',
      message: 'Consider reviewing your spending'
    };
  } else {
    return {
      percentage,
      status: 'critical',
      message: 'Budget nearly exhausted'
    };
  }
}

/**
 * Calculate days remaining in NDIS plan
 */
export function calculatePlanDaysRemaining(planEndDate: Date): number {
  const now = new Date();
  const diffTime = planEndDate.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Format shift duration
 */
export function formatShiftDuration(start: Date, end: Date): string {
  const diffMs = end.getTime() - start.getTime();
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours === 0) {
    return `${minutes}min`;
  } else if (minutes === 0) {
    return `${hours}hr`;
  }
  return `${hours}hr ${minutes}min`;
}

/**
 * Check if a rating should be escalated
 */
export function shouldEscalateRating(rating: number): boolean {
  return rating <= 2;
}

/**
 * Generate DEX-compliant session data
 */
export function generateDEXSessionData(shift: Shift, dexScore: {
  circumstance: number;
  goals: number;
  satisfaction: number;
}) {
  return {
    session_id: shift.id,
    slk_id: shift.participantId, // Would be actual SLK in production
    service_type: shift.serviceType,
    service_start: shift.actualStart || shift.scheduledStart,
    service_end: shift.actualEnd || shift.scheduledEnd,
    outcome_scores: {
      CIRCUMSTANCES: dexScore.circumstance,
      GOALS: dexScore.goals,
      SATISFACTION: dexScore.satisfaction,
    },
    overall_score: Math.round((dexScore.circumstance + dexScore.goals + dexScore.satisfaction) / 3 * 10) / 10,
  };
}
