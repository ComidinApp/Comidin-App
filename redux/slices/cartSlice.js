import { createSlice } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const newItem = action.payload;
      const existingItem = state.items.find(
        item => item.id === newItem.id && 
        JSON.stringify(item.selectedExtras) === JSON.stringify(newItem.selectedExtras)
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.items.push({...newItem, quantity: 1});
      }
    },
    removeFromCart: (state, action) => {
      const itemToRemove = state.items.find(
        item => item.id === action.payload.id && 
        JSON.stringify(item.selectedExtras) === JSON.stringify(action.payload.selectedExtras)
      );
      
      if (itemToRemove) {
        if (itemToRemove.quantity > 1) {
          itemToRemove.quantity -= 1;
        } else {
          state.items = state.items.filter(item => 
            !(item.id === action.payload.id && 
              JSON.stringify(item.selectedExtras) === JSON.stringify(action.payload.selectedExtras))
          );
        }
      }
    },
    updateQuantity: (state, action) => {
      const { id, quantity, selectedExtras } = action.payload;
      const item = state.items.find(
        item => item.id === id && 
        JSON.stringify(item.selectedExtras) === JSON.stringify(selectedExtras)
      );
      if (item) {
        item.quantity = quantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

// Selectores
const selectCart = state => state.cart;

// Función auxiliar para parsear precios de manera segura
const parsePrice = (price) => {
  const numPrice = Number(price);
  return isNaN(numPrice) ? 0 : numPrice;
};

export const selectCartItems = createSelector(
  [selectCart],
  cart => cart.items
);

export const selectCartItemsCount = createSelector(
  [selectCartItems],
  items => items.reduce((total, item) => total + item.quantity, 0)
);

export const selectCartItemsByID = createSelector(
  [selectCartItems, (state, id) => id],
  (items, id) => items.filter(item => item.id === id)
);

export const selectCartTotal = createSelector(
  [selectCartItems],
  items => items.reduce((total, item) => {
    const price = parsePrice(item.discounted_price);
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0)
);

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart
} = cartSlice.actions;

export default cartSlice.reducer;