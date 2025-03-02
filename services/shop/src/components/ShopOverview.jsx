import React, { useEffect, useRef, useState } from "react";
import cl from "@/utils/styles/ShopOverview.module.scss";
import FiltersStickyBar from "@packages/shared/src/components/FiltersStickyBar";
import ProductShopList from "./ProductShopList";

const ShopOverview = () => {
    const screenWidthRef = useRef(window.innerWidth);
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => {
            screenWidthRef.current = window.innerWidth;
            setWidth(window.innerWidth);
        };

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <div className={cl.overview} style={{ marginBottom: "12px" }}>
            <div className={cl.overview__wrapper} style={{ display: "flex", flexWrap: "nowrap" }}>
                {width >= 1069 && <FiltersStickyBar />}
                <ProductShopList />
            </div>
        </div>
    );
};

export default ShopOverview;
