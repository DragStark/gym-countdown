import React from 'react';

// Định nghĩa lại các Type cần thiết
type DailyStats = {
  completionPercentage: number;
  caloriesBurned: number;
  completed: boolean;
};
type WorkoutData = Record<string, DailyStats | undefined>;

export function WorkoutCalendar({
  workoutData, 
}: {
  workoutData: WorkoutData;
}) {
  // Lấy ngày hiện tại ở định dạng YYYY-MM-DD
  const todayStr = new Date().toISOString().split("T")[0]; 
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString("vi-VN", { month: "long" }); 
  
  // --- Logic Lấy Dữ Liệu và Cấu Trúc Lịch (Không thay đổi) ---
  
  // Tìm ngày hiện tại
  const today = new Date();
  // Lấy ngày đầu tuần (Thứ Hai)
  const diff = today.getDate() - today.getDay() + (today.getDay() === 0 ? -6 : 1); 
  const startOfWeek = new Date(today.setDate(diff));
  
  const currentWeekDays: { dateStr: string, dayName: string, dayOfMonth: number }[] = [];

  for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      
      currentWeekDays.push({
          dateStr: date.toISOString().split("T")[0],
          dayName: date.toLocaleString("vi-VN", { weekday: "short" }),
          dayOfMonth: date.getDate(),
      });
  }

  // --- Kết Xuất Component ---

  const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]; 
  
  return (
    <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white">Lịch Tập Luyện</h2>
      <p className="text-md font-medium text-indigo-600 dark:text-indigo-400 mb-4">
        Tuần hiện tại ({monthName} {year})
      </p>

      <div className="overflow-x-auto">
        <table className="min-w-full table-fixed divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              {/* Cột Ngày Thứ */}
              <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[10%]">
                Ngày
              </th>
              {/* Các Cột Thứ 2 -> Chủ Nhật */}
              {dayNames.map((dayName) => (
                <th key={dayName} className="px-2 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400 w-[12.8%]">
                  {dayName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            
            {/* Hàng 1: Ngày trong tháng & Chỉ số % Hoàn Thành */}
            <tr>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white sticky left-0 bg-white dark:bg-gray-800">
                Hoàn Thành (%)
              </td>
              {currentWeekDays.map(({ dateStr, dayOfMonth }) => {
                const data = workoutData[dateStr];
                const completion = data?.completionPercentage ?? 0;
                
                // --- PHẦN HIGHLIGHT NGÀY HIỆN TẠI ĐƯỢC THÊM TẠI ĐÂY ---
                const isToday = dateStr === todayStr;

                return (
                  <td 
                    key={dateStr || Math.random()} 
                    className={`px-2 py-3 text-center text-sm font-medium transition-all duration-300 ${
                        isToday 
                          ? 'bg-indigo-100 dark:bg-indigo-700/50 border-2 border-indigo-500 rounded-lg' // Highlight cho ngày hiện tại
                          : data?.completed
                          ? 'bg-green-50 dark:bg-green-900 text-green-700 dark:text-green-300' 
                          : dayOfMonth === 0 
                          ? 'bg-gray-100 dark:bg-gray-700' 
                          : 'text-gray-900 dark:text-gray-200'
                    }`}
                  >
                    {/* Hiển thị ngày trong tháng */}
                    <div className={`text-xs mb-1 font-bold ${isToday ? 'text-indigo-900 dark:text-indigo-100' : ''}`}>
                        {dayOfMonth > 0 ? dayOfMonth : ''}
                    </div>
                    {/* Hiển thị % Hoàn Thành */}
                    <div className={`text-md font-semibold ${completion === 100 ? 'text-green-600' : completion > 0 ? 'text-indigo-600' : 'text-gray-400'}`}>
                        {dayOfMonth > 0 ? `${completion}%` : '-'}
                    </div>
                  </td>
                );
              })}
            </tr>

            {/* Hàng 2: Số Calo Đốt Được */}
            <tr>
              <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white sticky left-0 bg-white dark:bg-gray-800">
                Calo Đốt (kcal)
              </td>
              {currentWeekDays.map(({ dateStr, dayOfMonth }) => {
                const data = workoutData[dateStr];
                const calories = data?.caloriesBurned ?? 0;
                const isToday = dateStr === todayStr; // Kiểm tra ngày hiện tại

                return (
                  <td 
                    key={dateStr || Math.random()} 
                    className={`px-2 py-3 text-center text-sm ${
                        isToday 
                        ? 'bg-indigo-100 dark:bg-indigo-700/50 border-x-2 border-b-2 border-indigo-500' // Highlight cho ngày hiện tại (chỉ cần border dưới và bên)
                        : dayOfMonth === 0 
                        ? 'bg-gray-100 dark:bg-gray-700' 
                        : ''
                    }`}
                  >
                    <span className="text-gray-700 dark:text-gray-300">
                        {dayOfMonth > 0 ? `${calories} kcal` : '-'}
                    </span>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}