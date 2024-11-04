// Экспорт транзакций
document.getElementById('exportButton').addEventListener('click', async () => {
    try {
        const response = await fetch('/api/transactions/export', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Убедитесь, что вы передаете токен
            }
        });

        if (!response.ok) {
            throw new Error('Ошибка при экспорте транзакций');
        }

        // Обработка ответа
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'transactions.csv';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        showMessage('Транзакции успешно экспортированы!');
    } catch (error) {
        console.error(error);
        showMessage('Ошибка при экспорте транзакций.');
    }
});

// Импорт транзакций
document.getElementById('importForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Предотвращаем стандартное поведение формы

    const fileInput = document.getElementById('fileInput');
    const formData = new FormData();
    formData.append('file', fileInput.files[0]); // Добавляем файл к FormData

    try {
        const response = await fetch('/api/transactions/import', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Убедитесь, что вы передаете токен
            },
            body: formData // Отправляем FormData с файлом
        });

        if (!response.ok) {
            throw new Error('Ошибка при импорте транзакций');
        }

        const result = await response.json();
        showMessage(result.message || 'Транзакции успешно импортированы!');
    } catch (error) {
        console.error(error);
        showMessage('Ошибка при импорте транзакций.');
    }
});

// Функция для отображения сообщений
function showMessage(message) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = message;
    messageDiv.style.display = 'block'; // Показываем сообщение
    setTimeout(() => {
        messageDiv.style.display = 'none'; // Скрываем сообщение через 3 секунды
    }, 3000);
}
