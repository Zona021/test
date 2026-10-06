import { createContext, useContext, useState, ReactNode } from 'react';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Document {
  id: string;
  title: string;
  description: string;
  category: string;
  format: string;
  size: string;
  uploadedBy: string;
  uploadedByName: string;
  uploadedAt: string;
  status: DocumentStatus;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  fileContent?: string;
  fileName?: string;
}

interface DocumentsContextType {
  documents: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt' | 'status'>) => void;
  approveDocument: (docId: string, approvedBy: string) => void;
  rejectDocument: (docId: string, reason: string) => void;
  deleteDocument: (docId: string) => void;
}

const initialDocuments: Document[] = [
  {
    id: '1',
    title: 'Федеральный закон №67-ФЗ «Об основных гарантиях избирательных прав»',
    description: 'Основной закон о выборах',
    category: 'laws',
    format: 'PDF',
    size: '2.4 МБ',
    uploadedBy: '1',
    uploadedByName: 'Зонов А.В.',
    uploadedAt: '2020-06-12',
    status: 'approved',
    approvedBy: '1',
    approvedAt: '2020-06-12',
  },
  {
    id: '2',
    title: 'Постановление ЦИК России №247/5678-7 «О порядке финансирования»',
    description: 'Порядок финансирования избирательных кампаний',
    category: 'decrees',
    format: 'PDF',
    size: '856 КБ',
    uploadedBy: '2',
    uploadedByName: 'Иванов П.С.',
    uploadedAt: '2026-01-10',
    status: 'approved',
    approvedBy: '1',
    approvedAt: '2026-01-11',
  },
  {
    id: '3',
    title: 'Инструкция по заполнению формы протокола УИК',
    description: 'Методические указания по работе с протоколами',
    category: 'instructions',
    format: 'DOCX',
    size: '3.2 МБ',
    uploadedBy: '3',
    uploadedByName: 'Смирнова Е.В.',
    uploadedAt: '2026-01-05',
    status: 'approved',
    approvedBy: '2',
    approvedAt: '2026-01-06',
  },
];

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const addDocument = (doc: Omit<Document, 'id' | 'uploadedAt' | 'status'>) => {
    const newDoc: Document = {
      ...doc,
      id: String(Date.now()),
      uploadedAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const approveDocument = (docId: string, approvedBy: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, status: 'approved', approvedBy, approvedAt: new Date().toISOString().split('T')[0] }
        : doc
    ));
  };

  const rejectDocument = (docId: string, reason: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, status: 'rejected', rejectionReason: reason }
        : doc
    ));
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  return (
    <DocumentsContext.Provider value={{
      documents,
      addDocument,
      approveDocument,
      rejectDocument,
      deleteDocument,
    }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (!context) {
    throw new Error('useDocuments must be used within DocumentsProvider');
  }
  return context;
}
