import React, { useEffect, useState } from 'react';
import cl from './UserProfileCard.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../routes/api';
import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png';
import { UserViewDataType } from '@/utils/types/userData.type';
import { useSelector } from 'react-redux';
import type { RootState } from '@packages/shared/src/store';
import JwtHandler from '@packages/shared/src/utils/jwt';


const UserProfileCard = ({ url, style }: { url: string, style?: string }) => {
    const [user, setUser] = useState<UserViewDataType>();
    const location = useLocation();
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);
    const jwtHandler = new JwtHandler();

    useEffect(() => {
        if (location.state?.userData) {
            setUser(location.state.userData);
        }
    }, [location.state]);

    const tokenPayload = jwtHandler.decryptJwt() as
        | { id?: string | number; userId?: string | number; sub?: string | number; uuid?: string | number }
        | null;
    const jwtUserId = tokenPayload?.id ?? tokenPayload?.userId ?? tokenPayload?.sub ?? tokenPayload?.uuid;
    const userId = currentUser?.id ?? user?.id ?? jwtUserId;
    const destination = userId
        ? `/${api}/user-profile/${userId}`
        : `/${api}/${url}`;

    return (
        <div
            className={style === 'burger' ? cl.profileBurger : cl.profile}
            role='button'
            tabIndex={0}
            onClick={() => navigate(destination)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(destination);
                }
            }}
        >
            <div className={cl.profile__icon}>
                <img src={userIcon} alt="userIcon" />
            </div>
            <div className={cl.profile__name}>
                <p className={cl.profile__naming}>{user?.name ?? ''}</p>
            </div>
        </div>
    );
};

export default UserProfileCard;



