import React, { useState, useEffect } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useRoute } from "@react-navigation/native";
 
const API_URL = "http://10.0.2.2:8080";
 
const FORMAS_PAGAMENTO = ['PIX', 'Dinheiro', 'Cartão de Crédito', 'Cartão de Débito', 'Boleto', 'Transferência Bancária'];
 
const REGEX_DATA = /^\d{4}-\d{2}-\d{2}$/;
 
function dataDeHoje() {
    const agora = new Date();
    const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000);
    return local.toISOString().split('T')[0];
}
 
export default function ReceitasScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const { token } = route.params;
 
    const [categorias, setCategorias] = useState([]);
    const [subcategorias, setSubcategorias] = useState([]);
    const [idCategoria, setIdCategoria] = useState('');
    const [idSubcategoria, setIdSubcategoria] = useState('');
    const [valor, setValor] = useState('');
    const [dataLancamento, setDataLancamento] = useState(dataDeHoje());
    const [formaPagamento, setFormaPagamento] = useState('');
    const [descricao, setDescricao] = useState('');
    const [origem, setOrigem] = useState('');
    const [dataPrevista, setDataPrevista] = useState('');
    const [carregando, setCarregando] = useState(true);
    const [carregandoSub, setCarregandoSub] = useState(false);
    const [salvando, setSalvando] = useState(false);
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(null);
 
    useEffect(() => {
        carregarCategorias();
    }, []);
 
    async function carregarCategorias() {
        try {
            const response = await fetch(`${API_URL}/categorias`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setCategorias((data.dados || []).filter(c => c.tipo === 'RECEITA'));
        } catch {
            setErro('Erro ao carregar categorias.');
        } finally {
            setCarregando(false);
        }
    }
 
    async function aoMudarCategoria(id) {
        setIdCategoria(id);
        setIdSubcategoria('');
        setSubcategorias([]);
        if (!id) return;
 
        setCarregandoSub(true);
        try {
            const response = await fetch(`${API_URL}/subcategorias/categoria/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await response.json();
            setSubcategorias(data.dados || []);
        } catch {
            setSubcategorias([]);
        } finally {
            setCarregandoSub(false);
        }
    }
 
    async function handleSalvar() {
        setErro(null);
        setSucesso(null);
 
        const valorNumerico = Number(String(valor).replace(',', '.'));
 
        if (!idCategoria || !valorNumerico || valorNumerico <= 0 || !dataLancamento) {
            setErro('Preencha os campos obrigatórios: categoria, valor e data de lançamento.');
            return;
        }
 
        if (!REGEX_DATA.test(dataLancamento) || (dataPrevista && !REGEX_DATA.test(dataPrevista))) {
            setErro('Use o formato de data AAAA-MM-DD (ex: 2026-09-24).');
            return;
        }
 
        setSalvando(true);
 
        try {
            const response = await fetch(`${API_URL}/receitas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    id_conta: route.params.usuario?.id_conta || null,
                    id_categoria: idCategoria,
                    id_subcategoria: idSubcategoria || null,
                    valor: valorNumerico,
                    data_lancamento: dataLancamento,
                    descricao: descricao.trim() || null,
                    forma_pagamento: formaPagamento || null,
                    origem: origem.trim() || null,
                    data_prevista: dataPrevista || null,
                })
            });
 
            const data = await response.json();
 
            if (!response.ok) {
                setErro(data.mensagem || 'Erro ao salvar.');
                return;
            }
 
            setSucesso('Receita lançada com sucesso!');
            setIdCategoria('');
            setIdSubcategoria('');
            setValor('');
            setDataLancamento(dataDeHoje());
            setFormaPagamento('');
            setDescricao('');
            setOrigem('');
            setDataPrevista('');
            setSubcategorias([]);
 
        } catch {
            setErro('Não foi possível conectar ao servidor.');
        } finally {
            setSalvando(false);
        }
    }
 
    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
 
                <Text style={styles.title}>Nova Receita</Text>
                <Text style={styles.subtitle}>Registre uma entrada no seu fluxo financeiro</Text>
 
                {erro && <View style={styles.alertErro}><Text style={styles.alertErroText}>{erro}</Text></View>}
                {sucesso && <View style={styles.alertSucesso}><Text style={styles.alertSucessoText}>{sucesso}</Text></View>}
 
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
                        placeholder="Ex: Salário, Freelance..."
                        placeholderTextColor="#9CA3AF"
                        value={descricao}
                        onChangeText={setDescricao}
                        maxLength={255}
                    />
                </View>
 
                {/* Origem e Data Prevista */}
                <View style={styles.row}>
                    <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
                        <Text style={styles.label}>Origem (opcional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Ex: Empresa X"
                            placeholderTextColor="#9CA3AF"
                            value={origem}
                            onChangeText={setOrigem}
                            maxLength={100}
                        />
                    </View>
                    <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
                        <Text style={styles.label}>Data prevista (opcional)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="AAAA-MM-DD"
                            placeholderTextColor="#9CA3AF"
                            value={dataPrevista}
                            onChangeText={setDataPrevista}
                        />
                    </View>
                </View>
 
                <TouchableOpacity
                    style={styles.btnSucesso}
                    onPress={handleSalvar}
                    activeOpacity={0.8}
                    disabled={salvando || carregando}
                >
                    {salvando
                        ? <ActivityIndicator color="#FFFFFF" />
                        : <Text style={styles.btnText}>Lançar Receita</Text>
                    }
                </TouchableOpacity>
 
                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                </View>
 
                <TouchableOpacity
                    style={styles.btnOutlineSucesso}
                    onPress={() => navigation.navigate('DespesasScreen', route.params)}
                    activeOpacity={0.8}
                >
                    <Text style={styles.btnOutlineSucessoText}>Ir para Despesas →</Text>
                </TouchableOpacity>
 
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
    selectOptionAtivo: { backgroundColor: "#EFF6FF" },
    selectOptionText: { fontSize: 14, color: "#64748B" },
    selectOptionTextAtivo: { color: "#2563EB", fontWeight: "600" },
    selectPlaceholder: { paddingHorizontal: 14, paddingVertical: 12, fontSize: 14, color: "#9CA3AF" },
    btnSucesso: { height: 52, backgroundColor: "#16A34A", borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 8, marginBottom: 20 },
    btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
    dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
    dividerLine: { flex: 1, height: 1, backgroundColor: "#E2E8F0" },
    dividerText: { marginHorizontal: 12, color: "#94A3B8", fontSize: 13 },
    btnOutlineSucesso: { height: 52, borderRadius: 8, borderWidth: 1, borderColor: "#16A34A", alignItems: "center", justifyContent: "center" },
    btnOutlineSucessoText: { color: "#16A34A", fontSize: 15, fontWeight: "600" },
});
