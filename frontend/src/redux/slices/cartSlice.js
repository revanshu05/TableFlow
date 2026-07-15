import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,

    reducers: {

        addItem: (state, action) => {
            const newItem = action.payload;

            if (newItem.quantity <= 0) return;

            const existingItem = state.items.find((item) => item.id === newItem.id);

            if(existingItem) existingItem.quantity += newItem.quantity;
            else state.items.push({...newItem,});
        },

        // increaseQuantity: (state, action) => {
        //     const item = state.items.find((item) => item.id === action.payload);

        //     if(item) item.quantity += 1;
        // },

        // decreaseQuantity: (state, action) => {
        //     const item = state.items.find((item) => item.id === action.payload);

        //     if (!item) return;

        //     if (item.quantity > 1) item.quantity -= 1;
        //     else state.items = state.items.filter((cartItem) => cartItem.id !== action.payload);
        // },

        removeItem: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },

        clearCart: (state) => state.items = [],
    },
});

export const {
    addItem,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;