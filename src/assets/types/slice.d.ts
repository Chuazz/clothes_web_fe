import { ProductType } from '@assets/interface';
import { OptionType } from './common';
import { CartProductByShopType, CartProductType, UserType } from './cart';

interface signInSliceType {
    account: string;
    password: string;
    rememberPassword: boolean;
    token?: string;
    userName: string;
}

interface MenuSliceType {
    activeItem?: string;
    openMenu?: boolean;
    parent?: string;
}

interface LANGUAGE_OPTIONSliceType {
    currLanguage: string;
}

interface filterSliceType {
    categories_code?: string[];
    min_price?: number;
    max_price?: number;
    locations_code?: string[];
    keyword?: string;
}

interface cartSliceType {
    products: CartProductType[];
    total_price: number;
    user: UserType | undefined;
    productsByShop: CartProductByShopType[];
}

export type { signInSliceType, MenuSliceType, LANGUAGE_OPTIONSliceType, filterSliceType, cartSliceType };
