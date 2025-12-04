import {createContext, useContext} from "react";

interface CustomThemeContextType {
    isDarkMode: boolean;
    toggleTheme: () => void;
}

export const CustomThemeContext = createContext<CustomThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(CustomThemeContext);
    if (!context) {
        throw new Error('Invalid use of useTheme');
    }
    return context;
};