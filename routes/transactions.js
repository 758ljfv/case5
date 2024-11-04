const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { addTransaction, getTransactions, getExpensesByCategory, exportTransactions, importTransactions } = require('../controllers/transactionController');
const multer = require('multer');


const upload = multer({ dest: 'uploads/' });

// Защищенный маршрут для получения транзакций
router.get('/', protect, getTransactions);

// Защищенный маршрут для добавления новой транзакции
router.post('/', protect, addTransaction);

// Защищенный маршрут для получения расходов по категориям
router.get('/expensesByCategory', protect, getExpensesByCategory);

router.get('/export', protect, exportTransactions); // Экспорт транзакций
router.post('/import', protect, upload.single('file'), importTransactions); // Импорт транзакций

module.exports = router;
