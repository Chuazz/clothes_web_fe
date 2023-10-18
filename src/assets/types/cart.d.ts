interface CartProductType {
    id?: string;
    name?: string;
    image?: string;
    qty?: number;
    price?: number;
    rating?: number;
    on_order?: boolean;
    original_price?: number;
    shop_id?: string;
    shop_name?: string;
    shop_image?: string;
}

interface CartProductByShopType {
    shop_id: ?string;
    shop_name?: string;
    shop_image?: string;
    total_price?: number;
    products?: CartProductType[];
}

interface UserType {
    name: string;
    phone_number: string;
    address: string;
    note: string;
}

export type { CartProductType, UserType, CartProductByShopType };
