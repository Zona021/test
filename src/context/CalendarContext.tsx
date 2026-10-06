import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type EventType = 'meeting' | 'work' | 'video' | 'seminar' | 'deadline' | 'other';

export interface CalendarEvent {
  id: string;
  title: string;
  date: number;
  month: number;
  year: number;
  time: string;
  type: EventType;
  location: string;
  createdBy: string;
  description?: string;
}

interface CalendarContextType {
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id' | 'createdBy'>) => void;
  deleteEvent: (eventId: string) => void;
  updateEvent: (eventId: string, updates: Partial<CalendarEvent>) => void;
}

const initialEvents: CalendarEvent[] = [
  { id: '1', title: 'Заседание ЦИК России', date: 15, month: 0, year: 2026, time: '10:00', type: 'meeting', location: 'Зал заседаний', createdBy: 'Zona', description: 'Рассмотрение вопросов подготовки к выборам' },
  { id: '2', title: 'Проверка протоколов УИК', date: 16, month: 0, year: 2026, time: '09:00 - 18:00', type: 'work', location: 'Кабинет 312', createdBy: 'Zona' },
  { id: '3', title: 'Видеоконференция с ТИК', date: 18, month: 0, year: 2026, time: '14:00', type: 'video', location: 'Онлайн', createdBy: 'Zona' },
  { id: '4', title: 'Семинар для членов ТИК', date: 20, month: 0, year: 2026, time: '10:00 - 16:00', type: 'seminar', location: 'Конференц-зал', createdBy: 'Zona', description: 'Обучение работе с ГАС «Выборы»' },
  { id: '5', title: 'Срок подачи документов', date: 22, month: 0, year: 2026, time: 'до 18:00', type: 'deadline', location: '', createdBy: 'Zona' },
  { id: '6', title: 'Рабочая группа по ГАС', date: 25, month: 0, year: 2026, time: '11:00', type: 'meeting', location: 'Зал 5', createdBy: 'Zona' },
  { id: '7', title: 'Подготовка отчётности', date: 27, month: 0, year: 2026, time: 'Весь день', type: 'work', location: '', createdBy: 'Zona' },
  { id: '8', title: 'Коллегия ЦИК', date: 30, month: 0, year: 2026, time: '15:00', type: 'meeting', location: 'Большой зал', createdBy: 'Zona' },
];

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);

  const addEvent = (event: Omit<CalendarEvent, 'id' | 'createdBy'>) => {
    if (!currentUser) return;
    const newEvent: CalendarEvent = {
      ...event,
      id: String(Date.now()),
      createdBy: currentUser.username,
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const deleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
  };

  const updateEvent = (eventId: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...updates } : e));
  };

  return (
    <CalendarContext.Provider value={{ events, addEvent, deleteEvent, updateEvent }}>
      {children}
    </CalendarContext.Provider>
  );
}

export function useCalendar() {
  const context = useContext(CalendarContext);
  if (!context) throw new Error('useCalendar must be used within CalendarProvider');
  return context;
}
