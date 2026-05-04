import { api } from './api';

const base = `${api}/info`;

/** Шляхи інформаційних сторінок блоку «Магазин» у футері */
export const storeInfoPaths = {
    about: `/${base}/about`,
    careers: `/${base}/careers`,
    contacts: `/${base}/contacts`,
    publicOffer: `/${base}/public-offer`,
} as const;

/** Сегменти path для `createBrowserRouter` (без початкового `/`) */
export const storeInfoRouteSegments = {
    about: `${base}/about`,
    careers: `${base}/careers`,
    contacts: `${base}/contacts`,
    publicOffer: `${base}/public-offer`,
} as const;
