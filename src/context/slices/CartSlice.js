// Redux Library
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isCartOpen: false,
    OpenVerify: false,
    cartItems: [],
    totalCount: 0,
    totalMoney: 0,
};

// Cart Slice
const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        toggleCart: (state) => {
            if(!state.isCartOpen){
                state.isCartOpen = true;
            } else {
                if(state.OpenVerify){
                    state.isCartOpen = false;
                    state.OpenVerify = false;
                } else {
                    state.isCartOpen = false;
                }
            }
        },
        openCart: (state) => {
            state.OpenVerify = true;
        },
        addItem: (state, action) => {
            const newItem = action.payload;
            const itemExists = state.cartItems.find(
                item => item.id === newItem.id && JSON.stringify(item.attributes) === JSON.stringify(newItem.attributes)
            );

            if(itemExists){
                itemExists.quantity++;
            } else{
                state.cartItems.push({ ...newItem, quantity: 1 });
            }

            state.totalCount++;
            state.totalMoney += newItem.price.amount;
        },
        incrementItem: (state, action) => {
            state.cartItems = state.cartItems.map(item => {
                if (item.id === action.payload.id && JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes)) {
                   item.quantity++;
                   state.totalCount++;
                   state.totalMoney += item.price.amount;
                }
                return item;
            });
        },
        decrementItem: (state, action) => {
            state.cartItems = state.cartItems.map(item => {
                if (item.id === action.payload.id && JSON.stringify(item.attributes) === JSON.stringify(action.payload.attributes)) {
                    item.quantity--;
                    state.totalCount--;
                    state.totalMoney -= item.price.amount;
                }
                return item;
            })
            .filter(item => item.quantity > 0);
        },
        AttributeChange: (state, action) => {
            const { id, attributes, changedAttributes } = action.payload;

            const AttrItemExists = state.cartItems.find(
                item => item.id === id && JSON.stringify(item.attributes) === JSON.stringify(changedAttributes)
            );
            const ItemIndex = state.cartItems.findIndex(
                item => item.id === id && JSON.stringify(item.attributes) === JSON.stringify(attributes)
            );

            if (AttrItemExists && ItemIndex !== -1) {
                AttrItemExists.quantity += state.cartItems[ItemIndex].quantity;
                state.cartItems.splice(ItemIndex, 1);
            } else if (ItemIndex !== -1) {
                state.cartItems[ItemIndex].attributes = changedAttributes;
            }
        },
        emptyCart: (state) => {
            state.cartItems = [];
            state.totalCount = 0;
            state.totalMoney = 0;
        }
    },
});

export const { toggleCart, openCart, addItem, incrementItem, decrementItem, AttributeChange, emptyCart } = CartSlice.actions;
export default CartSlice.reducer;