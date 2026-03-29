import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useFetch } from '@packages/shared/src/utils/hooks/useFetch';
import { currentUserActions } from '@packages/shared/src/store';
import { UserDataType } from '@packages/shared/src/utils/types/userData.type';
import { shopRoutes } from '@packages/shared/src/routes/shop';
import Cookies from '@packages/shared/src/utils/cookies';
import { api } from '@packages/shared/src/routes/api';

const cookies = new Cookies();

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

  useEffect(() => {
    fetchData({
      method: 'GET',
      port: 4004,
      url: 'google/clientid',
    });
  }, []);

  useEffect(() => {
    if (response?.clientId) {
      setClientId(response.clientId);
    }
  }, [response]);

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

      window.location.assign(`/${shopRoutes.shop}`);
      return;
    }

    if (authFetch.response?.success === false) {
      setGoogleAuthError('Google sign-in failed. Please try again.');
    }
  }, [authFetch.response, dispatch]);

  useEffect(() => {
    if (!authFetch.error) return;
    console.error('Google auth request error:', authFetch.error);
    setGoogleAuthError(authFetch.error.message || 'Google sign-in failed');
  }, [authFetch.error]);

  const handleSuccess = (credentialResponse: any) => {
    setGoogleAuthError(null);
    console.log('Google credential response received:', credentialResponse);
    authFetch.fetchData({
      method: 'POST',
      port: 4004,
      url: 'google/auth',
      body: credentialResponse,
    });
  };

  if (isLoading) return <div>Loading...</div>;

  if (clientIdError || !clientId) {
    return <div>Google sign-in is unavailable</div>;
  }

  return (
    <>
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            console.error('Google popup login failed');
            setGoogleAuthError('Google popup login failed');
          }}
        />
      </GoogleOAuthProvider>
      {googleAuthError && <div>{googleAuthError}</div>}
    </>
  );
};

export default SignWithGoogle;
