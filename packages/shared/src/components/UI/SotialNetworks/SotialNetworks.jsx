import React from 'react';
import { sotialNetworksItems } from "../../../utils/constants/sotialNetworksItems.js";

import cl from './SotialNetworks.module.scss';

const SotialNetworks = () => {
    return (
        <div className={cl.other__social_networks}>
            {
                sotialNetworksItems.map((item, index) => (

                    <div className={cl.sotial_networks__network} key={index}>
                        <a href={item.link} target="_blank" rel="noopener noreferrer">
                            <img src={item.icon} alt={item.title} className={cl.network__image} />
                        </a>
                    </div>
                ))
            }
        </div>
    );
};

export default SotialNetworks;


