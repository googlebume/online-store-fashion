import React, { useEffect, useMemo, useState } from 'react';
import cl from './UserProfileCard.module.scss';
import { useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../../routes/api';
import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png';
import { UserViewDataType } from '@/utils/types/userData.type';
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@packages/shared/src/store';
import { currentUserActions } from '@packages/shared/src/store';
import JwtHandler from '@packages/shared/src/utils/jwt';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';

/** Той самий порт, що й у user-profile сервісі для GET /user-profile/me */
const USER_PROFILE_SERVICE_PORT = 5003;

type ProfileMeResponse = {
    success?: boolean;
    message?: string;
    userData?: UserDataType & { role?: string[] | string };
};

const normalizeUserData = (
    user: (UserDataType & { role?: string[] | string }) | null | undefined,
): UserDataType | null => {
    if (!user) return null;
    return {
        ...user,
        role: Array.isArray(user.role) ? user.role : user.role ? [user.role] : [],
    };
};

const UserProfileCard = ({ url, style }: { url: string, style?: string }) => {
    const [user, setUser] = useState<UserViewDataType>();
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);
    const jwtHandler = useMemo(() => new JwtHandler(), []);
    const profileMeRequest = useFetch<never, ProfileMeResponse>();

    useEffect(() => {
        if (location.state?.userData) {
            setUser(location.state.userData);
        }
    }, [location.state]);

    useEffect(() => {
        if (!jwtHandler.getToken()) {
            return;
        }
        if (currentUser?.name?.trim()) {
            return;
        }

        profileMeRequest.fetchData({
            method: 'GET',
            port: USER_PROFILE_SERVICE_PORT,
            url: 'user-profile/me',
        });
    }, [jwtHandler, currentUser?.name, profileMeRequest.fetchData]);

    useEffect(() => {
        const raw = profileMeRequest.response?.userData;
        if (!raw) {
            return;
        }
        const normalized = normalizeUserData(raw);
        if (normalized) {
            dispatch(currentUserActions.setCurrentUser(normalized));
        }
    }, [profileMeRequest.response, dispatch]);

    const tokenPayload = jwtHandler.decryptJwt() as
        | {
              id?: string | number;
              userId?: string | number;
              sub?: string | number;
              uuid?: string | number;
              name?: string;
              username?: string;
          }
        | null;
    const jwtUserId = tokenPayload?.id ?? tokenPayload?.userId ?? tokenPayload?.sub ?? tokenPayload?.uuid;
    const userId = currentUser?.id ?? user?.id ?? jwtUserId;

    const displayName =
        currentUser?.name?.trim() ||
        user?.name?.trim() ||
        tokenPayload?.name?.trim() ||
        tokenPayload?.username?.trim() ||
        '';

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
            <div className={cl.profile__name}>
                <p className={cl.profile__naming}>{displayName}</p>
            </div>
            <div className={cl.profile__icon}>
                <img src={userIcon} alt="" />
            </div>
        </div>
    );
};

export default UserProfileCard;


