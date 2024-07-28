// Redux Library
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCartOpen: false,
    cartItems: [],
};

// Cart Slice
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
                if (item.id === action.payload) {
                   item.quantity++;
                }
                return item;
            });
        },
        decrementItem: (state, action) => {
            state.cartItems = state.cartItems.map(item => {
                if (item.id === action.payload.id) {
                    item.quantity--;
                }
            })
            .filer(item => item.quantity === 0);
        },
    },
});

export const { toogleCart, addItem, removeItem, incrementItem, decrementItem } = CartSlice.actions;
export default CartSlice.reducer;