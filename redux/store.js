import { configureStore } from '@reduxjs/toolkit'
import cartSlice from '../slices/cartSlice';
import restaurantSlice from '../slices/restaurantSlice';
import { commerceApi } from './apis/commerce';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    restaurant: restaurantSlice,
    [commerceApi.reducerPath]: commerceApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>  getDefaultMiddleware().concat(commerceApi.middleware)
})