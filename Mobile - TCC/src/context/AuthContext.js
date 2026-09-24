import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);

    const value = useMemo(
        () => ({
            session,
            signIn: setSession,
            signOut: () => setSession(null),
        }),
        [session],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error('useAuth precisa estar dentro de AuthProvider.');
    }

    return context;
}
