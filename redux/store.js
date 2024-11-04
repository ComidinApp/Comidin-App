import { configureStore } from '@reduxjs/toolkit'
import cartSlice from '../slices/cartSlice';
import restaurantSlice from '../slices/restaurantSlice';
import { commerceApi } from './apis/commerce';
import { publicationApi } from './apis/publication';
import { adressApi } from './apis/adress';
import { userApi } from './apis/user';

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    restaurant: restaurantSlice,
    [commerceApi.reducerPath]: commerceApi.reducer,
    [publicationApi.reducerPath]: publicationApi.reducer,
    [adressApi.reducerPath]: adressApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>  
    getDefaultMiddleware().
      concat(commerceApi.middleware).
      concat(publicationApi.middleware).
      concat(adressApi.middleware).
      concat(userApi.middleware),
})