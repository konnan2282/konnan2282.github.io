// Текущий заказ
let currentOrder = {
    soup: null,
    'main-course': null,
    salad: null,
    drink: null,
    dessert: null
};

// Хранилище активных фильтров для каждой категории
let activeFilters = {
    soup: null,
    'main-course': null,
    salad: null,
    drink: null,
    dessert: null
};

// 1. Сортировка по алфавиту
function sortDishes(dishes) {
    return dishes.sort((a, b) => a.name.localeCompare(b.name));
}

// 2. Создание HTML карточки
function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish', dish.keyword);
    card.setAttribute('data-kind', dish.kind);

    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}" onerror="this.src='https://placehold.co/300x250/eee/999?text=Нет+фото'">
        <div class="dish-details">
            <p class="dish-price">${dish.price}₽</p>
            <p class="dish-name">${dish.name}</p>
            <p class="dish-weight">${dish.count}</p>
        </div>
        <button class="add-button">Добавить</button>
    `;

    const addButton = card.querySelector('.add-button');
    addButton.addEventListener('click', () => addToOrder(dish));

    return card;
}

// 3. Отображение карточек на странице (с учетом фильтров)
function renderDishes() {
    const categories = ['soup', 'main-course', 'salad', 'drink', 'dessert'];
    
    categories.forEach(category => {
        const container = document.querySelector(`.dishes-grid[data-category="${category}"]`);
        if (!container) return;

        container.innerHTML = '';

        const filteredDishes = dishes.filter(dish => {
            const isCorrectCategory = dish.category === category;
            const isCorrectKind = activeFilters[category] ? dish.kind === activeFilters[category] : true;
            return isCorrectCategory && isCorrectKind;
        });

        const sortedDishes = sortDishes(filteredDishes);
        sortedDishes.forEach(dish => {
            const card = createDishCard(dish);
            container.appendChild(card);
        });
    });
}

// 4. Инициализация фильтров
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const section = button.closest('.menu-section');
            const grid = section.querySelector('.dishes-grid');
            const category = grid.dataset.category;
            const kind = button.dataset.kind;

            if (activeFilters[category] === kind) {
                activeFilters[category] = null;
                button.classList.remove('active');
            } else {
                activeFilters[category] = kind;
                const sectionButtons = section.querySelectorAll('.filter-btn');
                sectionButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
            }

            renderDishes();
        });
    });
}

// 5. Добавление в заказ
function addToOrder(dish) {
    currentOrder[dish.category] = dish;
    updateOrderDisplay();
}

// 6. Обновление панели заказа
function updateOrderDisplay() {
    const orderPanel = document.getElementById('order-summary-container');
    const emptyMessage = document.getElementById('nothing-selected');
    const totalPriceEl = document.getElementById('total-price-display');
    const totalValueEl = document.getElementById('total-value');
    
    const isOrderEmpty = !currentOrder.soup && 
                         !currentOrder['main-course'] && 
                         !currentOrder.salad &&
                         !currentOrder.drink &&
                         !currentOrder.dessert;

    if (isOrderEmpty) {
        if (emptyMessage) emptyMessage.style.display = 'block';
        if (orderPanel) orderPanel.style.display = 'none';
        if (totalPriceEl) totalPriceEl.style.display = 'none';
    } else {
        if (emptyMessage) emptyMessage.style.display = 'none';
        if (orderPanel) orderPanel.style.display = 'grid';
        if (totalPriceEl) totalPriceEl.style.display = 'block';

        updateOrderItem('soup', 'Суп');
        updateOrderItem('main-course', 'Главное блюдо');
        updateOrderItem('salad', 'Салат/Стартер');
        updateOrderItem('drink', 'Напиток');
        updateOrderItem('dessert', 'Десерт');

        let total = 0;
        Object.values(currentOrder).forEach(item => {
            if (item) total += item.price;
        });
        
        if (totalValueEl) totalValueEl.textContent = total;
    }
}

// Вспомогательная функция отрисовки строки заказа
function updateOrderItem(category, labelText) {
    const itemContainer = document.getElementById(`order-${category}-container`);
    const dish = currentOrder[category];
    
    const hiddenInput = document.getElementById(`hidden-${category}`);

    if (dish) {
        itemContainer.innerHTML = `
            <div class="order-item-row">
                <span class="order-item-label">${labelText}</span>
                <span class="order-item-info">${dish.name} <span class="order-item-price">${dish.price}₽</span></span>
            </div>
        `;
        if (hiddenInput) hiddenInput.value = dish.keyword;
    } else {
        itemContainer.innerHTML = `
            <div class="order-item-row">
                <span class="order-item-label">${labelText}</span>
                <span class="order-item-info">Не выбрано</span>
            </div>
        `;
        if (hiddenInput) hiddenInput.value = '';
    }
}

// --- ЛР 6: Функция показа уведомления ---
function showNotification(message) {
    // Создаем элементы уведомления
    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';

    const box = document.createElement('div');
    box.className = 'notification-box';

    const msg = document.createElement('p');
    msg.textContent = message;

    const btn = document.createElement('button');
    btn.className = 'notification-btn';
    btn.textContent = 'Окей';

    // Собираем структуру
    box.appendChild(msg);
    box.appendChild(btn);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    // Удаление по клику
    btn.addEventListener('click', () => {
        document.body.removeChild(overlay);
    });
}

// --- ЛР 6: Валидация формы (Обновлена для Combo 6) ---
function initFormValidation() {
    const form = document.getElementById('order-form');
    
    form.addEventListener('submit', (e) => {
        const soup = currentOrder.soup;
        const main = currentOrder['main-course'];
        const salad = currentOrder.salad;
        const drink = currentOrder.drink;
        const dessert = currentOrder.dessert; 

        // 1. Проверка: «Ничего не выбрано.» (Error 1)
        if (!soup && !main && !salad && !drink && !dessert) {
            e.preventDefault();
            showNotification('Ничего не выбрано. Выберите блюда для заказа');
            return;
        }

        // 2. Проверка: Valid Combo 6 (Только десерт)
        if (!soup && !main && !salad && !drink && dessert) {
            return; // Валидная комбинация, пропускаем
        }
        
        // 3. Проверка: «Выберите главное блюдо» (Error 5)
        // Если выбран только Напиток (без еды и без десерта - десерт отдельно проверен в п.2)
        if (!soup && !main && !salad && drink) {
            e.preventDefault();
            showNotification('Выберите главное блюдо');
            return;
        }

        // 4. Проверка: «Выберите напиток» (Error 2)
        // Если выбрана хотя бы одна еда (Суп, Главное, Салат), но нет напитка.
        if ((soup || main || salad) && !drink) {
            e.preventDefault();
            showNotification('Выберите напиток');
            return;
        }
        
        // Оставшиеся проверки применяются, когда есть ЕДА и НАПИТОК
        
        // 5. Проверка: «Выберите главное блюдо/салат/стартер» (Error 3)
        // Комбинация S D (Суп + Напиток)
        if (soup && !main && !salad && drink) {
            e.preventDefault();
            showNotification('Выберите главное блюдо/салат/стартер');
            return;
        }

        // 6. Проверка: «Выберите суп или главное блюдо» (Error 4)
        // Комбинация L D (Салат + Напиток)
        if (salad && !soup && !main && drink) {
            e.preventDefault();
            showNotification('Выберите суп или главное блюдо');
            return;
        }

        // Если все проверки пройдены, это одна из 6 валидных комбинаций.
        // Форма отправляется
    });
}

// Запуск при загрузке
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
    renderDishes();
    updateOrderDisplay();
    initFormValidation(); // Инициализация валидации ЛР 6
});