import { useState } from 'react';
import { useDocuments } from '../context/DocumentsContext';
import { useAuth } from '../context/AuthContext';

export default function Documents() {
  const { documents, pendingDocuments, addDocument, approveDocument, rejectDocument, deleteDocument } = useDocuments();
  const { currentUser, hasPermission } = useAuth();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState<string | null>(null);
  const [reviewComment, setReviewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'approved' | 'pending'>('approved');

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: 'instructions',
    description: '',
    format: 'PDF',
    size: '',
    uploadedBy: currentUser?.username || '',
  });

  const categories = [
    { id: 'all', label: 'Все документы', count: documents.filter(d => d.status === 'approved').length },
    { id: 'laws', label: 'Законы и кодексы', count: documents.filter(d => d.status === 'approved' && d.category === 'laws').length },
    { id: 'decrees', label: 'Постановления ЦИК', count: documents.filter(d => d.status === 'approved' && d.category === 'decrees').length },
    { id: 'instructions', label: 'Инструкции', count: documents.filter(d => d.status === 'approved' && d.category === 'instructions').length },
    { id: 'templates', label: 'Шаблоны и формы', count: documents.filter(d => d.status === 'approved' && d.category === 'templates').length },
  ];

  const filteredDocs = documents.filter(doc => {
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = activeTab === 'approved' ? doc.status === 'approved' : doc.status === 'pending';
    return matchesCategory && matchesSearch && matchesStatus;
  });

  const getFormatColor = (format: string) => {
    switch (format) {
      case 'PDF': return 'bg-red-100 text-red-700';
      case 'DOCX': return 'bg-blue-100 text-blue-700';
      case 'XLSX': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const handleAddDocument = () => {
    if (!newDoc.title || !currentUser) return;
    addDocument({
      ...newDoc,
      uploadedBy: currentUser.username,
      size: newDoc.size || '100 КБ',
    });
    setShowAddModal(false);
    setNewDoc({ title: '', category: 'instructions', description: '', format: 'PDF', size: '', uploadedBy: currentUser.username });
  };

  const handleReview = (docId: string, action: 'approve' | 'reject') => {
    if (action === 'approve') {
      approveDocument(docId, reviewComment || undefined);
    } else {
      rejectDocument(docId, reviewComment || 'Не соответствует требованиям');
    }
    setShowReviewModal(null);
    setReviewComment('');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Документы</h2>
          <p className="text-gray-500 text-sm mt-1">Нормативные акты, инструкции и шаблоны</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium shadow-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Загрузить документ
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => setActiveTab('approved')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === 'approved' ? 'bg-blue-700 text-white' : 'bg-white text-gray-600 border border-gray-200'
          }`}
        >
          Утверждённые ({documents.filter(d => d.status === 'approved').length})
        </button>
        {hasPermission('review_documents') && (
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
              activeTab === 'pending' ? 'bg-amber-600 text-white' : 'bg-white text-gray-600 border border-gray-200'
            }`}
          >
            На модерации
            {pendingDocuments.length > 0 && (
              <span className={`px-1.5 py-0.5 text-xs rounded-full ${
                activeTab === 'pending' ? 'bg-white/20' : 'bg-amber-100 text-amber-700'
              }`}>
                {pendingDocuments.length}
              </span>
            )}
          </button>
        )}
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
      {activeTab === 'approved' && (
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
      )}

      {/* Documents Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Документ</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Загрузил</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Дата</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Формат</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDocs.map(doc => (
                <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        doc.status === 'pending' ? 'bg-amber-50' : 'bg-gray-100'
                      }`}>
                        <svg className={`w-4 h-4 ${doc.status === 'pending' ? 'text-amber-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800 line-clamp-1">{doc.title}</p>
                        {doc.description && (
                          <p className="text-xs text-gray-400 mt-0.5">{doc.description}</p>
                        )}
                        {doc.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-1">
                            <span className="w-1.5 h-1.5 bg-amber-500 rounded-full"></span>
                            Ожидает модерации
                          </span>
                        )}
                        {doc.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 text-xs text-red-600 mt-1">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                            Отклонён
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-gray-500 hidden md:table-cell">@{doc.uploadedBy}</td>
                  <td className="px-5 py-4 text-sm text-gray-500 hidden sm:table-cell">{doc.uploadedAt}</td>
                  <td className="px-5 py-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getFormatColor(doc.format)}`}>
                      {doc.format}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {doc.status === 'approved' && (
                        <button className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Скачать">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                          </svg>
                        </button>
                      )}
                      {doc.status === 'pending' && hasPermission('review_documents') && (
                        <>
                          <button
                            onClick={() => { setShowReviewModal(doc.id); setReviewComment(''); }}
                            className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                            title="Проверить"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </button>
                        </>
                      )}
                      {(hasPermission('delete_documents') || doc.uploadedBy === currentUser?.username) && (
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                          title="Удалить"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
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
            <p className="text-sm">
              {activeTab === 'pending' ? 'Нет документов на модерации' : 'Документы не найдены'}
            </p>
          </div>
        )}
      </div>

      {/* Add Document Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-800">Загрузить документ</h3>
                <p className="text-xs text-gray-500 mt-0.5">Документ будет отправлен на модерацию</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название документа *</label>
                <input
                  type="text"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({...newDoc, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите название документа"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={newDoc.description}
                  onChange={(e) => setNewDoc({...newDoc, description: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Краткое описание документа"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                  <select
                    value={newDoc.category}
                    onChange={(e) => setNewDoc({...newDoc, category: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="laws">Законы и кодексы</option>
                    <option value="decrees">Постановления ЦИК</option>
                    <option value="instructions">Инструкции</option>
                    <option value="templates">Шаблоны и формы</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Формат</label>
                  <select
                    value={newDoc.format}
                    onChange={(e) => setNewDoc({...newDoc, format: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                  </select>
                </div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <div className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-xs text-blue-700">
                    Документ будет отправлен на модерацию. После одобрения администратором он появится в общем доступе.
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleAddDocument}
                disabled={!newDoc.title}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Отправить на модерацию
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowReviewModal(null)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Проверка документа</h3>
              <p className="text-xs text-gray-500 mt-1">
                {documents.find(d => d.id === showReviewModal)?.title}
              </p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Комментарий (необязательно)</label>
                <textarea
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Ваш комментарий..."
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => handleReview(showReviewModal, 'reject')}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-xl text-sm font-medium hover:bg-red-200 transition-colors"
              >
                Отклонить
              </button>
              <button
                onClick={() => handleReview(showReviewModal, 'approve')}
                className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 transition-colors"
              >
                Одобрить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
