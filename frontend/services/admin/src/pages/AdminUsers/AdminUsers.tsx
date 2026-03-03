import React, { useEffect, useState, useContext, createContext, Dispatch, SetStateAction } from 'react';
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { useLocation } from 'react-router-dom';
import UserCard from '@/components/UserCard';
import Cookies from '@packages/shared/src/utils/cookies';

import cl from './AdminUsers.module.scss';

export const UsersContext = createContext<{
    setSelectedUser: Dispatch<SetStateAction<UserDataType | null>>;
    setDeletedUser?: Dispatch<SetStateAction<UserDataType | null>>;
    selectedUser: UserDataType | null;
    deletedUser?: UserDataType | null;
}>({
    setSelectedUser: () => { },
    setDeletedUser: () => { },
    selectedUser: null,
    deletedUser: null,
});

export const useUsersContext = () => {
    const context = useContext(UsersContext);
    if (!context) {
        throw new Error('useUsersContext must be used within UsersContext.Provider');
    }
    return context;
};

const AdminUsers = () => {
    const location = useLocation();
    const { response, fetchData } = useFetch<null, UserDataType[]>();
    const [lastOfPath, setLastOfPath] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserDataType | null>(null);
    const [deletedUser, setDeletedUser] = useState<UserDataType | null>(null);

    const cookies = new Cookies();

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
        }
    }, [lastOfPath]);
    useEffect(() => {
        if (!deletedUser) return;

        fetch(`http://localhost:4005/fashion/admin/users/delete/${deletedUser.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${cookies.getCookie('token')}`
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log('Delete user response:', data);
                data?.success === true && document.location.reload();
            });
    }, [deletedUser]);

    if (lastOfPath !== 'users') {
        return null;
    }

    return (
        <div className={cl.overview}>
            <UsersContext.Provider value={{ setSelectedUser, selectedUser, setDeletedUser, deletedUser }}>
                {response && Array.isArray(response) && response.length > 0 && (
                    <UserCard users={response as UserDataType[]} />
                )}
            </UsersContext.Provider>
        </div>
    );
};

export default AdminUsers;


