const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Регистрация пользователя
const register = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Проверяем, существует ли пользователь с таким же именем
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь с таким именем уже существует' });
        }

        // Хешируем пароль и создаем нового пользователя
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();

        res.status(201).json({ message: 'Пользователь создан' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера, попробуйте позже' });
    }
};

// Логин пользователя
const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Поиск пользователя
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Неверный логин или пароль' });
        }

        // Генерация токена с временем жизни 24 часа
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        // Отправка токена и данных пользователя
        res.json({
            token,
            user: {
                id: user._id,
                username: user.username
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера, попробуйте позже' });
    }
};

module.exports = { register, login };
