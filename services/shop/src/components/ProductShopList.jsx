import React, { useEffect, useState } from "react";
import ProductCard from "@packages/shared/src/components/ProductCard";
import { exportProducts, getFilteredProducts, subscribeToFilteredProducts } from "../state/productsData";

const ProductShopList = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState(getFilteredProducts());

    // Завантаження всіх продуктів
    useEffect(() => {
        fetch("http://localhost:5000/shop")
            .then((response) => response.json())
            .then((data) => {
                setProducts(data); 
                exportProducts(data);
            })
            .catch(error => console.error("Error fetching products:", error));
    }, []);

    // 🔥 Підписуємось на зміни у `filteredProducts`
    useEffect(() => {
        const unsubscribe = subscribeToFilteredProducts(setFilteredProducts);
        return () => unsubscribe(); // Відписка при демонтажі
    }, []);

    return (
        <section
            style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(257px, 1fr))",
                gap: "8px 6px",
                width: "100%",
            }}
        >
            {(filteredProducts.length > 0 ? filteredProducts : products).map((card) => (
                <ProductCard
                    key={card.name}
                    name={`${card.name}`}
                    price={`${card.price}`}
                    discount={`${card.discount}`}
                    image={card.image}
                />
            ))}
        </section>
    );
};

export default ProductShopList;
