const dishes = [
    // --- СУПЫ (6 шт: 2 рыбных, 2 мясных, 2 вегетарианских) ---
    {
        keyword: 'fish_soup',
        name: 'Уха по-фински',
        price: 260,
        category: 'soup',
        count: '380 г',
        image: 'Yxa.png',
        kind: 'fish' // Рыбный 1
    },
    {
        keyword: 'tom_yam',
        name: 'Том Ям с креветками',
        price: 365,
        category: 'soup',
        count: '300 г',
        image: 'Tomyam.png',
        kind: 'fish' // Рыбный 2
    },
    {
        keyword: 'borsh',
        name: 'Борщ с говядиной',
        price: 250,
        category: 'soup',
        count: '350 г',
        image: 'Borsh.png',
        kind: 'meat' // Мясной 1
    },
    {
        keyword: 'chicken_soup',
        name: 'Куриный суп с лапшой',
        price: 210,
        category: 'soup',
        count: '350 г',
        image: 'Lapshaskyricei.png',
        kind: 'meat' // Мясной 2
    },
    {
        keyword: 'gazpacho',
        name: 'Гаспачо',
        price: 195,
        category: 'soup',
        count: '350 г',
        image: 'Gaspa4o.png',
        kind: 'veg' // Вегетарианский 1
    },
    {
        keyword: 'mushroom_soup',
        name: 'Грибной суп-пюре',
        price: 185,
        category: 'soup',
        count: '330 г',
        image: 'Syppure.png',
        kind: 'veg' // Вегетарианский 2
    },

    // --- ГЛАВНЫЕ БЛЮДА (6 шт: 2 рыбных, 2 мясных, 2 вегетарианских) ---
    {
        keyword: 'fish_rice',
        name: 'Рыбная котлета с рисом',
        price: 320,
        category: 'main-course',
        count: '300 г',
        image: 'kotletasrisom.png',
        kind: 'fish' // Рыбное 1
    },
    {
        keyword: 'shrimp_pasta',
        name: 'Паста с креветками',
        price: 340,
        category: 'main-course',
        count: '280 г',
        image: 'pastakrevetki.png',
        kind: 'fish' // Рыбное 2
    },
    {
        keyword: 'lasagna',
        name: 'Лазанья мясная',
        price: 385,
        category: 'main-course',
        count: '400 г',
        image: 'Lazanya.png',
        kind: 'meat' // Мясное 1
    },
    {
        keyword: 'cutlets',
        name: 'Котлеты из курицы с пюре',
        price: 225,
        category: 'main-course',
        count: '350 г',
        image: 'Kotletaspure.png',
        kind: 'meat' // Мясное 2
    },
    {
        keyword: 'fried_potatoes',
        name: 'Жареная картошка с грибами',
        price: 150,
        category: 'main-course',
        count: '250 г',
        image: 'kartoshkasgribami.png',
        kind: 'veg' // Вегетарианское 1
    },
    {
        keyword: 'pizza',
        name: 'Пицца Маргарита',
        price: 450,
        category: 'main-course',
        count: '400 г',
        image: 'pizza.png',
        kind: 'veg' // Вегетарианское 2
    },

    // --- САЛАТЫ И СТАРТЕРЫ (6 шт: 1 рыбный, 1 мясной, 4 вегетарианских) ---
    {
        keyword: 'tuna_salad',
        name: 'Салат с тунцом',
        price: 480,
        category: 'salad',
        count: '250 г',
        image: 'salatstyncom.png',
        kind: 'fish' // Рыбный 1
    },
    {
        keyword: 'salad_caesar',
        name: 'Цезарь с курицей',
        price: 370,
        category: 'salad',
        count: '220 г',
        image: 'cezarkyrica.png',
        kind: 'meat' // Мясной 1
    },
    {
        keyword: 'caprese',
        name: 'Капрезе с моцареллой',
        price: 350,
        category: 'salad',
        count: '235 г',
        image: 'kapreze.png',
        kind: 'veg' // Вегетарианский 1
    },
    {
        keyword: 'fries',
        name: 'Картофель фри с соусом',
        price: 280,
        category: 'salad',
        count: '235 г',
        image: 'kartoshkafri.png',
        kind: 'veg' // Вегетарианский 2
    },
    {
        keyword: 'tabbouleh',
        name: 'Табуле с овощами',
        price: 300,
        category: 'salad',
        count: '235 г',
        image: 'tabyle.png',
        kind: 'veg' // Вегетарианский 3
    },
    {
        keyword: 'greek_salad',
        name: 'Греческий салат',
        price: 330,
        category: 'salad',
        count: '250 г',
        image: 'gre4salat.png',
        kind: 'veg' // Вегетарианский 4
    },

    // --- НАПИТКИ (6 шт: 3 холодных, 3 горячих) ---
    {
        keyword: 'orange_juice',
        name: 'Апельсиновый сок',
        price: 120,
        category: 'drink',
        count: '300 мл',
        image: 'Sokapelsin.png',
        kind: 'cold' // Холодный 1
    },
    {
        keyword: 'apple_juice',
        name: 'Яблочный сок',
        price: 90,
        category: 'drink',
        count: '300 мл',
        image: 'applejuice.png',
        kind: 'cold' // Холодный 2
    },
    {
        keyword: 'carrot_juice',
        name: 'Морковный сок',
        price: 110,
        category: 'drink',
        count: '300 мл',
        image: 'morkovniysok.png',
        kind: 'cold' // Холодный 3
    },
    {
        keyword: 'cappuccino',
        name: 'Капучино',
        price: 180,
        category: 'drink',
        count: '300 мл',
        image: 'kapy4ino.png',
        kind: 'hot' // Горячий 1
    },
    {
        keyword: 'green_tea',
        name: 'Зеленый чай',
        price: 100,
        category: 'drink',
        count: '300 мл',
        image: 'zeleni4ai.png',
        kind: 'hot' // Горячий 2
    },
    {
        keyword: 'black_tea',
        name: 'Черный чай',
        price: 90,
        category: 'drink',
        count: '300 мл',
        image: '4erni4ai.png',
        kind: 'hot' // Горячий 3
    },

    // --- ДЕСЕРТЫ (6 шт: 3 маленьких, 2 средних, 1 большая) ---
    {
        keyword: 'cheesecake',
        name: 'Чизкейк',
        price: 240,
        category: 'dessert',
        count: '125 г',
        image: '4izkeik.png',
        kind: 'small' // Маленькая 1
    },
    {
        keyword: 'chocolate_cake',
        name: 'Шоколадный торт',
        price: 270,
        category: 'dessert',
        count: '140 г',
        image: 'shokoladnitort.png',
        kind: 'small' // Маленькая 2
    },
    {
        keyword: 'tiramisu',
        name: 'Тирамису',
        price: 230,
        category: 'dessert',
        count: '130 г',
        image: 'Tiramisu.png',
        kind: 'small' // Маленькая 3
    },
    {
        keyword: 'baklava',
        name: 'Пахлава',
        price: 220,
        category: 'dessert',
        count: '300 г',
        image: 'pahlava.png',
        kind: 'medium' // Средняя 1
    },
    {
        keyword: 'donut',
        name: 'Пончик (3 шт)',
        price: 200,
        category: 'dessert',
        count: '250 г',
        image: 'pon4iki.png',
        kind: 'medium' // Средняя 2
    },
    {
        keyword: 'pancakes',
        name: 'Блинчики с джемом',
        price: 350,
        category: 'dessert',
        count: '400 г',
        image: 'blin4iki.png',
        kind: 'large' // Большая 1
    }
];