const Transaction = require('../models/Transaction');
const User = require('../models/User'); // Импортируем модель пользователя
const fs = require('fs');
const path = require('path')
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

// Добавление транзакции
const addTransaction = async (req, res) => {
    try {
        const { amount, category, type, description } = req.body;

        // Преобразуем amount в число
        const parsedAmount = parseFloat(amount);

        // Проверка обязательных полей
        if (!parsedAmount || !type) {
            return res.status(400).json({ message: 'Требуется указать сумму и тип' });
        }

        // Если это расход, то категория должна быть обязательно
        if (type === 'expense' && !category) {
            return res.status(400).json({ message: 'Категория обязательна для расходов' });
        }

        // Создаем новую транзакцию
        const transaction = new Transaction({
            user: req.user._id,
            amount: parsedAmount,
            category: type === 'expense' ? category : null, // Категория только для расходов
            type,
            description: description || '' // Описание необязательное
        });

        // Сохраняем транзакцию в базу данных
        await transaction.save();

        // Получаем пользователя
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        // Проверка на недостаток средств
        if (type === 'expense' && user.money < parsedAmount) {
            return res.status(400).json({ message: 'Недостаточно средств' });
        }

        // Обновляем баланс пользователя
        if (type === 'income') {
            user.money += parsedAmount; // Добавляем сумму, если доход
        } else {
            user.money -= parsedAmount; // Вычитаем сумму, если расход
        }

        // Сохраняем обновленного пользователя
        await user.save();

        res.status(201).json(transaction);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Сервер недоступен, попробуйте снова' });
    }
};

// Получение транзакций
const getTransactions = async (req, res) => {
    try {
        // Получаем все транзакции для пользователя
        const transactions = await Transaction.find({ user: req.user._id });

        if (!transactions.length) {
            return res.status(404).json({ message: 'Транзакции не найдены' });
        }

        res.json(transactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Сервер недоступен, попробуйте снова' });
    }
};

/// Получение расходов по категориям
const getExpensesByCategory = async (req, res) => {
    try {
        const expenses = await Transaction.aggregate([
            { $match: { user: req.user._id, type: 'expense' } }, // Фильтруем только расходы
            { $group: { _id: "$category", total: { $sum: "$amount" } } } // Группируем по категориям и суммируем
        ]);

        // Преобразуем результат для удобства
        const result = expenses.map(item => ({
            category: item._id,
            total: item.total
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Сервер недоступен, попробуйте снова' });
    }
};

// Экспорт транзакций в CSV
const exportTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user._id });

        if (!transactions.length) {
            return res.status(404).json({ message: 'Нет транзакций для экспорта' });
        }

        const csvRows = [];
        const headers = 'Amount,Category,Type,Description,Date';
        csvRows.push(headers);

        transactions.forEach(transaction => {
            const row = `${transaction.amount},${transaction.category || ''},${transaction.type},${transaction.description},${transaction.date}`;
            csvRows.push(row);
        });

        const csvString = csvRows.join('\n');
        const dirPath = path.join(__dirname, '../export'); // Путь к директории export

        // Проверяем, существует ли директория, если нет, создаем ее
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        const filePath = path.join(dirPath, 'transactions.csv'); // Полный путь к файлу

        fs.writeFileSync(filePath, csvString);
        res.download(filePath, 'transactions.csv', (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Ошибка при загрузке файла');
            }
            fs.unlinkSync(filePath); // Удаляем файл после скачивания
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера, попробуйте позже' });
    }
};


// Импорт транзакций из CSV
const importTransactions = async (req, res) => {
    try {
        const filePath = req.file.path;
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const rows = fileContent.split('\n').slice(1); // Пропускаем заголовок

        for (const row of rows) {
            if (row.trim()) { // Проверяем, что строка не пустая
                const [amount, category, type, description, date] = row.split(',');
                const parsedAmount = parseFloat(amount);

                // Проверяем, что значения валидные
                if (isNaN(parsedAmount) || !type || !date) {
                    console.error('Некорректные данные в строке:', row);
                    continue; // Пропускаем некорректные строки
                }

                const transaction = new Transaction({
                    user: req.user._id,
                    amount: parsedAmount,
                    category: type === 'expense' ? category : null,
                    type,
                    description,
                    date: new Date(date)
                });

                await transaction.save();
            }
        }

        fs.unlinkSync(filePath); // Удаляем временный файл
        res.status(200).json({ message: 'Транзакции импортированы успешно' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Ошибка сервера, попробуйте позже' });
    }
};


module.exports = { addTransaction, getTransactions, getExpensesByCategory, exportTransactions, importTransactions };
