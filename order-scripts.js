const API_KEY = 'a5aa6a2a-26f1-4d40-a947-644e11764ba7';
const DISHES_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';
const ORDERS_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/orders';

let allDishes = [];
let selectedDishIds = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// Вспомогательные функции

function loadCart() {
    const saved = localStorage.getItem('selectedDishes');
    if (saved) selectedDishIds = JSON.parse(saved);
}

function saveCart() {
    localStorage.setItem('selectedDishes', JSON.stringify(selectedDishIds));
}

// Функция для красивых уведомлений (как в других скриптах)
function showNotification(message) {
    // Создаем оверлей
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    // Создаем контейнер сообщения
    const container = document.createElement('div');
    container.className = 'modal-container';

    // Текст
    const text = document.createElement('p');
    text.className = 'modal-text';
    text.textContent = message;

    // Кнопка
    const btn = document.createElement('button');
    btn.className = 'modal-btn';
    btn.textContent = 'Окей \uD83D\uDC4C'; // Эмодзи "ОК"

    // Добавление обработчика закрытия
    btn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });

    // Сборка
    container.appendChild(text);
    container.appendChild(btn);
    overlay.appendChild(container);

    // Добавление на страницу
    document.body.appendChild(overlay);
}

// Основная логика

function createOrderCard(dish, categoryKey) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    // Для страницы заказа карточка выглядит так же, но с кнопкой "Удалить"
    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <div class="dish-info">
            <p class="dish-price">${dish.price}Р</p>
            <p class="dish-name">${dish.name}</p>
            <p class="dish-weight">${dish.count}</p>
        </div>
        <button class="delete-button" data-cat="${categoryKey}">Удалить</button>
    `;
    return card;
}

function renderOrder() {
    const grid = document.getElementById('order-items-grid');
    const emptyMsg = document.getElementById('empty-cart-message');
    
    if (!grid) return;

    grid.innerHTML = '';
    
    let hasItems = false;
    let totalCost = 0;

    ['soup', 'main', 'salad', 'drink', 'dessert'].forEach(catKey => {
        const id = selectedDishIds[catKey];
        if (id) {
            const dish = allDishes.find(d => d.id === id);
            if (dish) {
                hasItems = true;
                totalCost += dish.price;
                grid.appendChild(createOrderCard(dish, catKey));
                
                // Обновляем текст слева в форме
                const summaryId = catKey === 'main' ? 'main-course' : catKey;
                const summaryEl = document.getElementById(`summary-${summaryId}`);
                if (summaryEl) summaryEl.textContent = `${dish.name} ${dish.price}Р`;
            }
        } else {
            // Если пусто
            const summaryId = catKey === 'main' ? 'main-course' : catKey;
            const summaryEl = document.getElementById(`summary-${summaryId}`);
            if (summaryEl) summaryEl.textContent = 'Не выбрано';
        }
    });

    // Итого
    const totalCostEl = document.getElementById('total-cost-value');
    if (totalCostEl) totalCostEl.textContent = `${totalCost}Р`;

    // Показ сообщения "Ничего не выбрано"
    if (!hasItems) {
        if (emptyMsg) emptyMsg.style.display = 'block';
    } else {
        if (emptyMsg) emptyMsg.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    loadCart();

    // Загружаем данные о блюдах
    try {
        const response = await fetch(`${DISHES_URL}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to load dishes');
        allDishes = await response.json();
        renderOrder();
    } catch (e) {
        console.error(e);
        showNotification('Ошибка загрузки данных меню. Попробуйте обновить страницу.');
    }

    // Обработчик удаления
    const grid = document.getElementById('order-items-grid');
    if (grid) {
        grid.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-button')) {
                const cat = e.target.dataset.cat;
                selectedDishIds[cat] = null;
                saveCart();
                renderOrder();
            }
        });
    }

    // Сброс формы
    const resetBtn = document.querySelector('.btn-reset');
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            document.getElementById('order-form').reset();
        });
    }

    // Отправка формы с валидацией
    const orderForm = document.getElementById('order-form');
    if (orderForm) {
        orderForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Валидация
            const { soup, main, salad, drink, dessert } = selectedDishIds;

            // 1. Ничего не выбрано
            if (!soup && !main && !salad && !drink && !dessert) {
                showNotification('Ничего не выбрано. Выберите блюда для заказа');
                return;
            }

            // 2. Только напиток/десерт без еды
            if (!soup && !main && !salad && (drink || dessert)) {
                showNotification('Выберите главное блюдо');
                return;
            }

            // 3. Есть суп, но нет главного/салата
            if (soup && !main && !salad) {
                showNotification('Выберите главное блюдо/салат/стартер');
                return;
            }

            // 4. Есть салат, но нет супа/главного
            if (salad && !soup && !main) {
                showNotification('Выберите суп или главное блюдо');
                return;
            }

            // 5. Есть еда, но нет напитка (Напиток обязателен в комбо)
            if ((soup || main || salad) && !drink) {
                showNotification('Выберите напиток');
                return;
            }

            // Если проверки пройдены, отправляем
            
            const formData = new FormData(e.target);
            
            // Добавляем ID блюд в запрос
            if (soup) formData.append('soup_id', soup);
            if (main) formData.append('main_course_id', main);
            if (salad) formData.append('salad_id', salad);
            if (drink) formData.append('drink_id', drink);
            if (dessert) formData.append('dessert_id', dessert);

            try {
                const response = await fetch(`${ORDERS_URL}?api_key=${API_KEY}`, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.error || 'Ошибка сервера при оформлении');
                }

                // Успех
                showNotification('Заказ успешно оформлен! \uD83C\uDF89'); // Хлопушка
                
                // Очистка
                localStorage.removeItem('selectedDishes');
                
                // Перенаправление на главную через небольшую паузу, чтобы успели прочитать
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 2000);

            } catch (err) {
                showNotification(err.message);
            }
        });
    }
});