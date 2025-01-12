import React from 'react';
import HeaderCompanyLogo from './UI/HeaderCompanyLogo/HeaderCompanyLogo';
import HeaderMenuList from './UI/HeaderMenuList/HeaderMenuList';

const MainHeader = () => {
    return (
        <header>
            <div 
            style={{
                backgroundColor: "#151a1f", // Замість $black
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: ".5rem 2rem",
                color: "white", // Замість $white
              }}
            className="header__body">
                    <HeaderCompanyLogo></HeaderCompanyLogo>

                    <HeaderMenuList></HeaderMenuList>
                
            </div>
        </header>
    );
};

export default MainHeader;