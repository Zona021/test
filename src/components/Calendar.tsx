import { useState } from 'react';
import { useCalendar, EventType } from '../context/CalendarContext';
import { useAuth } from '../context/AuthContext';

export default function CalendarComponent() {
  const { events, addEvent, deleteEvent } = useCalendar();
  const { hasPermission } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    date: 15,
    month: 0,
    year: 2026,
    time: '',
    type: 'meeting' as EventType,
    location: '',
    description: '',
  });

  const currentMonth = new Date(2026, 0);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days = Array.from({ length: 42 }, (_, i) => {
    const dayNum = i - firstDay + 1;
    if (dayNum < 1 || dayNum > daysInMonth) return null;
    return dayNum;
  });

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getEventForDay = (day: number) => events.filter(e => e.date === day && e.month === 0 && e.year === 2026);

  const getEventTypeColor = (type: EventType) => {
    switch (type) {
      case 'meeting': return 'bg-blue-500';
      case 'work': return 'bg-emerald-500';
      case 'video': return 'bg-purple-500';
      case 'seminar': return 'bg-amber-500';
      case 'deadline': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getEventTypeLabel = (type: EventType) => {
    switch (type) {
      case 'meeting': return 'Заседание';
      case 'work': return 'Работа';
      case 'video': return 'ВКС';
      case 'seminar': return 'Семинар';
      case 'deadline': return 'Срок';
      default: return 'Другое';
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.time) return;
    addEvent(newEvent);
    setShowAddModal(false);
    setNewEvent({ title: '', date: 15, month: 0, year: 2026, time: '', type: 'meeting', location: '', description: '' });
  };

  const today = 15;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Календарь событий</h2>
          <p className="text-gray-500 text-sm mt-1">Планирование и расписание мероприятий</p>
        </div>
        {hasPermission('manage_calendar') && (
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium shadow-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Добавить событие
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Январь 2026</h3>
            <div className="flex items-center gap-2">
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-semibold text-gray-500 py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              const dayEvents = day ? getEventForDay(day) : [];
              const isToday = day === today;
              return (
                <div
                  key={index}
                  className={`aspect-square p-1 rounded-lg flex flex-col items-center justify-start relative transition-colors ${
                    day ? 'hover:bg-blue-50 cursor-pointer' : ''
                  } ${isToday ? 'bg-blue-100 ring-2 ring-blue-500' : ''}`}
                >
                  {day && (
                    <>
                      <span className={`text-sm font-medium ${isToday ? 'text-blue-700' : 'text-gray-700'}`}>
                        {day}
                      </span>
                      {dayEvents.length > 0 && (
                        <div className="flex gap-0.5 mt-1">
                          {dayEvents.slice(0, 3).map((event, i) => (
                            <div
                              key={i}
                              className={`w-1.5 h-1.5 rounded-full ${getEventTypeColor(event.type)}`}
                            ></div>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Events List */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Ближайшие события</h3>
          </div>
          <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
            {events.map((event) => (
              <div key={event.id} className="p-4 hover:bg-gray-50 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <span className="text-xs text-gray-400">Янв</span>
                    <span className="text-lg font-bold text-gray-800">{event.date}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{event.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`w-2 h-2 rounded-full ${getEventTypeColor(event.type)}`}></span>
                      <span className="text-xs text-gray-500">{getEventTypeLabel(event.type)}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{event.time}</p>
                    {event.location && (
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {event.location}
                      </p>
                    )}
                  </div>
                  {hasPermission('manage_calendar') && (
                    <button
                      onClick={() => deleteEvent(event.id)}
                      className="p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-50 text-gray-400 hover:text-red-600 transition-all"
                      title="Удалить"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">Обозначения</h4>
        <div className="flex flex-wrap gap-4">
          {[
            { type: 'meeting' as EventType, label: 'Заседания' },
            { type: 'work' as EventType, label: 'Рабочие дни' },
            { type: 'video' as EventType, label: 'ВКС' },
            { type: 'seminar' as EventType, label: 'Семинары' },
            { type: 'deadline' as EventType, label: 'Сроки' },
          ].map(item => (
            <div key={item.type} className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${getEventTypeColor(item.type)}`}></div>
              <span className="text-xs text-gray-600">{item.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">Добавить событие</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Название события *</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Введите название"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Дата (число) *</label>
                  <input
                    type="number"
                    min="1"
                    max="31"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent({...newEvent, date: parseInt(e.target.value)})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Время *</label>
                  <input
                    type="text"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="10:00"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Тип события</label>
                  <select
                    value={newEvent.type}
                    onChange={(e) => setNewEvent({...newEvent, type: e.target.value as EventType})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="meeting">Заседание</option>
                    <option value="work">Работа</option>
                    <option value="video">ВКС</option>
                    <option value="seminar">Семинар</option>
                    <option value="deadline">Срок</option>
                    <option value="other">Другое</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Место</label>
                  <input
                    type="text"
                    value={newEvent.location}
                    onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Зал заседаний"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Дополнительная информация..."
                />
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
                onClick={handleAddEvent}
                disabled={!newEvent.title || !newEvent.time}
                className="px-4 py-2 bg-blue-700 text-white rounded-xl text-sm font-medium hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Добавить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
