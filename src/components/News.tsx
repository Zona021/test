import { useState } from 'react';

export default function News() {
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'official', label: 'Официальные' },
    { id: 'announcements', label: 'Объявления' },
    { id: 'legislation', label: 'Законодательство' },
  ];

  const news = [
    {
      id: 1,
      category: 'official',
      title: 'Заседание Центральной избирательной комиссии Российской Федерации',
      summary: '15 января 2026 года состоялось заседание ЦИК России. Рассмотрены вопросы подготовки к выборам, утверждены регламенты и назначены ответственные лица.',
      date: '15 января 2026',
      author: 'Пресс-служба ЦИК',
      image: '🏛️',
      important: true,
    },
    {
      id: 2,
      category: 'legislation',
      title: 'Изменения в Федеральный закон «Об основных гарантиях избирательных прав»',
      summary: 'Внесены изменения в порядок формирования избирательных комиссий и сроки подачи документов кандидатами. Документ вступает в силу с 1 февраля 2026 года.',
      date: '14 января 2026',
      author: 'Правовой отдел',
      image: '📜',
      important: true,
    },
    {
      id: 3,
      category: 'announcements',
      title: 'Семинар для членов территориальных избирательных комиссий',
      summary: 'Приглашаем членов ТИК на обучающий семинар по работе с ГАС «Выборы». Семинар состоится 20 января 2026 года в конференц-зале ЦИК.',
      date: '13 января 2026',
      author: 'Отдел обучения',
      image: '🎓',
      important: false,
    },
    {
      id: 4,
      category: 'official',
      title: 'Итоги мониторинга избирательного процесса в субъектах РФ',
      summary: 'Подведены итоги мониторинга подготовки к региональным выборам. Отмечена высокая степень готовности избирательной инфраструктуры в большинстве субъектов.',
      date: '12 января 2026',
      author: 'Департамент мониторинга',
      image: '📊',
      important: false,
    },
    {
      id: 5,
      category: 'announcements',
      title: 'Обновление программного обеспечения ГАС «Выборы»',
      summary: 'Планируется обновление модуля обработки протоколов участковых избирательных комиссий. Просьба ознакомиться с инструкцией по установке.',
      date: '11 января 2026',
      author: 'IT-отдел',
      image: '💻',
      important: false,
    },
    {
      id: 6,
      category: 'legislation',
      title: 'Методические рекомендации по работе с обращениями граждан',
      summary: 'Утверждены обновлённые методические рекомендации по порядку рассмотрения обращений граждан, связанных с избирательным процессом.',
      date: '10 января 2026',
      author: 'Контрольно-ревизионная служба',
      image: '📋',
      important: false,
    },
  ];

  const filteredNews = activeFilter === 'all' ? news : news.filter(n => n.category === activeFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Новости и объявления</h2>
          <p className="text-gray-500 text-sm mt-1">Актуальная информация для сотрудников</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter.id
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-700'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.map(item => (
          <article
            key={item.id}
            className={`bg-white rounded-xl border shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden ${
              item.important ? 'border-l-4 border-l-red-500 border-gray-100' : 'border-gray-100'
            }`}
          >
            <div className="p-5 md:p-6">
              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-12 h-12 bg-gray-50 rounded-xl items-center justify-center text-2xl flex-shrink-0">
                  {item.image}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    {item.important && (
                      <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded-full">
                        Важно
                      </span>
                    )}
                    <span className="px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-full">
                      {item.category === 'official' ? 'Официальное' : item.category === 'announcements' ? 'Объявление' : 'Законодательство'}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-700 cursor-pointer transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mt-2 leading-relaxed">{item.summary}</p>
                  <div className="flex items-center gap-4 mt-3">
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {item.date}
                    </span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      {item.author}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
