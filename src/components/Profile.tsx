import { useState } from 'react';
import { useAuth, Position } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';

export default function Profile() {
  const { currentUser, updateUser } = useAuth();
  const { activities } = useActivity();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    fullName: currentUser?.fullName || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
  });
  const [saved, setSaved] = useState(false);

  if (!currentUser) return null;

  const positions: Position[] = [
    'Главный специалист',
    'Ведущий специалист',
    'Старший специалист',
    'Специалист 1 категории',
    'Специалист 2 категории',
    'Специалист',
    'Начальник отдела',
    'Заместитель начальника отдела',
    'Начальник управления',
    'Заместитель председателя',
    'Председатель',
    'Член комиссии',
  ];

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'owner':
        return <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-sm">ВЛАДЕЛЕЦ</span>;
      case 'admin':
        return <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-full shadow-sm">АДМИНИСТРАТОР</span>;
      case 'editor':
        return <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-full shadow-sm">РЕДАКТОР</span>;
      case 'viewer':
        return <span className="px-3 py-1 text-xs font-bold bg-gradient-to-r from-gray-400 to-gray-500 text-white rounded-full shadow-sm">ПРОСМОТР</span>;
      default:
        return null;
    }
  };

  const handleSave = () => {
    updateUser(currentUser.id, editData);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    return date.toLocaleDateString('ru-RU');
  };

  const myActivities = activities.filter(a => a.userId === currentUser.id).slice(0, 20);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Мой профиль</h2>
          <p className="text-gray-500 text-sm mt-1">Управление личной информацией</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-700 font-medium">Изменения сохранены</span>
          </div>
        )}
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6">
            <div className="w-24 h-24 md:w-28 md:h-28 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border-2 border-white/30">
              <span className="text-3xl md:text-4xl font-bold text-white">
                {currentUser.fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </span>
            </div>
            <div className="text-center md:text-left flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                <h3 className="text-xl md:text-2xl font-bold text-white">{currentUser.fullName}</h3>
                {getRoleBadge(currentUser.role)}
              </div>
              <p className="text-blue-200 text-sm">@{currentUser.username}</p>
              <p className="text-blue-100 text-sm mt-1">{currentUser.position} • {currentUser.department}</p>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-colors"
            >
              {isEditing ? 'Отмена' : 'Редактировать'}
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="p-6 md:p-8">
          {isEditing ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">ФИО</label>
                  <input
                    type="text"
                    value={editData.fullName}
                    onChange={(e) => setEditData({...editData, fullName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData({...editData, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
                  <input
                    type="tel"
                    value={editData.phone}
                    onChange={(e) => setEditData({...editData, phone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Должность</label>
                  <select
                    value={currentUser.position}
                    disabled
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                  >
                    {positions.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-400 mt-1">Должность может изменить только администратор</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
                >
                  Сохранить изменения
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Логин</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">@{currentUser.username}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Email</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">{currentUser.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Телефон</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">{currentUser.phone}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Должность</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">{currentUser.position}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Подразделение</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">{currentUser.department}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-medium">Дата регистрации</p>
                  <p className="text-sm font-medium text-gray-800 mt-1">{currentUser.createdAt}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Real Activity Log */}
      {myActivities.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Журнал активности</h3>
            <p className="text-xs text-gray-500 mt-0.5">Последние {myActivities.length} действий</p>
          </div>
          <div className="divide-y divide-gray-50">
            {myActivities.map((activity) => (
              <div key={activity.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{activity.description}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatTimestamp(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {myActivities.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-gray-400">Журнал активности пуст</p>
          <p className="text-xs text-gray-400 mt-1">Ваши действия будут отображаться здесь</p>
        </div>
      )}
    </div>
  );
}
