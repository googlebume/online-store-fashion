export type ProductType = {
    id: number;
    name: string;
    image: string;
    price: number;
    discount?: number;
    description: string;
    attributes: ProductAttrType[];
};

export type ProductAttrType = {
    productsId: number;
    type: String;
    category: String;
    color: String;
    size: String;
    brand: String;
    material: String; 
    countryOfOrigin: String
    weight: number
}