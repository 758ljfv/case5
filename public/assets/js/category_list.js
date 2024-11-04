// Функция для отображения категорий в таблице
async function fetchCategories() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch('/api/categories', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        const categories = await response.json();
        const tableBody = document.getElementById('categoryTableBody');
        tableBody.innerHTML = ''; // Очищаем таблицу перед обновлением

        categories.forEach(category => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${category.name}</td>
                <td>
                    <button class="btn btn-danger btn-sm delete-btn" data-id="${category._id}">Удалить</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        // Добавляем обработчики удаления для кнопок после отрисовки
        document.querySelectorAll('.delete-btn').forEach(button => {
            button.addEventListener('click', async function() {
                const categoryId = this.getAttribute('data-id');
                console.log(`Удалена категория с id: ${categoryId}`);
                await deleteCategory(categoryId);
            });
        });
    } catch (error) {
        document.getElementById('message').textContent = 'Ошибка загрузки категорий!';
    }
}

// Загружаем категории при загрузке
document.addEventListener('DOMContentLoaded', fetchCategories);
