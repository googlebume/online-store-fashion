import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../../../routes/api';
import userIcon from '@packages/shared/src/assets/images/icons/userIcon.png';
import type { RootState } from '@packages/shared/src/store';
import { currentUserActions } from '@packages/shared/src/store';
import JwtHandler from '@packages/shared/src/utils/jwt';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import cl from './UserAuthBlock.module.scss';
import type { UserDataType } from '@packages/shared/src/utils/types/userData.type';

type ProfileMeResponse = {
    success?: boolean;
    userData?: UserDataType & { role?: string[] | string };
};

type Props = {
    loginUrl?: string;
    variant?: 'header' | 'burger';
};

const UserAuthBlock: React.FC<Props> = ({ loginUrl = 'register', variant = 'header' }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const currentUser = useSelector((state: RootState) => state.currentUser.currentUser);
    const jwtHandler = useMemo(() => new JwtHandler(), []);
    const profileMeRequest = useFetch<never, ProfileMeResponse>();

    const hasToken = Boolean(jwtHandler.getToken());

    useEffect(() => {
        if (!hasToken || currentUser?.id) return;
        profileMeRequest.fetchData({ method: 'GET', port: 5003, url: 'user-profile/me' });
    }, [hasToken, currentUser?.id]);

    useEffect(() => {
        const raw = profileMeRequest.response?.userData;
        if (!raw) return;
        dispatch(currentUserActions.setCurrentUser({
            ...raw,
            role: Array.isArray(raw.role) ? raw.role : raw.role ? [raw.role] : [],
        }));
    }, [profileMeRequest.response, dispatch]);

    const tokenPayload = jwtHandler.decryptJwt();
    const userId =
        currentUser?.id ??
        (tokenPayload?.['id'] ?? tokenPayload?.['userId'] ?? tokenPayload?.['sub']);
    const name =
        currentUser?.name ??
        (typeof tokenPayload?.['name'] === 'string' ? tokenPayload['name'] : '');
    const avatar = currentUser?.avatar;

    if (!hasToken) {
        return (
            <button
                className={variant === 'burger' ? cl.loginBtnBurger : cl.loginBtn}
                onClick={() => navigate(`/${api}/${loginUrl}`)}
            >
                Увійти
            </button>
        );
    }

    const destination = userId
        ? `/${api}/user-profile/${encodeURIComponent(String(userId))}`
        : `/${api}/user-profile`;

    return (
        <div
            className={variant === 'burger' ? cl.userBurger : cl.user}
            role="button"
            tabIndex={0}
            onClick={() => navigate(destination)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(destination);
                }
            }}
        >
            <div className={cl.avatar}>
                <img src={avatar || userIcon} alt="" />
            </div>
            {name && <span className={cl.name}>{name}</span>}
        </div>
    );
};

export default UserAuthBlock;
