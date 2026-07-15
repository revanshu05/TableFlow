import starters from "../images/menu/starters.jpg";
import mainCourse from "../images/menu/mainCourse.jpg";
import beverages from "../images/menu/beverages.jpg";
import soups from "../images/menu/soups.jpg";
import desserts from "../images/menu/desserts.jpg";
import pizzas from "../images/menu/pizzas.jpg";
import drinks from "../images/menu/drinks.jpg";
import salads from "../images/menu/salads.jpg";

export const menus = {
  starters: {
    id: 1,
    name: "Starters",
    image: starters,
    items: [
      { id: "ST-001", name: "Paneer Tikka", price: 250, isVeg: true, category: "Starters" },
      { id: "ST-002", name: "Chicken Tikka", price: 300, isVeg: false, category: "Starters" },
      { id: "ST-003", name: "Tandoori Chicken", price: 350, isVeg: false, category: "Starters" },
      { id: "ST-004", name: "Samosa", price: 100, isVeg: true, category: "Starters" },
      { id: "ST-005", name: "Aloo Tikki", price: 120, isVeg: true, category: "Starters" },
      { id: "ST-006", name: "Hara Bhara Kebab", price: 220, isVeg: true, category: "Starters" },
    ],
  },

  mainCourse: {
    id: 2,
    name: "Main Course",
    image: mainCourse,
    items: [
      { id: "MC-001", name: "Butter Chicken", price: 420, isVeg: false, category: "Main Course" },
      { id: "MC-002", name: "Shahi Paneer", price: 320, isVeg: true, category: "Main Course" },
      { id: "MC-003", name: "Dal Makhani", price: 280, isVeg: true, category: "Main Course" },
      { id: "MC-004", name: "Kadai Paneer", price: 330, isVeg: true, category: "Main Course" },
      { id: "MC-005", name: "Chicken Curry", price: 390, isVeg: false, category: "Main Course" },
      { id: "MC-006", name: "Jeera Rice", price: 180, isVeg: true, category: "Main Course" },
    ],
  },

  beverages: {
    id: 3,
    name: "Beverages",
    image: beverages,
    items: [
      { id: "BV-001", name: "Cold Coffee", price: 180, isVeg: true, category: "Beverages" },
      { id: "BV-002", name: "Lemon Soda", price: 80, isVeg: true, category: "Beverages" },
      { id: "BV-003", name: "Mango Shake", price: 150, isVeg: true, category: "Beverages" },
      { id: "BV-004", name: "Fresh Lime", price: 90, isVeg: true, category: "Beverages" },
      { id: "BV-005", name: "Chocolate Shake", price: 170, isVeg: true, category: "Beverages" },
      { id: "BV-006", name: "Mineral Water", price: 40, isVeg: true, category: "Beverages" },
    ],
  },

  soups: {
    id: 4,
    name: "Soups",
    image: soups,
    items: [
      { id: "SP-001", name: "Tomato Soup", price: 140, isVeg: true, category: "Soups" },
      { id: "SP-002", name: "Sweet Corn Soup", price: 150, isVeg: true, category: "Soups" },
      { id: "SP-003", name: "Hot & Sour Soup", price: 170, isVeg: true, category: "Soups" },
      { id: "SP-004", name: "Manchow Soup", price: 180, isVeg: true, category: "Soups" },
      { id: "SP-005", name: "Chicken Soup", price: 200, isVeg: false, category: "Soups" },
      { id: "SP-006", name: "Veg Clear Soup", price: 130, isVeg: true, category: "Soups" },
    ],
  },

  desserts: {
    id: 5,
    name: "Desserts",
    image: desserts,
    items: [
      { id: "DS-001", name: "Gulab Jamun", price: 90, isVeg: true, category: "Desserts" },
      { id: "DS-002", name: "Rasmalai", price: 120, isVeg: true, category: "Desserts" },
      { id: "DS-003", name: "Brownie", price: 180, isVeg: true, category: "Desserts" },
      { id: "DS-004", name: "Ice Cream", price: 100, isVeg: true, category: "Desserts" },
    ],
  },

  pizzas: {
    id: 6,
    name: "Pizzas",
    image: pizzas,
    items: [
      { id: "PZ-001", name: "Margherita", price: 250, isVeg: true, category: "Pizzas" },
      { id: "PZ-002", name: "Farmhouse", price: 380, isVeg: true, category: "Pizzas" },
      { id: "PZ-003", name: "Pepperoni", price: 450, isVeg: false, category: "Pizzas" },
    ],
  },

  drinks: {
    id: 7,
    name: "Alcoholic Drinks",
    image: drinks,
    items: [
      { id: "DR-001", name: "Beer", price: 220, isVeg: true, category: "Alcoholic Drinks" },
      { id: "DR-002", name: "Whiskey", price: 450, isVeg: true, category: "Alcoholic Drinks" },
      { id: "DR-003", name: "Vodka", price: 400, isVeg: true, category: "Alcoholic Drinks" },
      { id: "DR-004", name: "Rum", price: 350, isVeg: true, category: "Alcoholic Drinks" },
      { id: "DR-005", name: "Wine", price: 550, isVeg: true, category: "Alcoholic Drinks" },
      { id: "DR-006", name: "Gin", price: 480, isVeg: true, category: "Alcoholic Drinks" },
    ],
  },

  salads: {
    id: 8,
    name: "Salads",
    image: salads,
    items: [
      { id: "SL-001", name: "Green Salad", price: 120, isVeg: true, category: "Salads" },
      { id: "SL-002", name: "Caesar Salad", price: 220, isVeg: true, category: "Salads" },
      { id: "SL-003", name: "Greek Salad", price: 250, isVeg: true, category: "Salads" },
      { id: "SL-004", name: "Fruit Salad", price: 180, isVeg: true, category: "Salads" },
      { id: "SL-005", name: "Russian Salad", price: 230, isVeg: true, category: "Salads" },
    ],
  },
};

export default menus;