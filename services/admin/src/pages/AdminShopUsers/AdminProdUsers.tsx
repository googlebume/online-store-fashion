import React, { useEffect } from 'react';
import type { ProductType } from "@packages/shared/src/utils/types/prosuctData.type";
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { useLocation } from 'react-router-dom';
import { api } from '@packages/shared/src/routes/api';

const LazyAdminProdUsers = () => {
    const location = useLocation();


    const { response, error, isLoading, fetchData } = useFetch<null, ProductType[] | UserDataType>();


    useEffect(() => {
        fetchData({
            method: 'GET',
            url: `admin/${location.pathname.split('/')[3]}`,
            port: 4005,
        });
        console.log(`to   admin/${location.pathname.split('/')[3]}`)
    }, []);

    useEffect(() => {
        console.log(response)
    },[response])

    return (
        <div>
            LazyAdminProdUsers
        </div>
    );
};

export default LazyAdminProdUsers;