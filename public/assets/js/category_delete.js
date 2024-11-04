// Функция для удаления категории
async function deleteCategory(categoryId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/categories/${categoryId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {
            document.getElementById('message').textContent = 'Категория успешно удалена!';
            fetchCategories(); // Обновляем список категорий после удаления
        } else {
            document.getElementById('message').textContent = `Error: ${data.message}`;
        }
    } catch (error) {
        document.getElementById('message').textContent = 'Что-то не так!';
    }
}
