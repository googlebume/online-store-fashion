import React from 'react';

import StoreInfoArticle from './StoreInfoArticle';
import { contactsPageContent } from './copy/shopBlockPages';
import { infoSidebarImage, textureHero } from './storeInfoAssets';

const ContactsPage = () => (
    <StoreInfoArticle
        content={contactsPageContent}
        backgroundTexture={textureHero}
        sideRail={{ imageSrc: infoSidebarImage }}
    />
);

export default ContactsPage;
