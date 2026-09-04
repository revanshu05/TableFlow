import User from "../../src/models/user.model.js";
import Table from "../../src/models/table.model.js";
import MenuItem from "../../src/models/menu.model.js";


export const createTestUser = async (
    {
        name = "Test User",
        email = `user_${Date.now()}_${Math.random().toString(36).slice(2, 7)}@test.com`,
        password = "password123",
        role = "waiter",
        active = true,
    } = {}) => {
        
    const user = await User.create({
        name,
        email,
        password,
        role,
        active,
    });

    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    return { user, accessToken, refreshToken, rawPassword: password };
};


let tableCounter = 1;

export const createTestTable = async ({
    tableNo,
    capacity = 4,
    status = "AVAILABLE",
} = {}) => {
    return await Table.create({
        tableNo: tableNo !== undefined ? tableNo : tableCounter++,
        capacity,
        status,
    });
};


export const createTestMenuItem = async ({
    name = `Dish_${Date.now()}`,
    price = 250,
    category = "MAIN_COURSE",
    isAvailable = true,
} = {}) => {
    return await MenuItem.create({
        name,
        price,
        category,
        isAvailable,
    });
};