export type AsideSectionType = {
    title: string;
    links: AsideLinksType[]
};

export type AsideLinksType = {
        href: string;
        text: string;
        icon: string //JSX.Element // React.ReactNode ?? string;
};
