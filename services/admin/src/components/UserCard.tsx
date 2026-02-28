import React, { useState, useRef, useEffect } from 'react';
import cl from '@/utils/styles/modules/UserCard.module.scss';
import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png';

import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import ActionsMenu from '@packages/shared/src/components/UI/ActionsMenu/ActionsMenu';
import { adminUsersAction } from '@packages/shared/src/utils/constants/actionsMenu';
import { useUsersContext } from '@/pages/AdminUsers/AdminUsers';

const UserCard: React.FC<{ users: UserDataType[] }> = ({ users=[] }) => {
    const { setSelectedUser, setDeletedUser } = useUsersContext();
    const menuRef = useRef<HTMLDivElement>(null);

    return (
        <>
            {users.map((props: UserDataType, index: number) => (
                <div key={index} className={cl.userCard}>
                    <div className={cl.avatar}>
                        {props.avatar ? (
                            <img src={props.avatar} alt={props.name} />
                        ) : (
                            <img src={userIcon} alt={props.name} />
                        )}
                    </div>

                    <h3 className={cl.userName}>{props.name}</h3>
                    <p className={cl.userEmail}>{props.email}</p>
                    <span className={cl.userRole}>{props.role}</span>
                    <p className={cl.createdDate}>
                        {new Date(props.createdAt || '').toLocaleDateString('uk-UA')}
                    </p>

                    <ActionsMenu
                        actionList={adminUsersAction(props, setSelectedUser, setDeletedUser)}
                        ref={menuRef}
                        data={props}
                    />
                </div>
            ))}
        </>
    );
};

export default UserCard;


