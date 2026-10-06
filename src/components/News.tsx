import { useState } from 'react';
import { useNews, NewsCategory } from '../context/NewsContext';
import { useAuth } from '../context/AuthContext';
import { useActivity } from '../context/ActivityContext';

export default function News() {
  const { news, addNews, deleteNews, toggleImportant } = useNews();
  const { currentUser, hasPermission } = useAuth();
  const { addActivity, addNotification } = useActivity();
  const [activeFilter, setActiveFilter] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newNews, setNewNews] = useState({
    category: 'announcements' as NewsCategory,
    title: '',
    summary: '',
    emoji: '📢',
    important: false,
  });

  const filters = [
    { id: 'all', label: 'Все' },
    { id: 'official', label: 'Официальные' },
    { id: 'announcements', label: 'Объявления' },
    { id: 'legislation', label: 'Законодательство' },
  ];

  const emojis = ['📢', '🏛️', '📜', '📋', '🎓', '💻', '📊', '⚖️', '🔔', '📌'];

  const canCreateNews = hasPermission('edit_news');

  const filteredNews = activeFilter === 'all' ? news : news.filter(n => n.category === activeFilter);

  const handleCreateNews = () => {
    if (!newNews.title || !newNews.summary || !currentUser) return;
    
    addNews({
      ...newNews,
      author: currentUser.fullName,
      authorId: currentUser.id,
    });

    addActivity({
      userId: currentUser.id,
      userName: currentUser.fullName,
      type: 'task_assign',
      description: `Опубликована новость: "${newNews.title}"`,
    });

    // Notify all active users
    addNotification({
      userId: currentUser.id,
      title: 'Новость опубликована',
      message: `Вы опубликовали новость: "${newNews.title}"`,
      type: 'success',
    });

    setShowCreateModal(false);
    setNewNews({
      category: 'announcements',
      title: '',
      summary: '',
      emoji: '📢',
      important: false,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Новости и объявления</h2>
          <p className="text-gray-500 text-sm mt-1">Актуальная информация для сотрудников</p>
        </div>
        {canCreateNews && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Создать новость
          </button>
        )}
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
      {filteredNews.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-600">Новостей пока нет</h3>
          <p className="text-sm text-gray-400 mt-1">
            {canCreateNews ? 'Создайте первую новость, нажав кнопку выше' : 'Новости появятся здесь после публикации администратором'}
          </p>
        </div>
      ) : (
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
                    {item.emoji}
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
                    <h3 className="text-lg font-semibold text-gray-800">
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
                      {canCreateNews && (
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => toggleImportant(item.id)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              item.important 
                                ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                                : 'bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-600'
                            }`}
                            title={item.important ? 'Снять отметку важно' : 'Отметить как важное'}
                          >
                            <svg className="w-4 h-4" fill={item.important ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => deleteNews(item.id)}
                            className="p-1.5 rounded-lg bg-gray-50 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                            title="Удалить"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Create News Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Создать новость</h3>
              <button onClick={() => setShowCreateModal(false)} className="p-1.5 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Иконка</label>
                <div className="flex flex-wrap gap-2">
                  {emojis.map(emoji => (
                    <button
                      key={emoji}
                      onClick={() => setNewNews({...newNews, emoji})}
                      className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${
                        newNews.emoji === emoji 
                          ? 'bg-blue-100 ring-2 ring-blue-500' 
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select
                  value={newNews.category}
                  onChange={(e) => setNewNews({...newNews, category: e.target.value as NewsCategory})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="official">Официальное</option>
                  <option value="announcements">Объявление</option>
                  <option value="legislation">Законодательство</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Заголовок *</label>
                <input
                  type="text"
                  value={newNews.title}
                  onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите заголовок новости"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Содержание *</label>
                <textarea
                  value={newNews.summary}
                  onChange={(e) => setNewNews({...newNews, summary: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={4}
                  placeholder="Введите текст новости"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="important"
                  checked={newNews.important}
                  onChange={(e) => setNewNews({...newNews, important: e.target.checked})}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="important" className="text-sm text-gray-700">Отметить как важное</label>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleCreateNews}
                disabled={!newNews.title || !newNews.summary}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Опубликовать
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
