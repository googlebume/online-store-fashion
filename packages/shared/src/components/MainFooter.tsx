import React from 'react';
import SotialNetworks from './UI/SotialNetworks/SotialNetworks';
import FooterCopyright from './UI/FooterCopyright/FooterCopyright';

const MainFooter = () => {
    return (
        <div>
            <footer>
                <div className="footer__space-block"></div>
                <div className="footer__content">
                    <div className="content__info">
                        <div className="info__about">
                            <div className="about__logo">
                                <div className="logo__img">
                                    <img src="./imgs/logo/shop_logo1.png" alt="" />
                                </div>
                                <div className="logo__title">
                                    <h2>Fashion</h2>
                                </div>
                            </div>
                            <div className="about__phone-number">
                                <div className="phone-number__numbers">
                                    <h2>+380 067 387 4243</h2>
                                    <h2>+380 096 610 5602</h2>
                                </div>
                            </div>
                        </div>
                        <div className="info__columns">
                            <div className="info__buyer">
                                <div className="buyer__title">
                                    <h3>Покупцям</h3>
                                </div>
                                <div className="buyer__lis">
                                    <ul className="lis__li">
                                        <li><a href="#">Як зробити замовлення</a></li>
                                        <li><a href="#">Способи оплати</a></li>
                                        <li><a href="#">Доставка</a></li>
                                        <li><a href="#">Повернення товару</a></li>
                                        <li><a href="#">Питання та відповіді</a></li>
                                    </ul>
                                </div>
                            </div>
                            <div className="info__shop">
                                <div className="shop__title">
                                    <h3>Магазин</h3>
                                </div>
                                <div className="shop__lis">
                                    <ul className="lis__li">
                                        <li><a href="#">Про нас</a></li>
                                        <li><a href="#">Реквізити</a></li>
                                        <li><a href="#">Контакти</a></li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-info__other">
                        <SotialNetworks />
                        <div className="other__bunk">
                            <div className="bunk__logo">
                                <img src="./imgs/logo/mastercard.png" alt="" className="logo__image" />
                            </div>
                            <div className="bunk__logo">
                                <img src="./imgs/logo/visa.png" alt="" className="logo__image" />
                            </div>
                        </div>
                    </div>
                    <FooterCopyright />
                </div>
            </footer>
        </div>
    );
};

export default MainFooter;
