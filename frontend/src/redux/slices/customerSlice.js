import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  customerName: "",
  customerPhone: "",
  members: "",
  tableNo: "",
  orderId: "",
  orderType: "",
};

const customerSlice = createSlice({
    name: "customer",
    initialState,
    reducers : {
        setCustomer : (state, action) => {
            const {name, phone, members, orderType} = action.payload;
            state.customerName = name;
            state.customerPhone = phone;
            state.members = members;
            state.orderType = orderType;
            state.orderId = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
        },

        removeCustomer : (state) => {
            state.customerName = "";
            state.customerPhone = "";
            state.members = 0;
            state.type = "";
            state.tableNo = "";
        },

        updateTable : (state, action) => {
            state.tableNo = action.payload.tableNo;
        }
    }
})

export const {setCustomer, removeCustomer, updateTable} = customerSlice.actions;
export default customerSlice.reducer;