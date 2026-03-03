import React, { useEffect, useRef, useState } from 'react';
import cl from './UserProfileCard.module.scss';
import { Link, useLocation } from 'react-router-dom';
import { api } from '../../../routes/api';
import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png';
import { UserViewDataType } from '@/utils/types/userData.type';


const UserProfileCard = ({ url, style }: { url: string, style?: string }) => {
    const [user, setUser] = useState<UserViewDataType>();
    const location = useLocation();
    const prevPath = useRef<string | null>(null);
    useEffect(() => {
        if (location.state?.userData) {
            setUser(location.state.userData);
        }
    }, [location.state]);

    return (
        <Link to={`/${api}/${url}`}>
            <div className={style === 'burger' ? cl.profileBurger : cl.profile}>
                <div className={cl.profile__icon}>
                    <img src={userIcon} alt="userIcon" />
                </div>
                <div className={cl.profile__name}>
                    <p className={cl.profile__naming}>{user?.name ?? ''}</p>
                </div>
            </div>
        </Link>
    );
};

export default UserProfileCard;



