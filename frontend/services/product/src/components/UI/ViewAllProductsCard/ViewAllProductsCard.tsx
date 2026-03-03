import React from 'react';
import {api} from '@packages/shared/src/routes/api'

import cl from './ViewAllProductsCard.module.scss'
import { Link } from 'react-router-dom';

const ViewAllProductsCard = () => {
    return (
        <div className={cl.viewAllProductsCard}>
            <Link to={`/${api}/shop`}>
                <div className={cl.arrow}>
                    <span className={cl.arrowPart1}></span>
                    <span className={cl.arrowPart2}></span>
                </div>
            </Link>
        </div>
    );
};

export default ViewAllProductsCard;