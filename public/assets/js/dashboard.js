// Функция для получения расходов по категориям
async function fetchExpenseData() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/transactions/expensesByCategory', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await response.json();
        if (response.ok) {
            if (data.length > 0) {
                renderExpenseChart(data); // Отправляем данные в функцию построения диаграммы
                document.getElementById('message').style.display = 'none'; // Скрыть сообщение
            } else {
                document.getElementById('expensesChart').style.display = 'none'; // Скрыть диаграмму
                document.getElementById('message').textContent = 'У вас пока нет транзакций с типом расходы. Вы можете их создать на странице "Транзакции"';
                document.getElementById('message').style.display = 'block'; // Показать сообщение
            }
        } else {
            document.getElementById('message').textContent = 'Ошибка загрузки данных!';
            document.getElementById('message').style.display = 'block'; // Показать сообщение об ошибке
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Ошибка при подключении к серверу!';
        document.getElementById('message').style.display = 'block'; // Показать сообщение об ошибке
    }
}

// Функция для построения круговой диаграммы расходов по категориям
function renderExpenseChart(expenseData) {
    const ctx = document.getElementById('expensesChart').getContext('2d');

    const categories = expenseData.map(item => item.category); // Извлекаем категории
    const amounts = expenseData.map(item => item.total); // Извлекаем суммы

    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categories,
            datasets: [{
                label: 'Расходы по категориям',
                data: amounts,
                backgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ],
                hoverBackgroundColor: [
                    '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw + ' руб.';
                        }
                    }
                }
            }
        }
    });
}

// Запуск функции после загрузки страницы
document.addEventListener('DOMContentLoaded', fetchExpenseData);
