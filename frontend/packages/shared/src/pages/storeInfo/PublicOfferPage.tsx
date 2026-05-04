import React from 'react';

import StoreInfoArticle from './StoreInfoArticle';
import { publicOfferPageContent } from './copy/shopBlockPages';
import { infoSidebarImage, textureHero } from './storeInfoAssets';

const PublicOfferPage = () => (
    <StoreInfoArticle
        content={publicOfferPageContent}
        backgroundTexture={textureHero}
        sideRail={{ imageSrc: infoSidebarImage }}
    />
);

export default PublicOfferPage;
