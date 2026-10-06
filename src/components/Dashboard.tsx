export default function Dashboard() {
  const stats = [
    { label: 'Избирательных участков', value: '97 248', change: '+12', icon: '🏛️', color: 'from-blue-500 to-blue-600' },
    { label: 'Избирателей в списках', value: '109 432 567', change: '+234 120', icon: '👥', color: 'from-indigo-500 to-indigo-600' },
    { label: 'Активных кампаний', value: '3', change: '0', icon: '📋', color: 'from-emerald-500 to-emerald-600' },
    { label: 'Обработано протоколов', value: '89 432', change: '+1 247', icon: '📊', color: 'from-amber-500 to-amber-600' },
  ];

  const recentTasks = [
    { id: 1, title: 'Проверка протоколов УИК №1247', status: 'in_progress', priority: 'high', deadline: '16.01.2026' },
    { id: 2, title: 'Подготовка отчёта по явке', status: 'pending', priority: 'medium', deadline: '17.01.2026' },
    { id: 3, title: 'Согласование списка наблюдателей', status: 'completed', priority: 'low', deadline: '14.01.2026' },
    { id: 4, title: 'Обновление реестра кандидатов', status: 'in_progress', priority: 'high', deadline: '18.01.2026' },
    { id: 5, title: 'Проверка подписных листов', status: 'pending', priority: 'medium', deadline: '19.01.2026' },
  ];

  const quickActions = [
    { label: 'Создать протокол', icon: '📝' },
    { label: 'Внести данные', icon: '📥' },
    { label: 'Сформировать отчёт', icon: '📈' },
    { label: 'Отправить уведомление', icon: '📨' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">В работе</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Ожидает</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Выполнено</span>;
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Высокий</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">Средний</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Низкий</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Добро пожаловать, Пётр Сергеевич!</h2>
          <p className="text-blue-100 text-sm md:text-base">Центральная избирательная комиссия Российской Федерации</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Сегодня: 15 января 2026</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">5 задач на сегодня</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{stat.icon}</span>
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <button
            key={index}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{action.label}</span>
          </button>
        ))}
      </div>

      {/* Tasks */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Текущие задачи</h3>
          <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Все задачи →</button>
        </div>
        <div className="divide-y divide-gray-50">
          {recentTasks.map(task => (
            <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800">{task.title}</p>
                  <p className="text-xs text-gray-500 mt-1">Срок: {task.deadline}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getPriorityBadge(task.priority)}
                  {getStatusBadge(task.status)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
