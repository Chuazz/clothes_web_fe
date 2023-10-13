interface CartProductType {
    id?: string;
    name?: string;
    image?: string;
    qty?: number;
    price?: number;
    rating?: number;
    onOrder?: boolean;
    originalPrice?: number;
    shop_id?: string;
    shop_name?: string;
    shop_image?: string;
}

interface CartProductByShopType {
    shop_id: ?string;
    shop_name?: string;
    shop_image?: string;
    totalPrice?: number;
    products?: CartProductType[];
}

interface UserType {
    name: string;
    phone_number: string;
    address: string;
    note: string;
}

export type { CartProductType, UserType, CartProductByShopType };
