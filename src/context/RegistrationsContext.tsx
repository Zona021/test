import { createContext, useContext, useState, ReactNode } from 'react';

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface Registration {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  reason: string;
  status: RegistrationStatus;
  submittedAt: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rejectionReason?: string;
}

interface RegistrationsContextType {
  registrations: Registration[];
  submitRegistration: (reg: Omit<Registration, 'id' | 'submittedAt' | 'status'>) => void;
  approveRegistration: (regId: string, reviewedBy: string) => void;
  rejectRegistration: (regId: string, reason: string) => void;
}

const RegistrationsContext = createContext<RegistrationsContextType | undefined>(undefined);

export function RegistrationsProvider({ children }: { children: ReactNode }) {
  const [registrations, setRegistrations] = useState<Registration[]>([]);

  const submitRegistration = (reg: Omit<Registration, 'id' | 'submittedAt' | 'status'>) => {
    const newReg: Registration = {
      ...reg,
      id: String(Date.now()),
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setRegistrations(prev => [...prev, newReg]);
  };

  const approveRegistration = (regId: string, reviewedBy: string) => {
    setRegistrations(prev => prev.map(reg =>
      reg.id === regId
        ? { ...reg, status: 'approved', reviewedBy, reviewedAt: new Date().toISOString().split('T')[0] }
        : reg
    ));
  };

  const rejectRegistration = (regId: string, reason: string) => {
    setRegistrations(prev => prev.map(reg =>
      reg.id === regId
        ? { ...reg, status: 'rejected', reviewedBy: '', reviewedAt: new Date().toISOString().split('T')[0], rejectionReason: reason }
        : reg
    ));
  };

  return (
    <RegistrationsContext.Provider value={{
      registrations,
      submitRegistration,
      approveRegistration,
      rejectRegistration,
    }}>
      {children}
    </RegistrationsContext.Provider>
  );
}

export function useRegistrations() {
  const context = useContext(RegistrationsContext);
  if (!context) {
    throw new Error('useRegistrations must be used within RegistrationsProvider');
  }
  return context;
}
