export type UserRole = 'admin' | 'user' | 'editor';

export interface User {
    id: string;
    email: string;
    role: UserRole;
}

export interface AuthContextType {
    user: User | null;
    role: UserRole | null;
    isLoading: boolean;
    checkAuth: () => Promise<void>;
}