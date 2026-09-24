import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

function formatarData(data) {
    if (!data) {
        return 'Data não informada';
    }

    const [ano, mes, dia] = String(data).slice(0, 10).split('-');
    return `${dia}/${mes}/${ano}`;
}

function formatarValor(valor) {
    const numero = Number(valor);
    return Number.isFinite(numero)
        ? numero.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
        : 'R$ 0,00';
}

export default function MovimentacoesScreen() {
    const { session, signOut } = useAuth();
    const token = session?.token;
    const [movimentacoes, setMovimentacoes] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState(null);
    const [atualizacao, setAtualizacao] = useState(0);

    useEffect(() => {
        if (!token) {
            return undefined;
        }

        let ativo = true;

        Promise.all([
            apiRequest('/receitas', {
                headers: { Authorization: `Bearer ${token}` },
            }),
            apiRequest('/despesas', {
                headers: { Authorization: `Bearer ${token}` },
            }),
        ])
            .then(([receitasData, despesasData]) => {
                if (!ativo) {
                    return;
                }

                const receitas = Array.isArray(receitasData.dados) ? receitasData.dados : [];
                const despesas = Array.isArray(despesasData.dados) ? despesasData.dados : [];

                setMovimentacoes(
                    [...receitas, ...despesas].sort((primeira, segunda) => {
                        const diferenca = String(segunda.data_lancamento).localeCompare(
                            String(primeira.data_lancamento),
                        );
                        return diferenca || String(segunda.id_movimentacao).localeCompare(String(primeira.id_movimentacao));
                    }),
                );
                setErro(null);
            })
            .catch((requestError) => {
                if (!ativo) {
                    return;
                }
                if (requestError.status === 401 || requestError.status === 403) {
                    signOut();
                    router.replace('/login');
                    return;
                }
                setErro(requestError.message || 'Não foi possível carregar as movimentações.');
            })
            .finally(() => {
                if (ativo) {
                    setCarregando(false);
                }
            });

        return () => {
            ativo = false;
        };
    }, [atualizacao, signOut, token]);

    function atualizar() {
        setErro(null);
        setCarregando(true);
        setAtualizacao((valorAtual) => valorAtual + 1);
    }

    function renderItem({ item }) {
        const ehReceita = item.tipo === 'RECEITA';
        const categoria = item.categoria || 'Categoria não informada';
        const subcategoria = item.subcategoria ? ` / ${item.subcategoria}` : '';
        const informacoesExtras = ehReceita
            ? [
                item.origem ? `Origem: ${item.origem}` : null,
                item.data_prevista ? `Receita prevista: ${formatarData(item.data_prevista)}` : null,
            ]
            : [
                item.status ? `Status: ${item.status}` : null,
                item.data_vencimento ? `Vencimento: ${formatarData(item.data_vencimento)}` : null,
            ];
        const detalhes = informacoesExtras.filter(Boolean).join(' • ');

        return (
            <View style={styles.itemCard}>
                <View style={styles.itemHeader}>
                    <View style={[styles.typeBadge, ehReceita ? styles.receitaBadge : styles.despesaBadge]}>
                        <Text style={styles.typeText}>{ehReceita ? 'RECEITA' : 'DESPESA'}</Text>
                    </View>
                    <Text style={[styles.value, ehReceita ? styles.receitaValue : styles.despesaValue]}>
                        {ehReceita ? '+' : '-'} {formatarValor(item.valor)}
                    </Text>
                </View>

                <Text style={styles.description}>{item.descricao || 'Sem descrição'}</Text>
                <Text style={styles.meta}>{categoria}{subcategoria}</Text>
                <Text style={styles.meta}>{formatarData(item.data_lancamento)}</Text>

                {item.forma_pagamento && (
                    <Text style={styles.meta}>Pagamento: {item.forma_pagamento}</Text>
                )}
                {detalhes && <Text style={styles.details}>{detalhes}</Text>}
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => (router.canGoBack() ? router.back() : router.replace('/home'))}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backText}>← Início</Text>
                </TouchableOpacity>
                <Text style={styles.title}>Movimentações</Text>
                <Text style={styles.subtitle}>Receitas e despesas cadastradas no sistema</Text>
            </View>

            {erro && (
                <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{erro}</Text>
                    <TouchableOpacity onPress={atualizar} activeOpacity={0.7}>
                        <Text style={styles.retryText}>Tentar novamente</Text>
                    </TouchableOpacity>
                </View>
            )}

            {carregando && movimentacoes.length === 0 ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#2563EB" />
                    <Text style={styles.loadingText}>Carregando movimentações...</Text>
                </View>
            ) : (
                <FlatList
                    data={movimentacoes}
                    keyExtractor={(item) => item.id_movimentacao}
                    renderItem={renderItem}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    contentContainerStyle={movimentacoes.length === 0 ? styles.emptyList : styles.listContent}
                    refreshControl={(
                        <RefreshControl
                            refreshing={carregando && movimentacoes.length > 0}
                            onRefresh={atualizar}
                            colors={['#2563EB']}
                        />
                    )}
                    ListEmptyComponent={(
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyTitle}>Nenhuma movimentação encontrada</Text>
                            <Text style={styles.emptyText}>
                                As receitas e despesas aparecerão aqui depois que forem cadastradas.
                            </Text>
                        </View>
                    )}
                />
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    header: {
        paddingHorizontal: 24,
        paddingTop: 20,
        paddingBottom: 16,
    },
    backButton: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        marginBottom: 12,
    },
    backText: {
        color: '#2563EB',
        fontSize: 15,
        fontWeight: '600',
    },
    title: {
        color: '#0F172A',
        fontSize: 26,
        fontWeight: '700',
    },
    subtitle: {
        color: '#64748B',
        fontSize: 14,
        marginTop: 4,
    },
    errorBox: {
        marginHorizontal: 24,
        marginBottom: 12,
        backgroundColor: '#FEF2F2',
        borderColor: '#FECACA',
        borderWidth: 1,
        borderRadius: 8,
        padding: 14,
    },
    errorText: {
        color: '#B91C1C',
        fontSize: 14,
        lineHeight: 20,
    },
    retryText: {
        color: '#B91C1C',
        fontSize: 14,
        fontWeight: '700',
        marginTop: 10,
    },
    center: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    loadingText: {
        color: '#64748B',
        marginTop: 12,
    },
    listContent: {
        paddingHorizontal: 24,
        paddingBottom: 32,
    },
    emptyList: {
        flexGrow: 1,
        padding: 24,
    },
    itemCard: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E2E8F0',
        borderWidth: 1,
        borderRadius: 10,
        padding: 16,
    },
    itemHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    typeBadge: {
        borderRadius: 999,
        paddingHorizontal: 9,
        paddingVertical: 5,
    },
    receitaBadge: {
        backgroundColor: '#DCFCE7',
    },
    despesaBadge: {
        backgroundColor: '#FEE2E2',
    },
    typeText: {
        fontSize: 11,
        fontWeight: '800',
        letterSpacing: 0.5,
    },
    value: {
        fontSize: 16,
        fontWeight: '800',
    },
    receitaValue: {
        color: '#15803D',
    },
    despesaValue: {
        color: '#B91C1C',
    },
    description: {
        color: '#0F172A',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    meta: {
        color: '#64748B',
        fontSize: 13,
        marginTop: 2,
    },
    details: {
        color: '#475569',
        fontSize: 12,
        marginTop: 8,
    },
    separator: {
        height: 12,
    },
    emptyState: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyTitle: {
        color: '#0F172A',
        fontSize: 17,
        fontWeight: '700',
        textAlign: 'center',
    },
    emptyText: {
        color: '#64748B',
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center',
        marginTop: 8,
    },
});
