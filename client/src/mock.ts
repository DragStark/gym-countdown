type Exercise = {
  name: string;
  caloriesPerSet: number; // Calo đốt được trong 45 giây WORK
};

// 1. Bài tập cường độ cao
export const mockExerciseBurpees: Exercise = {
  name: "Burpees (Toàn Thân)",
  caloriesPerSet: 10, 
};

// 2. Bài tập cường độ trung bình
export const mockExerciseSquats: Exercise = {
  name: "Air Squats (Chân)",
  caloriesPerSet: 6, 
};

// 3. Bài tập cường độ thấp/cơ bụng
export const mockExercisePlank: Exercise = {
  name: "Plank (Cơ Bụng)",
  caloriesPerSet: 4, 
};

// 4. Ví dụ sử dụng trong props đầy đủ
export const mockGymTimerProps: { totalSets: number, exercise: Exercise } = {
  totalSets: 5,
  exercise: mockExerciseBurpees, // Sử dụng một trong các mock trên
};


// Định nghĩa lại các Type cần thiết (dựa trên phiên bản đã sửa)
type DailyStats = {
  completionPercentage: number; 
  caloriesBurned: number;      
  completed: boolean; 
};

type WorkoutData = Record<string, DailyStats | undefined>;

// Lấy ngày hiện tại để tạo dữ liệu giả lập có liên quan đến thời gian thực
const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1; // getMonth() là 0-indexed

// Hàm tiện ích để tạo chuỗi ngày
const getDateString = (day: number): string => {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
};

export const mockWorkoutData: WorkoutData = {
  // Ngày Thứ Hai - 14
  [getDateString(14)]: { 
    completionPercentage: 100, 
    caloriesBurned: 350, 
    completed: true 
  },
  // Ngày Thứ Ba - 15 (Ngày không hoàn thành)
  [getDateString(15)]: { 
    completionPercentage: 0, 
    caloriesBurned: 0, 
    completed: false 
  },
  // Ngày Thứ Tư - 16 (Hoàn thành một phần)
  [getDateString(16)]: { 
    completionPercentage: 60, 
    caloriesBurned: 120, 
    completed: true // Coi như đã tập, dù chưa đạt 100%
  },
  // Ngày Thứ Năm - 17 (Hoàn thành tốt)
  [getDateString(17)]: { 
    completionPercentage: 95, 
    caloriesBurned: 280, 
    completed: true 
  },
  // Ngày Thứ Sáu - 18 (Hoàn thành 100%)
  [getDateString(18)]: { 
    completionPercentage: 100, 
    caloriesBurned: 420, 
    completed: true 
  },
  // Ngày Thứ Bảy - 19
  [getDateString(19)]: { 
    completionPercentage: 0, 
    caloriesBurned: 0, 
    completed: false 
  },
  // Ngày Chủ Nhật - 20 (Hôm nay, giả sử chưa hoàn thành)
  [getDateString(20)]: { 
    completionPercentage: 0, 
    caloriesBurned: 0, 
    completed: false 
  },
  // Thêm một ngày khác ngoài tuần hiện tại để kiểm tra
  [getDateString(25)]: { 
    completionPercentage: 100, 
    caloriesBurned: 300, 
    completed: true 
  },
};

