// Декодируем JWT-токен и возвращаем имя пользователя
function getUsernameFromToken() {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
        // Разделяем токен и декодируем полезную нагрузку
        const payloadBase64 = token.split('.')[1];
        const payload = JSON.parse(atob(payloadBase64));

        // Сохраняем имя пользователя в localStorage, если оно не было сохранено ранее
        if (payload.username) {
            localStorage.setItem('username', payload.username);
        }

        // Возвращаем имя пользователя или дефолтное значение
        return payload.username || 'Пользователь';
    } catch (error) {
        console.error('Ошибка при декодировании токена:', error);
        return null;
    }
}

// Функция для создания и добавления заголовка
function createHeader(username) {
    const header = document.createElement('header');
    header.classList.add('header', 'bg-primary', 'text-light', 'p-3');

    header.innerHTML = `
        <div class="container">
            <div class="d-flex justify-content-between align-items-center">
                <nav class="navbar navbar-expand-lg navbar-dark">
                    <a class="navbar-brand" href="/">Главная</a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto">
                            <li class="nav-item">
                                <a class="nav-link" href="/transaction">Транзакции</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/category">Категори</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="/export">Ипорт/Экспорт</a>
                            </li>
                        </ul>
                    </div>
                </nav>
                <div class="d-flex align-items-center">
                    <span class="me-3">Привет, ${username}!</span>
                    <button id="logoutButton" class="btn btn-outline-light ml-3">Выйти</button>
                </div>
            </div>
        </div>
    `;

    document.body.insertAdjacentElement('afterbegin', header);

    // Логика кнопки "Выйти"
    document.getElementById('logoutButton').addEventListener('click', () => {
        // Удаляем токен и имя пользователя из localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        window.location.href = '/auth/login'; // Перенаправляем на страницу входа
    });
}

// Получение имени пользователя и создание header
document.addEventListener('DOMContentLoaded', () => {
    // Получаем имя пользователя из localStorage, если токена нет
    const username = localStorage.getItem('username') || getUsernameFromToken() || 'Гость';
    createHeader(username);
});