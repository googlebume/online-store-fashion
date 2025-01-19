import React from 'react';

import SpaceBlock from './UI/SpaceBlock/SpaceBlock';
import FooterContentPie from './FooterContentPie';

const MainFooter = () => {
    return (
        <footer>
            <SpaceBlock height={'12vh'} fileName={'whiteShelfOfClothes.png'}/>
            <FooterContentPie />
        </footer>
    );
};

export default MainFooter;
