import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User, type AuthContextType, type UserRole } from '../types/auth';
import apiClient from '../api/ApiClient';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuth = async () => {
        setIsLoading(true);
        try {
            const response = await apiClient.get<any>('/auth/role');
            setUser(response.data);
        } catch (error) {
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    const role: UserRole | null = user?.role || null;

    return (
        <AuthContext.Provider value={{ user, role, isLoading, checkAuth }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};