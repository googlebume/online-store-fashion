import React from 'react';

import {footerUsefulLinks} from './../utils/constants/footerUsefulLinks';
import UsefuelLinks from './UI/UsefuelLinks/UsefuelLinks';

const FooterUsefulLinks = () => {
    return (
        <>
            <div className="info__columns" style={{
                display: 'flex',
                flexWrap: 'wrap'
            }}>
                {footerUsefulLinks.map((block, index) => (
                    <UsefuelLinks key={index} title={block.title} links={block.links} />
                ))}
            </div>
        </>
    );
};

export default FooterUsefulLinks;


