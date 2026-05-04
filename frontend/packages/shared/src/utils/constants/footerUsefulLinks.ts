import { storeInfoPaths } from '@packages/shared/src/routes/storeInfo';

export type FooterLinkItem =
    | { text: string; to: string }
    | { text: string; href: string };

export type FooterLinkBlock = {
    title: string;
    links: FooterLinkItem[];
};

export const footerUsefulLinks: FooterLinkBlock[] = [
    {
        title: 'Покупцям',
        links: [
            { href: '#', text: 'Як зробити замовлення' },
            { href: '#', text: 'Способи оплати' },
            { href: '#', text: 'Доставка' },
            { href: '#', text: 'Повернення товару' },
            {
                href: 'https://www.google.com.ua/maps/search/%D0%BC%D0%B0%D0%B3%D0%B0%D0%B7%D0%B8%D0%BD+%D0%BE%D0%B4%D1%8F%D0%B3%D1%83+%D1%80%D1%8F%D0%B4%D0%BE%D0%BC+%D0%B7+%D0%9D%D1%96%D0%B6%D0%B8%D0%BD,+%D0%A7%D0%B5%D1%80%D0%BD%D0%B8%D0%B3%D0%BE%D0%B2%D1%81%D0%BA%D0%B0%D1%8F+%D0%BE%D0%B1%D0%BB%D0%B0%D1%81%D1%82%D1%8C,+%D0%A3%D0%BA%D1%80%D0%B0%D1%97%D0%BD%D0%B0/@51.0404188,31.8868624,14z?hl=ru&entry=ttu&g_ep=EgoyMDI0MDkxMS4wIKXMDSoASAFQAw%3D%3D',
                text: 'Адреси магазинів',
            },
            { href: '#', text: 'Політика конфіденційності' },
        ],
    },
    {
        title: 'Магазин',
        links: [
            { to: storeInfoPaths.about, text: 'Про нас' },
            { to: storeInfoPaths.careers, text: 'Вакансії' },
            { to: storeInfoPaths.contacts, text: 'Контакти' },
            { to: storeInfoPaths.publicOffer, text: 'Публічна оферта' },
        ],
    },
];
