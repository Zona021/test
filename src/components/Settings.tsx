import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { currentUser, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const [settings, setSettings] = useState({
    notifications: { email: true, push: true, sms: false, importantOnly: false },
    security: { twoFactor: true, sessionTimeout: '30', loginNotifications: true },
    appearance: { language: 'ru', dateFormat: 'dd.mm.yyyy', timezone: 'Europe/Moscow' },
    system: { autoSave: true, autoSaveInterval: '5', dataExport: true },
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!currentUser) return null;

  const tabs = [
    { id: 'general', label: 'Общие' },
    { id: 'notifications', label: 'Уведомления' },
    { id: 'security', label: 'Безопасность' },
    { id: 'appearance', label: 'Интерфейс' },
    ...(hasPermission('manage_settings') ? [{ id: 'system', label: 'Система' }] : []),
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
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <nav className="p-2 space-y-1">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <div className="flex-1">
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Общие настройки</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Язык интерфейса</label>
                    <select value={settings.appearance.language} onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, language: e.target.value}})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Формат даты</label>
                    <select value={settings.appearance.dateFormat} onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, dateFormat: e.target.value}})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="dd.mm.yyyy">ДД.ММ.ГГГГ</option>
                      <option value="mm/dd/yyyy">ММ/ДД/ГГГГ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Часовой пояс</label>
                    <select value={settings.appearance.timezone} onChange={(e) => setSettings({...settings, appearance: {...settings.appearance, timezone: e.target.value}})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="Europe/Moscow">Москва (UTC+3)</option>
                      <option value="Europe/Samara">Самара (UTC+4)</option>
                      <option value="Asia/Yekaterinburg">Екатеринбург (UTC+5)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Настройки уведомлений</h3>
                <div className="space-y-4">
                  {[
                    { key: 'email', title: 'Email-уведомления', desc: 'Получать уведомления на электронную почту' },
                    { key: 'push', title: 'Push-уведомления', desc: 'Уведомления в браузере' },
                    { key: 'sms', title: 'SMS-уведомления', desc: 'Только для критических событий' },
                    { key: 'importantOnly', title: 'Только важные', desc: 'Получать уведомления только о важных событиях' },
                  ].map(item => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div>
                        <p className="text-sm font-medium text-gray-800">{item.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                      </div>
                      <ToggleSwitch
                        enabled={settings.notifications[item.key as keyof typeof settings.notifications]}
                        onChange={(v) => setSettings({...settings, notifications: {...settings.notifications, [item.key]: v}})}
                      />
                    </div>
                  ))}
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
                    <ToggleSwitch enabled={settings.security.twoFactor} onChange={(v) => setSettings({...settings, security: {...settings.security, twoFactor: v}})} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Уведомления о входе</p>
                      <p className="text-xs text-gray-500 mt-0.5">Получать уведомления при входе с нового устройства</p>
                    </div>
                    <ToggleSwitch enabled={settings.security.loginNotifications} onChange={(v) => setSettings({...settings, security: {...settings.security, loginNotifications: v}})} />
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <label className="block text-sm font-medium text-gray-800 mb-2">Тайм-аут сессии</label>
                    <select value={settings.security.sessionTimeout} onChange={(e) => setSettings({...settings, security: {...settings.security, sessionTimeout: e.target.value}})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option value="15">15 минут</option>
                      <option value="30">30 минут</option>
                      <option value="60">1 час</option>
                    </select>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm font-medium text-gray-800 mb-3">Смена пароля</p>
                    <div className="space-y-3">
                      <input type="password" placeholder="Текущий пароль" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <input type="password" placeholder="Новый пароль" className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                      <button className="px-4 py-2 bg-blue-700 text-white rounded-lg text-sm font-medium hover:bg-blue-800 transition-colors">Сменить пароль</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Внешний вид</h3>
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
              </div>
            )}

            {activeTab === 'system' && hasPermission('manage_settings') && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-800">Системные настройки</h3>
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <p className="text-xs text-amber-700"><strong>Внимание:</strong> Изменение системных настроек может повлиять на работу всех пользователей.</p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Автосохранение</p>
                      <p className="text-xs text-gray-500 mt-0.5">Автоматическое сохранение данных при вводе</p>
                    </div>
                    <ToggleSwitch enabled={settings.system.autoSave} onChange={(v) => setSettings({...settings, system: {...settings.system, autoSave: v}})} />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <p className="text-sm font-medium text-gray-800">Экспорт данных</p>
                      <p className="text-xs text-gray-500 mt-0.5">Разрешить пользователям экспортировать данные</p>
                    </div>
                    <ToggleSwitch enabled={settings.system.dataExport} onChange={(v) => setSettings({...settings, system: {...settings.system, dataExport: v}})} />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100 flex justify-end">
              <button onClick={handleSave} className="px-6 py-2.5 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors shadow-sm">
                Сохранить настройки
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
