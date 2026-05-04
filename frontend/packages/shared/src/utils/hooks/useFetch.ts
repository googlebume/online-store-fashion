import { useState, useCallback } from 'react';
import { api } from '../../../../../packages/shared/src/routes/api';
import Cookies from '../cookies';

type MethodTypes = 'POST' | 'GET';

type UseFetchProps<T> = {
  method: MethodTypes;
  url: string;
  body?: T;
  /** ���� ������, ��������������� ������ `http://localhost:${port}` (����. docker ��� ����� ����). */
  baseUrl?: string;
  port?: number;
};

type UseFetchReturn<R> = {
  response: R | null;
  error: Error | null;
  isLoading: boolean;
  fetchData: (params: UseFetchProps<any>) => void;
};

export const useFetch = <T = any, R = any>(): UseFetchReturn<R> => {
  const [response, setResponse] = useState<R | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const cookies = new Cookies();

  const fetchData = useCallback(async (params: UseFetchProps<T>) => {
    const { method, url, body } = params;
    const port = params.port ?? 5000;
    const origin = (params.baseUrl ?? `http://localhost:${port}`).replace(/\/$/, '');

    setIsLoading(true);
    setError(null);

    try {
      const publicEndpoints = new Set([
        'register/init',
        'register/confirm',
        'login/init',
        'login/confirm',
        'google/clientid',
        'google/auth',
      ]);

      const isPublicEndpoint = publicEndpoints.has(url);
      const token = cookies.getCookie('token');

      const fetchConfig: RequestInit = {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(!isPublicEndpoint && token ? { authorization: `Bearer ${token}` } : {}),
        },
      };

      if (method === 'POST') {
        const requestBody: any = { ...(body || {}) };
        fetchConfig.body = JSON.stringify(requestBody);
      }

      const res = await fetch(`${origin}/${api}/${url}`, fetchConfig);

      let data: any;
      let text = '';
      try {
        text = await res.text();
        data = JSON.parse(text);
      } catch {
        data = null;
      }

      if (!res.ok) {
        if (data && typeof data === 'object' && (data.message || data.error)) {
          throw new Error(data.message || data.error);
        }
        throw new Error(`������� ${res.status}: ${text || res.statusText}`);
      }

      if (data && typeof data === 'object' && data.success === false) {
        throw new Error(data.error || data.message || '������� �������');
      }

      setResponse(data);
    } catch (err: any) {
      setError(err);
      setResponse({ error: err.message } as any);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    response,
    error,
    isLoading,
    fetchData,
  };
};
