import React, {useState, useEffect} from 'react';
import cl from '@packages/shared/src/utils/styles/modules/MainHeader.module.scss'
import HeaderCompanyLogo from './UI/CompanyLogo/CompanyLogo';
import HeaderMenuList from './UI/HeaderMenuList/HeaderMenuList';
import BurgerMenu from './UI/BurgerMenu/BurgerMenu';

const MainHeader = () => {
    const [offsetWidth, setOffsetWidth] = useState(document.body.offsetWidth);

    const handleResize = () => {
        setOffsetWidth(document.body.offsetWidth);
    };

    useEffect(() => {
        window.addEventListener('resize', handleResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <header className={cl.header}>
            <div
                className={cl.headerBody}>
                <HeaderCompanyLogo/>

                
                {
                    offsetWidth >= 740 ? <HeaderMenuList /> : <BurgerMenu />
                }

            </div>
        </header>
    );
};

export default MainHeader;


