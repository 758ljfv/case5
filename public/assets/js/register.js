document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('registrationSuccess', 'Вы успешно прошли регистрацию.');
            window.location.href = '/auth/login';
        } else {
            document.getElementById('message').textContent = `Ошибка: ${data.message}`;
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Что-то пошло не так!';
    }
});
