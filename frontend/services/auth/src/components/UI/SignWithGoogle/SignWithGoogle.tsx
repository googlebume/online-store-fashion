import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { currentUserActions } from '@packages/shared/src/store';
import { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { shopRoutes } from '@packages/shared/src/routes/shop';
import Cookies from '@packages/shared/src/utils/cookies';
import { api } from '@packages/shared/src/routes/api';
import { trackAnalytics } from '@packages/shared/src/utils/analytics/trackAnalytics';
import cl from './SignWithGoogle.module.scss';

const cookies = new Cookies();

/** Після виходу з екрану входу: скасувати One Tap і auto-select, щоб на інших маршрутах не лишався активний GSI. */
function cleanupGoogleIdentityScript(): void {
  try {
    const gid = (
      window as unknown as {
        google?: {
          accounts?: {
            id?: {
              disableAutoSelect?: () => void;
              cancel?: () => void;
            };
          };
        };
      }
    ).google?.accounts?.id;
    gid?.cancel?.();
    gid?.disableAutoSelect?.();
  } catch {
    /* ignore */
  }
}

type GoogleAuthResponse = {
  success?: boolean;
  isNewUser?: boolean;
  token?: string;
  user?: {
    id: number | string;
    name: string;
    email: string;
    role: string | string[];
    avatar?: string | null;
    createdAt?: string;
  };
};

const SignWithGoogle = () => {
  const dispatch = useDispatch();
  const {
    response,
    fetchData,
    isLoading,
    error: clientIdError,
  } = useFetch<{ clientId: string }>();

  const authFetch = useFetch<Record<string, any>, GoogleAuthResponse>();
  const [clientId, setClientId] = useState<string | null>(null);
  const [googleAuthError, setGoogleAuthError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [buttonWidth, setButtonWidth] = useState<number>(400);
  const authInFlightRef = useRef(false);

  useEffect(() => {
    fetchData({
      method: 'GET',
      port: 5003,
      url: 'google/clientid',
    });
  }, []);

  useEffect(() => {
    return () => cleanupGoogleIdentityScript();
  }, []);

  useEffect(() => {
    if (response?.clientId) {
      setClientId(response.clientId);
    }
  }, [response]);

  useEffect(() => {
    if (!clientId || !containerRef.current) return;
    const width = containerRef.current.offsetWidth;
    if (width > 0) setButtonWidth(width);
  }, [clientId]);

  useEffect(() => {
    if (clientIdError) {
      console.error('Google client id fetch error:', clientIdError);
    }
  }, [clientIdError]);

  useEffect(() => {
    if (!authFetch.response) {
      return;
    }

    console.log('Google auth backend response:', authFetch.response);

    authInFlightRef.current = false;
    if (authFetch.response.success && authFetch.response.user) {
      const backendUser = authFetch.response.user;
      const currentUser: UserDataType = {
        id: backendUser.id,
        name: backendUser.name,
        email: backendUser.email,
        role: Array.isArray(backendUser.role) ? backendUser.role : [backendUser.role],
        avatar: backendUser.avatar ?? null,
        createdAt: backendUser.createdAt,
      };

      dispatch(currentUserActions.setCurrentUser(currentUser));
      if (authFetch.response.token) {
        cookies.setCookie({
          name: 'token',
          data: authFetch.response.token,
          path: `/${api}`,
        });
      }

      trackAnalytics({
        name: 'login_google_success',
        userId: String(backendUser.id),
        payload: { isNewUser: authFetch.response.isNewUser === true },
      });

      window.location.assign(`/${shopRoutes.shop}`);
      return;
    }

    if (authFetch.response?.success === false) {
      setGoogleAuthError('Google sign-in failed. Please try again.');
    }
  }, [authFetch.response, dispatch]);

  useEffect(() => {
    if (!authFetch.error) return;
    authInFlightRef.current = false;
    console.error('Google auth request error:', authFetch.error);
    setGoogleAuthError(authFetch.error.message || 'Google sign-in failed');
  }, [authFetch.error]);

  const handleSuccess = (credentialResponse: any) => {
    if (authInFlightRef.current) return;
    authInFlightRef.current = true;
    setGoogleAuthError(null);
    console.log('Google credential response received:', credentialResponse);
    authFetch.fetchData({
      method: 'POST',
      port: 5003,
      url: 'google/auth',
      body: credentialResponse,
    });
  };

  return (
    <div ref={containerRef} className={cl.wrapper}>
      {clientId ? (
        <GoogleOAuthProvider clientId={clientId}>
          <GoogleLogin
            useOneTap={false}
            width={buttonWidth}
            onSuccess={handleSuccess}
            onError={() => {
              console.error('Google popup login failed');
              setGoogleAuthError('Google popup login failed');
            }}
          />
        </GoogleOAuthProvider>
      ) : (
        <div className={cl.placeholder} />
      )}
      {googleAuthError && <div className={cl.error}>{googleAuthError}</div>}
    </div>
  );
};

export default SignWithGoogle;
