import React, {useState, useEffect} from 'react';
import HeaderCompanyLogo from './UI/CompanyLogo/CompanyLogo';
import HeaderMenuList from './UI/HeaderMenuList/HeaderMenuList';
import BurgerMenu from './UI/BurgerMenu/BurgerMenu';

const MainHeader = () => {
    // Стан для ширини екрана
    const [offsetWidth, setOffsetWidth] = useState(document.body.offsetWidth);

    // Функція для оновлення ширини
    const handleResize = () => {
        setOffsetWidth(document.body.offsetWidth);
    };

    useEffect(() => {
        // Додати слухач події
        window.addEventListener('resize', handleResize);

        // Викликати handleResize, щоб отримати початкове значення
        handleResize();

        // Прибрати слухач події під час демонтажу компонента
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <header style={{ backgroundColor: "#151a1f" }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: ".5rem 16px",
                    margin: "0 auto",
                    color: "white",
                    maxWidth: "1440px"
                }}
                className="header__body">
                <HeaderCompanyLogo></HeaderCompanyLogo>

                
                {
                    offsetWidth >= 740 ? <HeaderMenuList /> : <BurgerMenu />
                }

            </div>
        </header>
    );
};

export default MainHeader;