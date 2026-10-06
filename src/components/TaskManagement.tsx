import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks, TaskPriority, TaskStatus } from '../context/TasksContext';
import { useActivity } from '../context/ActivityContext';

export default function TaskManagement() {
  const { currentUser, users, hasPermission } = useAuth();
  const { tasks, updateTaskStatus, deleteTask, addTask } = useTasks();
  const { addActivity, addNotification } = useActivity();
  
  const [filterUser, setFilterUser] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [taskFiles, setTaskFiles] = useState<File[]>([]);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as TaskPriority,
    deadline: '',
  });

  if (!currentUser || !hasPermission('manage_users')) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-800">Доступ запрещён</h3>
        <p className="text-sm text-gray-500 mt-1">У вас нет прав для управления задачами</p>
      </div>
    );
  }

  const filteredTasks = tasks.filter(task => {
    const matchesUser = filterUser === 'all' || task.assignedTo === filterUser;
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    return matchesUser && matchesStatus && matchesPriority;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    inProgress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    updateTaskStatus(taskId, newStatus);
    
    addActivity({
      userId: currentUser.id,
      userName: currentUser.fullName,
      type: 'task_assign',
      description: `Изменён статус задачи "${task.title}" на "${newStatus === 'pending' ? 'Ожидает' : newStatus === 'in_progress' ? 'В работе' : 'Выполнено'}"`,
    });

    addNotification({
      userId: task.assignedTo,
      title: 'Статус задачи изменён',
      message: `${currentUser.fullName} изменил(а) статус вашей задачи "${task.title}"`,
      type: 'info',
    });
  };

  const handleDeleteTask = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    deleteTask(taskId);
    
    addActivity({
      userId: currentUser.id,
      userName: currentUser.fullName,
      type: 'task_assign',
      description: `Удалена задача "${task.title}" у ${task.assignedToName}`,
    });

    addNotification({
      userId: task.assignedTo,
      title: 'Задача удалена',
      message: `${currentUser.fullName} удалил(а) задачу "${task.title}"`,
      type: 'warning',
    });
  };

  const handleAddTask = async () => {
    if (!newTask.title || !newTask.assignedTo || !newTask.deadline) return;
    const assignee = users.find(u => u.id === newTask.assignedTo);
    if (!assignee) return;
    
    // Process files
    const attachments = await Promise.all(
      taskFiles.map(async (file) => {
        const content = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
        return {
          name: file.name,
          size: `${(file.size / 1024).toFixed(1)} KB`,
          type: file.type,
          content,
        };
      })
    );
    
    addTask({
      title: newTask.title,
      description: newTask.description,
      assignedTo: newTask.assignedTo,
      assignedToName: assignee.fullName,
      assignedBy: currentUser.id,
      assignedByName: currentUser.fullName,
      priority: newTask.priority,
      deadline: newTask.deadline,
      attachments: attachments.length > 0 ? attachments : undefined,
    });

    addActivity({
      userId: currentUser.id,
      userName: currentUser.fullName,
      type: 'task_assign',
      description: `Назначена задача "${newTask.title}" пользователю ${assignee.fullName}`,
    });

    addNotification({
      userId: assignee.id,
      title: 'Новая задача',
      message: `${currentUser.fullName} назначил(а) вам задачу: "${newTask.title}". Срок: ${newTask.deadline}`,
      type: 'info',
    });

    setShowAssignModal(false);
    setNewTask({ title: '', description: '', assignedTo: '', priority: 'medium', deadline: '' });
    setTaskFiles([]);
  };

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

  const assignableUsers = users.filter(u => u.isActive);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Управление задачами</h2>
          <p className="text-gray-500 text-sm mt-1">Просмотр и управление задачами всех пользователей</p>
        </div>
        <button
          onClick={() => setShowAssignModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Назначить задачу
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          <p className="text-xs text-gray-500">Всего задач</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-blue-600">{stats.pending}</p>
          <p className="text-xs text-gray-500">Ожидают</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-yellow-600">{stats.inProgress}</p>
          <p className="text-xs text-gray-500">В работе</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
          <p className="text-xs text-gray-500">Выполнено</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Пользователь</label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все пользователи</option>
              {assignableUsers.map(u => (
                <option key={u.id} value={u.id}>{u.fullName}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Статус</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все статусы</option>
              <option value="pending">Ожидает</option>
              <option value="in_progress">В работе</option>
              <option value="completed">Выполнено</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Приоритет</label>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Все приоритеты</option>
              <option value="high">Высокий</option>
              <option value="medium">Средний</option>
              <option value="low">Низкий</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-600">Задач не найдено</h3>
            <p className="text-sm text-gray-400 mt-1">Попробуйте изменить фильтры или назначить новую задачу</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {filteredTasks.map(task => {
              const isExpanded = expandedTaskId === task.id;
              return (
                <div key={task.id} className="transition-colors">
                  <div 
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <svg 
                            className={`w-4 h-4 text-gray-400 transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                          <p className={`text-sm font-medium ${task.status === 'completed' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                            {task.title}
                          </p>
                          {getPriorityBadge(task.priority)}
                          {getStatusBadge(task.status)}
                          {task.attachments && task.attachments.length > 0 && (
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                              </svg>
                              {task.attachments.length}
                            </span>
                          )}
                        </div>
                        {!isExpanded && task.description && (
                          <p className="text-xs text-gray-500 mt-1 ml-6 line-clamp-1">{task.description}</p>
                        )}
                        <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-gray-400 ml-6">
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {task.assignedToName}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Срок: {task.deadline}
                          </span>
                          <span className="flex items-center gap-1">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Создано: {task.createdAt}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {task.status === 'pending' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'in_progress')}
                            className="px-3 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-100 transition-colors"
                          >
                            Начать
                          </button>
                        )}
                        {task.status === 'in_progress' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'completed')}
                            className="px-3 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                          >
                            Завершить
                          </button>
                        )}
                        {task.status === 'completed' && (
                          <button
                            onClick={() => handleStatusChange(task.id, 'pending')}
                            className="px-3 py-1.5 bg-gray-50 text-gray-600 rounded-lg text-xs font-medium hover:bg-gray-100 transition-colors"
                          >
                            Переоткрыть
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteTask(task.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          title="Удалить"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Expanded task details */}
                  {isExpanded && (
                    <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
                      <div className="pt-4 space-y-4">
                        {task.description && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">Описание</h4>
                            <p className="text-sm text-gray-700">{task.description}</p>
                          </div>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Исполнитель</h4>
                            <p className="text-sm text-gray-700">{task.assignedToName}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Назначил</h4>
                            <p className="text-sm text-gray-700">{task.assignedByName}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Срок</h4>
                            <p className="text-sm text-gray-700">{task.deadline}</p>
                          </div>
                          <div>
                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Создано</h4>
                            <p className="text-sm text-gray-700">{task.createdAt}</p>
                          </div>
                        </div>

                        {task.attachments && task.attachments.length > 0 && (
                          <div>
                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-2">
                              Прикреплённые файлы ({task.attachments.length})
                            </h4>
                            <div className="space-y-2">
                              {task.attachments.map((file, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                                    <p className="text-xs text-gray-500">{file.size}</p>
                                  </div>
                                  <a
                                    href={file.content}
                                    download={file.name}
                                    className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    Скачать
                                  </a>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Assign Task Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAssignModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Назначить задачу</h3>
              <button onClick={() => setShowAssignModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
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
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Опишите задачу подробнее"
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
                    {assignableUsers.map(u => (
                      <option key={u.id} value={u.id}>{u.fullName}</option>
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
                  type="date"
                  value={newTask.deadline}
                  onChange={(e) => setNewTask({...newTask, deadline: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Прикреплённые файлы</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="task-file-upload-mgmt"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setTaskFiles(prev => [...prev, ...files]);
                    }}
                    className="hidden"
                  />
                  <label htmlFor="task-file-upload-mgmt" className="cursor-pointer">
                    <svg className="w-8 h-8 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="text-sm text-gray-600">Нажмите для выбора файлов</p>
                    <p className="text-xs text-gray-400 mt-1">Можно выбрать несколько файлов</p>
                  </label>
                </div>
                {taskFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {taskFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                        <svg className="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span className="text-sm text-gray-700 flex-1 truncate">{file.name}</span>
                        <span className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                        <button
                          type="button"
                          onClick={() => setTaskFiles(prev => prev.filter((_, i) => i !== idx))}
                          className="p-1 hover:bg-red-50 rounded text-gray-400 hover:text-red-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
                onClick={handleAddTask}
                disabled={!newTask.title || !newTask.assignedTo || !newTask.deadline}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Назначить задачу
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
