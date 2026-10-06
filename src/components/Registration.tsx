import { useState } from 'react';
import { useRegistrations } from '../context/RegistrationsContext';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';

export default function Registration() {
  const { registrations, submitRegistration, approveRegistration, rejectRegistration } = useRegistrations();
  const { currentUser, hasPermission, users } = useAuth();
  const { addActivity, addNotification } = useActivity();
  const [showForm, setShowForm] = useState(!currentUser);
  const [showModeration, setShowModeration] = useState(false);
  const [rejectModal, setRejectModal] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    reason: '',
  });

  const canModerate = hasPermission('manage_users');
  const pendingRegistrations = registrations.filter(r => r.status === 'pending');

  const departments = [
    'Аппарат ЦИК России',
    'Организационный отдел',
    'Правовой департамент',
    'Департамент по работе с ГАС «Выборы»',
    'Контрольно-ревизионная служба',
    'Пресс-служба',
  ];

  const handleSubmit = () => {
    if (!formData.username || !formData.fullName || !formData.email || !formData.reason) return;
    submitRegistration(formData);
    
    // Add activity
    addActivity({
      userId: currentUser?.id || 'anonymous',
      userName: currentUser?.fullName || formData.fullName,
      type: 'registration_submit',
      description: `Подана заявка на регистрацию от ${formData.fullName} (@${formData.username})`,
    });

    // Notify admins and owners
    const adminsAndOwners = users.filter(u => (u.role === 'admin' || u.role === 'owner') && u.isActive);
    adminsAndOwners.forEach(admin => {
      addNotification({
        userId: admin.id,
        title: 'Новая заявка на регистрацию',
        message: `${formData.fullName} (@${formData.username}) подал(а) заявку на регистрацию`,
        type: 'warning',
      });
    });

    setSubmitted(true);
    setFormData({ username: '', fullName: '', email: '', phone: '', position: '', department: '', reason: '' });
  };

  const handleApprove = (regId: string) => {
    if (currentUser) {
      approveRegistration(regId, currentUser.id);
      
      const reg = registrations.find(r => r.id === regId);
      if (reg) {
        addActivity({
          userId: currentUser.id,
          userName: currentUser.fullName,
          type: 'registration_approve',
          description: `Одобрена регистрация ${reg.fullName} (@${reg.username})`,
        });

        addNotification({
          userId: currentUser.id,
          title: 'Заявка одобрена',
          message: `Вы одобрили регистрацию ${reg.fullName} (@${reg.username})`,
          type: 'success',
        });
      }
    }
  };

  const handleReject = () => {
    if (rejectModal && rejectReason) {
      const reg = registrations.find(r => r.id === rejectModal);
      rejectRegistration(rejectModal, rejectReason);
      
      if (reg && currentUser) {
        addActivity({
          userId: currentUser.id,
          userName: currentUser.fullName,
          type: 'registration_reject',
          description: `Отклонена регистрация ${reg.fullName} (@${reg.username}): ${rejectReason}`,
        });

        addNotification({
          userId: currentUser.id,
          title: 'Заявка отклонена',
          message: `Вы отклонили регистрацию ${reg.fullName} (@${reg.username}). Причина: ${rejectReason}`,
          type: 'error',
        });
      }
      
      setRejectModal(null);
      setRejectReason('');
    }
  };

  // If user is logged in and is admin+, show moderation view
  if (currentUser && canModerate) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Регистрация</h2>
            <p className="text-gray-500 text-sm mt-1">Управление заявками на регистрацию</p>
          </div>
          {pendingRegistrations.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-amber-700 font-medium">{pendingRegistrations.length} заявок на рассмотрении</span>
            </div>
          )}
        </div>

        {registrations.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-600">Заявок пока нет</h3>
            <p className="text-sm text-gray-400 mt-1">Здесь будут отображаться заявки на регистрацию</p>
          </div>
        ) : (
          <div className="space-y-4">
            {registrations.map(reg => (
              <div key={reg.id} className={`bg-white rounded-xl border shadow-sm overflow-hidden ${
                reg.status === 'pending' ? 'border-amber-200' :
                reg.status === 'approved' ? 'border-green-200' : 'border-red-200'
              }`}>
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h4 className="text-base font-semibold text-gray-800">{reg.fullName}</h4>
                        {reg.status === 'pending' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-700 rounded-full">На рассмотрении</span>
                        )}
                        {reg.status === 'approved' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-700 rounded-full">Одобрена</span>
                        )}
                        {reg.status === 'rejected' && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">Отклонена</span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="text-gray-400">Логин:</span>
                          <span className="ml-2 text-gray-700 font-medium">@{reg.username}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Email:</span>
                          <span className="ml-2 text-gray-700">{reg.email}</span>
                        </div>
                        {reg.phone && (
                          <div>
                            <span className="text-gray-400">Телефон:</span>
                            <span className="ml-2 text-gray-700">{reg.phone}</span>
                          </div>
                        )}
                        {reg.position && (
                          <div>
                            <span className="text-gray-400">Должность:</span>
                            <span className="ml-2 text-gray-700">{reg.position}</span>
                          </div>
                        )}
                        {reg.department && (
                          <div>
                            <span className="text-gray-400">Подразделение:</span>
                            <span className="ml-2 text-gray-700">{reg.department}</span>
                          </div>
                        )}
                        <div className="sm:col-span-2">
                          <span className="text-gray-400">Обоснование:</span>
                          <span className="ml-2 text-gray-700">{reg.reason}</span>
                        </div>
                        <div>
                          <span className="text-gray-400">Дата подачи:</span>
                          <span className="ml-2 text-gray-700">{reg.submittedAt}</span>
                        </div>
                      </div>
                      {reg.status === 'rejected' && reg.rejectionReason && (
                        <div className="mt-2 p-2 bg-red-50 rounded-lg">
                          <p className="text-xs text-red-600"><strong>Причина:</strong> {reg.rejectionReason}</p>
                        </div>
                      )}
                    </div>
                    {reg.status === 'pending' && (
                      <div className="flex sm:flex-col gap-2">
                        <button
                          onClick={() => handleApprove(reg.id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          Одобрить
                        </button>
                        <button
                          onClick={() => setRejectModal(reg.id)}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors flex items-center gap-1"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                          Отклонить
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Reject Modal */}
        {rejectModal && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setRejectModal(null)}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Отклонить регистрацию</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Причина отклонения *</label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                    rows={3}
                    placeholder="Укажите причину отклонения"
                  />
                </div>
              </div>
              <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
                <button onClick={() => { setRejectModal(null); setRejectReason(''); }} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Отмена</button>
                <button onClick={handleReject} disabled={!rejectReason} className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">Отклонить</button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Registration form for non-logged-in users or regular users
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Регистрация</h2>
        <p className="text-gray-500 text-sm mt-1">Подача заявки на регистрацию в системе</p>
      </div>

      {submitted ? (
        <div className="bg-white rounded-xl border border-green-200 shadow-sm p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-800">Заявка отправлена!</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            Ваша заявка на регистрацию успешно отправлена. Она будет рассмотрена администратором в течение 1-3 рабочих дней. О результате вы будете уведомлены.
          </p>
          <button
            onClick={() => setSubmitted(false)}
            className="mt-4 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors"
          >
            Подать ещё одну заявку
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100 bg-blue-50">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm font-medium text-blue-800">Порядок регистрации</p>
                <p className="text-xs text-blue-600 mt-0.5">
                  После подачи заявки она будет направлена на рассмотрение администратору. Доступ к системе будет предоставлен только после одобрения вашей заявки.
                </p>
              </div>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Логин *</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Желаемый логин"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ФИО *</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Иванов Иван Иванович"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Телефон</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+7 (___) ___-__-__"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Желаемая должность</label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Специалист"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Подразделение</label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Выберите...</option>
                  {departments.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Обоснование необходимости доступа *</label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({...formData, reason: e.target.value})}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Опишите, почему вам необходим доступ к системе..."
              />
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubmit}
                disabled={!formData.username || !formData.fullName || !formData.email || !formData.reason}
                className="px-6 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отправить заявку
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
