import React from "react";
import cl from "./FullScreenArrowButton.module.scss";

const FullScreenArrowButton = () => {
    return (
        <div className={cl.toConstructor}>
            <div className={cl.toConstructor__body}>
                <div className={cl.toConstructor__arrow}></div>
                <div className={cl.toConstructor__arrow}></div>
                <div className={cl.toConstructor__arrow}></div>
                <a 
                    className={cl.toConstructor__link} 
                    href="https://googlebume.github.io/online-fashion-constructor/">
                    Створи унікальний принт!
                </a>
                <div className={cl.toConstructor__arrow}></div>
            </div>
        </div>
    );
};

export default FullScreenArrowButton;
