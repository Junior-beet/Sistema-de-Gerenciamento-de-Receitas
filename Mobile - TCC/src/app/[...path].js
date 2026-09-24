import { Redirect, usePathname } from 'expo-router';

import { useAuth } from '../context/AuthContext';
import CadastroScreen from '../screens/Cadastro';
import DespesasScreen from '../screens/Despesas';
import EsqueciSenhaScreen from '../screens/EsqueciSenha';
import HomeScreen from '../screens/Home';
import LoginScreen from '../screens/Login';
import MovimentacoesScreen from '../screens/Movimentacoes';
import ReceitasScreen from '../screens/Receitas';
import RedefinirSenhaScreen from '../screens/RedefinirSenha';

const TELAS = {
    '/login': LoginScreen,
    '/cadastro': CadastroScreen,
    '/esqueci-senha': EsqueciSenhaScreen,
    '/redefinir-senha': RedefinirSenhaScreen,
    '/home': HomeScreen,
    '/movimentacoes': MovimentacoesScreen,
    '/receitas': ReceitasScreen,
    '/despesas': DespesasScreen,
};

const ROTAS_AUTENTICADAS = new Set([
    '/home',
    '/movimentacoes',
    '/receitas',
    '/despesas',
]);
const ROTAS_DE_LANCAMENTO = new Set(['/receitas', '/despesas']);

export default function AppRoute() {
    const pathname = usePathname().replace(/\/+$/, '') || '/login';
    const { session } = useAuth();
    const Screen = TELAS[pathname];

    if (!Screen) {
        return <Redirect href="/login" />;
    }

    if (ROTAS_AUTENTICADAS.has(pathname) && !session) {
        return <Redirect href="/login" />;
    }

    if (
        ROTAS_DE_LANCAMENTO.has(pathname)
        && session?.usuario?.cargo !== 'DIRETOR_FINANCEIRO'
    ) {
        return <Redirect href="/home" />;
    }

    return <Screen />;
}
