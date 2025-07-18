import React, { useEffect, useState } from 'react';
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { useLocation } from 'react-router-dom';
import UserCard from '@/components/UserCard';

import cl from './AdminProdUsers.module.scss';

const AdminUsers = () => {
    const location = useLocation();
    const { response, error, isLoading, fetchData } = useFetch<null, UserDataType[]>();
    const [lastOfPath, setLastOfPath] = useState('');

    useEffect(() => {
        const path = location.pathname.split('/')[3];
        setLastOfPath(path);
    }, [location.pathname]);

    useEffect(() => {
        if (lastOfPath === 'users') {
            fetchData({
                method: 'GET',
                url: `admin/${lastOfPath}`,
                port: 4005,
            });
            console.log(`to admin/${lastOfPath}`);
        }
    }, [lastOfPath]);

    useEffect(() => {
        console.log(response);
    }, [response]);

    if (lastOfPath !== 'users') {
        return null;
    }

    return (
        <div className={cl.overview}>
            {response !== null && Array.isArray(response) && response.length > 0 && "email" in response[0] && 
                <UserCard users={response as UserDataType[]} />
            }
        </div>
    );
};

export default AdminUsers;