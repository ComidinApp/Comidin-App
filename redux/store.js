import { configureStore } from '@reduxjs/toolkit'
import cartSlice from './slices/cartSlice';
import restaurantSlice from './slices/restaurantSlice';
import { commerceApi } from './apis/commerce';
import { publicationApi } from './apis/publication';
import { addressApi } from './apis/address';
import { userApi } from './apis/user';
import { cartMiddleware } from './middleware/cartMiddleware';
import userSlice from './slices/userSlice';
import addressReducer from './slices/addressSlice';
import { orderApi } from './apis/order';

const customMiddleware = (store) => (next) => (action) => {
  if (action.type === 'address/setCurrentAddress') {
    console.log('Setting address in Redux:', action.payload);
  }
  return next(action);
};

export const store = configureStore({
  reducer: {
    cart: cartSlice,
    restaurant: restaurantSlice,
    [commerceApi.reducerPath]: commerceApi.reducer,
    [publicationApi.reducerPath]: publicationApi.reducer,
    [addressApi.reducerPath]: addressApi.reducer,
    [userApi.reducerPath]: userApi.reducer,
    user: userSlice,
    address: addressReducer,
    [orderApi.reducerPath]: orderApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>  
    getDefaultMiddleware().
      concat(commerceApi.middleware).
      concat(publicationApi.middleware).
      concat(addressApi.middleware).
      concat(userApi.middleware).
      concat(cartMiddleware).
      concat(customMiddleware).
      concat(orderApi.middleware),
})