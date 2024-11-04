// checkAuth.js

// Функция проверки токена и редиректа на страницу логина
function checkAuth() {
    const token = localStorage.getItem('token');

    // Если токена нет, перенаправляем на страницу логина
    if (!token) {
        window.location.href = '/auth/login';
    }
}

// Выполняем проверку токена сразу при загрузке страницы
document.addEventListener('DOMContentLoaded', checkAuth);
