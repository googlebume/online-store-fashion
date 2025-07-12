import React from 'react';
import type { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import {useFetch} from '@packages/shared/src/utils/hooks/useFetch';


const { response, error, isLoading, fetchData } = useFetch<null, ProductType[] | UserDataType>();

const AdminLayout = () => {
    return (
        <div>
            
        </div>
    );
};

export default AdminLayout;