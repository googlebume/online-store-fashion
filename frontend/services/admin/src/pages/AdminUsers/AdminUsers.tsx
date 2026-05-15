import React, { useCallback, useEffect, useState, useContext, createContext, Dispatch, SetStateAction, useMemo } from 'react';
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { useLocation } from 'react-router-dom';
import UserCard from '@/components/UserCard';
import Cookies from '@packages/shared/src/utils/cookies';
import PopupEditUser from '@/components/PopupEditUser';

import cl from './AdminUsers.module.scss';
import { backendOriginForPort } from '@packages/shared/src/config/backendOrigin';

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
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [roleFilter, setRoleFilter] = useState<string>('');

    const cookies = new Cookies();

    const loadUsers = useCallback(() => {
        fetchData({
            method: 'GET',
            url: 'admin/users',
            port: 5004,
        });
    }, [fetchData]);

    useEffect(() => {
        const path = location.pathname.split('/')[3];
        setLastOfPath(path);
    }, [location.pathname]);

    useEffect(() => {
        if (lastOfPath === 'users') {
            loadUsers();
        }
    }, [lastOfPath, loadUsers]);

    useEffect(() => {
        if (!deletedUser) return;

        fetch(`${backendOriginForPort(5004)}/fashion/admin/users/delete/${deletedUser.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${cookies.getCookie('token')}`
            },
        })
            .then(res => res.json())
            .then(data => {
                if (data?.success === true) {
                    setDeletedUser(null);
                    loadUsers();
                }
            });
    }, [deletedUser, loadUsers]);

    const allUsers = Array.isArray(response) ? (response as UserDataType[]) : [];

    const displayUsers = useMemo(() => {
        let result = allUsers;
        if (searchTerm.trim()) {
            const term = searchTerm.trim().toLowerCase();
            result = result.filter(
                (u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term),
            );
        }
        if (roleFilter) {
            result = result.filter((u) => {
                const roles = Array.isArray(u.role) ? u.role : [u.role];
                return roles.some((r) => r === roleFilter);
            });
        }
        return result;
    }, [searchTerm, allUsers, roleFilter]);

    const uniqueRoles = useMemo(() => {
        const roles = new Set<string>();
        allUsers.forEach((u) => {
            const r = Array.isArray(u.role) ? u.role : [u.role];
            r.forEach((role) => roles.add(role));
        });
        return Array.from(roles).sort();
    }, [allUsers]);

    if (lastOfPath !== 'users') {
        return null;
    }

    return (
        <div className={cl.overview}>
            <UsersContext.Provider value={{ setSelectedUser, selectedUser, setDeletedUser, deletedUser }}>
                {response && (
                    <div className={cl.toolbar}>
                        <input
                            type="text"
                            className={cl.searchInput}
                            placeholder="Пошук за ім'ям або email…"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <select
                            className={cl.roleFilter}
                            value={roleFilter}
                            onChange={(e) => setRoleFilter(e.target.value)}
                        >
                            <option value="">Усі ролі</option>
                            {uniqueRoles.map((role) => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                )}
                {displayUsers.length > 0 && (
                    <UserCard users={displayUsers} />
                )}
                {selectedUser ? (
                    <PopupEditUser
                        user={selectedUser}
                        onClose={() => setSelectedUser(null)}
                        onSaved={loadUsers}
                    />
                ) : null}
            </UsersContext.Provider>
        </div>
    );
};

export default AdminUsers;

