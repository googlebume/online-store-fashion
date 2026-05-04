import type { RouteObject } from 'react-router-dom';

import AboutPage from '@packages/shared/src/pages/storeInfo/AboutPage';
import CareersPage from '@packages/shared/src/pages/storeInfo/CareersPage';
import ContactsPage from '@packages/shared/src/pages/storeInfo/ContactsPage';
import PublicOfferPage from '@packages/shared/src/pages/storeInfo/PublicOfferPage';
import { storeInfoRouteSegments } from '@packages/shared/src/routes/storeInfo';

export const storeInfoRoutes: RouteObject[] = [
    { path: storeInfoRouteSegments.about, element: <AboutPage /> },
    { path: storeInfoRouteSegments.careers, element: <CareersPage /> },
    { path: storeInfoRouteSegments.contacts, element: <ContactsPage /> },
    { path: storeInfoRouteSegments.publicOffer, element: <PublicOfferPage /> },
];
