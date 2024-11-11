import { setRestaurant } from '../slices/restaurantSlice';
import { clearCart } from '../slices/cartSlice';

export const cartMiddleware = store => next => action => {
  if (action.type === setRestaurant.type) {
    const currentRestaurant = store.getState().restaurant.restaurant;
    const newRestaurant = action.payload;
    
    if (currentRestaurant && newRestaurant && currentRestaurant.id !== newRestaurant.id) {
      store.dispatch(clearCart());
    }
  }
  
  return next(action);
}; 