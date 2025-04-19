'use client';

import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { IUser } from '@/models/User'; 

interface AuthState {
    user: IUser | null;
}

interface AuthContextType {
    state: AuthState;
    dispatch: React.Dispatch<AuthAction>;
}

type AuthAction = { type: 'LOGIN'; payload: IUser } | { type: 'LOGOUT' };

const initialState: AuthState = { user: null };


function authReducer(state: AuthState, action: AuthAction): AuthState {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload));  
            return { user: action.payload };
            
        case 'LOGOUT':
            localStorage.removeItem('user');  
            localStorage.removeItem('token'); 
            return { user: null };
        default:
            return state;
    }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(authReducer, initialState);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (storedUser && token) {
            dispatch({ type: 'LOGIN', payload: JSON.parse(storedUser) });
        } else {
            dispatch({ type: 'LOGOUT' });
        }

        async function checkAuth() {
            try {
                if (!token) return;

                const res = await fetch('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                const data = await res.json();

                if (res.ok && data.user) {
                    dispatch({ type: 'LOGIN', payload: data.user });
                } else {
                    dispatch({ type: 'LOGOUT' });
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                dispatch({ type: 'LOGOUT' });
            }
        }

        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
}


export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
