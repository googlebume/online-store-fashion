import React from 'react';
import HeaderCompanyLogo from './UI/HeaderCompanyLogo/HeaderCompanyLogo';
import HeaderMenuList from './UI/HeaderMenuList/HeaderMenuList';

const MainHeader = () => {
    return (
        <header>
            <div className="header__body">
                <HeaderCompanyLogo></HeaderCompanyLogo>

                <HeaderMenuList></HeaderMenuList>
            </div>
        </header>
    );
};

export default MainHeader;