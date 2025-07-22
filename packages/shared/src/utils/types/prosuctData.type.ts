export type ProductType = {
    id: number;
    name: string;
    image: string;
    price: number;
    brand: string
    discount?: number;
    description: string;
    attributes: ProductAttrType;
};

export type ProductAttrType = {
    productsId: number;
    type: string;
    category: string;
    color: string;
    size: string;
    brand: string;
    material: string; 
    countryOfOrigin: String
    weight: number
}