const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { protect } = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Применяем защитное middleware ко всем маршрутам, требующим авторизации
app.use('/api/transactions', protect, require('./routes/transactions'));
app.use('/api/categories', protect, require('./routes/category'));
app.use('/api/users', protect, require('./routes/user'));

// Routes
app.use('/api/auth', require('./routes/auth')); // Не требует авторизации

// Статические файлы
app.use(express.static('public'));
app.use('/auth', express.static('auth')); // Публичные файлы для страниц авторизации

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
