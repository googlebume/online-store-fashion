import React from 'react';

import StoreInfoArticle from './StoreInfoArticle';
import { aboutPageContent } from './copy/shopBlockPages';
import { infoSidebarImage, textureHero } from './storeInfoAssets';

const AboutPage = () => (
    <StoreInfoArticle
        content={aboutPageContent}
        backgroundTexture={textureHero}
        sideRail={{ imageSrc: infoSidebarImage }}
    />
);

export default AboutPage;
