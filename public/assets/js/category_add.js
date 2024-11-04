//Обработчик добавления категории
document.getElementById('categoryForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const categoryName = document.getElementById('categoryName').value;

    try {
        const token = localStorage.getItem('token'); // Получаем токен из localStorage
        const response = await fetch('/api/categories', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // Передаем токен в заголовке для авторизации
            },
            body: JSON.stringify({ name: categoryName }) // Отправляем категорию
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('message').textContent = 'Категория успешно добавлена!!';
            document.getElementById('categoryName').value = ''; // Очищаем поле
            fetchCategories(); // Обновляем список категорий после добавления
        } else {
            document.getElementById('message').textContent = `Error: ${data.message}`;
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Что-то не так!!';
    }
});
