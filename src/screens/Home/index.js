import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';

const CARGOS = {
    CEO: 'CEO',
    DIRETOR_FINANCEIRO: 'Departamento Financeiro',
    GERENTE: 'Gerente',
};

export default function HomeScreen() {
    const { session, signOut } = useAuth();
    const usuario = session?.usuario;
    const podeAdicionarMovimentacoes = usuario?.cargo === 'DIRETOR_FINANCEIRO';

    function sair() {
        signOut();
        router.replace('/login');
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.eyebrow}>SISTEMA FINANCEIRO</Text>
                    <Text style={styles.title}>Olá, {usuario?.nome || 'usuário'}!</Text>
                    <View style={styles.cargoBadge}>
                        <Text style={styles.cargoText}>{CARGOS[usuario?.cargo] || usuario?.cargo}</Text>
                    </View>
                </View>

                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Movimentações financeiras</Text>
                    <Text style={styles.cardText}>
                        {podeAdicionarMovimentacoes
                            ? 'Você pode consultar todas as movimentações e registrar novas receitas e despesas.'
                            : 'Você pode consultar as receitas e despesas cadastradas pelo Departamento Financeiro.'}
                    </Text>

                    <View style={styles.actions}>
                        <TouchableOpacity
                            style={[styles.actionButton, styles.consultaButton]}
                            onPress={() => router.push('/movimentacoes')}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.actionText}>Ver movimentações</Text>
                        </TouchableOpacity>

                        {podeAdicionarMovimentacoes && (
                            <>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.receitaButton]}
                                    onPress={() => router.push('/receitas')}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.actionText}>Nova receita</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.actionButton, styles.despesaButton]}
                                    onPress={() => router.push('/despesas')}
                                    activeOpacity={0.8}
                                >
                                    <Text style={styles.actionText}>Nova despesa</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>

                    {!podeAdicionarMovimentacoes && (
                        <View style={styles.warningBox}>
                            <Text style={styles.warningText}>
                                Seu cargo permite consultar movimentações, mas não adicioná-las.
                            </Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.logoutButton} onPress={sair} activeOpacity={0.7}>
                    <Text style={styles.logoutText}>Sair da conta</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 32,
    },
    header: {
        marginBottom: 28,
    },
    eyebrow: {
        color: '#2563EB',
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginBottom: 8,
    },
    title: {
        color: '#0F172A',
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 14,
    },
    cargoBadge: {
        alignSelf: 'flex-start',
        backgroundColor: '#DBEAFE',
        borderRadius: 999,
        paddingHorizontal: 12,
        paddingVertical: 7,
    },
    cargoText: {
        color: '#1D4ED8',
        fontSize: 13,
        fontWeight: '700',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
        padding: 20,
    },
    cardTitle: {
        color: '#0F172A',
        fontSize: 19,
        fontWeight: '700',
        marginBottom: 8,
    },
    cardText: {
        color: '#64748B',
        fontSize: 15,
        lineHeight: 22,
    },
    actions: {
        marginTop: 20,
        gap: 12,
    },
    actionButton: {
        minHeight: 50,
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
    },
    consultaButton: {
        backgroundColor: '#2563EB',
    },
    receitaButton: {
        backgroundColor: '#16A34A',
    },
    despesaButton: {
        backgroundColor: '#DC2626',
    },
    actionText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
    warningBox: {
        marginTop: 20,
        backgroundColor: '#FFFBEB',
        borderColor: '#FDE68A',
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
    },
    warningText: {
        color: '#92400E',
        fontSize: 14,
        lineHeight: 20,
    },
    logoutButton: {
        alignItems: 'center',
        paddingVertical: 16,
        marginTop: 18,
    },
    logoutText: {
        color: '#64748B',
        fontSize: 14,
        fontWeight: '600',
    },
});
