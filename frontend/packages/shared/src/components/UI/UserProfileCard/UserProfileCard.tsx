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

function isLikelyJwt(value: string): boolean {
    // JWT looks like xxx.yyy.zzz (base64url segments)
    return /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/.test(value.trim());
}

function pickDisplayName(candidates: Array<string | undefined>): string {
    for (const candidate of candidates) {
        const v = candidate?.trim();
        if (!v) continue;
        if (isLikelyJwt(v)) continue;
        return v;
    }
    return '';
}

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
        /** Після повного перезавантаження (Google redirect) Redux порожній — не покладаємось лише на name */
        if (currentUser?.id) {
            return;
        }

        profileMeRequest.fetchData({
            method: 'GET',
            port: USER_PROFILE_SERVICE_PORT,
            url: 'user-profile/me',
        });
    }, [jwtHandler, currentUser?.id, profileMeRequest.fetchData]);

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

    const tokenPayload = jwtHandler.decryptJwt();
    const jwtUserId = tokenPayload
        ? (tokenPayload['id'] ?? tokenPayload['userId'] ?? tokenPayload['sub'] ?? tokenPayload['uuid'])
        : undefined;
    const userId =
        currentUser?.id ?? user?.id ?? (jwtUserId != null && jwtUserId !== '' ? String(jwtUserId) : undefined);

    const hasAuthToken = Boolean(jwtHandler.getToken());

    const displayName = pickDisplayName([
        currentUser?.name,
        user?.name,
        typeof tokenPayload?.['name'] === 'string' ? tokenPayload['name'] : undefined,
        typeof tokenPayload?.['username'] === 'string' ? tokenPayload['username'] : undefined,
    ]);

    /** Є токен, але id ще не підтягнувся — все одно на профіль, не на register */
    const destination = userId
        ? `/${api}/user-profile/${encodeURIComponent(userId)}`
        : hasAuthToken
          ? `/${api}/user-profile`
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


