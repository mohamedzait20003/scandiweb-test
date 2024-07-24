import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCartOpen: false,
    cartItems: [],
};

const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        toogleCart: (state, action) => {
            state.isCartOpen = !state.isCartOpen;
        },
        addItem: (state, action) => {
            const newItemId = action.payload.id;
            const itemExists = state.cartItems.find(
                item => item.id === newItemId
            );

            if(itemExists){
                itemExists.quantity++;
            } else{
                state.cartItems.push(action.payload);
            }
        },
        removeItem: (state, action) => {
            state.cartItems  = state.cartItems.filter(
                item => item.id !== action.payload.id
            );
        },
        incrementItem: (state, action) => {
            state.cartItems = state.cartItems.map(item => {
                if (item.id === action.payload.id) {
                    return { ...item, quantity: item.quantity + 1 };
                }
                return item;
            });
        },
        decrementItem: (state, action) => {
            state.cartItems = state.cartItems.map(item => {
                if (item.id === action.payload.id) {
                    return { ...item, quantity: item.quantity - 1 };
                }
                return item;
            });
        },
    },
});