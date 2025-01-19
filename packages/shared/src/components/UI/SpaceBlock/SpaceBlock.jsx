import React from 'react';

import cl from './SpaceBlock.module.scss'

const SpaceBlock = ({ height, fileName }) => {

    const imagePath = require(`@packages/shared/src/assets/images/backdrops/${fileName}`);
    return (
        <div className={cl.footer__space_block}
            style={{
                height: height,
                backgroundImage: `url(${imagePath})`,
            }}
        >
        </div>
    );
};

export default SpaceBlock;