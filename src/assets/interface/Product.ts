interface ProductType {
    id?: string;
    internal_code: string;
    name: string;
    price: number;
    description: string;
    image: string;
    sole_number: number;
    rating?: number;
    in_stock?: number;
    policies?: string;
    is_active?: string;
    images: string[];
    shop: any;
    properties: any[];
    product_category: any;
    comments: any[];
}

export type { ProductType };
