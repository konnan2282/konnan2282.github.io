const API_KEY = 'a5aa6a2a-26f1-4d40-a947-644e11764ba7';
const API_URL_ORDERS = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';
const API_URL_DISHES = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

let orders = [];
let dishes = [];
let currentOrderId = null; // ID заказа, с которым сейчас работаем (удаление/редактирование)

// Утилиты

// Показ уведомления (копия из order-scripts.js)
function showNotification(message, type = 'success') {
    // Создаем оверлей
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    
    // Создаем контейнер
    const container = document.createElement('div');
    container.className = 'modal-container';

    // Создаем текст
    const text = document.createElement('p');
    text.className = 'modal-text';
    text.textContent = message;

    // Создаем кнопку
    const btn = document.createElement('button');
    btn.className = 'btn btn-secondary';
    btn.textContent = 'OK';
    
    // Логика закрытия
    btn.onclick = () => document.body.removeChild(overlay);

    // Сборка элементов
    container.appendChild(text);
    container.appendChild(btn);
    overlay.appendChild(container);
    
    // Добавление на страницу
    document.body.appendChild(overlay);
}

// Форматирование даты
function formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleString('ru-RU', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
    });
}

// Получение названий блюд и цены по ID заказа
function getOrderDetails(order) {
    const dishIds = [order.soup_id, order.main_course_id, order.salad_id, order.drink_id, order.dessert_id];
    const orderDishes = [];
    let totalPrice = 0;

    dishIds.forEach(id => {
        if (id) {
            const dish = dishes.find(d => d.id === id);
            if (dish) {
                orderDishes.push(dish);
                totalPrice += dish.price;
            }
        }
    });

    return {
        names: orderDishes.map(d => d.name).join(', '),
        fullDishes: orderDishes,
        price: totalPrice
    };
}

// Работа с API

