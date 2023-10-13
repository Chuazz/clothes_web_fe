import { ProductType } from '.';

interface ShopType {
    id?: string;
    name: string;
    image: string;
    is_active?: boolean;
    product_category: any;
    comments: any[];
    location: any;
    owner: any;
    follows_by: any;
    products: ProductType[];
    orders: any[];
}

export type { ShopType };
