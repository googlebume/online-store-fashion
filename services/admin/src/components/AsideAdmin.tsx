import React from 'react';
import AsideList from '@packages/shared/src/components/AsideList';
import { administrationListItems } from '@/utils/constants/administrationList';

const AsideAdmin = () => {
    return (
        <aside>
            <AsideList section={administrationListItems}/>
        </aside>
    );
};

export default AsideAdmin;