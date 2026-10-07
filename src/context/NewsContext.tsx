import { createContext, useContext, useState, ReactNode } from 'react';

export type NewsCategory = 'official' | 'announcements' | 'legislation';

export interface NewsItem {
  id: string;
  category: NewsCategory;
  title: string;
  summary: string;
  date: string;
  author: string;
  authorId: string;
  emoji: string;
  important: boolean;
}

interface NewsContextType {
  news: NewsItem[];
  addNews: (item: Omit<NewsItem, 'id' | 'date'>) => void;
  deleteNews: (id: string) => void;
  toggleImportant: (id: string) => void;
}

const NewsContext = createContext<NewsContextType | undefined>(undefined);

export function NewsProvider({ children }: { children: ReactNode }) {
  const [news, setNews] = useState<NewsItem[]>([]);

  const addNews = (item: Omit<NewsItem, 'id' | 'date'>) => {
    const newItem: NewsItem = {
      ...item,
      id: String(Date.now()),
      date: new Date().toLocaleDateString('ru-RU', { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
      }),
    };
    setNews(prev => [newItem, ...prev]);
  };

  const deleteNews = (id: string) => {
    setNews(prev => prev.filter(n => n.id !== id));
  };

  const toggleImportant = (id: string) => {
    setNews(prev => prev.map(n => n.id === id ? { ...n, important: !n.important } : n));
  };

  return (
    <NewsContext.Provider value={{ news, addNews, deleteNews, toggleImportant }}>
      {children}
    </NewsContext.Provider>
  );
}

export function useNews() {
  const context = useContext(NewsContext);
  if (!context) {
    throw new Error('useNews must be used within NewsProvider');
  }
  return context;
}
