import { createContext, useContext, useState, ReactNode } from 'react';

export type TaskStatus = 'pending' | 'in_progress' | 'completed';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToName: string;
  assignedBy: string;
  assignedByName: string;
  priority: TaskPriority;
  status: TaskStatus;
  deadline: string;
  createdAt: string;
  completedAt?: string;
}

interface TasksContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  deleteTask: (taskId: string) => void;
  getTasksByUser: (userId: string) => Task[];
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Проверка протоколов УИК №1247',
    description: 'Проверить корректность заполнения протоколов',
    assignedTo: '2',
    assignedToName: 'Иванов П.С.',
    assignedBy: '1',
    assignedByName: 'Зонов А.В.',
    priority: 'high',
    status: 'in_progress',
    deadline: '2026-01-16',
    createdAt: '2026-01-14',
  },
  {
    id: '2',
    title: 'Подготовка отчёта по явке',
    description: 'Сформировать сводный отчёт по явке избирателей',
    assignedTo: '2',
    assignedToName: 'Иванов П.С.',
    assignedBy: '1',
    assignedByName: 'Зонов А.В.',
    priority: 'medium',
    status: 'pending',
    deadline: '2026-01-17',
    createdAt: '2026-01-14',
  },
  {
    id: '3',
    title: 'Согласование списка наблюдателей',
    description: 'Проверить и согласовать список аккредитованных наблюдателей',
    assignedTo: '3',
    assignedToName: 'Смирнова Е.В.',
    assignedBy: '2',
    assignedByName: 'Иванов П.С.',
    priority: 'low',
    status: 'completed',
    deadline: '2026-01-14',
    createdAt: '2026-01-12',
    completedAt: '2026-01-14',
  },
];

const TasksContext = createContext<TasksContextType | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'status'>) => {
    const newTask: Task = {
      ...task,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
      status: 'pending',
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, status, completedAt: status === 'completed' ? new Date().toISOString().split('T')[0] : undefined }
        : task
    ));
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const getTasksByUser = (userId: string) => {
    return tasks.filter(task => task.assignedTo === userId);
  };

  return (
    <TasksContext.Provider value={{
      tasks,
      addTask,
      updateTaskStatus,
      deleteTask,
      getTasksByUser,
    }}>
      {children}
    </TasksContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error('useTasks must be used within TasksProvider');
  }
  return context;
}
