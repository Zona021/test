export default function Contacts() {
  const departments = [
    {
      name: 'Аппарат ЦИК России',
      head: 'Смирнова Елена Владимировна',
      phone: '+7 (495) 261-78-52',
      email: 'apparat@cikrf.ru',
      address: 'г. Москва, ГС-1, ул. Ильинка, д. 21',
      workingHours: 'Пн-Пт: 9:00 - 18:00',
    },
    {
      name: 'Организационный отдел',
      head: 'Козлов Андрей Николаевич',
      phone: '+7 (495) 261-78-53',
      email: 'org@cikrf.ru',
      address: 'г. Москва, ГС-1, ул. Ильинка, д. 21, каб. 312',
      workingHours: 'Пн-Пт: 9:00 - 18:00',
    },
    {
      name: 'Правовой департамент',
      head: 'Петрова Мария Ивановна',
      phone: '+7 (495) 261-78-54',
      email: 'legal@cikrf.ru',
      address: 'г. Москва, ГС-1, ул. Ильинка, д. 21, каб. 405',
      workingHours: 'Пн-Пт: 9:00 - 18:00',
    },
    {
      name: 'Департамент по работе с ГАС «Выборы»',
      head: 'Волков Дмитрий Сергеевич',
      phone: '+7 (495) 261-78-55',
      email: 'gas@cikrf.ru',
      address: 'г. Москва, ГС-1, ул. Ильинка, д. 21, каб. 510',
      workingHours: 'Пн-Пт: 9:00 - 18:00 (техподдержка: круглосуточно)',
    },
    {
      name: 'Контрольно-ревизионная служба',
      head: 'Новикова Ольга Петровна',
      phone: '+7 (495) 261-78-56',
      email: 'control@cikrf.ru',
      address: 'г. Москва, ГС-1, ул. Ильинка, д. 21, каб. 208',
      workingHours: 'Пн-Пт: 9:00 - 18:00',
    },
    {
      name: 'Пресс-служба',
      head: 'Белова Анастасия Юрьевна',
      phone: '+7 (495) 261-78-57',
      email: 'press@cikrf.ru',
      address: 'г. Москва, ГС-1, ул. Ильинка, д. 21, каб. 101',
      workingHours: 'Пн-Пт: 9:00 - 18:00',
    },
  ];

  const quickContacts = [
    { label: 'Горячая линия', value: '8 (800) 707-07-11', icon: '📞', description: 'Бесплатно по России' },
    { label: 'Приёмная', value: '+7 (495) 606-44-44', icon: '🏢', description: 'Пн-Пт: 9:00 - 18:00' },
    { label: 'Электронная почта', value: 'info@cikrf.ru', icon: '📧', description: 'Ответ в течение 3 рабочих дней' },
    { label: 'Телеграм-бот', value: '@cikrf_bot', icon: '💬', description: 'Быстрые справки' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Контакты</h2>
        <p className="text-gray-500 text-sm mt-1">Контактная информация подразделений ЦИК России</p>
      </div>

      {/* Quick Contacts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickContacts.map((contact, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{contact.icon}</span>
              <span className="text-sm font-medium text-gray-600">{contact.label}</span>
            </div>
            <p className="text-lg font-bold text-gray-800">{contact.value}</p>
            <p className="text-xs text-gray-400 mt-1">{contact.description}</p>
          </div>
        ))}
      </div>

      {/* Departments */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Подразделения</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {departments.map((dept, index) => (
            <div key={index} className="p-5 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-gray-800">{dept.name}</h4>
                  <p className="text-sm text-gray-500 mt-1">Руководитель: {dept.head}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="text-sm text-gray-600">{dept.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm text-blue-600">{dept.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-sm text-gray-600">{dept.workingHours}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <svg className="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-sm text-gray-500">{dept.address}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Map placeholder */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Расположение</h3>
        </div>
        <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center relative overflow-hidden">
          {/* Stylized map */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-10 left-10 w-32 h-32 border-2 border-blue-300 rounded-full"></div>
            <div className="absolute top-20 right-20 w-48 h-48 border-2 border-blue-300 rounded-full"></div>
            <div className="absolute bottom-10 left-1/3 w-24 h-24 border-2 border-blue-300 rounded-full"></div>
          </div>
          <div className="text-center z-10">
            <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-gray-700">г. Москва, ул. Ильинка, д. 21</p>
            <p className="text-xs text-gray-500 mt-1">Ближайшее метро: Площадь Революции</p>
          </div>
        </div>
      </div>
    </div>
  );
}
