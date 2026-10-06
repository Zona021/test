import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login, users } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showHint, setShowHint] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username.trim()) {
      setError('Введите логин');
      return;
    }

    const success = login(username.trim(), password);
    if (!success) {
      setError('Неверный логин или пользователь деактивирован');
    }
  };

  const quickLogin = (user: string) => {
    setUsername(user);
    login(user, '');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-3xl"></div>
      </div>

      {/* Top strip */}
      <div className="absolute top-0 left-0 right-0 h-1 flex">
        <div className="flex-1 bg-white"></div>
        <div className="flex-1 bg-blue-500"></div>
        <div className="flex-1 bg-red-500"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/20">
            <svg viewBox="0 0 100 100" className="w-12 h-12">
              <circle cx="50" cy="50" r="48" fill="none" stroke="#c4a44a" strokeWidth="2"/>
              <text x="50" y="38" textAnchor="middle" fill="#c4a44a" fontSize="16" fontWeight="bold">ЦИК</text>
              <text x="50" y="56" textAnchor="middle" fill="#ffffff" fontSize="9">РОССИИ</text>
              <path d="M 25 68 Q 50 78 75 68" fill="none" stroke="#c4a44a" strokeWidth="1.5"/>
              <circle cx="50" cy="82" r="3" fill="#c4a44a"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white">Центральная избирательная комиссия</h1>
          <p className="text-blue-200 text-sm mt-1">Российской Федерации</p>
          <p className="text-blue-300 text-xs mt-2">Портал сотрудников</p>
        </div>

        {/* Login Form */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h2 className="text-xl font-semibold text-white mb-6">Вход в систему</h2>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Логин</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Введите логин"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-blue-100 mb-2">Пароль</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
                placeholder="Введите пароль"
              />
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 bg-red-500/20 border border-red-400/30 rounded-xl">
                <svg className="w-4 h-4 text-red-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-red-200">{error}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-white text-blue-800 font-semibold rounded-xl hover:bg-blue-50 transition-colors shadow-lg"
            >
              Войти
            </button>
          </form>

          {/* Quick access */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={() => setShowHint(!showHint)}
              className="w-full text-center text-sm text-blue-300 hover:text-blue-100 transition-colors"
            >
              {showHint ? 'Скрыть список' : 'Быстрый доступ (демо)'}
            </button>
            
            {showHint && (
              <div className="mt-4 space-y-2">
                <p className="text-xs text-blue-300 mb-2">Нажмите для быстрого входа:</p>
                {users.filter(u => u.isActive).map(user => (
                  <button
                    key={user.id}
                    onClick={() => quickLogin(user.username)}
                    className="w-full flex items-center justify-between px-3 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        user.role === 'owner' ? 'bg-amber-400' :
                        user.role === 'admin' ? 'bg-blue-400' :
                        user.role === 'editor' ? 'bg-green-400' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-sm text-white">@{user.username}</span>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      user.role === 'owner' ? 'bg-amber-500/20 text-amber-300' :
                      user.role === 'admin' ? 'bg-blue-500/20 text-blue-300' :
                      user.role === 'editor' ? 'bg-green-500/20 text-green-300' : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {user.role === 'owner' ? 'Владелец' : user.role === 'admin' ? 'Админ' : user.role === 'editor' ? 'Редактор' : 'Просмотр'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-blue-300/70">© 2026 ЦИК России. Все права защищены.</p>
          <p className="text-xs text-blue-300/50 mt-1">Версия системы 4.2.1</p>
        </div>
      </div>
    </div>
  );
}
