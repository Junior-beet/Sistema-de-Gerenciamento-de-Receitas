<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";

const API_URL = "http://10.0.2.2:8080";

const FORMAS_PAGAMENTO = ['PIX', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Transferência Bancária'];

const REGEX_DATA = /^\d{4}-\d{2}-\d{2}$/;

=======
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';
import { converterValor, isDataValida, VALOR_MAXIMO } from '../../utils/validacoes';

const FORMAS_PAGAMENTO = ['PIX', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Transferência Bancária'];

>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
function dataDeHoje() {
    const agora = new Date();
    const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000);
    return local.toISOString().split('T')[0];
}

export default function DespesasScreen() {
<<<<<<< HEAD
    const navigation = useNavigation();
    const route = useRoute();
    const { token } = route.params;

=======
    const { session, signOut } = useAuth();
    const token = session?.token;
    const requisicaoSubcategoriaRef = useRef(0);

    const [contas, setContas] = useState([]);
    const [idConta, setIdConta] = useState('');
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [idCategoria, setIdCategoria] = useState('');
    const [idSubcategoria, setIdSubcategoria] = useState('');
    const [valor, setValor] = useState('');
    const [dataLancamento, setDataLancamento] = useState(dataDeHoje());
    const [formaPagamento, setFormaPagamento] = useState('');
    const [descricao, setDescricao] = useState('');
    const [dataVencimento, setDataVencimento] = useState('');
    const [parcelado, setParcelado] = useState(false);
    const [totalParcelas, setTotalParcelas] = useState('2');
    const [carregando, setCarregando] = useState(true);
    const [carregandoSub, setCarregandoSub] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(null);

    useEffect(() => {
<<<<<<< HEAD
        carregarCategorias();
    }, []);

    async function carregarCategorias() {
        try {
            const response = await fetch(`${API_URL}/categorias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setCategorias((data.dados || []).filter(c => c.tipo === 'DESPESA'));
        } catch {
            setErro('Erro ao carregar categorias.');
        } finally {
            setCarregando(false);
        }
    }

    async function aoMudarCategoria(id) {
=======
        if (!token) {
            return undefined;
        }

        let ativo = true;

        Promise.all([
            apiRequest('/contas', {
                headers: { Authorization: `Bearer ${token}` },
            }),
            apiRequest('/categorias', {
                headers: { Authorization: `Bearer ${token}` },
            }),
        ])
            .then(([contasData, categoriasData]) => {
                if (!ativo) {
                    return;
                }

                const listaContas = Array.isArray(contasData.dados) ? contasData.dados : [];
                const listaCategorias = Array.isArray(categoriasData.dados) ? categoriasData.dados : [];

                setContas(listaContas);
                setCategorias(listaCategorias.filter((categoria) => categoria.tipo === 'DESPESA'));

                if (listaContas.length > 0) {
                    setIdConta((contaAtual) => contaAtual || listaContas[0].id_conta);
                }
            })
            .catch((error) => {
                if (!ativo) {
                    return;
                }
                if (error.status === 401 || error.status === 403) {
                    signOut();
                    router.replace('/');
                    return;
                }
                setErro(error.message || 'Erro ao carregar contas e categorias.');
            })
            .finally(() => {
                if (ativo) {
                    setCarregando(false);
                }
            });

        return () => {
            ativo = false;
            requisicaoSubcategoriaRef.current += 1;
        };
    }, [signOut, token]);

    async function aoMudarCategoria(id) {
        const requisicaoId = ++requisicaoSubcategoriaRef.current;
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
        setIdCategoria(id);
        setIdSubcategoria('');
        setSubcategorias([]);
        if (!id) return;

        setCarregandoSub(true);
        try {
<<<<<<< HEAD
            const response = await fetch(`${API_URL}/subcategorias/categoria/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setSubcategorias(data.dados || []);
        } catch {
            setSubcategorias([]);
        } finally {
            setCarregandoSub(false);
=======
            const data = await apiRequest(`/subcategorias/categoria/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (requisicaoId === requisicaoSubcategoriaRef.current) {
                setSubcategorias(Array.isArray(data.dados) ? data.dados : []);
            }
        } catch (error) {
            if (requisicaoId !== requisicaoSubcategoriaRef.current) {
                return;
            }
            if (error.status === 401 || error.status === 403) {
                signOut();
                router.replace('/');
                return;
            }
            setSubcategorias([]);
            setErro(error.message || 'Erro ao carregar subcategorias.');
        } finally {
            if (requisicaoId === requisicaoSubcategoriaRef.current) {
                setCarregandoSub(false);
            }
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
        }
    }

    async function handleSalvar() {
        setErro(null);
        setSucesso(null);

<<<<<<< HEAD
        const valorNumerico = Number(String(valor).replace(',', '.'));
        const parcelas = Number(totalParcelas);

        if (!idCategoria || !valorNumerico || valorNumerico <= 0 || !dataLancamento) {
            setErro('Preencha os campos obrigatórios: categoria, valor e data de lançamento.');
            return;
        }

        if (!REGEX_DATA.test(dataLancamento) || (dataVencimento && !REGEX_DATA.test(dataVencimento))) {
            setErro('Use o formato de data AAAA-MM-DD (ex: 2026-09-24).');
            return;
        }

        if (parcelado && (!parcelas || parcelas < 2)) {
            setErro('Informe um total de parcelas maior que 1.');
=======
        const valorNumerico = converterValor(valor);
        const parcelas = Number(totalParcelas);

        if (!idConta || !idCategoria || !valorNumerico || valorNumerico <= 0 || !dataLancamento) {
            setErro('Preencha os campos obrigatórios: conta, categoria, valor e data de lançamento.');
            return;
        }
        if (valorNumerico > VALOR_MAXIMO) {
            setErro('O valor informado excede o limite suportado pelo banco de dados.');
            return;
        }

        if (!isDataValida(dataLancamento) || (dataVencimento && !isDataValida(dataVencimento))) {
            setErro('Use uma data válida no formato AAAA-MM-DD (ex: 2026-09-24).');
            return;
        }

        if (parcelado && (!Number.isInteger(parcelas) || parcelas < 2 || parcelas > 60)) {
            setErro('Informe um total de parcelas inteiro entre 2 e 60.');
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
            return;
        }

        setSalvando(true);

        try {
<<<<<<< HEAD
            const response = await fetch(`${API_URL}/despesas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_conta: route.params.usuario?.id_conta || null,
=======
            await apiRequest('/despesas', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    id_conta: idConta,
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
                    id_categoria: idCategoria,
                    id_subcategoria: idSubcategoria || null,
                    valor: valorNumerico,
                    data_lancamento: dataLancamento,
                    descricao: descricao.trim() || null,
                    forma_pagamento: formaPagamento || null,
                    data_vencimento: dataVencimento || null,
                    parcelado,
                    total_parcelas: parcelado ? parcelas : 1,
<<<<<<< HEAD
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(data.mensagem || 'Erro ao salvar.');
                return;
            }

=======
                }),
            });

>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
            setSucesso('Despesa lançada com sucesso!');
            setIdCategoria('');
            setIdSubcategoria('');
            setValor('');
            setDataLancamento(dataDeHoje());
            setFormaPagamento('');
            setDescricao('');
            setDataVencimento('');
            setParcelado(false);
            setTotalParcelas('2');
            setSubcategorias([]);

<<<<<<< HEAD
        } catch {
            setErro('Não foi possível conectar ao servidor.');
=======
        } catch (error) {
            if (error.status === 401 || error.status === 403) {
                signOut();
                router.replace('/');
                return;
            }
            setErro(error.message || 'Erro ao salvar a despesa.');
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
        } finally {
            setSalvando(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <Text style={styles.title}>Nova Despesa</Text>
                <Text style={styles.subtitle}>Registre uma saída no seu fluxo financeiro</Text>

                {erro && <View style={styles.alertErro}><Text style={styles.alertErroText}>{erro}</Text></View>}
                {sucesso && <View style={styles.alertSucesso}><Text style={styles.alertSucessoText}>{sucesso}</Text></View>}

<<<<<<< HEAD
=======
                {/* Conta */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Conta <Text style={styles.required}>*</Text></Text>
                    <View style={styles.selectBox}>
                        {carregando ? (
                            <Text style={styles.selectPlaceholder}>Carregando contas...</Text>
                        ) : contas.length === 0 ? (
                            <Text style={styles.selectPlaceholder}>Nenhuma conta cadastrada</Text>
                        ) : (
                            contas.map((conta) => {
                                const descricaoConta = conta.descricao || conta.numero || conta.tipo || 'Conta';

                                return (
                                    <TouchableOpacity
                                        key={conta.id_conta}
                                        style={[styles.selectOption, idConta === conta.id_conta && styles.selectOptionAtivo]}
                                        onPress={() => setIdConta(conta.id_conta)}
                                    >
                                        <Text style={[styles.selectOptionText, idConta === conta.id_conta && styles.selectOptionTextAtivo]}>
                                            {descricaoConta}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })
                        )}
                    </View>
                </View>

>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
                {/* Categoria */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Categoria <Text style={styles.required}>*</Text></Text>
                    <View style={styles.selectBox}>
                        {carregando ? (
                            <Text style={styles.selectPlaceholder}>Carregando categorias...</Text>
                        ) : categorias.length === 0 ? (
                            <Text style={styles.selectPlaceholder}>Nenhuma categoria cadastrada</Text>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[styles.selectOption, !idCategoria && styles.selectOptionAtivo]}
                                    onPress={() => aoMudarCategoria('')}
                                >
                                    <Text style={[styles.selectOptionText, !idCategoria && styles.selectOptionTextAtivo]}>
                                        Selecione a categoria
                                    </Text>
                                </TouchableOpacity>
                                {categorias.map(c => (
                                    <TouchableOpacity
                                        key={c.id_categoria}
                                        style={[styles.selectOption, idCategoria === c.id_categoria && styles.selectOptionAtivo]}
                                        onPress={() => aoMudarCategoria(c.id_categoria)}
                                    >
                                        <Text style={[styles.selectOptionText, idCategoria === c.id_categoria && styles.selectOptionTextAtivo]}>
                                            {c.nome}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}
                    </View>
                </View>

                {/* Subcategoria */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Subcategoria (opcional)</Text>
                    <View style={styles.selectBox}>
                        {carregandoSub ? (
                            <Text style={styles.selectPlaceholder}>Carregando...</Text>
                        ) : subcategorias.length === 0 ? (
                            <Text style={styles.selectPlaceholder}>Sem subcategoria</Text>
                        ) : (
                            <>
                                <TouchableOpacity
                                    style={[styles.selectOption, !idSubcategoria && styles.selectOptionAtivo]}
                                    onPress={() => setIdSubcategoria('')}
                                >
                                    <Text style={[styles.selectOptionText, !idSubcategoria && styles.selectOptionTextAtivo]}>
                                        Sem subcategoria (opcional)
                                    </Text>
                                </TouchableOpacity>
                                {subcategorias.map(s => (
                                    <TouchableOpacity
                                        key={s.id_subcategoria}
                                        style={[styles.selectOption, idSubcategoria === s.id_subcategoria && styles.selectOptionAtivo]}
                                        onPress={() => setIdSubcategoria(s.id_subcategoria)}
                                    >
                                        <Text style={[styles.selectOptionText, idSubcategoria === s.id_subcategoria && styles.selectOptionTextAtivo]}>
                                            {s.nome}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </>
                        )}
                    </View>
                </View>

                {/* Valor e Data */}
                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Valor (R$) <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="0,00"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="decimal-pad"
                            value={valor}
                            onChangeText={setValor}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Data de lançamento <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="AAAA-MM-DD"
                            placeholderTextColor="#9CA3AF"
                            value={dataLancamento}
                            onChangeText={setDataLancamento}
                        />
                    </View>
                </View>

                {/* Forma de pagamento */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Forma de pagamento</Text>
                    <View style={styles.selectBox}>
                        <TouchableOpacity
                            style={[styles.selectOption, !formaPagamento && styles.selectOptionAtivo]}
                            onPress={() => setFormaPagamento('')}
                        >
                            <Text style={[styles.selectOptionText, !formaPagamento && styles.selectOptionTextAtivo]}>
                                Selecione (opcional)
                            </Text>
                        </TouchableOpacity>
                        {FORMAS_PAGAMENTO.map(f => (
                            <TouchableOpacity
                                key={f}
                                style={[styles.selectOption, formaPagamento === f && styles.selectOptionAtivo]}
                                onPress={() => setFormaPagamento(f)}
                            >
                                <Text style={[styles.selectOptionText, formaPagamento === f && styles.selectOptionTextAtivo]}>
                                    {f}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Descrição */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Descrição</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Aluguel, Supermercado..."
                        placeholderTextColor="#9CA3AF"
                        value={descricao}
                        onChangeText={setDescricao}
                        maxLength={255}
                    />
                </View>

                {/* Vencimento */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Vencimento (opcional)</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="AAAA-MM-DD"
                        placeholderTextColor="#9CA3AF"
                        value={dataVencimento}
                        onChangeText={setDataVencimento}
                    />
                </View>

                {/* Parcelado */}
                <View style={styles.inputGroup}>
                    <TouchableOpacity
                        style={styles.checkboxRow}
                        onPress={() => setParcelado(!parcelado)}
                        activeOpacity={0.7}
                    >
                        <View style={[styles.checkbox, parcelado && styles.checkboxAtivo]}>
                            {parcelado && <Text style={styles.checkboxCheck}>✓</Text>}
                        </View>
                        <Text style={styles.checkboxLabel}>Despesa parcelada</Text>
                    </TouchableOpacity>
                </View>

                {parcelado && (
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Total de parcelas <Text style={styles.required}>*</Text></Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Mínimo 2"
                            placeholderTextColor="#9CA3AF"
                            keyboardType="number-pad"
                            value={totalParcelas}
                            onChangeText={setTotalParcelas}
                        />
                    </View>
                )}

                <TouchableOpacity
                    style={styles.btnPerigo}
                    onPress={handleSalvar}
                    activeOpacity={0.8}
                    disabled={salvando || carregando}
                >
                    {salvando
                        ? <ActivityIndicator color="#FFFFFF" />
                        : <Text style={styles.btnText}>Lançar Despesa</Text>
                    }
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                    style={styles.btnOutlinePerigo}
<<<<<<< HEAD
                    onPress={() => navigation.navigate('ReceitasScreen', route.params)}
=======
                    onPress={() => router.replace('/receitas')}
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
                    activeOpacity={0.8}
                >
                    <Text style={styles.btnOutlinePerigoText}>← Ir para Receitas</Text>
                </TouchableOpacity>

<<<<<<< HEAD
=======
                <TouchableOpacity
                    style={styles.btnSair}
                    onPress={() => {
                        signOut();
                        router.replace('/');
                    }}
                    activeOpacity={0.7}
                >
                    <Text style={styles.btnSairText}>Sair da conta</Text>
                </TouchableOpacity>
 
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: "#F8FAFC" },
    container: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 32 },
    title: { fontSize: 26, fontWeight: "700", color: "#0F172A", marginBottom: 6 },
    subtitle: { fontSize: 15, color: "#64748B", marginBottom: 24 },
    alertErro: { backgroundColor: "#FEF2F2", borderWidth: 1, borderColor: "#FECACA", borderRadius: 8, padding: 12, marginBottom: 16 },
    alertErroText: { color: "#DC2626", fontSize: 14 },
    alertSucesso: { backgroundColor: "#F0FDF4", borderWidth: 1, borderColor: "#BBF7D0", borderRadius: 8, padding: 12, marginBottom: 16 },
    alertSucessoText: { color: "#16A34A", fontSize: 14 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: "600", color: "#0F172A", marginBottom: 6 },
    required: { color: "#DC2626" },
    input: { height: 48, backgroundColor: "#FFFFFF", borderRadius: 8, paddingHorizontal: 14, fontSize: 15, color: "#0F172A", borderWidth: 1, borderColor: "#CBD5E1" },
    row: { flexDirection: "row" },
    selectBox: { backgroundColor: "#FFFFFF", borderRadius: 8, borderWidth: 1, borderColor: "#CBD5E1", overflow: "hidden" },
    selectOption: { paddingHorizontal: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F1F5F9" },
    selectOptionAtivo: { backgroundColor: "#FEF2F2" },
    selectOptionText: { fontSize: 14, color: "#64748B" },
    selectOptionTextAtivo: { color: "#DC2626", fontWeight: "600" },
    selectPlaceholder: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#9CA3AF" },
    checkboxRow: { flexDirection: "row", alignItems: "center", gap: 10 },
    checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: "#CBD5E1", backgroundColor: "#FFFFFF", alignItems: "center", justifyContent: "center" },
    checkboxAtivo: { backgroundColor: "#DC2626", borderColor: "#DC2626" },
    checkboxCheck: { color: "#FFFFFF", fontSize: 12, fontWeight: "700" },
    checkboxLabel: { fontSize: 14, color: "#0F172A" },
    btnPerigo: { height: 52, backgroundColor: "#DC2626", borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 8, marginBottom: 20 },
    btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
    dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
    dividerText: { marginHorizontal: 12, color: "#94A3B8", fontSize: 13 },
    btnOutlinePerigo: { height: 52, borderRadius: 8, borderWidth: 1, borderColor: "#DC2626", alignItems: "center", justifyContent: "center" },
    btnOutlinePerigoText: { color: "#DC2626", fontSize: 15, fontWeight: "600" },
<<<<<<< HEAD
=======
    btnSair: { alignItems: 'center', paddingVertical: 14, marginTop: 8 },
    btnSairText: { color: '#64748B', fontSize: 14, fontWeight: '600' },
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
});