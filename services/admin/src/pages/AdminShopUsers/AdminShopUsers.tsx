import React, { useEffect } from 'react';
import type { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { useLocation } from 'react-router-dom';

const AdminShopUsers = () => {
    const location = useLocation();

    
    const { response, error, isLoading, fetchData } = useFetch<null, ProductType[] | UserDataType>();
    

    useEffect(() => {
        fetchData({
            method: 'GET',
            url: `admin/${location.pathname.split('/')[2]}`,
            port: 5000,
        });
        console.log(`to   admin/${location.pathname.split('/')[3]}`)
    }, []);

    return (
        <div>

        </div>
    );
};

export default AdminShopUsers;