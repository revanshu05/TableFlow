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
      { id: 1, name: "Paneer Tikka", price: 250, isVeg: true },
      { id: 2, name: "Chicken Tikka", price: 300, isVeg: false },
      { id: 3, name: "Tandoori Chicken", price: 350, isVeg: false },
      { id: 4, name: "Samosa", price: 100, isVeg: true },
      { id: 5, name: "Aloo Tikki", price: 120, isVeg: true },
      { id: 6, name: "Hara Bhara Kebab", price: 220, isVeg: true },
    ],
  },

  mainCourse: {
    id: 2,
    name: "Main Course",
    image: mainCourse,
    items: [
      { id: 1, name: "Butter Chicken", price: 420 },
      { id: 2, name: "Shahi Paneer", price: 320 },
      { id: 3, name: "Dal Makhani", price: 280 },
      { id: 4, name: "Kadai Paneer", price: 330 },
      { id: 5, name: "Chicken Curry", price: 390 },
      { id: 6, name: "Jeera Rice", price: 180 },
    ],
  },

  beverages: {
    id: 3,
    name: "Beverages",
    image: beverages,
    items: [
      { id: 1, name: "Cold Coffee", price: 180 },
      { id: 2, name: "Lemon Soda", price: 80 },
      { id: 3, name: "Mango Shake", price: 150 },
      { id: 4, name: "Fresh Lime", price: 90 },
      { id: 5, name: "Chocolate Shake", price: 170 },
      { id: 6, name: "Mineral Water", price: 40 },
    ],
  },

  soups: {
    id: 4,
    name: "Soups",
    image: soups,
    items: [
      { id: 1, name: "Tomato Soup", price: 140 },
      { id: 2, name: "Sweet Corn Soup", price: 150 },
      { id: 3, name: "Hot & Sour Soup", price: 170 },
      { id: 4, name: "Manchow Soup", price: 180 },
      { id: 5, name: "Chicken Soup", price: 200 },
      { id: 6, name: "Veg Clear Soup", price: 130 },
    ],
  },

  desserts: {
    id: 5,
    name: "Desserts",
    image: desserts,
    items: [
      { id: 1, name: "Gulab Jamun", price: 90 },
      { id: 2, name: "Rasmalai", price: 120 },
      { id: 3, name: "Brownie", price: 180 },
      { id: 4, name: "Ice Cream", price: 100 },
    ],
  },

  pizzas: {
    id: 6,
    name: "Pizzas",
    image: pizzas,
    items: [
      { id: 1, name: "Margherita", price: 250 },
      { id: 2, name: "Farmhouse", price: 380 },
      { id: 3, name: "Pepperoni", price: 450 },
    ],
  },

  drinks: {
    id: 7,
    name: "Alcoholic Drinks",
    image: drinks,
    items: [
      { id: 1, name: "Beer", price: 220 },
      { id: 2, name: "Whiskey", price: 450 },
      { id: 3, name: "Vodka", price: 400 },
      { id: 4, name: "Rum", price: 350 },
      { id: 5, name: "Wine", price: 550 },
      { id: 6, name: "Gin", price: 480 },
    ],
  },

  salads: {
    id: 8,
    name: "Salads",
    image: salads,
    items: [
      { id: 1, name: "Green Salad", price: 120 },
      { id: 2, name: "Caesar Salad", price: 220 },
      { id: 3, name: "Greek Salad", price: 250 },
      { id: 4, name: "Fruit Salad", price: 180 },
      { id: 5, name: "Russian Salad", price: 230 },
    ],
  },
};

export default menus;