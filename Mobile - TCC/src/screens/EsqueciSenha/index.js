import { router } from 'expo-router';
import { useState } from 'react';
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { apiRequest } from '../../services/api';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function EsqueciSenhaScreen() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(null);

    async function handleRecuperacao() {
        const emailLimpo = email.trim();
        setErro(null);
        setSucesso(null);

        if (!EMAIL_REGEX.test(emailLimpo)) {
            setErro('Informe um e-mail válido.');
            return;
        }

        setLoading(true);

        try {
            const data = await apiRequest('/senha/recuperar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailLimpo }),
            });

            setSucesso(data.mensagem || 'Se o e-mail estiver cadastrado, você receberá as instruções em breve.');
        } catch (error) {
            setErro(error.message || 'Não foi possível solicitar a recuperação.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backText}>← Voltar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Recuperar senha</Text>
                <Text style={styles.subtitle}>
                    Informe seu e-mail. Se ele estiver cadastrado, você receberá um link para redefinir a senha.
                </Text>

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
                        editable={!loading}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.btnPrimary, loading && styles.btnDisabled]}
                    onPress={handleRecuperacao}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.btnPrimaryText}>Enviar instruções</Text>
                    )}
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
        paddingTop: 24,
        paddingBottom: 32,
    },
    backButton: {
        alignSelf: 'flex-start',
        paddingVertical: 8,
        marginBottom: 24,
    },
    backText: {
        color: '#2563EB',
        fontSize: 15,
        fontWeight: '600',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 15,
        lineHeight: 22,
        color: '#64748B',
        marginBottom: 24,
    },
    alertErro: {
        backgroundColor: '#FEF2F2',
        borderWidth: 1,
        borderColor: '#FECACA',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    alertErroText: {
        color: '#DC2626',
        fontSize: 14,
    },
    alertSucesso: {
        backgroundColor: '#F0FDF4',
        borderWidth: 1,
        borderColor: '#BBF7D0',
        borderRadius: 8,
        padding: 12,
        marginBottom: 16,
    },
    alertSucessoText: {
        color: '#16A34A',
        fontSize: 14,
        lineHeight: 20,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#0F172A',
        marginBottom: 6,
    },
    input: {
        height: 48,
        backgroundColor: '#FFFFFF',
        borderRadius: 8,
        paddingHorizontal: 14,
        fontSize: 15,
        color: '#0F172A',
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },
    btnPrimary: {
        height: 52,
        backgroundColor: '#2563EB',
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 8,
    },
    btnDisabled: {
        opacity: 0.7,
    },
    btnPrimaryText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
