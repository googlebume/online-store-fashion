// import { useState, useCallback } from 'react';
// import { api } from '../../../../../packages/shared/src/routes/api';

// type MethodTypes = 'POST' | 'GET';

// type UseFetchProps<T> = {
//     method: MethodTypes;
//     port: number;
//     url: string;
//     body?: T;
// };

// type UseFetchReturn<R> = {
//     response: R | null;
//     error: Error | null;
//     isLoading: boolean;
//     fetchData: (params?: Partial<UseFetchProps<any>>) => void;
// };

// export const useFetch = <T = any, R = any>(): UseFetchReturn<R> => {
//     const [response, setResponse] = useState<R | null>(null);
//     const [error, setError] = useState<Error | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const fetchData = useCallback(async (params?: UseFetchProps<T>) => {
//         if (!params) return;

//         const { method, port, url, body } = params;

//         setIsLoading(true);
//         setError(null);

//         try {
//             const res = await fetch(`http://localhost:${port}/${api}/${url}`, {
//                 method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: method === 'POST' && body ? JSON.stringify(body) : undefined,
//             });

//             if (!res.ok) {
//                 throw new Error(`HTTP error! status: ${res.status}`);
//             }

//             const data = await res.json();
//             setResponse(data);
//         } catch (err: any) {
//             setError(err);
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     return {
//         response,
//         error,
//         isLoading,
//         fetchData,
//     };
// };



// import { useState, useCallback } from 'react';
// import { api } from '../../../../../packages/shared/src/routes/api';

// type MethodTypes = 'POST' | 'GET';

// type UseFetchProps<T> = {
//     method: MethodTypes;
//     port: number;
//     url: string;
//     body?: T;
// };

// type UseFetchReturn<R> = {
//     response: R | null;
//     error: Error | null;
//     isLoading: boolean;
//     POSTFetch: (params?: Partial<UseFetchProps<any>>) => void;
// };

// export const useFetch = <T = any, R = any>(): UseFetchReturn<R> => {
//     const [response, setResponse] = useState<R | null>(null);
//     const [error, setError] = useState<Error | null>(null);
//     const [isLoading, setIsLoading] = useState<boolean>(false);

//     const POSTFetch = useCallback(async (params?: UseFetchProps<T>) => {
//         if (!params) return;

//         const { method, port, url, body } = params;

//         setIsLoading(true);
//         setError(null);

//         try {
//             const res = await fetch(`http://localhost:${port}/${api}/${url}`, {
//                 method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: method === 'POST' && body ? JSON.stringify(body) : undefined,
//             });

//             const data = await res.json();
            
//             if (!res.ok) {
//                 throw new Error(`HTTP error! status: ${res.status}`);
//             }
            
//             // Додано перевірку на помилку в даних, навіть якщо статус 200
//             if (data && typeof data === 'object' && data.success === false) {
//                 const errorMessage = data.error || data.message || 'Сталася помилка';
//                 throw new Error(errorMessage);
//             }
            
//             setResponse(data);
//         } catch (err: any) {
//             setError(err);
//             // Також оновлюємо response з помилкою для обробки в компоненті
//             setResponse({ error: err.message } as any);
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     return {
//         response,
//         error,
//         isLoading,
//         POSTFetch,
//     };
// };


import { useState, useCallback } from 'react';
import { api } from '../../../../../packages/shared/src/routes/api';

type MethodTypes = 'POST' | 'GET';
type EventType = 'register' | 'login';

type UseFetchProps<T> = {
    method: MethodTypes;
    port: number;
    url: string;
    body?: T;
    event?: EventType;
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

    const fetchData = useCallback(async (params: UseFetchProps<T>) => {
        const { method, port, url, body, event } = params;

        setIsLoading(true);
        setError(null);

        try {
            const fetchConfig: RequestInit = {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
            };

            if (method === 'POST') {
                const requestBody: any = { ...(body || {}) };

                // Додаємо поле event до тіла POST-запиту
                if (event) {
                    requestBody.event = event;
                }

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
