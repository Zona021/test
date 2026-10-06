import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth, Position } from './AuthContext';

export type RegistrationStatus = 'pending' | 'approved' | 'rejected';

export interface Registration {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  position: Position;
  department: string;
  reason: string;
  submittedAt: string;
  status: RegistrationStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
}

interface RegistrationsContextType {
  registrations: Registration[];
  pendingRegistrations: Registration[];
  submitRegistration: (reg: Omit<Registration, 'id' | 'submittedAt' | 'status'>) => void;
  approveRegistration: (regId: string, comment?: string) => void;
  rejectRegistration: (regId: string, comment: string) => void;
}

const initialRegistrations: Registration[] = [
  {
    id: '1',
    username: 'novikov_av',
    fullName: 'Новиков Александр Владимирович',
    email: 'novikov@cikrf.ru',
    phone: '+7 (495) 261-78-10',
    position: 'Специалист',
    department: 'Организационный отдел',
    reason: 'Необходимость доступа к системе для выполнения служебных обязанностей',
    submittedAt: '14.01.2026',
    status: 'pending',
  },
  {
    id: '2',
    username: 'fedorova_ek',
    fullName: 'Фёдорова Екатерина Константиновна',
    email: 'fedorova@cikrf.ru',
    phone: '+7 (495) 261-78-11',
    position: 'Ведущий специалист',
    department: 'Правовой департамент',
    reason: 'Назначение на должность, требуется доступ к документам',
    submittedAt: '13.01.2026',
    status: 'pending',
  },
];

const RegistrationsContext = createContext<RegistrationsContextType | undefined>(undefined);

export function RegistrationsProvider({ children }: { children: ReactNode }) {
  const { currentUser, addUser } = useAuth();
  const [registrations, setRegistrations] = useState<Registration[]>(initialRegistrations);

  const submitRegistration = (reg: Omit<Registration, 'id' | 'submittedAt' | 'status'>) => {
    const newReg: Registration = {
      ...reg,
      id: String(Date.now()),
      submittedAt: new Date().toLocaleDateString('ru-RU'),
      status: 'pending',
    };
    setRegistrations(prev => [...prev, newReg]);
  };

  const approveRegistration = (regId: string, comment?: string) => {
    if (!currentUser) return;
    const reg = registrations.find(r => r.id === regId);
    if (!reg) return;
    
    // Create user account
    addUser({
      username: reg.username,
      fullName: reg.fullName,
      email: reg.email,
      phone: reg.phone,
      role: 'viewer',
      position: reg.position,
      department: reg.department,
      isActive: true,
    });

    setRegistrations(prev => prev.map(r => 
      r.id === regId 
        ? { ...r, status: 'approved' as RegistrationStatus, reviewedBy: currentUser.username, reviewedAt: new Date().toLocaleDateString('ru-RU'), reviewComment: comment }
        : r
    ));
  };

  const rejectRegistration = (regId: string, comment: string) => {
    if (!currentUser) return;
    setRegistrations(prev => prev.map(r => 
      r.id === regId 
        ? { ...r, status: 'rejected' as RegistrationStatus, reviewedBy: currentUser.username, reviewedAt: new Date().toLocaleDateString('ru-RU'), reviewComment: comment }
        : r
    ));
  };

  const pendingRegistrations = registrations.filter(r => r.status === 'pending');

  return (
    <RegistrationsContext.Provider value={{ registrations, pendingRegistrations, submitRegistration, approveRegistration, rejectRegistration }}>
      {children}
    </RegistrationsContext.Provider>
  );
}

export function useRegistrations() {
  const context = useContext(RegistrationsContext);
  if (!context) throw new Error('useRegistrations must be used within RegistrationsProvider');
  return context;
}
