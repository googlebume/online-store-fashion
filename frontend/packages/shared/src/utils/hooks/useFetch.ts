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

            // Не додавати Authorization для підтвердження коду
            const isPublicConfirm =
                url === 'register/confirm' || url === 'login/confirm';

            const fetchConfig: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    ...(isPublicConfirm ? {} : { 'authorization': `Bearer ${cookies.getCookie('token')}` })
                },
            };

            if (method === 'POST') {
                const requestBody: any = { ...(body || {}) };

                fetchConfig.body = JSON.stringify(requestBody);
            }

            const res = await fetch(`http://localhost:${port}/${api}/${url}`, fetchConfig);
            let data;
            let text;
            try {
                text = await res.text();
                data = JSON.parse(text);
            } catch (e) {
                data = null;
            }

            if (!res.ok) {
                // Якщо сервер повернув json з message, показати його
                if (data && typeof data === 'object' && (data.message || data.error)) {
                    throw new Error(data.message || data.error);
                }
                // Інакше показати статус і текст
                throw new Error(`Помилка ${res.status}: ${text || res.statusText}`);
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

