"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const productsDB = [
    { id: "1", name: "Oversize Hoodie", category: "male", type: "hoodie", color: "black", price: 1200, discount: 15, image: "http://localhost:5000/products/hoodie_1_1.webp" },
    { id: "2", name: "Casual Hoodie", category: "male", type: "hoodie", color: "white", price: 1100, discount: 10, image: "http://localhost:5000/products/hoodie_2_1.webp" },
    { id: "3", name: "Sporty Hoodie", category: "female", type: "hoodie", color: "white", price: 1300, discount: 20, image: "http://localhost:5000/products/hoodie_3_1.webp" },
    { id: "4", name: "Streetwear Hoodie", category: "male", type: "hoodie", color: "black", price: 1250, discount: 5, image: "http://localhost:5000/products/hoodie_4_1.webp" },
    { id: "5", name: "Minimalist Hoodie", category: "male", type: "hoodie", color: "brown", price: 1150, discount: 10, image: "http://localhost:5000/products/hoodie_5_1.webp" },
    { id: "6", name: "Classic Sweatshirt", category: "male", type: "sweatshirt", color: "black", price: 1000, discount: 12, image: "http://localhost:5000/products/sweatshirt_1_1.webp" },
    { id: "7", name: "Urban Sweatshirt", category: "female", type: "sweatshirt", color: "black", price: 1050, discount: 8, image: "http://localhost:5000/products/sweatshirt_2_1.webp" },
    { id: "8", name: "Vintage Sweatshirt", category: "female", type: "sweatshirt", color: "pink", price: 1100, discount: 15, image: "http://localhost:5000/products/sweatshirt_3_1.webp" },
    { id: "9", name: "Comfy Sweatshirt", category: "female", type: "sweatshirt", color: "white", price: 980, discount: 10, image: "http://localhost:5000/products/sweatshirt_4_1.webp" },
    { id: "10", name: "Trendy Sweatshirt", category: "female", type: "sweatshirt", color: "black", price: 1020, discount: 7, image: "http://localhost:5000/products/sweatshirt_5_1.webp" },
    { id: "11", name: "Formal Shirt", category: "male", type: "shirt", color: "white", price: 1500, discount: 18, image: "http://localhost:5000/products/shirt_1_1.webp" },
    { id: "12", name: "Casual Shirt", category: "female", type: "shirt", color: "brown", price: 1350, discount: 12, image: "http://localhost:5000/products/shirt_2_1.webp" },
    { id: "13", name: "Linen Shirt", category: "male", type: "shirt", color: "blue", price: 1450, discount: 10, image: "http://localhost:5000/products/shirt_3_1.webp" },
    { id: "14", name: "Denim Shirt", category: "male", type: "shirt", color: "yellow", price: 1400, discount: 15, image: "http://localhost:5000/products/shirt_4_1.webp" },
    { id: "15", name: "Plaid Shirt", category: "female", type: "shirt", color: "white", price: 1300, discount: 20, image: "http://localhost:5000/products/shirt_5_1.webp" },
    { id: "16", name: "Basic T-shirt", category: "female", type: "tshirt", color: "pink", price: 800, discount: 5, image: "http://localhost:5000/products/tshirt_1_1.webp" },
    { id: "17", name: "Graphic T-shirt", category: "male", type: "tshirt", color: "yellow", price: 850, discount: 10, image: "http://localhost:5000/products/tshirt_2_1.webp" },
    { id: "18", name: "Sport T-shirt", category: "male", type: "tshirt", color: "black", price: 900, discount: 12, image: "http://localhost:5000/products/tshirt_3_1.webp" },
    { id: "19", name: "Slim Fit T-shirt", category: "male", type: "tshirt", color: "white", price: 880, discount: 8, image: "http://localhost:5000/products/tshirt_4_1.webp" },
    { id: "20", name: "Vintage T-shirt", category: "male", type: "tshirt", color: "black", price: 950, discount: 15, image: "http://localhost:5000/products/tshirt_5_1.webp" }
];
async function main() {
    console.log("Seeding database...");
    for (const product of productsDB) {
        await prisma.products.create({
            data: {
                name: product.name,
                price: product.price,
                discount: product.discount,
                image: product.image,
                brand: "Generic Brand",
                description: "Default description",
                attributes: {
                    create: {
                        type: product.type,
                        category: product.category,
                        color: product.color,
                        size: "M",
                    },
                },
            },
        });
    }
    console.log("Seeding finished!");
}
main()
    .catch((e) => {
    console.error(e);
    process.exit(1);
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map