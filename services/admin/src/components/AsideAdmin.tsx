import React from 'react';
import cl from '@/utils/styles/modules/AsideAdmin.module.scss';
import AsideList from '@packages/shared/src/components/AsideList';
import { administrationListItems } from '../utils/constants/administrationList';

const AsideAdmin = () => {
    return (
        <aside className={cl.aside}>
            <AsideList section={administrationListItems}/>
        </aside>
    );
};

export default AsideAdmin;