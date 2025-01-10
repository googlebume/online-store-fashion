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
                padding: "1rem 2rem",
                boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
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