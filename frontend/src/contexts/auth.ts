import { createContext } from 'react';

import type {
    AuthenticatedUser,
    AuthSession,
} from '@/types/auth';

export interface AuthContextValue {
    user: AuthenticatedUser | null;
    isAuthenticated: boolean;
    isInitializing: boolean;

    setSession: (session: AuthSession) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);