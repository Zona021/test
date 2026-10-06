import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type DocStatus = 'pending' | 'approved' | 'rejected';

export interface Document {
  id: string;
  title: string;
  category: string;
  description: string;
  format: string;
  size: string;
  uploadedBy: string;
  uploadedAt: string;
  status: DocStatus;
  reviewedBy?: string;
  reviewedAt?: string;
  reviewComment?: string;
}

interface DocumentsContextType {
  documents: Document[];
  pendingDocuments: Document[];
  approvedDocuments: Document[];
  addDocument: (doc: Omit<Document, 'id' | 'uploadedAt' | 'status'>) => void;
  approveDocument: (docId: string, comment?: string) => void;
  rejectDocument: (docId: string, comment: string) => void;
  deleteDocument: (docId: string) => void;
}

const initialDocuments: Document[] = [
  { id: '1', title: 'Федеральный закон №67-ФЗ «Об основных гарантиях избирательных прав»', category: 'laws', description: 'Основной закон о выборах', format: 'PDF', size: '2.4 МБ', uploadedBy: 'Zona', uploadedAt: '12.06.2002', status: 'approved' },
  { id: '2', title: 'Постановление ЦИК России №247/5678-7 «О порядке финансирования»', category: 'decrees', description: 'Порядок финансирования избирательных кампаний', format: 'PDF', size: '856 КБ', uploadedBy: 'Zona', uploadedAt: '10.01.2026', status: 'approved' },
  { id: '3', title: 'Инструкция по заполнению формы протокола УИК', category: 'instructions', description: 'Порядок заполнения протоколов', format: 'DOCX', size: '3.2 МБ', uploadedBy: 'ivanov_ps', uploadedAt: '05.01.2026', status: 'approved' },
  { id: '4', title: 'Шаблон протокола УИК об итогах голосования', category: 'templates', description: 'Форма для ПЭВМ', format: 'XLSX', size: '456 КБ', uploadedBy: 'ivanov_ps', uploadedAt: '03.01.2026', status: 'approved' },
  { id: '5', title: 'Методические рекомендации по организации видеонаблюдения', category: 'instructions', description: 'Рекомендации для ТИК и УИК', format: 'PDF', size: '2.7 МБ', uploadedBy: 'smirnova_ev', uploadedAt: '15.12.2025', status: 'approved' },
];

const DocumentsContext = createContext<DocumentsContextType | undefined>(undefined);

export function DocumentsProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [documents, setDocuments] = useState<Document[]>(initialDocuments);

  const addDocument = (doc: Omit<Document, 'id' | 'uploadedAt' | 'status'>) => {
    const newDoc: Document = {
      ...doc,
      id: String(Date.now()),
      uploadedAt: new Date().toLocaleDateString('ru-RU'),
      status: 'pending',
    };
    setDocuments(prev => [...prev, newDoc]);
  };

  const approveDocument = (docId: string, comment?: string) => {
    if (!currentUser) return;
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, status: 'approved' as DocStatus, reviewedBy: currentUser.username, reviewedAt: new Date().toLocaleDateString('ru-RU'), reviewComment: comment }
        : doc
    ));
  };

  const rejectDocument = (docId: string, comment: string) => {
    if (!currentUser) return;
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, status: 'rejected' as DocStatus, reviewedBy: currentUser.username, reviewedAt: new Date().toLocaleDateString('ru-RU'), reviewComment: comment }
        : doc
    ));
  };

  const deleteDocument = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const pendingDocuments = documents.filter(d => d.status === 'pending');
  const approvedDocuments = documents.filter(d => d.status === 'approved');

  return (
    <DocumentsContext.Provider value={{ documents, pendingDocuments, approvedDocuments, addDocument, approveDocument, rejectDocument, deleteDocument }}>
      {children}
    </DocumentsContext.Provider>
  );
}

export function useDocuments() {
  const context = useContext(DocumentsContext);
  if (!context) throw new Error('useDocuments must be used within DocumentsProvider');
  return context;
}
