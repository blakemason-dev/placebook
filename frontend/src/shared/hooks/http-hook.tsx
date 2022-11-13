import { useCallback, useState, useRef, useEffect } from 'react';

export const useHttpClient = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<any>(null);
    const activeHttpRequests = useRef<any>([]);

    const sendRequest = useCallback(async (url: string, method='GET', body:any=null, headers = {}) => {
        setIsLoading(true);
        const httpAbortCtrl = new AbortController();
        activeHttpRequests.current.push(httpAbortCtrl);

        try {
            const fetchData = {
                method: method,
                body: body,
                headers: headers,
                signal: httpAbortCtrl.signal
            }

            const response = await fetch(url, fetchData);

            const responseData = await response.json();

            activeHttpRequests.current = activeHttpRequests.current.filter(
                (reqCtrl: any) => reqCtrl !== httpAbortCtrl
            )
    
            if (!response.ok) {
                throw new Error(responseData.message);
            }

            setIsLoading(false); 
            return responseData;
        } catch (err: any) {
            if (err.name === 'AbortError') {
                // console.log('Aborted a fetch request');
            } else {
                setError(err.message);
                setIsLoading(false);     
                throw err;
            }
        }
    }, []);

    const clearError = () => {
        setError(null);
    }

    useEffect(() => {
        return () => {
            activeHttpRequests.current.forEach((ac: any) => ac.abort());
        };
    }, []);

    return { isLoading, error, sendRequest, clearError }
}