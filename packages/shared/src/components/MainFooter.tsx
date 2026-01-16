import React from 'react';

import cl from '../utils/styles/modules/MainFooter.module.scss'

import SpaceBlock from './UI/SpaceBlock/SpaceBlock';
import FooterContentPie from './FooterContentPie';

const MainFooter = () => {

    const date = new Date()

    return (
        <footer>
            <SpaceBlock height={'12vh'} fileName={'whiteShelfOfClothes.png'}/>
            <FooterContentPie />
            <div className={cl.footer_copyright}>
            <div className={cl.copyright__text}>
                <p>2024-{date.getFullYear()}© Fashion - інтернет магазин принтованого одягу</p>
            </div>
        </div>
        </footer>
    );
};

export default MainFooter;
