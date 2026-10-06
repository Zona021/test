import { useState } from 'react';

interface HeaderProps {
  onMenuToggle: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const notifications = [
    { id: 1, text: 'Новое постановление №247-П от 15.01.2026', time: '10 мин назад', type: 'important' },
    { id: 2, text: 'Обновлены данные по участкам', time: '1 час назад', type: 'info' },
    { id: 3, text: 'Заседание комиссии перенесено на 18:00', time: '3 часа назад', type: 'warning' },
  ];

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      {/* Top colored strip */}
      <div className="h-1 flex">
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-blue-700"></div>
        <div className="flex-1 bg-red-600"></div>
      </div>
      
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          <div className="flex items-center gap-3">
            {/* Emblem */}
            <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full">
                <circle cx="50" cy="50" r="48" fill="#1e3a5f" stroke="#c4a44a" strokeWidth="2"/>
                <text x="50" y="38" textAnchor="middle" fill="#c4a44a" fontSize="14" fontWeight="bold">ЦИК</text>
                <text x="50" y="55" textAnchor="middle" fill="#ffffff" fontSize="8">РОССИИ</text>
                <path d="M 25 65 Q 50 75 75 65" fill="none" stroke="#c4a44a" strokeWidth="1.5"/>
                <circle cx="50" cy="80" r="3" fill="#c4a44a"/>
              </svg>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg md:text-xl font-bold text-gray-800 leading-tight">
                Центральная избирательная комиссия
              </h1>
              <p className="text-xs text-gray-500">Российской Федерации</p>
            </div>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Search */}
          <div className="hidden lg:flex items-center bg-gray-100 rounded-lg px-3 py-2">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Поиск..."
              className="bg-transparent text-sm outline-none w-48"
            />
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <h3 className="font-semibold text-gray-800">Уведомления</h3>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {notifications.map(n => (
                    <div key={n.id} className="p-4 border-b border-gray-50 hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start gap-3">
                        <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                          n.type === 'important' ? 'bg-red-500' : n.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`}></div>
                        <div>
                          <p className="text-sm text-gray-700">{n.text}</p>
                          <p className="text-xs text-gray-400 mt-1">{n.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">ИП</span>
              </div>
              <span className="hidden md:block text-sm text-gray-700 font-medium">Иванов П.С.</span>
            </button>
            
            {showProfile && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                  <p className="font-medium text-gray-800">Иванов Пётр Сергеевич</p>
                  <p className="text-xs text-gray-500">Главный специалист</p>
                </div>
                <div className="py-2">
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Мой профиль
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.313c.725-1.024 2.352-1.024 3.077 0a1.999 1.999 0 002.502.579 1.999 1.999 0 012.502 2.502 1.999 1.999 0 00.579 2.502c1.024.725 1.024 2.352 0 3.077a1.999 1.999 0 00-.579 2.502 1.999 1.999 0 01-2.502 2.502 1.999 1.999 0 00-2.502.579c-1.024.725-2.352 1.024-3.077 0a1.999 1.999 0 00-2.502-.579 1.999 1.999 0 01-2.502-2.502 1.999 1.999 0 00-.579-2.502c-1.024-.725-1.024-2.352 0-3.077a1.999 1.999 0 00.579-2.502 1.999 1.999 0 012.502-2.502 1.999 1.999 0 002.502-.579z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Настройки
                  </button>
                  <hr className="my-2 border-gray-100" />
                  <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Выйти
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
