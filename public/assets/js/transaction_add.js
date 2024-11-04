document.addEventListener('DOMContentLoaded', async () => {
    const token = localStorage.getItem('token');

    const balanceElement = document.getElementById('balanceAmount');
    const transactionsTableBody = document.getElementById('transactionsTableBody');
    const categorySelect = document.getElementById('category');
    const categoryContainer = document.getElementById('categoryContainer');
    const typeSelect = document.getElementById('type');

    // Функция для скрытия/показа категории в зависимости от типа транзакции
    const toggleCategoryField = () => {
        const transactionType = typeSelect.value;
        if (transactionType === 'income') {
            categoryContainer.classList.add('d-none'); // Скрываем поле категории
            categorySelect.removeAttribute('required'); // Убираем required
        } else {
            categoryContainer.classList.remove('d-none'); // Показываем поле категории
            categorySelect.setAttribute('required', 'required'); // Добавляем required
        }
    };

    // Применяем логику при изменении типа транзакции
    typeSelect.addEventListener('change', toggleCategoryField);

    // При загрузке страницы проверяем начальное состояние
    toggleCategoryField();

    // Функция для загрузки данных пользователя (баланс)
    const loadUserData = async () => {
        try {
            const response = await fetch('/api/users/me', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const userData = await response.json();
            balanceElement.textContent = userData.money.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
        } catch (error) {
            console.error('Ошибка загрузки данных пользователя:', error);
        }
    };

    // Загрузка категорий
    const loadCategories = async () => {
        try {
            const response = await fetch('/api/categories', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const categories = await response.json();

            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.name;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Ошибка загрузки приложений:', error);
        }
    };

    // Загрузка транзакций
    const loadTransactions = async () => {
        try {
            const response = await fetch('/api/transactions', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const transactions = await response.json();

            transactionsTableBody.innerHTML = ''; // Очищаем таблицу перед обновлением

            transactions.forEach(transaction => {
                const row = document.createElement('tr');

                // Подсветка строки для расходов
                if (transaction.type === 'expense') {
                    row.classList.add('table-danger');
                }

                const transactionType = transaction.type === 'income' ? 'Доход' : 'Расходы';

                row.innerHTML = `
                    <td>${transaction.amount.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</td>
                    <td>${transaction.category || 'Пополнение средств'}</td>
                    <td>${transactionType}</td>
                    <td>${new Date(transaction.date).toLocaleDateString('ru-RU')}</td>
                `;
                transactionsTableBody.appendChild(row);
            });
        } catch (error) {
            console.error('Ошибка загрузки транзакций:', error);
        }
    };

    // Обработка формы добавления транзакции
    document.getElementById('transactionForm').addEventListener('submit', async function(event) {
        event.preventDefault();

        const amount = document.getElementById('amount').value;
        const category = categorySelect.value;
        const type = document.getElementById('type').value;

        try {
            const response = await fetch('/api/transactions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ amount, category: type === 'income' ? null : category, type })
            });

            if (response.ok) {
                // Очищаем форму и обновляем список транзакций
                document.getElementById('transactionForm').reset();
                await loadUserData(); // Обновляем баланс после добавления транзакции
                loadTransactions(); // Перезагружаем транзакции
                toggleCategoryField(); // Возвращаем к начальному состоянию поля категории
            } else {
                const data = await response.json();
                alert(`Error: ${data.message}`);
            }


        } catch (error) {
            console.error('Ошибка добавления транзакции:', error);
        }
    });

    // Инициализация страницы: загружаем данные пользователя и транзакции
    loadUserData();
    loadCategories();
    loadTransactions();
});
