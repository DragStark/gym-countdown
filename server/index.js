import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// Lấy biến môi trường
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const PORT = process.env.PORT || 3000;

// Khởi tạo Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Tạo server Express
const app = express();
app.use(cors());
app.use(express.json());

// Route test
app.get('/', (req, res) => {
  res.send('🚀 Node.js server is running!');
});

// Test kết nối Supabase
async function testSupabaseConnection() {
  const { data, error } = await supabase.from('DayRecord').select('*').limit(1);
  if (error) {
    console.error('❌ Kết nối Supabase thất bại:', error.message);
  } else {
    console.log('✅ Kết nối Supabase thành công!');
  }
}

testSupabaseConnection();

// Ví dụ: lấy dữ liệu từ bảng "todos"
app.get('/todos', async (req, res) => {
  const { data, error } = await supabase.from('todos').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Ví dụ: thêm 1 todo
app.post('/todos', async (req, res) => {
  const { title } = req.body;
  const { data, error } = await supabase.from('todos').insert([{ title }]);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running at http://localhost:${PORT}`);
});
