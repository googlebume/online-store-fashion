import React from "react";
import cl from "./FullScreenArrowButton.module.scss";
import Button from '@packages/shared/src/components/UI/Button/Button';

const FullScreenArrowButton = () => {
    return (
        <div className={cl.toConstructor}>
            <div className={cl.toConstructor__body}>
                <div className={cl.toConstructor__arrow}></div>
                <div className={cl.toConstructor__arrow}></div>
                <div className={cl.toConstructor__arrow}></div>
                <Button
                    as='a'
                    variant='constructor-link'
                    href="https://googlebume.github.io/online-fashion-constructor/">
                    Створи унікальний принт!
                </Button>
                <div className={cl.toConstructor__arrow}></div>
            </div>
        </div>
    );
};

export default FullScreenArrowButton;






