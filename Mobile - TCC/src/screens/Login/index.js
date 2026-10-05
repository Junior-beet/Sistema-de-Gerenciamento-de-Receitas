<<<<<<< HEAD
import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

const API_URL = "http://10.0.2.2:8080";

export default function LoginScreen() {
    const navigation = useNavigation();
    const timeoutRef = useRef(null);
=======
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../../context/AuthContext';
import { apiRequest } from '../../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
    const { signIn } = useAuth();
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)

    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
<<<<<<< HEAD
    const [sucesso, setSucesso] = useState(null);

    // Limpa o timer se a tela for desmontada antes do redirecionamento
    useEffect(() => {
        return () => {
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, []);

    async function handleLogin() {
        setErro(null);
        setSucesso(null);

        const emailLimpo = email.trim();

        if (!emailLimpo || !senha) {
            setErro('Preencha e-mail e senha.');
=======

    async function handleLogin() {
        setErro(null);

        const emailLimpo = email.trim();

        if (!EMAIL_REGEX.test(emailLimpo) || !senha) {
            setErro('Informe um e-mail e uma senha válidos.');
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
            return;
        }

        setLoading(true);

        try {
<<<<<<< HEAD
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailLimpo, senha_usuario: senha })
            });

            const data = await response.json();

            if (!response.ok) {
                setErro(data.mensagem || 'E-mail ou senha inválidos.');
                return;
            }

            setSucesso(`Bem-vindo, ${data.usuario.nome}!`);
            timeoutRef.current = setTimeout(() => {
                navigation.navigate('ReceitasScreen', { token: data.token, usuario: data.usuario });
            }, 1200);

        } catch (error) {
            setErro('Não foi possível conectar ao servidor.');
=======
            const data = await apiRequest('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailLimpo, senha_usuario: senha }),
            });

            if (!data?.token || !data?.usuario) {
                throw new Error('A resposta do servidor não contém uma sessão válida.');
            }

            signIn({ token: data.token, usuario: data.usuario });
            router.replace('/home');
        } catch (error) {
            setErro(error.message || 'Não foi possível realizar o login.');
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                <Text style={styles.title}>Acessar Sistema</Text>
                <Text style={styles.subtitle}>Insira suas credenciais para continuar</Text>

                {erro && (
                    <View style={styles.alertErro}>
                        <Text style={styles.alertErroText}>{erro}</Text>
                    </View>
                )}

<<<<<<< HEAD
                {sucesso && (
                    <View style={styles.alertSucesso}>
                        <Text style={styles.alertSucessoText}>{sucesso}</Text>
                    </View>
                )}

=======
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
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
<<<<<<< HEAD
=======
                        maxLength={150}
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Sua senha"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={senha}
                        onChangeText={setSenha}
                    />
                </View>

                <TouchableOpacity
                    style={styles.btnPrimary}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading
                        ? <ActivityIndicator color="#FFFFFF" />
                        : <Text style={styles.btnPrimaryText}>Entrar</Text>
                    }
                </TouchableOpacity>

                <View style={styles.dividerRow}>
                    <View style={styles.dividerLine} />
                    <Text style={styles.dividerText}>ou</Text>
                    <View style={styles.dividerLine} />
                </View>

                <TouchableOpacity
                    style={styles.btnOutline}
<<<<<<< HEAD
                    onPress={() => navigation.navigate('CadastroScreen')}
=======
                    onPress={() => router.push('/cadastro')}
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
                    activeOpacity={0.7}
                >
                    <Text style={styles.btnOutlineText}>Cadastre-se</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
<<<<<<< HEAD
                    onPress={() => navigation.navigate('EsqueciSenhaScreen')}
=======
                    onPress={() => router.push('/esqueci-senha')}
>>>>>>> 51e090d (Atualizações no back end e adição do mobile)
                    activeOpacity={0.7}
                >
                    <Text style={styles.linkText}>Esqueci minha senha</Text>
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
        marginBottom: 16,
    },

    btnOutlineText: {
        color: "#2563EB",
        fontSize: 16,
        fontWeight: "600",
    },

    linkButton: {
        alignItems: "center",
        paddingVertical: 8,
    },

    linkText: {
        color: "#2563EB",
        fontSize: 14,
        fontWeight: "600",
    },
});