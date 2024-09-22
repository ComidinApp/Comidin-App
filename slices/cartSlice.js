import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
}

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      state.items = [...state.items, action.payload];
    },
    removeToCart: (state, action) => {
     let newCart = [...state.items];
     let itemIndex = state.items.findIndex((cartItem) => cartItem.id === action.payload.id);
     if(itemIndex >= 0){
       newCart.splice(itemIndex, 1);
     }else{
        console.warn(`Cant remove product (id: ${action.payload.id}) as its not in cart!`)
     }

     state.items = newCart;
    },
    emptyCart: (state, action) => {
      state.items = [];
    },
  },
})

export const { addToCart, removeToCart, emptyCart } = cartSlice.actions

export const selectCart = (state) => state.cart.items;
export const selectCartItemsByID = (state, id) => state.cart.items.filter((item) => item.id === id);
export const selectCartTotal = (state) => state.cart.items.reduce((total, item) => total + item.price, 0);

export default cartSlice.reducer