async function fetchDishes() {
    try {
        const response = await fetch(`${API_URL_DISHES}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки меню');
        dishes = await response.json();
    } catch (err) {
        console.error(err);
        showNotification('Не удалось загрузить меню', 'error');
    }
}

async function fetchOrders() {
    try {
        const response = await fetch(`${API_URL_ORDERS}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Ошибка загрузки заказов');
        orders = await response.json();
        
        // Сортировка: новые сначала
        orders.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        
        renderTable();
    } catch (err) {
        console.error(err);
        showNotification('Не удалось загрузить историю заказов', 'error');
    }
}

async function deleteOrder(id) {
    try {
        const response = await fetch(`${API_URL_ORDERS}/${id}?api_key=${API_KEY}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Ошибка удаления');
        
        closeModal('delete-modal');
        showNotification('Заказ успешно удален');
        fetchOrders(); // Обновляем список
    } catch (err) {
        showNotification('Не удалось удалить заказ', 'error');
    }
}

async function updateOrder(id, formData) {
    try {
        const response = await fetch(`${API_URL_ORDERS}/${id}?api_key=${API_KEY}`, {
            method: 'PUT',
            body: formData
        });
        if (!response.ok) throw new Error('Ошибка обновления');
        
        closeModal('edit-modal');
        showNotification('Заказ успешно обновлен');
        fetchOrders();
    } catch (err) {
        showNotification('Не удалось обновить заказ', 'error');
    }
}

// Рендеринг

function renderTable() {
    const tbody = document.getElementById('orders-tbody');
    const msg = document.getElementById('no-orders-msg');
    
    tbody.innerHTML = '';

    if (orders.length === 0) {
        msg.style.display = 'block';
        return;
    }
    msg.style.display = 'none';

    orders.forEach((order, index) => {
        const { names, price } = getOrderDetails(order);
        const dateStr = formatDate(order.created_at);
        const timeStr = order.delivery_type === 'now' 
            ? 'Как можно скорее (07:00-23:00)' 
            : order.delivery_time;

        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td data-label="№">${index + 1}</td>
            <td data-label="Дата">${dateStr}</td>
            <td data-label="Состав">${names}</td>
            <td data-label="Стоимость">${price}₽</td>
            <td data-label="Время доставки">${timeStr}</td>
            <td data-label="Действия">
                <div class="action-icons">
                    <button class="action-btn" title="Подробнее" onclick="openViewModal(${order.id})">👁️</button>
                    <button class="action-btn" title="Редактировать" onclick="openEditModal(${order.id})">✏️</button>
                    <button class="action-btn" title="Удалить" onclick="openDeleteModal(${order.id})">🗑️</button>
                </div>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Модальные окна

function openModal(modalId) {
    document.getElementById(modalId).classList.add('show');
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('show');
}

// 1. Просмотр
window.openViewModal = function(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;
    
    const { fullDishes, price } = getOrderDetails(order);

    document.getElementById('view-date').textContent = formatDate(order.created_at);
    document.getElementById('view-name').textContent = order.full_name;
    document.getElementById('view-address').textContent = order.delivery_address;
    document.getElementById('view-phone').textContent = order.phone;
    document.getElementById('view-email').textContent = order.email;
    document.getElementById('view-time').textContent = order.delivery_type === 'now' ? 'Как можно скорее' : order.delivery_time;
    document.getElementById('view-comment').textContent = order.comment || 'Нет комментария';
    document.getElementById('view-total').textContent = `${price}₽`;

    const list = document.getElementById('view-dishes-list');
    list.innerHTML = '';
    fullDishes.forEach(dish => {
        const li = document.createElement('li');
        li.textContent = `${dish.name} (${dish.price}₽)`;
        list.appendChild(li);
    });

    openModal('view-modal');
}

// 2. Удаление
window.openDeleteModal = function(id) {
    currentOrderId = id;
    openModal('delete-modal');
}

// 3. Редактирование
window.openEditModal = function(id) {
    const order = orders.find(o => o.id === id);
    if (!order) return;

    currentOrderId = id;

    // Заполняем форму
    document.getElementById('edit-name').value = order.full_name;
    document.getElementById('edit-email').value = order.email;
    document.getElementById('edit-phone').value = order.phone;
    document.getElementById('edit-address').value = order.delivery_address;
    document.getElementById('edit-comment').value = order.comment || '';
    
    if (order.delivery_type === 'now') {
        document.getElementById('edit-asap').checked = true;
        document.getElementById('edit-delivery-time').value = '';
    } else {
        document.getElementById('edit-time').checked = true;
        document.getElementById('edit-delivery-time').value = order.delivery_time;
    }

    openModal('edit-modal');
}

// Обработчики событий

document.addEventListener('DOMContentLoaded', async () => {
    await fetchDishes(); // Сначала блюда, чтобы знать названия и цены
    await fetchOrders(); // Потом заказы

    // Закрытие модальных окон
    document.querySelectorAll('.close-btn, .close-action').forEach(btn => {
        btn.addEventListener('click', () => {
            closeModal(btn.dataset.modal);
        });
    });

    // Клик вне окна закрывает его
    window.onclick = function(event) {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
        }
    }

    // Подтверждение удаления
    document.getElementById('confirm-delete-btn').addEventListener('click', () => {
        if (currentOrderId) deleteOrder(currentOrderId);
    });

    // Отправка формы редактирования
    document.getElementById('edit-form').addEventListener('submit', (e) => {
        e.preventDefault();
        if (!currentOrderId) return;

        const formData = new FormData(e.target);
        updateOrder(currentOrderId, formData);
    });

    // Логика переключения времени в форме редактирования
    const radioButtons = document.querySelectorAll('input[name="delivery_type"]');
    const timeInput = document.getElementById('edit-delivery-time');

    radioButtons.forEach(radio => {
        radio.addEventListener('change', (e) => {
            if (e.target.value === 'by_time') {
                timeInput.required = true;
            } else {
                timeInput.required = false;
                timeInput.value = '';
            }
        });
    });
});