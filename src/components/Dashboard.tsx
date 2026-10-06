import { useState } from 'react';
import { useTasks, TaskStatus, TaskPriority } from '../context/TasksContext';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { myTasks, tasks, addTask, updateTaskStatus, deleteTask } = useTasks();
  const { currentUser, users, hasPermission } = useAuth();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as TaskPriority,
    deadline: '',
  });

  const stats = [
    { label: 'Избирательных участков', value: '97 248', change: '+12', icon: '🏛️' },
    { label: 'Избирателей в списках', value: '109 432 567', change: '+234 120', icon: '👥' },
    { label: 'Активных кампаний', value: '3', change: '0', icon: '📋' },
    { label: 'Обработано протоколов', value: '89 432', change: '+1 247', icon: '📊' },
  ];

  const quickActions = [
    { label: 'Создать протокол', icon: '📝' },
    { label: 'Внести данные', icon: '📥' },
    { label: 'Сформировать отчёт', icon: '📈' },
    { label: 'Отправить уведомление', icon: '📨' },
  ];

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'in_progress':
        return <span className="px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 rounded-full">В работе</span>;
      case 'pending':
        return <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">Ожидает</span>;
      case 'completed':
        return <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full">Выполнено</span>;
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">Высокий</span>;
      case 'medium':
        return <span className="px-2 py-1 text-xs font-medium bg-orange-100 text-orange-700 rounded-full">Средний</span>;
      case 'low':
        return <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">Низкий</span>;
    }
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTaskStatus(taskId, newStatus);
  };

  const handleAssignTask = () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.deadline || !currentUser) return;
    addTask({
      ...newTask,
      assignedBy: currentUser.username,
    });
    setShowAssignModal(false);
    setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Добро пожаловать{currentUser ? `, ${currentUser.fullName.split(' ')[1]}` : ''}!</h2>
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
              <span className="text-sm">{myTasks.filter(t => t.status !== 'completed').length} задач на сегодня</span>
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
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Мои задачи</h3>
            <p className="text-xs text-gray-500 mt-0.5">
              {myTasks.filter(t => t.status === 'pending').length} ожидает • {myTasks.filter(t => t.status === 'in_progress').length} в работе • {myTasks.filter(t => t.status === 'completed').length} выполнено
            </p>
          </div>
          {hasPermission('assign_tasks') && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 px-3 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Назначить задачу
            </button>
          )}
        </div>
        <div className="divide-y divide-gray-50">
          {myTasks.length === 0 ? (
            <div className="p-8 text-center text-gray-400">
              <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-sm">У вас пока нет задач</p>
            </div>
          ) : (
            myTasks.map(task => (
              <div key={task.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {task.title}
                      </p>
                    </div>
                    {task.description && (
                      <p className="text-xs text-gray-400 mb-1">{task.description}</p>
                    )}
                    <p className="text-xs text-gray-500">Срок: {task.deadline} • Назначил: @{task.assignedBy}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {getPriorityBadge(task.priority)}
                    {getStatusBadge(task.status)}
                    {/* Status change buttons */}
                    {task.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'in_progress')}
                        className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors"
                        title="Взять в работу"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    )}
                    {task.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'completed')}
                        className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                        title="Завершить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                    )}
                    {task.status === 'completed' && (
                      <button
                        onClick={() => handleStatusChange(task.id, 'pending')}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Вернуть в ожидание"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      </button>
                    )}
                    {(task.assignedBy === currentUser?.username || hasPermission('manage_users')) && (
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                        title="Удалить"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAssignModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Назначить задачу</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название задачи *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите название задачи"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Опишите задачу подробнее..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Исполнитель *</label>
                  <select
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Выберите...</option>
                    {users.filter(u => u.isActive).map(u => (
                      <option key={u.id} value={u.username}>@{u.username} ({u.fullName.split(' ').slice(0, 2).join(' ')})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Приоритет</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({...newTask, priority: e.target.value as TaskPriority})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Срок выполнения *</label>
                <input
                  type="text"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="ДД.ММ.ГГГГ"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAssignModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleAssignTask}
                disabled={!newTask.title || !newTask.assignedTo || !newTask.deadline}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назначить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
