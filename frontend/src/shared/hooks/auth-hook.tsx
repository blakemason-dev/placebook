import React, { useState, useCallback, useEffect } from 'react';

let logoutTimer: any;

export const useAuth = () => {
    const [token, setToken] = useState<any>();
    const [tokenExpirationDate, setTokenExpirationDate] = useState<any>();
    const [userId, setUserId] = useState<any>(null);

    const login = useCallback((userId: any, userToken: any, expirationDate: any) => {
        setToken(userToken);
        setUserId(userId);

        const ted = expirationDate || new Date(new Date().getTime() + 1000*60*60);
        setTokenExpirationDate(ted);

        localStorage.setItem('userData', JSON.stringify({
        userId: userId,
        token: userToken,
        expiration: ted.toISOString()
        }));
    }, []);

    const logout = useCallback(() => {
        setToken(null);
        setUserId(null);
        setTokenExpirationDate(null);
        localStorage.removeItem('userData');
    }, []);

    useEffect(() => {
        if (token && tokenExpirationDate) {
        const remainingTime = tokenExpirationDate.getTime() - new Date().getTime();
        logoutTimer = setTimeout(logout, remainingTime);
        } else {
        clearTimeout(logoutTimer);
        }
    }, [token, logout, tokenExpirationDate])

    useEffect(() => {
        const strStoredData = localStorage.getItem('userData');
        if (strStoredData) {
        const storedData = JSON.parse(strStoredData);

        if (
            storedData && 
            storedData.token && 
            new Date(storedData.expiration) > new Date()
            ) {
            login(storedData.userId, storedData.token, new Date(storedData.expiration));
        }
        }

    }, [login]);

    return { token, userId, login, logout }
}