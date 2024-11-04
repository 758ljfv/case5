// Показ успешного сообщения о регистрации при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    // Проверяем наличие сообщения о регистрации
    const successMessage = localStorage.getItem('registrationSuccess');

    if (successMessage) {
        // Создаем элемент для отображения сообщения
        const messageDiv = document.createElement('div');
        messageDiv.className = 'alert alert-success'; // Используем bootstrap для оформления
        messageDiv.textContent = successMessage;

        // Вставляем сообщение в элемент на странице
        const container = document.querySelector('.success-message');
        container.appendChild(messageDiv); // Добавляем сообщение

        // Удаляем сообщение из localStorage после отображения
        localStorage.removeItem('registrationSuccess');
    }
});

// Обработка формы логина
document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            // Сохраняем токен в localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.user.username);
            window.location.href = '/'; // Пример редиректа после авторизации
        } else {
            document.getElementById('message').textContent = `Ошибка: ${data.message}`;
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Что-то пошло не так!';
    }
});
