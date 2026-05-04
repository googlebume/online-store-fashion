import React from 'react';

import StoreInfoArticle from './StoreInfoArticle';
import { careersPageContent } from './copy/shopBlockPages';
import { infoSidebarImage, textureHero } from './storeInfoAssets';

const CareersPage = () => (
    <StoreInfoArticle
        content={careersPageContent}
        backgroundTexture={textureHero}
        sideRail={{ imageSrc: infoSidebarImage }}
    />
);

export default CareersPage;
