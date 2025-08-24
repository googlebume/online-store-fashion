import { useState, useCallback } from 'react';
import { api } from '../../../../../packages/shared/src/routes/api';
import Cookies from '../cookies';

type MethodTypes = 'POST' | 'GET';

type UseFetchProps<T> = {
    method: MethodTypes;
    port: number;
    url: string;
    body?: T;
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
    const cookies = new Cookies;

    const fetchData = useCallback(async (params: UseFetchProps<T>) => {
        const { method, port, url, body } = params;

        setIsLoading(true);
        setError(null);

        try {
            const fetchConfig: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${cookies.getCookie('token')}`
                },
            };

            if (method === 'POST') {
                const requestBody: any = { ...(body || {}) };

                fetchConfig.body = JSON.stringify(requestBody);
            }

            const res = await fetch(`http://localhost:${port}/${api}/${url}`, fetchConfig);
            const data = await res.json();

            if (!res.ok) {
                // throw new Error(`HTTP error! status: ${res.status}`);
                throw new Error(`Сталася помилка. Скоротіть довжину тексту або спробуйте пізніше`);
            }

            if (data && typeof data === 'object' && data.success === false) {
                const errorMessage = data.error || data.message || 'Сталася помилка';
                throw new Error(errorMessage);
            }

            if (method === 'GET' && !Array.isArray(data)) {
                throw new Error('Очікувався масив обʼєктів у відповіді GET');
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