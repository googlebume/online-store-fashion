import React from 'react';

import cl from './FooterCopyright.module.scss'

const FooterCopyright = () => {
    const date = new Date()
    return (
        <div className={cl.footer_copyright}>
            <div className={cl.copyright__text}>
                <p>2024-{date.getFullYear()}© Fashion - інтернет магазин принтованого одягу</p>
            </div>
        </div>
    );
};

export default FooterCopyright;