import React from 'react';
import cl from '@/utils/styles/modules/UserCard.module.scss';
import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png';

import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';

const UserCard: React.FC<{ users: UserDataType[] }> = ({ users=[] }) => {
    return (
        <>
            {
                users.map((props: UserDataType, index: number) => (
                    <div key={index} className={cl.userCard}>
                        <div className={cl.avatar}>
                            {props.avatar ? <img src={props.avatar} alt={props.name} /> : <img src={userIcon} alt={props.name} />}
                        </div>

                        <h3 className={cl.userName}>{props.name}</h3>

                        <p className={cl.userEmail}>{props.email}</p>

                        <span className={cl.userRole}>{props.role}</span>

                        <p className={cl.createdDate}>
                            {new Date(props.createdAt || '').toLocaleDateString('uk-UA')}
                        </p>

                        <button className={cl.menuBtn}>
                            ...
                        </button>
                    </div>
                ))
            }
        </>
    )
};

export default UserCard;