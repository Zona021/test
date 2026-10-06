import { useState } from 'react';

export default function Documents() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: 'all', label: 'Все документы', count: 156 },
    { id: 'laws', label: 'Законы и кодексы', count: 24 },
    { id: 'decrees', label: 'Постановления ЦИК', count: 47 },
    { id: 'instructions', label: 'Инструкции', count: 38 },
    { id: 'templates', label: 'Шаблоны и формы', count: 47 },
  ];

  const documents = [
    { id: 1, title: 'Федеральный закон №67-ФЗ «Об основных гарантиях избирательных прав»', category: 'laws', date: '12.06.2002', size: '2.4 МБ', format: 'PDF', status: 'active' },
    { id: 2, title: 'Постановление ЦИК России №247/5678-7 «О порядке финансирования»', category: 'decrees', date: '10.01.2026', size: '856 КБ', format: 'PDF', status: 'active' },
    { id: 3, title: 'Постановление ЦИК России №246/5670-7 «О регламенте работы»', category: 'decrees', date: '08.01.2026', size: '1.1 МБ', format: 'PDF', status: 'active' },
    { id: 4, title: 'Инструкция по заполнению формы протокола участковой избирательной комиссии', category: 'instructions', date: '05.01.2026', size: '3.2 МБ', format: 'DOCX', status: 'active' },
    { id: 5, title: 'Шаблон протокола УИК об итогах голосования (форма ПЭВМ)', category: 'templates', date: '03.01.2026', size: '456 КБ', format: 'XLSX', status: 'active' },
    { id: 6, title: 'Федеральный закон №19-ФЗ «О выборах депутатов Государственной Думы»', category: 'laws', date: '22.02.1994', size: '1.8 МБ', format: 'PDF', status: 'active' },
    { id: 7, title: 'Инструкция по работе с ГАС «Выборы» (модуль подготовки)', category: 'instructions', date: '28.12.2025', size: '5.1 МБ', format: 'PDF', status: 'active' },
    { id: 8, title: 'Шаблон заявления кандидата о согласии баллотироваться', category: 'templates', date: '25.12.2025', size: '234 КБ', format: 'DOCX', status: 'active' },
    { id: 9, title: 'Постановление ЦИК России №245/5650-7 «О контроле за finansированием»', category: 'decrees', date: '20.12.2025', size: '978 КБ', format: 'PDF', status: 'archived' },
    { id: 10, title: 'Методические рекомендации по организации видеонаблюдения', category: 'instructions', date: '15.12.2025', size: '2.7 МБ', format: 'PDF', status: 'active' },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF': return 'bg-red-100 text-red-700';
      case 'DOCX': return 'bg-blue-100 text-blue-700';
      case 'XLSX': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Документы</h2>
          <p className="text-gray-500 text-sm mt-1">Нормативные акты, инструкции и шаблоны</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium shadow-sm">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Загрузить документ
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          placeholder="Поиск документов..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeCategory === cat.id
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'
            }`}
          >
            {cat.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${
              activeCategory === cat.id ? 'bg-white/20' : 'bg-gray-100'
            }`}>
              {cat.count}
            </span>
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Документ</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Дата</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Размер</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Формат</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{doc.title}</p>
                        <p className="text-xs text-gray-400 md:hidden">{doc.date}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 hidden md:table-cell">{doc.date}</td>
                  <td className="px-5 py-4 text-sm text-gray-500 hidden sm:table-cell">{doc.size}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getFormatColor(doc.format)}`}>
                      {doc.format}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Скачать">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors" title="Просмотр">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredDocs.length === 0 && (
          <div className="p-8 text-center text-gray-400">
            <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p className="text-sm">Документы не найдены</p>
          </div>
        )}
      </div>
    </div>
  );
}
