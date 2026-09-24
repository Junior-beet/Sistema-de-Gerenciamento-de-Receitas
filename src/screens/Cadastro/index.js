import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://10.0.2.2:8080";

const CARGOS = [
    { label: 'Selecione seu cargo', value: '' },
    { label: 'CEO', value: 'CEO' },
    { label: 'Departamento Financeiro', value: 'DIRETOR_FINANCEIRO' },
    { label: 'Gerente', value: 'GERENTE' },
];

function dicaSenha(senha) {
    if (senha.length > 0 && senha.length < 8) return { texto: 'A senha deve ter ao menos 8 caracteres', cor: '#DC2626' };
    if (senha.length >= 8) return { texto: 'Senha válida', cor: '#16A34A' };
    return { texto: 'Use ao menos 8 caracteres', cor: '#94A3B8' };
}

export default function CadastroScreen() {
    const navigation = useNavigation();
    const timeoutRef = useRef(null);

    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [cargo, setCargo] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(null);

    const dica = dicaSenha(senha);

    // Limpa o timer se a tela for desmontada antes do redirecionamento
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    async function handleCadastro() {
        setErro(null);
        setSucesso(null);

        const nomeLimpo = nome.trim();
        const emailLimpo = email.trim();

        if (!nomeLimpo || !emailLimpo) {
            setErro('Preencha nome e e-mail.');
            return;
        }

        if (senha.length < 8) {
            setErro('A senha deve ter ao menos 8 caracteres.');
            return;
        }

        if (!cargo) {
            setErro('Selecione seu cargo.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/usuarios`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nome: nomeLimpo, email: emailLimpo, senha_usuario: senha, cargo })
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(data.mensagem || 'Erro ao cadastrar.');
                return;
            }

            setSucesso(`Cadastro efetuado com sucesso. Bem-vindo, ${nomeLimpo}!`);
            timeoutRef.current = setTimeout(() => navigation.navigate('LoginScreen'), 1600);

        } catch (error) {
            setErro('Não foi possível conectar ao servidor.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <Text style={styles.title}>Criar Conta</Text>
                <Text style={styles.subtitle}>Preencha os dados para se registrar</Text>

                {erro && (
                    <View style={styles.alertErro}>
                        <Text style={styles.alertErroText}>{erro}</Text>
                    </View>
                )}

                {sucesso && (
                    <View style={styles.alertSucesso}>
                        <Text style={styles.alertSucessoText}>{sucesso}</Text>
                    </View>
                )}

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome completo</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Seu nome"
                        placeholderTextColor="#9CA3AF"
                        value={nome}
                        onChangeText={setNome}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>E-mail</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="seu@email.com"
                        placeholderTextColor="#9CA3AF"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoCorrect={false}
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Crie uma senha segura"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                    />
                    {senha.length > 0 && (
                        <Text style={[styles.dicaSenha, { color: dica.cor }]}>{dica.texto}</Text>
                    )}
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Cargo</Text>
                    <View style={styles.cargoGroup}>
                        {CARGOS.filter(c => c.value !== '').map((c) => (
                            <TouchableOpacity
                                key={c.value}
                                style={[
                                    styles.cargoButton,
                                    cargo === c.value && styles.cargoButtonAtivo
                                ]}
                                onPress={() => setCargo(c.value)}
                                activeOpacity={0.8}
                            >
                                <Text style={[
                                    styles.cargoText,
                                    cargo === c.value && styles.cargoTextAtivo
                                ]}>
                                    {c.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={handleCadastro}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#FFFFFF" />
                        : <Text style={styles.btnPrimaryText}>Cadastrar</Text>
                    }
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                    style={styles.btnOutline}
                    onPress={() => navigation.navigate('LoginScreen')}
                    activeOpacity={0.7}
                >
                    <Text style={styles.btnOutlineText}>Já possui conta? Faça login</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: "#F8FAFC",
    },

    container: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingTop: 56,
        paddingBottom: 32,
    },

    title: {
        fontSize: 28,
        fontWeight: "700",
        color: "#0F172A",
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 15,
        color: "#64748B",
        marginBottom: 24,
    },

    alertErro: {
        backgroundColor: "#FEF2F2",
        borderWidth: 1,
        borderColor: "#FECACA",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },

    alertErroText: {
        color: "#DC2626",
        fontSize: 14,
    },

    alertSucesso: {
        backgroundColor: "#F0FDF4",
        borderWidth: 1,
        borderColor: "#BBF7D0",
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },

    alertSucessoText: {
        color: "#16A34A",
        fontSize: 14,
    },

    inputGroup: {
        marginBottom: 16,
    },

    label: {
        fontSize: 14,
        fontWeight: "600",
        color: "#0F172A",
        marginBottom: 6,
    },

    input: {
        height: 48,
        backgroundColor: "#FFFFFF",
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 15,
        color: "#0F172A",
        borderWidth: 1,
        borderColor: "#CBD5E1",
    },

    dicaSenha: {
        fontSize: 12,
        marginTop: 4,
    },

    cargoGroup: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    cargoButton: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#CBD5E1",
        backgroundColor: "#FFFFFF",
    },

    cargoButtonAtivo: {
        backgroundColor: "#2563EB",
        borderColor: "#2563EB",
    },

    cargoText: {
        fontSize: 13,
        fontWeight: "600",
        color: "#64748B",
    },

    cargoTextAtivo: {
        color: "#FFFFFF",
    },

    btnPrimary: {
        height: 52,
        backgroundColor: "#2563EB",
        borderRadius: 8,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 8,
        marginBottom: 20,
    },

    btnPrimaryText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "700",
    },

    dividerRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20,
    },

    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: "#E2E8F0",
    },

    dividerText: {
        marginHorizontal: 12,
        color: "#94A3B8",
        fontSize: 13,
    },

    btnOutline: {
        height: 52,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#2563EB",
        alignItems: "center",
        justifyContent: "center",
    },

    btnOutlineText: {
        color: "#2563EB",
        fontSize: 15,
        fontWeight: "600",
    },
});