const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addCategory, getCategories, deleteCategory } = require('../controllers/categoryController');

// Маршрут для добавления новой категории
router.post('/', protect, addCategory);

// Маршрут для получения всех категорий текущего пользователя
router.get('/', protect, getCategories);

// Маршрут для удаления категории
router.delete('/:id', protect, deleteCategory);

module.exports = router;
