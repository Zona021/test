import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRegistrations } from '../context/RegistrationsContext';

export default function Settings() {
  const { currentUser, hasPermission } = useAuth();
  const { pendingRegistrations, registrations, approveRegistration, rejectRegistration } = useRegistrations();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      sms: false,
      importantOnly: false,
    },
    security: {
      twoFactor: true,
      sessionTimeout: '30',
      loginNotifications: true,
    },
    appearance: {
      language: 'ru',
      dateFormat: 'dd.mm.yyyy',
      timezone: 'Europe/Moscow',
    },
    system: {
      autoSave: true,
      autoSaveInterval: '5',
      dataExport: true,
    },
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!currentUser) return null;

  const tabs = [
    { id: 'general', label: 'Общие', icon: 'M10.325 4.313c.725-1.024 2.352-1.024 3.077 0a1.999 1.999 0 002.502.579 1.999 1.999 0 012.502 2.502 1.999 1.999 0 00.579 2.502c1.024.725 1.024 2.352 0 3.077a1.999 1.999 0 00-.579 2.502 1.999 1.999 0 01-2.502 2.502 1.999 1.999 0 00-2.502.579c-1.024.725-2.352 1.024-3.077 0a1.999 1.999 0 00-2.502-.579 1.999 1.999 0 01-2.502-2.502 1.999 1.999 0 00-.579-2.502c-1.024-.725-1.024-2.352 0-3.077a1.999 1.999 0 00.579-2.502 1.999 1.999 0 012.502-2.502 1.999 1.999 0 002.502-.579z' },
    { id: 'notifications', label: 'Уведомления', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9' },
    { id: 'security', label: 'Безопасность', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
    { id: 'appearance', label: 'Интерфейс', icon: 'M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01' },
    ...(hasPermission('review_registrations') ? [{ id: 'registrations', label: `Регистрации${pendingRegistrations.length > 0 ? ` (${pendingRegistrations.length})` : ''}`, icon: 'M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z' }] : []),
    ...(hasPermission('manage_settings') ? [{ id: 'system', label: 'Система', icon: 'M10.325 4.313c.725-1.024 2.352-1.024 3.077 0a1.999 1.999 0 002.502.579 1.999 1.999 0 012.502 2.502 1.999 1.999 0 00.579 2.502c1.024.725 1.024 2.352 0 3.077a1.999 1.999 0 00-.579 2.502 1.999 1.999 0 01-2.502 2.502 1.999 1.999 0 00-2.502.579c-1.024.725-2.352 1.024-3.077 0a1.999 1.999 0 00-2.502-.579 1.999 1.999 0 01-2.502-2.502 1.999 1.999 0 00-.579-2.502c-1.024-.725-1.024-2.352 0-3.077a1.999 1.999 0 00.579-2.502 1.999 1.999 0 012.502-2.502 1.999 1.999 0 002.502-.579z' }] : []),
  ];

  const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
    >
      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-5' : 'translate-x-0'}`}></div>
    </button>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Настройки</h2>
          <p className="text-gray-500 text-sm mt-1">Персональные и системные настройки</p>
        </div>
        {saved && (
          <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border border-green-200 rounded-lg">
            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm text-green-700 font-medium">Настройки сохранены</span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <nav className="p-2 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={tab.icon} />
                  </svg>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Общие настройки</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Язык интерфейса</label>
                    <select
                      value={settings.appearance.language}
                      onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, language: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Формат даты</label>
                    <select
                      value={settings.appearance.dateFormat}
                      onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, dateFormat: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="dd.mm.yyyy">ДД.ММ.ГГГГ</option>
                      <option value="mm/dd/yyyy">ММ/ДД/ГГГГ</option>
                      <option value="yyyy-mm-dd">ГГГГ-ММ-ДД</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Часовой пояс</label>
                    <select
                      value={settings.appearance.timezone}
                      onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, timezone: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Europe/Moscow">Москва (UTC+3)</option>
                      <option value="Europe/Samara">Самара (UTC+4)</option>
                      <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
                      <option value="Asia/Novosibirsk">Новосибирск (UTC+7)</option>
                      <option value="Asia/Vladivostok">Владивосток (UTC+10)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Настройки уведомлений</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Email-уведомления</p>
                      <p className="text-xs text-gray-500 mt-0.5">Получать уведомления на электронную почту</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.notifications.email}
                      onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, email: v}})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Push-уведомления</p>
                      <p className="text-xs text-gray-500 mt-0.5">Уведомления в браузере</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.notifications.push}
                      onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, push: v}})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">SMS-уведомления</p>
                      <p className="text-xs text-gray-500 mt-0.5">Только для критических событий</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.notifications.sms}
                      onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, sms: v}})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Только важные</p>
                      <p className="text-xs text-gray-500 mt-0.5">Получать уведомления только о важных событиях</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.notifications.importantOnly}
                      onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, importantOnly: v}})}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Безопасность</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Двухфакторная аутентификация</p>
                      <p className="text-xs text-gray-500 mt-0.5">Дополнительная защита при входе</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.security.twoFactor}
                      onChange={(v) => setSettings({...settings, security: {...settings.security, twoFactor: v}})}
                    />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Уведомления о входе</p>
                      <p className="text-xs text-gray-500 mt-0.5">Получать уведомления при входе с нового устройства</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.security.loginNotifications}
                      onChange={(v) => setSettings({...settings, security: {...settings.security, loginNotifications: v}})}
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm font-medium text-gray-800 mb-2">Тайм-аут сессии (минуты)</label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => setSettings({...settings, security: {...settings.security, sessionTimeout: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15">15 минут</option>
                      <option value="30">30 минут</option>
                      <option value="60">1 час</option>
                      <option value="120">2 часа</option>
                    </select>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-800 mb-3">Смена пароля</p>
                    <div className="space-y-3">
                      <input type="password" placeholder="Текущий пароль" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="password" placeholder="Новый пароль" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="password" placeholder="Подтвердите новый пароль" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">
                        Сменить пароль
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Внешний вид</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-800 mb-3">Тема оформления</p>
                    <div className="grid grid-cols-3 gap-3">
                      <button className="p-4 border-2 border-blue-500 rounded-xl bg-white text-center">
                        <div className="w-full h-8 bg-white border border-gray-200 rounded mb-2"></div>
                        <span className="text-xs font-medium text-gray-700">Светлая</span>
                      </button>
                      <button className="p-4 border-2 border-gray-200 rounded-xl bg-gray-800 text-center hover:border-gray-400 transition-colors">
                        <div className="w-full h-8 bg-gray-700 rounded mb-2"></div>
                        <span className="text-xs font-medium text-gray-300">Тёмная</span>
                      </button>
                      <button className="p-4 border-2 border-gray-200 rounded-xl text-center hover:border-gray-400 transition-colors" style={{background: 'linear-gradient(135deg, #fff 50%, #1f2937 50%)'}}>
                        <div className="w-full h-8 rounded mb-2" style={{background: 'linear-gradient(90deg, #fff 50%, #1f2937 50%)'}}></div>
                        <span className="text-xs font-medium text-gray-700">Авто</span>
                      </button>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-800 mb-3">Размер шрифта</p>
                    <div className="flex gap-3">
                      <button className="px-4 py-2 border-2 border-gray-200 rounded-lg text-xs hover:border-blue-500 transition-colors">Мелкий</button>
                      <button className="px-4 py-2 border-2 border-blue-500 rounded-lg text-sm bg-blue-50 font-medium">Обычный</button>
                      <button className="px-4 py-2 border-2 border-gray-200 rounded-lg text-base hover:border-blue-500 transition-colors">Крупный</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'system' && hasPermission('manage_settings') && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Системные настройки</h3>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <div>
                      <p className="text-sm font-medium text-amber-800">Внимание</p>
                      <p className="text-xs text-amber-700 mt-0.5">Изменение системных настроек может повлиять на работу всех пользователей системы.</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Автосохранение</p>
                      <p className="text-xs text-gray-500 mt-0.5">Автоматическое сохранение данных при вводе</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.system.autoSave}
                      onChange={(v) => setSettings({...settings, system: {...settings.system, autoSave: v}})}
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm font-medium text-gray-800 mb-2">Интервал автосохранения (минуты)</label>
                    <select
                      value={settings.system.autoSaveInterval}
                      onChange={(e) => setSettings({...settings, system: {...settings.system, autoSaveInterval: e.target.value}})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="1">1 минута</option>
                      <option value="5">5 минут</option>
                      <option value="10">10 минут</option>
                      <option value="15">15 минут</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Экспорт данных</p>
                      <p className="text-xs text-gray-500 mt-0.5">Разрешить пользователям экспортировать данные</p>
                    </div>
                    <ToggleSwitch
                      enabled={settings.system.dataExport}
                      onChange={(v) => setSettings({...settings, system: {...settings.system, dataExport: v}})}
                    />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-800 mb-2">Версия системы</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Текущая версия:</span>
                        <span className="ml-2 font-medium text-gray-800">4.2.1</span>
                      </div>
                      <div>
                        <span className="text-gray-500">Дата сборки:</span>
                        <span className="ml-2 font-medium text-gray-800">15.01.2026</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'registrations' && hasPermission('review_registrations') && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Заявки на регистрацию</h3>
                
                {pendingRegistrations.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-sm text-amber-700">
                      <strong>{pendingRegistrations.length}</strong> {pendingRegistrations.length === 1 ? 'заявка ожидает' : 'заявок ожидают'} рассмотрения
                    </p>
                  </div>
                )}

                {/* Pending registrations */}
                <div className="space-y-4">
                  {pendingRegistrations.map(reg => (
                    <div key={reg.id} className="border border-gray-200 rounded-xl p-4">
                      {reviewingId === reg.id ? (
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div>
                              <p className="text-xs text-gray-500">ФИО</p>
                              <p className="text-sm font-medium">{reg.fullName}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Логин</p>
                              <p className="text-sm font-medium">@{reg.username}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Email</p>
                              <p className="text-sm font-medium">{reg.email}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Должность</p>
                              <p className="text-sm font-medium">{reg.position}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-xs text-gray-500">Причина</p>
                            <p className="text-sm text-gray-700">{reg.reason}</p>
                          </div>
                          <div>
                            <label className="block text-xs text-gray-500 mb-1">Комментарий</label>
                            <textarea
                              value={reviewComment}
                              onChange={(e) => setReviewComment(e.target.value)}
                              rows={2}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                              placeholder="Необязательно..."
                            />
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => { approveRegistration(reg.id, reviewComment || undefined); setReviewingId(null); setReviewComment(''); }}
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                            >
                              Одобрить
                            </button>
                            <button
                              onClick={() => { rejectRegistration(reg.id, reviewComment || 'Не соответствует требованиям'); setReviewingId(null); setReviewComment(''); }}
                              className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                              Отклонить
                            </button>
                            <button
                              onClick={() => { setReviewingId(null); setReviewComment(''); }}
                              className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
                            >
                              Отмена
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-medium text-gray-800">{reg.fullName}</p>
                            <p className="text-xs text-gray-500">@{reg.username} • {reg.email}</p>
                            <p className="text-xs text-gray-400 mt-1">{reg.position} • {reg.department}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-400">{reg.submittedAt}</span>
                            <button
                              onClick={() => setReviewingId(reg.id)}
                              className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-xs font-medium hover:bg-blue-100 transition-colors"
                            >
                              Рассмотреть
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {pendingRegistrations.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm">Нет заявок на рассмотрении</p>
                    </div>
                  )}
                </div>

                {/* History */}
                {registrations.filter(r => r.status !== 'pending').length > 0 && (
                  <div className="mt-6">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">История</h4>
                    <div className="space-y-2">
                      {registrations.filter(r => r.status !== 'pending').slice(0, 5).map(reg => (
                        <div key={reg.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="text-sm text-gray-700">{reg.fullName}</p>
                            <p className="text-xs text-gray-400">@{reg.username}</p>
                          </div>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                            reg.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {reg.status === 'approved' ? 'Одобрено' : 'Отклонено'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Save Button */}
            {activeTab !== 'registrations' && (
              <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
                <button
                  onClick={handleSave}
                  className="px-6 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm"
                >
                  Сохранить настройки
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
