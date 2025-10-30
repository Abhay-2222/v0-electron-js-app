// Special database with complete Indian recipe ingredients
const indianRecipesData = [
  {
    recipe: "Butter Chicken",
    ingredients: [
      "boneless chicken",
      "yogurt",
      "lemon juice",
      "ginger-garlic paste",
      "red chilli powder",
      "turmeric",
      "garam masala",
      "butter",
      "oil",
      "onions",
      "tomatoes",
      "tomato puree",
      "cashews",
      "fresh cream",
      "kasuri methi",
      "coriander leaves",
      "salt",
    ],
  },
  {
    recipe: "Palak Paneer",
    ingredients: [
      "spinach",
      "paneer",
      "onions",
      "tomatoes",
      "green chillies",
      "ginger-garlic paste",
      "cumin seeds",
      "turmeric",
      "red chilli powder",
      "garam masala",
      "cream",
      "ghee or oil",
      "kasuri methi",
      "salt",
    ],
  },
  {
    recipe: "Chicken Biryani",
    ingredients: [
      "basmati rice",
      "chicken",
      "yogurt",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "green chillies",
      "biryani masala",
      "turmeric",
      "red chilli powder",
      "garam masala",
      "mint leaves",
      "coriander leaves",
      "saffron",
      "warm milk",
      "ghee",
      "whole spices (bay leaf, cinnamon, cloves, cardamom)",
      "lemon juice",
      "salt",
    ],
  },
  {
    recipe: "Masala Dosa",
    ingredients: [
      "parboiled rice",
      "urad dal",
      "poha",
      "fenugreek seeds",
      "salt",
      "potatoes",
      "onions",
      "green chillies",
      "ginger",
      "mustard seeds",
      "curry leaves",
      "turmeric",
      "chana dal",
      "urad dal (tempering)",
      "oil",
      "ghee",
    ],
  },
  {
    recipe: "Chole Bhature",
    ingredients: [
      "chickpeas",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "chole masala",
      "tea bag (optional)",
      "bay leaf",
      "cumin seeds",
      "turmeric",
      "red chilli powder",
      "garam masala",
      "amchur",
      "coriander powder",
      "salt",
      "oil",
      "all-purpose flour",
      "semolina",
      "yogurt",
      "baking powder",
      "baking soda",
      "sugar",
    ],
  },
  {
    recipe: "Tandoori Chicken",
    ingredients: [
      "chicken (bone-in)",
      "yogurt",
      "lemon juice",
      "ginger-garlic paste",
      "tandoori masala",
      "red chilli powder",
      "turmeric",
      "garam masala",
      "mustard oil",
      "kasuri methi",
      "salt",
    ],
  },
  {
    recipe: "Aloo Gobi",
    ingredients: [
      "potatoes",
      "cauliflower",
      "onions",
      "tomatoes",
      "ginger",
      "garlic",
      "cumin seeds",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "green peas (optional)",
      "coriander leaves",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Samosa",
    ingredients: [
      "all-purpose flour",
      "oil",
      "carom seeds",
      "salt",
      "water",
      "potatoes",
      "green peas",
      "onions",
      "ginger",
      "green chillies",
      "coriander powder",
      "cumin seeds",
      "garam masala",
      "amchur",
      "red chilli powder",
    ],
  },
  {
    recipe: "Dal Tadka",
    ingredients: [
      "toor dal",
      "onions",
      "tomatoes",
      "green chillies",
      "ginger-garlic paste",
      "turmeric",
      "red chilli powder",
      "cumin seeds",
      "mustard seeds",
      "hing",
      "dry red chillies",
      "ghee",
      "curry leaves",
      "coriander leaves",
      "salt",
    ],
  },
  {
    recipe: "Paneer Tikka",
    ingredients: [
      "paneer",
      "capsicum",
      "onions",
      "yogurt",
      "ginger-garlic paste",
      "red chilli powder",
      "turmeric",
      "garam masala",
      "tandoori masala",
      "lemon juice",
      "mustard oil",
      "salt",
      "skewers",
    ],
  },
  {
    recipe: "Rogan Josh",
    ingredients: [
      "mutton",
      "yogurt",
      "onions",
      "ginger-garlic paste",
      "kashmiri chilli powder",
      "fennel powder",
      "dry ginger powder",
      "garam masala",
      "bay leaf",
      "black cardamom",
      "cinnamon",
      "mustard oil",
      "asafoetida",
      "salt",
    ],
  },
  {
    recipe: "Malai Kofta",
    ingredients: [
      "potatoes",
      "paneer",
      "cornflour",
      "raisins",
      "cashews",
      "cream",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "cashew paste",
      "garam masala",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "kasuri methi",
      "ghee or oil",
      "salt",
    ],
  },
  {
    recipe: "Pav Bhaji",
    ingredients: [
      "potatoes",
      "cauliflower",
      "green peas",
      "capsicum",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "pav bhaji masala",
      "red chilli powder",
      "turmeric",
      "butter",
      "lemon",
      "coriander leaves",
      "pav buns",
      "salt",
    ],
  },
  {
    recipe: "Vada Pav",
    ingredients: [
      "potatoes",
      "green chillies",
      "ginger",
      "garlic",
      "mustard seeds",
      "curry leaves",
      "turmeric",
      "besan",
      "baking soda",
      "oil",
      "pav buns",
      "dry garlic chutney",
      "tamarind chutney",
      "green chutney",
      "salt",
    ],
  },
  {
    recipe: "Idli Sambar",
    ingredients: [
      "idli rice",
      "urad dal",
      "fenugreek seeds",
      "salt",
      "oil",
      "toor dal",
      "tamarind",
      "sambar powder",
      "onions",
      "tomatoes",
      "drumsticks",
      "carrots",
      "mustard seeds",
      "curry leaves",
      "dry red chillies",
      "hing",
    ],
  },
  {
    recipe: "Medu Vada",
    ingredients: [
      "urad dal",
      "green chillies",
      "ginger",
      "black pepper",
      "curry leaves",
      "onions (optional)",
      "salt",
      "oil",
    ],
  },
  {
    recipe: "Uttapam",
    ingredients: [
      "dosa batter",
      "onions",
      "tomatoes",
      "green chillies",
      "coriander leaves",
      "carrots (optional)",
      "capsicum (optional)",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Rava Dosa",
    ingredients: [
      "semolina",
      "rice flour",
      "all-purpose flour",
      "cumin seeds",
      "black pepper",
      "green chillies",
      "ginger",
      "coriander leaves",
      "curd (optional)",
      "water",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Paneer Butter Masala",
    ingredients: [
      "paneer",
      "butter",
      "onions",
      "tomatoes",
      "tomato puree",
      "cashews",
      "cream",
      "ginger-garlic paste",
      "red chilli powder",
      "turmeric",
      "garam masala",
      "kasuri methi",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Kadai Paneer",
    ingredients: [
      "paneer",
      "capsicum",
      "onions",
      "tomatoes",
      "kadai masala (roasted coriander & red chillies)",
      "ginger",
      "garlic",
      "red chilli powder",
      "garam masala",
      "kasuri methi",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Shahi Paneer",
    ingredients: [
      "paneer",
      "onions",
      "tomatoes",
      "cashews",
      "cream",
      "ghee or oil",
      "ginger-garlic paste",
      "cardamom",
      "turmeric",
      "kashmiri chilli powder",
      "garam masala",
      "kasuri methi",
      "saffron (optional)",
      "salt",
    ],
  },
  {
    recipe: "Matar Paneer",
    ingredients: [
      "paneer",
      "green peas",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "cumin seeds",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Chana Masala",
    ingredients: [
      "chickpeas",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "chana masala",
      "cumin seeds",
      "bay leaf",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "amchur",
      "kasuri methi",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Rajma Masala",
    ingredients: [
      "kidney beans",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "cumin seeds",
      "bay leaf",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "kasuri methi",
      "ghee or oil",
      "salt",
    ],
  },
  {
    recipe: "Baingan Bharta",
    ingredients: [
      "eggplant",
      "onions",
      "tomatoes",
      "green chillies",
      "ginger-garlic paste",
      "cumin seeds",
      "turmeric",
      "red chilli powder",
      "garam masala",
      "coriander leaves",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Bhindi Masala",
    ingredients: [
      "okra",
      "onions",
      "tomatoes",
      "green chillies",
      "ginger-garlic paste",
      "cumin seeds",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "amchur",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Dum Aloo",
    ingredients: [
      "baby potatoes",
      "yogurt",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "cashew paste",
      "kasuri methi",
      "ghee or oil",
      "salt",
    ],
  },
  {
    recipe: "Vegetable Korma",
    ingredients: [
      "mixed vegetables",
      "onions",
      "tomatoes",
      "coconut",
      "cashews",
      "poppy seeds",
      "ginger-garlic paste",
      "coriander powder",
      "turmeric",
      "red chilli powder",
      "garam masala",
      "coconut milk",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Navratan Korma",
    ingredients: [
      "mixed vegetables",
      "paneer",
      "cashews",
      "raisins",
      "pineapple (optional)",
      "onions",
      "tomatoes",
      "cream",
      "ginger-garlic paste",
      "turmeric",
      "kashmiri chilli powder",
      "garam masala",
      "kasuri methi",
      "ghee",
      "salt",
    ],
  },
  {
    recipe: "Vegetable Jalfrezi",
    ingredients: [
      "mixed vegetables",
      "onions",
      "capsicum",
      "tomatoes",
      "ginger",
      "garlic",
      "tomato puree",
      "coriander powder",
      "turmeric",
      "red chilli powder",
      "garam masala",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Chicken Curry",
    ingredients: [
      "chicken",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "curry leaves (optional)",
      "green chillies",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Chicken Korma",
    ingredients: [
      "chicken",
      "yogurt",
      "onions",
      "ginger-garlic paste",
      "cashew paste",
      "poppy seeds (optional)",
      "cardamom",
      "turmeric",
      "kashmiri chilli powder",
      "garam masala",
      "ghee or oil",
      "saffron (optional)",
      "salt",
    ],
  },
  {
    recipe: "Chicken Vindaloo",
    ingredients: [
      "chicken",
      "vinegar",
      "garlic",
      "ginger",
      "dry red chillies",
      "cumin seeds",
      "mustard seeds",
      "turmeric",
      "black pepper",
      "cinnamon",
      "cloves",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Chicken Madras",
    ingredients: [
      "chicken",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "madras curry powder",
      "turmeric",
      "red chilli powder",
      "curry leaves",
      "mustard seeds",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Chicken Jalfrezi",
    ingredients: [
      "chicken",
      "onions",
      "capsicum",
      "tomatoes",
      "ginger",
      "garlic",
      "tomato puree",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Lamb Curry",
    ingredients: [
      "lamb",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "whole spices",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Lamb Rogan Josh",
    ingredients: [
      "lamb",
      "yogurt",
      "kashmiri chilli powder",
      "fennel powder",
      "dry ginger powder",
      "garam masala",
      "bay leaf",
      "cinnamon",
      "mustard oil",
      "hing",
      "salt",
    ],
  },
  {
    recipe: "Keema Curry",
    ingredients: [
      "minced meat",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "green peas (optional)",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Fish Curry",
    ingredients: [
      "fish",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "curry leaves",
      "mustard seeds",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "coconut milk (optional)",
      "tamarind",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Prawn Curry",
    ingredients: [
      "prawns",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "curry leaves",
      "mustard seeds",
      "turmeric",
      "red chilli powder",
      "coconut milk",
      "tamarind",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Egg Curry",
    ingredients: [
      "eggs",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "curry leaves (optional)",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Mushroom Masala",
    ingredients: [
      "mushrooms",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "cream (optional)",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Aloo Matar",
    ingredients: [
      "potatoes",
      "green peas",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "cumin seeds",
      "turmeric",
      "red chilli powder",
      "coriander powder",
      "garam masala",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Aloo Palak",
    ingredients: [
      "spinach",
      "potatoes",
      "onions",
      "tomatoes",
      "ginger",
      "garlic",
      "cumin seeds",
      "turmeric",
      "red chilli powder",
      "garam masala",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Saag Paneer",
    ingredients: [
      "mustard greens",
      "spinach",
      "paneer",
      "onions",
      "ginger",
      "garlic",
      "green chillies",
      "makki atta (optional)",
      "ghee",
      "garam masala",
      "salt",
    ],
  },
  {
    recipe: "Paneer Bhurji",
    ingredients: [
      "paneer",
      "onions",
      "tomatoes",
      "green chillies",
      "ginger",
      "turmeric",
      "red chilli powder",
      "garam masala",
      "coriander leaves",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Vegetable Biryani",
    ingredients: [
      "basmati rice",
      "mixed vegetables",
      "onions",
      "tomatoes",
      "yogurt",
      "ginger-garlic paste",
      "biryani masala",
      "mint leaves",
      "coriander leaves",
      "saffron",
      "warm milk",
      "ghee",
      "whole spices",
      "salt",
    ],
  },
  {
    recipe: "Mutton Biryani",
    ingredients: [
      "basmati rice",
      "mutton",
      "yogurt",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "biryani masala",
      "mint leaves",
      "coriander leaves",
      "saffron",
      "ghee",
      "whole spices",
      "salt",
    ],
  },
  {
    recipe: "Egg Biryani",
    ingredients: [
      "basmati rice",
      "eggs",
      "onions",
      "tomatoes",
      "yogurt",
      "ginger-garlic paste",
      "biryani masala",
      "mint leaves",
      "coriander leaves",
      "saffron",
      "ghee",
      "whole spices",
      "salt",
    ],
  },
  {
    recipe: "Hyderabadi Biryani",
    ingredients: [
      "basmati rice",
      "meat (chicken or mutton)",
      "yogurt",
      "onions",
      "mint leaves",
      "coriander leaves",
      "green chillies",
      "fried onions",
      "saffron",
      "ghee",
      "whole spices",
      "lemon juice",
      "biryani masala",
      "salt",
    ],
  },
  {
    recipe: "Lucknowi Biryani",
    ingredients: [
      "basmati rice",
      "mutton",
      "yogurt",
      "onions",
      "rose water",
      "kewra water",
      "saffron",
      "ghee",
      "whole spices",
      "ginger-garlic paste",
      "salt",
    ],
  },
  {
    recipe: "Kolkata Biryani",
    ingredients: [
      "basmati rice",
      "mutton",
      "potatoes",
      "eggs (optional)",
      "onions",
      "yogurt",
      "kewra water",
      "rose water",
      "saffron",
      "ghee",
      "whole spices",
      "salt",
    ],
  },
  {
    recipe: "Pulao",
    ingredients: [
      "basmati rice",
      "mixed vegetables",
      "onions",
      "green peas",
      "whole spices",
      "ghee or oil",
      "coriander leaves",
      "salt",
    ],
  },
  {
    recipe: "Jeera Rice",
    ingredients: ["basmati rice", "cumin seeds", "ghee", "bay leaf", "green chilli (optional)", "salt"],
  },
  {
    recipe: "Lemon Rice",
    ingredients: [
      "cooked rice",
      "mustard seeds",
      "urad dal",
      "chana dal",
      "curry leaves",
      "green chillies",
      "turmeric",
      "peanuts",
      "lemon juice",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Curd Rice",
    ingredients: [
      "cooked rice",
      "curd",
      "milk",
      "ginger",
      "green chillies",
      "mustard seeds",
      "urad dal",
      "curry leaves",
      "hing",
      "pomegranate (optional)",
      "salt",
    ],
  },
  {
    recipe: "Tamarind Rice",
    ingredients: [
      "cooked rice",
      "tamarind pulp",
      "mustard seeds",
      "urad dal",
      "chana dal",
      "curry leaves",
      "dry red chillies",
      "peanuts",
      "sesame seeds (optional)",
      "turmeric",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Coconut Rice",
    ingredients: [
      "cooked rice",
      "grated coconut",
      "mustard seeds",
      "urad dal",
      "chana dal",
      "curry leaves",
      "green chillies",
      "cashews",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Naan",
    ingredients: [
      "all-purpose flour",
      "yeast",
      "sugar",
      "salt",
      "yogurt",
      "milk",
      "oil",
      "butter",
      "garlic (optional)",
    ],
  },
  { recipe: "Roti", ingredients: ["whole wheat flour", "water", "salt (optional)", "oil (optional)"] },
  { recipe: "Paratha", ingredients: ["whole wheat flour", "water", "salt", "ghee or oil"] },
  {
    recipe: "Aloo Paratha",
    ingredients: [
      "whole wheat flour",
      "potatoes",
      "onions",
      "green chillies",
      "coriander leaves",
      "amchur",
      "garam masala",
      "salt",
      "ghee or oil",
    ],
  },
  {
    recipe: "Gobi Paratha",
    ingredients: [
      "whole wheat flour",
      "grated cauliflower",
      "onions",
      "green chillies",
      "ginger",
      "coriander leaves",
      "garam masala",
      "amchur",
      "salt",
      "ghee or oil",
    ],
  },
  {
    recipe: "Paneer Paratha",
    ingredients: [
      "whole wheat flour",
      "paneer",
      "onions",
      "green chillies",
      "coriander leaves",
      "garam masala",
      "amchur",
      "salt",
      "ghee or oil",
    ],
  },
  { recipe: "Puri", ingredients: ["whole wheat flour", "semolina (optional)", "salt", "oil", "water"] },
  {
    recipe: "Bhatura",
    ingredients: [
      "all-purpose flour",
      "semolina",
      "yogurt",
      "baking powder",
      "baking soda",
      "sugar",
      "salt",
      "oil",
      "water",
    ],
  },
  {
    recipe: "Kulcha",
    ingredients: [
      "all-purpose flour",
      "yogurt",
      "baking powder",
      "baking soda",
      "milk",
      "sugar",
      "salt",
      "oil",
      "butter",
      "garlic (optional)",
    ],
  },
  {
    recipe: "Poha",
    ingredients: [
      "flattened rice",
      "onions",
      "potatoes (optional)",
      "green chillies",
      "mustard seeds",
      "curry leaves",
      "turmeric",
      "peanuts",
      "lemon",
      "coriander leaves",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Upma",
    ingredients: [
      "semolina",
      "onions",
      "green chillies",
      "ginger",
      "mustard seeds",
      "urad dal",
      "chana dal",
      "curry leaves",
      "cashews",
      "ghee or oil",
      "salt",
    ],
  },
  {
    recipe: "Pongal",
    ingredients: [
      "raw rice",
      "moong dal",
      "black pepper",
      "cumin seeds",
      "ginger",
      "cashews",
      "ghee",
      "curry leaves",
      "salt",
    ],
  },
  {
    recipe: "Khichdi",
    ingredients: [
      "rice",
      "moong dal",
      "turmeric",
      "ghee",
      "cumin seeds",
      "ginger",
      "green chillies (optional)",
      "salt",
    ],
  },
  {
    recipe: "Dal Makhani",
    ingredients: [
      "whole urad dal",
      "rajma",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "butter",
      "cream",
      "kasuri methi",
      "garam masala",
      "red chilli powder",
      "ghee or oil",
      "salt",
    ],
  },
  {
    recipe: "Dal Fry",
    ingredients: [
      "toor dal",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "turmeric",
      "red chilli powder",
      "cumin seeds",
      "mustard seeds",
      "hing",
      "ghee",
      "curry leaves",
      "salt",
    ],
  },
  {
    recipe: "Moong Dal",
    ingredients: ["moong dal", "turmeric", "ginger", "green chillies", "cumin seeds", "ghee", "hing", "salt"],
  },
  {
    recipe: "Chana Dal",
    ingredients: [
      "chana dal",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "turmeric",
      "red chilli powder",
      "cumin seeds",
      "garam masala",
      "ghee or oil",
      "salt",
    ],
  },
  {
    recipe: "Toor Dal",
    ingredients: ["toor dal", "turmeric", "tomatoes", "green chillies", "cumin seeds", "ghee", "salt"],
  },
  {
    recipe: "Urad Dal",
    ingredients: [
      "split urad dal",
      "onions",
      "tomatoes",
      "ginger-garlic paste",
      "turmeric",
      "red chilli powder",
      "cumin seeds",
      "ghee or oil",
      "salt",
    ],
  },
  {
    recipe: "Raita",
    ingredients: [
      "curd",
      "cucumber (optional)",
      "onions (optional)",
      "tomatoes (optional)",
      "roasted cumin powder",
      "coriander leaves",
      "salt",
    ],
  },
  {
    recipe: "Boondi Raita",
    ingredients: [
      "curd",
      "boondi",
      "roasted cumin powder",
      "black salt",
      "chilli powder (optional)",
      "coriander leaves",
    ],
  },
  {
    recipe: "Cucumber Raita",
    ingredients: ["curd", "cucumber", "roasted cumin powder", "black pepper", "coriander leaves", "salt"],
  },
  {
    recipe: "Mint Chutney",
    ingredients: [
      "mint leaves",
      "coriander leaves",
      "green chillies",
      "ginger",
      "lemon juice",
      "roasted cumin powder",
      "salt",
    ],
  },
  {
    recipe: "Tamarind Chutney",
    ingredients: ["tamarind", "jaggery", "dates (optional)", "cumin powder", "red chilli powder", "black salt", "salt"],
  },
  {
    recipe: "Coconut Chutney",
    ingredients: [
      "grated coconut",
      "roasted chana dal",
      "green chillies",
      "ginger",
      "curd (optional)",
      "mustard seeds",
      "curry leaves",
      "dry red chillies",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Tomato Chutney",
    ingredients: [
      "tomatoes",
      "onions (optional)",
      "garlic",
      "red chillies",
      "mustard seeds",
      "curry leaves",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Onion Chutney",
    ingredients: ["onions", "red chillies", "tamarind", "mustard seeds", "curry leaves", "oil", "salt"],
  },
  {
    recipe: "Peanut Chutney",
    ingredients: [
      "peanuts",
      "green chillies",
      "garlic",
      "tamarind",
      "cumin seeds",
      "mustard seeds",
      "curry leaves",
      "oil",
      "salt",
    ],
  },
  {
    recipe: "Gulab Jamun",
    ingredients: [
      "khoya",
      "paneer (optional)",
      "all-purpose flour",
      "baking powder",
      "milk",
      "sugar",
      "water",
      "cardamom",
      "rose water",
      "ghee or oil",
    ],
  },
  { recipe: "Rasgulla", ingredients: ["milk", "lemon juice", "sugar", "water", "cardamom", "rose water"] },
  {
    recipe: "Jalebi",
    ingredients: [
      "all-purpose flour",
      "cornflour",
      "yogurt",
      "baking powder",
      "sugar",
      "water",
      "saffron",
      "cardamom",
      "ghee or oil",
    ],
  },
  {
    recipe: "Kheer",
    ingredients: [
      "basmati rice",
      "milk",
      "sugar",
      "cardamom",
      "saffron (optional)",
      "cashews",
      "almonds",
      "raisins",
      "ghee (optional)",
    ],
  },
  {
    recipe: "Gajar Halwa",
    ingredients: ["carrots", "milk", "khoya (optional)", "sugar", "ghee", "cardamom", "cashews", "almonds", "raisins"],
  },
  {
    recipe: "Besan Ladoo",
    ingredients: ["besan", "ghee", "sugar (powdered)", "cardamom", "cashews (optional)", "almonds (optional)"],
  },
  {
    recipe: "Rava Kesari",
    ingredients: ["semolina", "sugar", "ghee", "water", "milk", "cardamom", "saffron (optional)", "cashews", "raisins"],
  },
  { recipe: "Mysore Pak", ingredients: ["besan", "ghee", "sugar", "water"] },
  { recipe: "Barfi", ingredients: ["khoya", "sugar", "ghee", "cardamom", "nuts (optional)"] },
  { recipe: "Peda", ingredients: ["khoya", "sugar", "cardamom", "ghee", "saffron (optional)"] },
  {
    recipe: "Kulfi",
    ingredients: ["milk", "condensed milk", "cream", "sugar", "cardamom", "pistachios", "saffron (optional)"],
  },
  {
    recipe: "Falooda",
    ingredients: ["falooda sev", "milk", "rose syrup", "basil seeds", "ice cream", "jelly (optional)", "nuts"],
  },
  { recipe: "Lassi", ingredients: ["curd", "water", "sugar or salt", "cardamom (optional)", "rose water (optional)"] },
  {
    recipe: "Masala Chai",
    ingredients: [
      "tea leaves",
      "milk",
      "water",
      "sugar",
      "ginger",
      "cardamom",
      "cinnamon",
      "cloves",
      "black pepper (optional)",
    ],
  },
]

// Helper function to categorize ingredients
function categorizeIngredient(name: string): string {
  const lowerName = name.toLowerCase()

  // Meat & Protein
  if (
    lowerName.includes("chicken") ||
    lowerName.includes("mutton") ||
    lowerName.includes("lamb") ||
    lowerName.includes("fish") ||
    lowerName.includes("prawn") ||
    lowerName.includes("meat") ||
    lowerName.includes("egg")
  )
    return "meat"

  // Dairy
  if (
    lowerName.includes("paneer") ||
    lowerName.includes("cream") ||
    lowerName.includes("butter") ||
    lowerName.includes("ghee") ||
    lowerName.includes("yogurt") ||
    lowerName.includes("curd") ||
    lowerName.includes("milk") ||
    lowerName.includes("khoya") ||
    lowerName.includes("cheese")
  )
    return "dairy"

  // Produce
  if (
    lowerName.includes("onion") ||
    lowerName.includes("tomato") ||
    lowerName.includes("potato") ||
    lowerName.includes("spinach") ||
    lowerName.includes("cauliflower") ||
    lowerName.includes("capsicum") ||
    lowerName.includes("carrot") ||
    lowerName.includes("peas") ||
    lowerName.includes("ginger") ||
    lowerName.includes("garlic") ||
    lowerName.includes("chilli") ||
    lowerName.includes("coriander") ||
    lowerName.includes("mint") ||
    lowerName.includes("curry leaves") ||
    lowerName.includes("eggplant") ||
    lowerName.includes("okra") ||
    lowerName.includes("mushroom") ||
    lowerName.includes("vegetable") ||
    lowerName.includes("greens") ||
    lowerName.includes("cucumber") ||
    lowerName.includes("lemon")
  )
    return "produce"

  // Pantry (everything else - spices, grains, legumes, etc.)
  return "pantry"
}

// Helper function to estimate amount and unit
function estimateAmountAndUnit(ingredientName: string): { amount: number; unit: string } {
  const lowerName = ingredientName.toLowerCase()

  // Spices and small quantities
  if (
    lowerName.includes("powder") ||
    lowerName.includes("masala") ||
    lowerName.includes("seeds") ||
    lowerName.includes("saffron") ||
    lowerName.includes("hing") ||
    lowerName.includes("bay leaf")
  ) {
    return { amount: 1, unit: "tsp" }
  }

  // Liquids
  if (
    lowerName.includes("oil") ||
    lowerName.includes("ghee") ||
    lowerName.includes("water") ||
    lowerName.includes("milk") ||
    lowerName.includes("cream") ||
    lowerName.includes("juice")
  ) {
    return { amount: 2, unit: "tbsp" }
  }

  // Vegetables
  if (
    lowerName.includes("onion") ||
    lowerName.includes("tomato") ||
    lowerName.includes("potato") ||
    lowerName.includes("cauliflower") ||
    lowerName.includes("capsicum") ||
    lowerName.includes("eggplant")
  ) {
    return { amount: 2, unit: "whole" }
  }

  // Leafy greens
  if (
    lowerName.includes("spinach") ||
    lowerName.includes("coriander") ||
    lowerName.includes("mint") ||
    lowerName.includes("curry leaves") ||
    lowerName.includes("greens")
  ) {
    return { amount: 1, unit: "cup" }
  }

  // Proteins
  if (
    lowerName.includes("chicken") ||
    lowerName.includes("mutton") ||
    lowerName.includes("lamb") ||
    lowerName.includes("fish") ||
    lowerName.includes("prawn")
  ) {
    return { amount: 500, unit: "g" }
  }

  // Paneer and dairy
  if (lowerName.includes("paneer") || lowerName.includes("cheese")) {
    return { amount: 200, unit: "g" }
  }

  // Rice and grains
  if (
    lowerName.includes("rice") ||
    lowerName.includes("flour") ||
    lowerName.includes("dal") ||
    lowerName.includes("semolina") ||
    lowerName.includes("besan")
  ) {
    return { amount: 1, unit: "cup" }
  }

  // Default
  return { amount: 1, unit: "unit" }
}

// Generate the updated Indian recipes section
function generateIndianRecipes() {
  const recipes = indianRecipesData.map((recipeData, index) => {
    const ingredients = recipeData.ingredients.map((ing, ingIndex) => {
      const { amount, unit } = estimateAmountAndUnit(ing)
      return {
        id: `ind-${index + 1}-${ingIndex + 1}`,
        name: ing,
        amount,
        unit,
        category: categorizeIngredient(ing),
      }
    })

    // Determine category based on recipe name
    let category = "dinner"
    const name = recipeData.recipe.toLowerCase()
    if (
      name.includes("dosa") ||
      name.includes("idli") ||
      name.includes("vada") ||
      name.includes("uttapam") ||
      name.includes("poha") ||
      name.includes("upma") ||
      name.includes("pongal")
    ) {
      category = "breakfast"
    } else if (
      name.includes("gulab") ||
      name.includes("rasgulla") ||
      name.includes("jalebi") ||
      name.includes("kheer") ||
      name.includes("halwa") ||
      name.includes("ladoo") ||
      name.includes("kesari") ||
      name.includes("pak") ||
      name.includes("barfi") ||
      name.includes("peda") ||
      name.includes("kulfi") ||
      name.includes("falooda")
    ) {
      category = "dessert"
    } else if (name.includes("lassi") || name.includes("chai")) {
      category = "beverage"
    }

    // Determine diet type
    let diet = "classic"
    if (!ingredients.some((ing) => ing.category === "meat")) {
      diet = "vegetarian"
    }

    return {
      id: `indian-${index + 1}`,
      name: recipeData.recipe,
      category,
      diet,
      prepTime: 15,
      cookTime: 30,
      servings: 4,
      ingredients,
      nutrition: { calories: 400, protein: 20, carbs: 40, fat: 15 },
    }
  })

  return recipes
}

const updatedRecipes = generateIndianRecipes()

console.log("[v0] Generated", updatedRecipes.length, "Indian recipes with complete ingredients")
console.log("[v0] Sample recipe:", updatedRecipes[0].name, "has", updatedRecipes[0].ingredients.length, "ingredients")
console.log("[v0] Ingredient breakdown:")
updatedRecipes.forEach((recipe) => {
  console.log(`  - ${recipe.name}: ${recipe.ingredients.length} ingredients`)
})

console.log("\n[v0] Now you need to manually update lib/sample-recipes.ts")
console.log("[v0] Replace the Indian recipes section (lines 14-191) with the generated recipes")
