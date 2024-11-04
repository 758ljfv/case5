const Category = require('../models/Category');

// Добавление новой категории
const addCategory = async (req, res) => {
    try {
        const { name } = req.body;

        // Проверяем, указано ли имя категории
        if (!name) {
            return res.status(400).json({ message: 'Введите имя категории' });
        }

        // Проверяем, есть ли уже такая категория для текущего пользователя
        const existingCategory = await Category.findOne({ name, user: req.user._id });

        // Если категория существует для текущего пользователя, возвращаем ошибку
        if (existingCategory) {
            return res.status(400).json({ message: 'Такая категория у данного пользователя уже существует' });
        }

        // Создаем новую категорию для текущего пользователя
        const category = new Category({
            name,
            user: req.user._id, // Привязываем категорию к текущему пользователю
        });

        await category.save();
        res.status(201).json(category);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};


// Получение категорий для текущего пользователя
const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({ user: req.user._id });
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка сервера' });
    }
};

// Удаление категории
const deleteCategory = async (req, res) => {
    try {
        // Проверка корректности ID категории
        if (!req.params.id || req.params.id.length !== 24) {
            return res.status(400).json({ message: 'Неверный ID категории' });
        }

        // Проверка наличия пользователя
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: 'Пользователь не авторизирован!' });
        }

        const category = await Category.findById(req.params.id);

        // Проверяем, существует ли категория и принадлежит ли она текущему пользователю
        if (!category) {
            return res.status(404).json({ message: 'Категория не найдена' });
        }

        if (category.user.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Не авторизован, для удаления категории' });
        }

        await Category.deleteOne({ _id: req.params.id }); // Удаляем категорию
        res.json({ message: 'Категория удалена' });
    } catch (error) {
        console.error('Ошибка при удалении категории:', error);
        res.status(500).json({ message: 'Ошибка сервера 111' });
    }
};



module.exports = { addCategory, getCategories, deleteCategory };
