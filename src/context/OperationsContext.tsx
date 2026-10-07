import { createContext, useContext, useState, ReactNode } from 'react';

export interface Protocol {
  id: string;
  number: string;
  uikNumber: string;
  createdAt: string;
  createdBy: string;
  createdByName: string;
  status: 'draft' | 'submitted' | 'approved';
  data: {
    totalVoters: number;
    receivedBallots: number;
    votedEarly: number;
    votedHome: number;
    spoiledBallots: number;
    totalVoted: number;
  };
}

export interface Report {
  id: string;
  title: string;
  type: 'turnout' | 'processing' | 'complaints' | 'summary';
  createdAt: string;
  createdBy: string;
  createdByName: string;
  period: string;
  data: Record<string, any>;
}

export interface DataEntry {
  id: string;
  type: 'voter_list' | 'uik_data' | 'candidate_data';
  targetId: string;
  fieldName: string;
  oldValue: string;
  newValue: string;
  changedAt: string;
  changedBy: string;
  changedByName: string;
}

interface OperationsContextType {
  protocols: Protocol[];
  reports: Report[];
  dataEntries: DataEntry[];
  createProtocol: (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status'>) => void;
  updateProtocol: (id: string, updates: Partial<Protocol>) => void;
  createReport: (report: Omit<Report, 'id' | 'createdAt'>) => void;
  addDataEntry: (entry: Omit<DataEntry, 'id' | 'changedAt'>) => void;
}

const OperationsContext = createContext<OperationsContextType | undefined>(undefined);

export function OperationsProvider({ children }: { children: ReactNode }) {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [dataEntries, setDataEntries] = useState<DataEntry[]>([]);

  const createProtocol = (protocol: Omit<Protocol, 'id' | 'createdAt' | 'status'>) => {
    const newProtocol: Protocol = {
      ...protocol,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
      status: 'draft',
    };
    setProtocols(prev => [newProtocol, ...prev]);
  };

  const updateProtocol = (id: string, updates: Partial<Protocol>) => {
    setProtocols(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const createReport = (report: Omit<Report, 'id' | 'createdAt'>) => {
    const newReport: Report = {
      ...report,
      id: String(Date.now()),
      createdAt: new Date().toISOString(),
    };
    setReports(prev => [newReport, ...prev]);
  };

  const addDataEntry = (entry: Omit<DataEntry, 'id' | 'changedAt'>) => {
    const newEntry: DataEntry = {
      ...entry,
      id: String(Date.now()),
      changedAt: new Date().toISOString(),
    };
    setDataEntries(prev => [newEntry, ...prev]);
  };

  return (
    <OperationsContext.Provider value={{
      protocols,
      reports,
      dataEntries,
      createProtocol,
      updateProtocol,
      createReport,
      addDataEntry,
    }}>
      {children}
    </OperationsContext.Provider>
  );
}

export function useOperations() {
  const context = useContext(OperationsContext);
  if (!context) {
    throw new Error('useOperations must be used within OperationsProvider');
  }
  return context;
}
