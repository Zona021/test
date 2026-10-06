import { createContext, useContext, useState, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedBy: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  createdAt: string;
  completedAt?: string;
}

interface TasksContextType {
  tasks: Task[];
  myTasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
}

const initialTasks: Task[] = [
  { id: '1', title: 'Проверка протоколов УИК №1247', description: 'Проверить корректность заполнения протоколов', assignedTo: 'ivanov_ps', assignedBy: 'Zona', priority: 'high', status: 'in_progress', deadline: '16.01.2026', createdAt: '14.01.2026' },
  { id: '2', title: 'Подготовка отчёта по явке', description: 'Сформировать отчёт о явке избирателей', assignedTo: 'ivanov_ps', assignedBy: 'Zona', priority: 'medium', status: 'pending', deadline: '17.01.2026', createdAt: '14.01.2026' },
  { id: '3', title: 'Согласование списка наблюдателей', description: 'Проверить и согласовать список наблюдателей', assignedTo: 'smirnova_ev', assignedBy: 'Zona', priority: 'low', status: 'completed', deadline: '14.01.2026', createdAt: '12.01.2026', completedAt: '13.01.2026' },
  { id: '4', title: 'Обновление реестра кандидатов', description: 'Внести изменения в реестр кандидатов', assignedTo: 'kozlov_an', assignedBy: 'Zona', priority: 'high', status: 'in_progress', deadline: '18.01.2026', createdAt: '15.01.2026' },
  { id: '5', title: 'Проверка подписных листов', description: 'Проверить подлинность подписных листов', assignedTo: 'petrova_mi', assignedBy: 'ivanov_ps', priority: 'medium', status: 'pending', deadline: '19.01.2026', createdAt: '15.01.2026' },
];

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: String(Date.now()),
      createdAt: new Date().toLocaleDateString('ru-RU'),
      status: 'pending',
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status, completedAt: status === 'completed' ? new Date().toLocaleDateString('ru-RU') : undefined }
        : task
    ));
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => task.id === taskId ? { ...task, ...updates } : task));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const myTasks = currentUser ? tasks.filter(t => t.assignedTo === currentUser.username) : [];

  return (
    <TasksContext.Provider value={{ tasks, myTasks, addTask, updateTaskStatus, deleteTask, updateTask }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) throw new Error('useTasks must be used within TasksProvider');
  return context;
}
