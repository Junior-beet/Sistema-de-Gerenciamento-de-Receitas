import { Stack, usePathname } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { AuthProvider } from '../context/AuthContext';

const TITULOS = {
    '/receitas': 'Nova Receita',
    '/despesas': 'Nova Despesa',
};

export default function RootLayout() {
    const pathname = usePathname().replace(/\/+$/, '') || '/';
    const titulo = TITULOS[pathname];

    return (
        <AuthProvider>
            <StatusBar style="dark" />
            <Stack
                screenOptions={{
                    title: titulo,
                    headerShown: Boolean(titulo),
                    contentStyle: { backgroundColor: '#F8FAFC' },
                    headerStyle: { backgroundColor: '#F8FAFC' },
                    headerTintColor: '#0F172A',
                }}
            />
        </AuthProvider>
    );
}
