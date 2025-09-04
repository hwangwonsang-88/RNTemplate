import React, { createContext, useContext, useState } from 'react';

const ScreenContext = createContext();

export const ScreenProvider = ({ children }) => {
    const [currentScreen, setCurrentScreen] = useState('splash');

    const value = {
        currentScreen,
        setCurrentScreen
    };

    return (
        <ScreenContext.Provider value={value}>
            {children}
        </ScreenContext.Provider>
    );
};

export const useScreen = () => {
    const context = useContext(ScreenContext);
    if (!context) {
        throw new Error('useScreen must be used within a ScreenProvider');
    }
    return context;
};