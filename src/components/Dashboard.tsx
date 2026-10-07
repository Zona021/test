import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks, TaskPriority } from '../context/TasksContext';
import { useOperations } from '../context/OperationsContext';
import { useActivity } from '../context/ActivityContext';

export default function Dashboard() {
  const { currentUser, users, hasPermission } = useAuth();
  const { tasks, addTask, updateTaskStatus, updateTaskDeadline, deleteTask } = useTasks();
  const { createProtocol, createReport, addDataEntry } = useOperations();
  const { addActivity, activities, addNotification } = useActivity();
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showProtocolModal, setShowProtocolModal] = useState(false);
  const [showDataEntryModal, setShowDataEntryModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);
  const [taskFiles, setTaskFiles] = useState<File[]>([]);
  const [extendDeadlineTaskId, setExtendDeadlineTaskId] = useState<string | null>(null);
  const [newDeadline, setNewDeadline] = useState('');

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignedTo: '',
    priority: 'medium' as TaskPriority,
    deadline: '',
  });

  const [newProtocol, setNewProtocol] = useState({
    number: '',
    uikNumber: '',
    createdBy: currentUser?.id || '',
    createdByName: currentUser?.fullName || '',
    data: {
      totalVoters: 0,
      receivedBallots: 0,
      votedEarly: 0,
      votedHome: 0,
      spoiledBallots: 0,
      totalVoted: 0,
    },
  });

  const [newDataEntry, setNewDataEntry] = useState({
    type: 'voter_list' as 'voter_list' | 'uik_data' | 'candidate_data',
    targetId: '',
    fieldName: '',
    oldValue: '',
    newValue: '',
    changedBy: currentUser?.id || '',
    changedByName: currentUser?.fullName || '',
  });

  const [newReport, setNewReport] = useState({
    title: '',
    type: 'summary' as 'turnout' | 'processing' | 'complaints' | 'summary',
    createdBy: currentUser?.id || '',
    createdByName: currentUser?.fullName || '',
    period: '',
    data: {},
  });

  if (!currentUser) return null;

  const myTasks = tasks.filter(t => t.assignedTo === currentUser.id);
  const pendingTasks = myTasks.filter(t => t.status === 'pending');
  const inProgressTasks = myTasks.filter(t => t.status === 'in_progress');
  const completedTasks = myTasks.filter(t => t.status === 'completed');

  const stats = [
    { label: 'Избирательных участков', value: '97 248', change: '+12', icon: '🏛️' },
    { label: 'Избирателей в списках', value: '109 432 567', change: '+234 120', icon: '👥' },
    { label: 'Активных кампаний', value: '3', change: '0', icon: '📋' },
    { label: 'Обработано протоколов', value: '89 432', change: '+1 247', icon: '📊' },
  ];

  const quickActions = [
    { 
      label: 'Создать протокол', 
      icon: '📝', 
      action: () => setShowProtocolModal(true)
    },
    { 
      label: 'Внести данные', 
      icon: '📥', 
      action: () => setShowDataEntryModal(true)
    },
    { 
      label: 'Сформировать отчёт', 
      icon: '📈', 
      action: () => setShowReportModal(true)
    },
    { 
      label: 'Назначить задачу', 
      icon: '📨', 
      action: () => hasPermission('edit_documents') && setShowAssignModal(true),
      disabled: !hasPermission('edit_documents')
    },
  ];

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

    // Send notification to assignee
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

  const handleCreateProtocol = () => {
    if (!newProtocol.number || !newProtocol.uikNumber) return;
    
    createProtocol(newProtocol);
    
    addActivity({
      userId: currentUser.id,
      userName: currentUser.fullName,
      type: 'document_upload',
      description: `Создан протокол №${newProtocol.number} для УИК №${newProtocol.uikNumber}`,
    });

    setShowProtocolModal(false);
    setNewProtocol({
      number: '',
      uikNumber: '',
      createdBy: currentUser.id,
      createdByName: currentUser.fullName,
      data: {
        totalVoters: 0,
        receivedBallots: 0,
        votedEarly: 0,
        votedHome: 0,
        spoiledBallots: 0,
        totalVoted: 0,
      },
    });
  };

  const handleAddDataEntry = () => {
    if (!newDataEntry.targetId || !newDataEntry.fieldName || !newDataEntry.newValue) return;
    
    addDataEntry(newDataEntry);
    
    addActivity({
      userId: currentUser.id,
      userName: currentUser.fullName,
      type: 'task_assign',
      description: `Внесены данные: ${newDataEntry.fieldName} для ${newDataEntry.targetId}`,
    });

    setShowDataEntryModal(false);
    setNewDataEntry({
      type: 'voter_list',
      targetId: '',
      fieldName: '',
      oldValue: '',
      newValue: '',
      changedBy: currentUser.id,
      changedByName: currentUser.fullName,
    });
  };

  const handleCreateReport = () => {
    if (!newReport.title || !newReport.period) return;
    
    createReport(newReport);
    
    addActivity({
      userId: currentUser.id,
      userName: currentUser.fullName,
      type: 'task_assign',
      description: `Сформирован отчёт "${newReport.title}" за период ${newReport.period}`,
    });

    setShowReportModal(false);
    setNewReport({
      title: '',
      type: 'summary',
      createdBy: currentUser.id,
      createdByName: currentUser.fullName,
      period: '',
      data: {},
    });
  };

  const handleStatusChange = (taskId: string, status: 'pending' | 'in_progress' | 'completed') => {
    updateTaskStatus(taskId, status);
    
    if (status === 'completed') {
      addActivity({
        userId: currentUser.id,
        userName: currentUser.fullName,
        type: 'task_complete',
        description: `Завершена задача: ${tasks.find(t => t.id === taskId)?.title}`,
      });
    }
  };

  const handleExtendDeadline = () => {
    if (!extendDeadlineTaskId || !newDeadline) return;
    
    const task = tasks.find(t => t.id === extendDeadlineTaskId);
    if (!task) return;

    updateTaskDeadline(extendDeadlineTaskId, newDeadline);
    
    addActivity({
      userId: currentUser.id,
      userName: currentUser.fullName,
      type: 'task_assign',
      description: `Продлён срок задачи "${task.title}" до ${newDeadline}`,
    });

    addNotification({
      userId: task.assignedTo,
      title: 'Срок задачи изменён',
      message: `${currentUser.fullName} продлил(а) срок задачи "${task.title}" до ${newDeadline}`,
      type: 'info',
    });

    setExtendDeadlineTaskId(null);
    setNewDeadline('');
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

  const canAssignTasks = hasPermission('edit_documents');
  const assignableUsers = users.filter(u => u.isActive && u.id !== currentUser.id);

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

  const myActivities = activities.filter(a => a.userId === currentUser.id).slice(0, 10);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4"></div>
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative">
          <h2 className="text-2xl md:text-3xl font-bold mb-2">Добро пожаловать, {currentUser.fullName.split(' ')[1]}!</h2>
          <p className="text-blue-100 text-sm md:text-base">Центральная избирательная комиссия Российской Федерации</p>
          <div className="flex flex-wrap gap-4 mt-4">
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm">Сегодня: {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 rounded-lg px-3 py-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm">{pendingTasks.length + inProgressTasks.length} задач на сегодня</span>
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
            onClick={action.action}
            disabled={action.disabled}
            className="flex flex-col items-center gap-2 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-3xl group-hover:scale-110 transition-transform">{action.icon}</span>
            <span className="text-sm font-medium text-gray-700 group-hover:text-blue-700">{action.label}</span>
            {action.disabled && (
              <span className="text-[10px] text-gray-400">Нет прав</span>
            )}
          </button>
        ))}
      </div>

      {/* My Tasks */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Мои задачи</h3>
            <p className="text-xs text-gray-500 mt-0.5">Всего: {myTasks.length} • Ожидает: {pendingTasks.length} • В работе: {inProgressTasks.length} • Выполнено: {completedTasks.length}</p>
          </div>
          {canAssignTasks && (
            <button
              onClick={() => setShowAssignModal(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Назначить
            </button>
          )}
        </div>
        
        {myTasks.length === 0 ? (
          <div className="p-8 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-sm">У вас пока нет задач</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {myTasks.map(task => {
              const isExpanded = expandedTaskId === task.id;
              return (
                <div key={task.id} className="transition-colors">
                  <div 
                    className="p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => setExpandedTaskId(isExpanded ? null : task.id)}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
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
                        <div className="flex items-center gap-3 mt-2 text-xs text-gray-400 ml-6">
                          <span>Срок: {task.deadline}</span>
                          <span>От: {task.assignedByName}</span>
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
                          onClick={() => deleteTask(task.id)}
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
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-700">{task.deadline}</p>
                              {(task.assignedBy === currentUser.id || hasPermission('manage_users')) && task.status !== 'completed' && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setExtendDeadlineTaskId(task.id);
                                    setNewDeadline(task.deadline);
                                  }}
                                  className="p-1 hover:bg-blue-100 rounded text-blue-600 transition-colors"
                                  title="Продлить срок"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </button>
                              )}
                            </div>
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

      {/* Real Activity Log */}
      {myActivities.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Журнал активности</h3>
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
                    id="task-file-upload"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setTaskFiles(prev => [...prev, ...files]);
                    }}
                    className="hidden"
                  />
                  <label htmlFor="task-file-upload" className="cursor-pointer">
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

      {/* Create Protocol Modal */}
      {showProtocolModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowProtocolModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h3 className="text-lg font-semibold text-gray-800">Создать протокол</h3>
              <button onClick={() => setShowProtocolModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Номер протокола *</label>
                  <input
                    type="text"
                    value={newProtocol.number}
                    onChange={(e) => setNewProtocol({...newProtocol, number: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Например: 1247"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Номер УИК *</label>
                  <input
                    type="text"
                    value={newProtocol.uikNumber}
                    onChange={(e) => setNewProtocol({...newProtocol, uikNumber: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Например: 1247"
                  />
                </div>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-3">Данные протокола</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Всего избирателей</label>
                    <input
                      type="number"
                      value={newProtocol.data.totalVoters}
                      onChange={(e) => setNewProtocol({...newProtocol, data: {...newProtocol.data, totalVoters: parseInt(e.target.value) || 0}})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Получено бюллетеней</label>
                    <input
                      type="number"
                      value={newProtocol.data.receivedBallots}
                      onChange={(e) => setNewProtocol({...newProtocol, data: {...newProtocol.data, receivedBallots: parseInt(e.target.value) || 0}})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Проголосовало досрочно</label>
                    <input
                      type="number"
                      value={newProtocol.data.votedEarly}
                      onChange={(e) => setNewProtocol({...newProtocol, data: {...newProtocol.data, votedEarly: parseInt(e.target.value) || 0}})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Проголосовало на дому</label>
                    <input
                      type="number"
                      value={newProtocol.data.votedHome}
                      onChange={(e) => setNewProtocol({...newProtocol, data: {...newProtocol.data, votedHome: parseInt(e.target.value) || 0}})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Испорчено бюллетеней</label>
                    <input
                      type="number"
                      value={newProtocol.data.spoiledBallots}
                      onChange={(e) => setNewProtocol({...newProtocol, data: {...newProtocol.data, spoiledBallots: parseInt(e.target.value) || 0}})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Всего проголосовало</label>
                    <input
                      type="number"
                      value={newProtocol.data.totalVoted}
                      onChange={(e) => setNewProtocol({...newProtocol, data: {...newProtocol.data, totalVoted: parseInt(e.target.value) || 0}})}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 sticky bottom-0 bg-white">
              <button
                onClick={() => setShowProtocolModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateProtocol}
                disabled={!newProtocol.number || !newProtocol.uikNumber}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Создать протокол
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Data Entry Modal */}
      {showDataEntryModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowDataEntryModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Внести данные</h3>
              <button onClick={() => setShowDataEntryModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип данных</label>
                <select
                  value={newDataEntry.type}
                  onChange={(e) => setNewDataEntry({...newDataEntry, type: e.target.value as any})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="voter_list">Список избирателей</option>
                  <option value="uik_data">Данные УИК</option>
                  <option value="candidate_data">Данные кандидата</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID объекта *</label>
                <input
                  type="text"
                  value={newDataEntry.targetId}
                  onChange={(e) => setNewDataEntry({...newDataEntry, targetId: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: УИК-1247"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Поле *</label>
                <input
                  type="text"
                  value={newDataEntry.fieldName}
                  onChange={(e) => setNewDataEntry({...newDataEntry, fieldName: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: Количество избирателей"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Старое значение</label>
                  <input
                    type="text"
                    value={newDataEntry.oldValue}
                    onChange={(e) => setNewDataEntry({...newDataEntry, oldValue: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Необязательно"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Новое значение *</label>
                  <input
                    type="text"
                    value={newDataEntry.newValue}
                    onChange={(e) => setNewDataEntry({...newDataEntry, newValue: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Обязательно"
                  />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowDataEntryModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleAddDataEntry}
                disabled={!newDataEntry.targetId || !newDataEntry.fieldName || !newDataEntry.newValue}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Внести данные
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReportModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Сформировать отчёт</h3>
              <button onClick={() => setShowReportModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название отчёта *</label>
                <input
                  type="text"
                  value={newReport.title}
                  onChange={(e) => setNewReport({...newReport, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите название отчёта"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Тип отчёта</label>
                <select
                  value={newReport.type}
                  onChange={(e) => setNewReport({...newReport, type: e.target.value as any})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="summary">Сводный отчёт</option>
                  <option value="turnout">Отчёт по явке</option>
                  <option value="processing">Отчёт по обработке</option>
                  <option value="complaints">Отчёт по жалобам</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Период *</label>
                <input
                  type="text"
                  value={newReport.period}
                  onChange={(e) => setNewReport({...newReport, period: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Например: 01.01.2026 - 15.01.2026"
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateReport}
                disabled={!newReport.title || !newReport.period}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Сформировать отчёт
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Extend Deadline Modal */}
      {extendDeadlineTaskId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setExtendDeadlineTaskId(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Продлить срок задачи</h3>
              <button onClick={() => setExtendDeadlineTaskId(null)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Новый срок выполнения *</label>
                <input
                  type="date"
                  value={newDeadline}
                  onChange={(e) => setNewDeadline(e.target.value)}
                  min={tasks.find(t => t.id === extendDeadlineTaskId)?.deadline}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Текущий срок: {tasks.find(t => t.id === extendDeadlineTaskId)?.deadline}
                </p>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setExtendDeadlineTaskId(null)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleExtendDeadline}
                disabled={!newDeadline}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Продлить срок
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
