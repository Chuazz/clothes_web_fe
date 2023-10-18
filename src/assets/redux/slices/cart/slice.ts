import { CartProductByShopType, CartProductType, UserType } from '@assets/types/cart';
import { cartSliceType } from '@assets/types/slice';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { setCookie } from 'cookies-next';
import moment from 'moment';

const initialCartState: cartSliceType = {
    products: [],
    user: undefined,
    total_price: 0,
    productsByShop: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialCartState,
    reducers: {
        setItems: (state, action: PayloadAction<CartProductType[]>) => {
            state.products = action.payload;

            setCookie('cart_products', state.products, { expires: moment().add({ day: 360 }).toDate() });
        },
        addItem: (state, action: PayloadAction<CartProductType>) => {
            state.products?.push(action.payload);
        },
        removeItem: (state, action: PayloadAction<CartProductType>) => {
            let foundIndex = state.products.findIndex((t) => t.id === action.payload.id);

            if (foundIndex > -1) {
                state.products.splice(foundIndex, 1);

                setCookie('cart_products', state.products, { expires: moment().add({ day: 360 }).toDate() });
            }
        },
        updateItem: (state, action: PayloadAction<CartProductType>) => {
            let foundIndex = state.products.findIndex((t) => t.id === action.payload.id);

            if (foundIndex > -1) {
                state.products[foundIndex] = action.payload;

                setCookie('cart_products', state.products, { expires: moment().add({ day: 360 }).toDate() });
            }
        },
        setUserInfo: (state, action: PayloadAction<UserType>) => {
            state.user = action.payload;
        },
        confirmOrder: (state, action: PayloadAction<CartProductType[]>) => {
            let products = state.products.filter((t) => {
                let index = action.payload.findIndex((t2) => t2.id === t.id);

                if (index === -1) {
                    return t;
                }
            });

            state.products = products;

            setCookie('cart_products', state.products, { expires: moment().add({ day: 360 }).toDate() });
        },
        calculateCart: (state) => {
            const groupedProducts: CartProductType[] = [];
            let total_price = 0;

            state.products.forEach((product) => {
                const existingItem = groupedProducts.find((item) => item.id === product.id);

                if (existingItem) {
                    existingItem.qty! += product.qty!;
                    existingItem.price! += product.original_price!;
                } else {
                    groupedProducts.push(product);
                }

                if (product.on_order) {
                    total_price += product.price!;
                }
            });

            state.products = groupedProducts;
            state.total_price = total_price;

            setCookie('cart_products', state.products, { expires: moment().add({ day: 360 }).toDate() });
        },
        splitOrder: (state) => {
            const groupedProducts: CartProductByShopType[] = [];

            state.products.forEach((product) => {
                const existingItem = groupedProducts.find((item) => item.shop_id === product.shop_id);

                if (existingItem) {
                    existingItem.total_price! += product.original_price! * product.qty!;
                    existingItem.products?.push(product);
                } else {
                    groupedProducts.push({
                        shop_id: product.shop_id!,
                        shop_name: product.shop_name,
                        shop_image: product.shop_image,
                        products: [product],
                        total_price: product.original_price! * product.qty!,
                    });
                }
            });

            state.productsByShop = groupedProducts;
        },
    },
    extraReducers: (builder) => {
        builder;
    },
});

export { initialCartState };
export default cartSlice;
