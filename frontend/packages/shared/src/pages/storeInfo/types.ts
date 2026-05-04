export type StoreInfoLinkItem = {
    label: string;
    href: string;
};

export type StoreInfoSection = {
    title?: string;
    paragraphs?: string[];
    links?: StoreInfoLinkItem[];
};

export type StoreInfoPageContent = {
    title: string;
    lead?: string;
    sections: StoreInfoSection[];
};
