import { configureStore } from '@reduxjs/toolkit'
import cartSlice from '../slices/cartSlice';
import restaurantSlice from '../slices/restaurantSlice';
import { commerceApi } from './apis/commerce';
import { publicationApi } from './apis/publication';
import { adressApi } from './apis/adress';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    restaurant: restaurantSlice,
    [commerceApi.reducerPath]: commerceApi.reducer,
    [publicationApi.reducerPath]: publicationApi.reducer,
    [adressApi.reducerPath]: adressApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>  
    getDefaultMiddleware().
      concat(commerceApi.middleware).
      concat(publicationApi.middleware).
      concat(adressApi.middleware),
})