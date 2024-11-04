const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
    // Разрешаем доступ к страницам логина и регистрации
    if (req.path.startsWith('/api/auth')) {
        return next();
    }

    let token;

    // Проверяем наличие токена в заголовке авторизации
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1]; // Извлекаем токен
    }

    // Если токена нет, отправляем статус 401
    if (!token) {
        return res.status(401).json({ message: 'Не авторизован, нет токена' });
    }

    try {
        // Проверяем и декодируем токен
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id); // Находим пользователя по id

        // Если пользователь не найден, отправляем статус 401
        if (!req.user) {
            return res.status(401).json({ message: 'Не авторизован, пользователь не найден' });
        }

        next(); //
    } catch (error) {
        // При ошибке авторизации — отправляем статус 401
        return res.status(401).json({ message: 'Не авторизован, плохой токен' });
    }
};

module.exports = { protect };
