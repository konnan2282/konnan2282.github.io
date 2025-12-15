const API_KEY = 'a5aa6a2a-26f1-4d40-a947-644e11764ba7';
const API_URL = 'https://edu.std-900.ist.mospolytech.ru/labs/api/dishes';

let dishes = []; // Глобальный массив блюд

const categoriesConfig = {
    soup: { gridId: 'soups-grid', apiCategory: 'soup' },
    main: { gridId: 'main-dishes-grid', apiCategory: 'main-course' },
    salad: { gridId: 'salads-grid', apiCategory: 'salad' },
    drink: { gridId: 'drinks-grid', apiCategory: 'drink' },
    dessert: { gridId: 'desserts-grid', apiCategory: 'dessert' }
};

// Храним ID выбранных блюд
let selectedDishes = {
    soup: null,
    main: null,
    salad: null,
    drink: null,
    dessert: null
};

// Вспомогательные функции для LocalStorage
function loadFromLocalStorage() {
    const saved = localStorage.getItem('selectedDishes');
    if (saved) {
        selectedDishes = JSON.parse(saved);
    }
}

function saveToLocalStorage() {
    localStorage.setItem('selectedDishes', JSON.stringify(selectedDishes));
}

// Основные функции

function createDishCard(dish) {
    const card = document.createElement('div');
    card.className = 'dish-card';
    card.setAttribute('data-dish-id', dish.id); // Добавляем ID в атрибут
    
    card.innerHTML = `
        <img src="${dish.image}" alt="${dish.name}">
        <div class="dish-info">
            <p class="dish-price">${dish.price}Р</p>
            <p class="dish-name">${dish.name}</p>
            <p class="dish-weight">${dish.count}</p>
        </div>
        <button class="add-button">Добавить</button>
    `;
    return card;
}

function renderCategory(category, filterKind = null) {
    const config = categoriesConfig[category];
    const gridElement = document.getElementById(config.gridId);
    
    gridElement.innerHTML = '';

    let dishesToRender = dishes.filter(d => d.category === config.apiCategory);
    
    if (filterKind) {
        dishesToRender = dishesToRender.filter(d => d.kind === filterKind);
    }

    dishesToRender.forEach(dish => {
        const card = createDishCard(dish);
        
        // Проверяем, выбрано ли блюдо, и добавляем класс active-card
        if (selectedDishes[category] === dish.id) {
            card.classList.add('active-card');
        }
        
        gridElement.appendChild(card);
    });
}

function calculateAndDisplayTotal() {
    const bar = document.getElementById('order-bar');
    const totalEl = document.getElementById('order-total-price');
    const linkBtn = document.getElementById('order-link');
    
    let totalCost = 0;
    let count = 0;
    const currentDishes = {}; // Для проверки комбо

    // Считаем стоимость
    for (const [cat, id] of Object.entries(selectedDishes)) {
        if (id) {
            const dish = dishes.find(d => d.id === id);
            if (dish) {
                totalCost += dish.price;
                currentDishes[cat] = dish;
                count++;
            }
        }
    }

    // Показываем или скрываем бар
    if (count === 0) {
        if(bar) bar.style.display = 'none';
        return;
    }
    if(bar) {
        bar.style.display = 'flex';
        totalEl.textContent = `${totalCost}Р`;
    }

    // Проверка комбо (для активации кнопки)
    const hasDrink = !!currentDishes.drink;
    const hasMain = !!currentDishes.main;
    const hasSoup = !!currentDishes.soup;
    const hasSalad = !!currentDishes.salad;

    let isValid = false;
    if (hasDrink) {
        if (hasMain) isValid = true;
        else if (hasSoup && hasSalad) isValid = true;
    }

    if (linkBtn) {
        if (isValid) {
            linkBtn.classList.remove('btn-disabled');
            linkBtn.removeAttribute('title');
        } else {
            linkBtn.classList.add('btn-disabled');
            linkBtn.setAttribute('title', 'Соберите комбо');
        }
    }
}

async function loadDishes() {
    try {
        const response = await fetch(`${API_URL}?api_key=${API_KEY}`);
        if (!response.ok) throw new Error('Failed to fetch');
        
        dishes = await response.json();
        dishes.sort((a, b) => a.name.localeCompare(b.name));

        // Рендерим все категории
        Object.keys(categoriesConfig).forEach(cat => renderCategory(cat));
        
        // Обновляем итоговую стоимость и панель
        calculateAndDisplayTotal();
        
    } catch (error) {
        console.error("Error loading dishes:", error);
    }
}

// Обработчики событий

document.addEventListener('DOMContentLoaded', () => {
    loadFromLocalStorage(); // Сначала загружаем выбор пользователя
    loadDishes(); // Потом загружаем блюда

    // 2. Логика фильтрации
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const button = e.target;
            const section = button.closest('.menu-section');
            const category = section.dataset.category;
            const kind = button.dataset.kind;

            if (button.classList.contains('active')) {
                button.classList.remove('active');
                renderCategory(category, null);
            } else {
                section.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                button.classList.add('active');
                renderCategory(category, kind);
            }
        });
    });

    // 3. Добавление блюда в заказ (Клик по карточке)
    const mainContent = document.querySelector('.main .container');
    
    mainContent.addEventListener('click', (event) => {
        // Ищем карточку, даже если кликнули на картинку или текст
        const card = event.target.closest('.dish-card');
        if (!card) return;

        const dishId = parseInt(card.dataset.dishId);
        
        // Определяем категорию по родительской секции
        const section = card.closest('.menu-section');
        const categoryKey = section.dataset.category;

        // Сохраняем выбор
        selectedDishes[categoryKey] = dishId;
        
        // Сохраняем в localStorage
        saveToLocalStorage();

        // Визуальное обновление
        // 1. Убираем класс active-card у всех карточек в этой категории
        section.querySelectorAll('.dish-card').forEach(c => c.classList.remove('active-card'));
        // 2. Добавляем класс нажатой карточке
        card.classList.add('active-card');

        // Пересчитываем итог
        calculateAndDisplayTotal();
    });
});