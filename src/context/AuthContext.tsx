import { createContext, useContext, useState, ReactNode } from 'react';

export type Role = 'owner' | 'admin' | 'editor' | 'viewer';

export type Position = 
  | 'Главный специалист'
  | 'Ведущий специалист'
  | 'Старший специалист'
  | 'Специалист 1 категории'
  | 'Специалист 2 категории'
  | 'Специалист'
  | 'Начальник отдела'
  | 'Заместитель начальника отдела'
  | 'Начальник управления'
  | 'Заместитель председателя'
  | 'Председатель'
  | 'Член комиссии';

export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: Role;
  position: Position;
  department: string;
  avatar?: string;
  createdAt: string;
  lastLogin: string;
  isActive: boolean;
}

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  login: (username: string, password: string) => boolean;
  logout: () => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  deleteUser: (userId: string) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => void;
  changeUserRole: (userId: string, newRole: Role) => void;
  changeUserPosition: (userId: string, newPosition: Position) => void;
  changeUserDepartment: (userId: string, newDepartment: string) => void;
  hasPermission: (permission: Permission) => boolean;
}

export type Permission = 
  | 'manage_users'
  | 'manage_roles'
  | 'manage_positions'
  | 'edit_documents'
  | 'delete_documents'
  | 'view_statistics'
  | 'edit_news'
  | 'manage_settings'
  | 'manage_contacts'
  | 'manage_calendar'
  | 'assign_tasks'
  | 'review_documents'
  | 'review_registrations';

const rolePermissions: Record<Role, Permission[]> = {
  owner: ['manage_users', 'manage_roles', 'manage_positions', 'edit_documents', 'delete_documents', 'view_statistics', 'edit_news', 'manage_settings', 'manage_contacts', 'manage_calendar', 'assign_tasks', 'review_documents', 'review_registrations'],
  admin: ['manage_users', 'manage_positions', 'edit_documents', 'delete_documents', 'view_statistics', 'edit_news', 'manage_settings', 'manage_calendar', 'assign_tasks', 'review_documents', 'review_registrations'],
  editor: ['edit_documents', 'view_statistics', 'edit_news'],
  viewer: ['view_statistics'],
};

const initialUsers: User[] = [
  {
    id: '1',
    username: 'Zona',
    fullName: 'Зонов Алексей Викторович',
    email: 'zona@cikrf.ru',
    phone: '+7 (495) 261-78-00',
    role: 'owner',
    position: 'Председатель',
    department: 'Аппарат ЦИК России',
    createdAt: '2020-03-15',
    lastLogin: '2026-01-15',
    isActive: true,
  },
  {
    id: '2',
    username: 'ivanov_ps',
    fullName: 'Иванов Пётр Сергеевич',
    email: 'ivanov@cikrf.ru',
    phone: '+7 (495) 261-78-01',
    role: 'admin',
    position: 'Начальник отдела',
    department: 'Организационный отдел',
    createdAt: '2021-06-10',
    lastLogin: '2026-01-15',
    isActive: true,
  },
  {
    id: '3',
    username: 'smirnova_ev',
    fullName: 'Смирнова Елена Владимировна',
    email: 'smirnova@cikrf.ru',
    phone: '+7 (495) 261-78-02',
    role: 'editor',
    position: 'Ведущий специалист',
    department: 'Правовой департамент',
    createdAt: '2022-01-20',
    lastLogin: '2026-01-14',
    isActive: true,
  },
  {
    id: '4',
    username: 'kozlov_an',
    fullName: 'Козлов Андрей Николаевич',
    email: 'kozlov@cikrf.ru',
    phone: '+7 (495) 261-78-03',
    role: 'editor',
    position: 'Старший специалист',
    department: 'Департамент по работе с ГАС «Выборы»',
    createdAt: '2022-09-05',
    lastLogin: '2026-01-13',
    isActive: true,
  },
  {
    id: '5',
    username: 'petrova_mi',
    fullName: 'Петрова Мария Ивановна',
    email: 'petrova@cikrf.ru',
    phone: '+7 (495) 261-78-04',
    role: 'viewer',
    position: 'Специалист 1 категории',
    department: 'Контрольно-ревизионная служба',
    createdAt: '2023-04-12',
    lastLogin: '2026-01-12',
    isActive: true,
  },
  {
    id: '6',
    username: 'volkov_ds',
    fullName: 'Волков Дмитрий Сергеевич',
    email: 'volkov@cikrf.ru',
    phone: '+7 (495) 261-78-05',
    role: 'viewer',
    position: 'Специалист',
    department: 'Пресс-служба',
    createdAt: '2024-02-28',
    lastLogin: '2026-01-10',
    isActive: false,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(initialUsers[1]); // Default logged in as Ivanov
  const [users, setUsers] = useState<User[]>(initialUsers);

  const login = (username: string, _password: string): boolean => {
    const user = users.find(u => u.username === username && u.isActive);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
  };

  const deleteUser = (userId: string) => {
    if (userId === currentUser?.id) return; // Can't delete yourself
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const addUser = (user: Omit<User, 'id' | 'createdAt' | 'lastLogin'>) => {
    const newUser: User = {
      ...user,
      id: String(Date.now()),
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: new Date().toISOString().split('T')[0],
    };
    setUsers(prev => [...prev, newUser]);
  };

  const changeUserRole = (userId: string, newRole: Role) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
  };

  const changeUserPosition = (userId: string, newPosition: Position) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, position: newPosition } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, position: newPosition } : null);
    }
  };

  const changeUserDepartment = (userId: string, newDepartment: string) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, department: newDepartment } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, department: newDepartment } : null);
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!currentUser) return false;
    return rolePermissions[currentUser.role].includes(permission);
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      users,
      login,
      logout,
      updateUser,
      deleteUser,
      addUser,
      changeUserRole,
      changeUserPosition,
      changeUserDepartment,
      hasPermission,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
