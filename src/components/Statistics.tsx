export default function Statistics() {
  const regionData = [
    { region: 'Москва', voters: 7498512, turnout: 62.3, processed: 98.7 },
    { region: 'Санкт-Петербург', voters: 3962145, turnout: 58.7, processed: 97.2 },
    { region: 'Московская область', voters: 5234789, turnout: 55.1, processed: 96.8 },
    { region: 'Краснодарский край', voters: 4123456, turnout: 67.8, processed: 99.1 },
    { region: 'Свердловская область', voters: 3456789, turnout: 54.2, processed: 95.4 },
    { region: 'Республика Татарстан', voters: 2987654, turnout: 78.9, processed: 99.5 },
    { region: 'Нижегородская область', voters: 2654321, turnout: 56.3, processed: 97.8 },
    { region: 'Самарская область', voters: 2456789, turnout: 53.8, processed: 96.2 },
  ];

  const electionTypes = [
    { type: 'Президентские выборы', count: 1, status: 'Подготовка', color: 'bg-blue-500' },
    { type: 'Региональные выборы', count: 14, status: 'Активная фаза', color: 'bg-emerald-500' },
    { type: 'Муниципальные выборы', count: 47, status: 'Завершены', color: 'bg-gray-400' },
  ];

  const monthlyData = [
    { month: 'Авг', value: 45 },
    { month: 'Сен', value: 62 },
    { month: 'Окт', value: 78 },
    { month: 'Ноя', value: 55 },
    { month: 'Дек', value: 89 },
    { month: 'Янв', value: 72 },
  ];

  const maxValue = Math.max(...monthlyData.map(d => d.value));

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Статистика</h2>
        <p className="text-gray-500 text-sm mt-1">Аналитические данные по избирательному процессу</p>
      </div>

      {/* Election Types */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {electionTypes.map((item, index) => (
          <div key={index} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
              <span className="text-sm text-gray-500">{item.status}</span>
            </div>
            <p className="text-3xl font-bold text-gray-800">{item.count}</p>
            <p className="text-sm text-gray-600 mt-1">{item.type}</p>
          </div>
        ))}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Обработка протоколов (тыс.)</h3>
        <div className="flex items-end justify-between gap-2 h-48">
          {monthlyData.map((item, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-gray-600">{item.value}</span>
              <div
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg transition-all duration-500 hover:from-blue-700 hover:to-blue-500"
                style={{ height: `${(item.value / maxValue) * 100}%`, minHeight: '20px' }}
              ></div>
              <span className="text-xs text-gray-500">{item.month}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Regions Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Данные по регионам</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Регион</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Избиратели</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Явка</th>
                <th className="text-right px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Обработка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {regionData.map((region, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">{region.region}</p>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <span className="text-sm text-gray-600">{region.voters.toLocaleString('ru-RU')}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${region.turnout}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{region.turnout}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${region.processed > 98 ? 'bg-blue-500' : region.processed > 96 ? 'bg-yellow-500' : 'bg-orange-500'}`}
                          style={{ width: `${region.processed}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-700">{region.processed}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
          <p className="text-sm text-blue-600 font-medium">Всего обработано</p>
          <p className="text-2xl font-bold text-blue-800 mt-1">89 432</p>
          <p className="text-xs text-blue-500 mt-1">протоколов УИК</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-5 border border-emerald-200">
          <p className="text-sm text-emerald-600 font-medium">Средняя явка</p>
          <p className="text-2xl font-bold text-emerald-800 mt-1">60.9%</p>
          <p className="text-xs text-emerald-500 mt-1">по monitored регионам</p>
        </div>
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-5 border border-purple-200">
          <p className="text-sm text-purple-600 font-medium">Жалоб рассмотрено</p>
          <p className="text-2xl font-bold text-purple-800 mt-1">1 247</p>
          <p className="text-xs text-purple-500 mt-1">за текущий период</p>
        </div>
        <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-5 border border-amber-200">
          <p className="text-sm text-amber-600 font-medium">Наблюдателей</p>
          <p className="text-2xl font-bold text-amber-800 mt-1">34 521</p>
          <p className="text-xs text-amber-500 mt-1">аккредитовано</p>
        </div>
      </div>
    </div>
  );
}
