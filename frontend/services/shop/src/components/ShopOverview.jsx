import React, { useEffect, useRef, useState } from "react";
import cl from "@/utils/styles/modules/ShopOverview.module.scss";
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
        <div className={cl.overview}>
            <div className={cl.overview__wrapper}>
                {width >= 1069 && <FiltersStickyBar />}
                <ProductShopList />
            </div>
        </div>
    );
};

export default ShopOverview;

