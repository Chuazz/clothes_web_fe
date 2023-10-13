import cartSlice from '@assets/redux/slices/cart/slice';
import filterSlice from './slices/filter/slice';
import LANGUAGE_OPTIONSlice from './slices/language/slice';
import menuSlice from './slices/menu/slice';
import { signInSlice } from './slices/sign-in';

export const reducer = {
    signIn: signInSlice.reducer,
    menu: menuSlice.reducer,
    language: LANGUAGE_OPTIONSlice.reducer,
    filter: filterSlice.reducer,
    cart: cartSlice.reducer,
};
