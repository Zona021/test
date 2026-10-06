import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ activeSection, onSectionChange, isOpen, onClose }: SidebarProps) {
  const { currentUser, hasPermission } = useAuth();

  const mainMenuItems = [
    { id: 'dashboard', label: 'Главная', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { id: 'news', label: 'Новости', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
    { id: 'documents', label: 'Документы', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    { id: 'statistics', label: 'Статистика', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'calendar', label: 'Календарь', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { id: 'contacts', label: 'Контакты', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  const adminMenuItems: typeof mainMenuItems = hasPermission('manage_users') ? [
    { id: 'users', label: 'Пользователи', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ] : [];

  const personalMenuItems = [
    { id: 'profile', label: 'Мой профиль', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
    { id: 'settings', label: 'Настройки', icon: 'M10.325 4.313c.725-1.024 2.352-1.024 3.077 0a1.999 1.999 0 002.502.579 1.999 1.999 0 012.502 2.502 1.999 1.999 0 00.579 2.502c1.024.725 1.024 2.352 0 3.077a1.999 1.999 0 00-.579 2.502 1.999 1.999 0 01-2.502 2.502 1.999 1.999 0 00-2.502.579c-1.024.725-2.352 1.024-3.077 0a1.999 1.999 0 00-2.502-.579 1.999 1.999 0 01-2.502-2.502 1.999 1.999 0 00-.579-2.502c-1.024-.725-1.024-2.352 0-3.077a1.999 1.999 0 00.579-2.502 1.999 1.999 0 012.502-2.502 1.999 1.999 0 002.502-.579z' },
    { id: 'registration', label: 'Регистрация', icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' },
  ];

  // Listen for navigation events from Header
  useEffect(() => {
    const handleNavigate = (e: Event) => {
      const customEvent = e as CustomEvent;
      onSectionChange(customEvent.detail);
    };
    window.addEventListener('navigate', handleNavigate);
    return () => window.removeEventListener('navigate', handleNavigate);
  }, [onSectionChange]);

  const handleItemClick = (id: string) => {
    onSectionChange(id);
    onClose();
  };

  const allMenuItems = [
    ...mainMenuItems,
    ...adminMenuItems,
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        ></div>
      )}
      
      <aside className={`
        fixed md:fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-lg md:shadow-sm
        transform transition-transform duration-300 ease-in-out z-50
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="pt-20 pb-6 px-4 overflow-y-auto h-full">
          {/* Main navigation */}
          <nav className="space-y-1">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-4 mb-2">Навигация</p>
            {allMenuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeSection === item.id
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeSection === item.id ? 2 : 1.5} d={item.icon} />
                </svg>
                {item.label}
                {item.id === 'users' && (
                  <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-amber-100 text-amber-700 rounded">
                    {currentUser?.role === 'owner' ? 'ВЛАДЕЛЕЦ' : 'АДМИН'}
                  </span>
                )}
                {activeSection === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </nav>

          {/* Personal section */}
          <div className="mt-6">
            <nav className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold px-4 mb-2">Личное</p>
              {personalMenuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeSection === item.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeSection === item.id ? 2 : 1.5} d={item.icon} />
                  </svg>
                  {item.label}
                  {activeSection === item.id && (
                    <div className="ml-auto w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Bottom info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100 bg-white">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-medium text-gray-600">Система активна</span>
            </div>
            <p className="text-xs text-gray-500">Версия системы: 4.2.1</p>
            <p className="text-xs text-gray-500">Последнее обновление: 15.01.2026</p>
          </div>
        </div>
      </aside>
    </>
  );
}
