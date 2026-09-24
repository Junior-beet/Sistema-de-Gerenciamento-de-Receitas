import { router, useLocalSearchParams } from 'expo-router';
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

export default function RedefinirSenhaScreen() {
    const { token: tokenParam } = useLocalSearchParams();
    const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam;
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const [loading, setLoading] = useState(false);
    const [erro, setErro] = useState(null);
    const [sucesso, setSucesso] = useState(null);

    async function handleRedefinir() {
        setErro(null);
        setSucesso(null);

        if (!token) {
            setErro('Link de recuperação inválido ou expirado.');
            return;
        }
        if (novaSenha.length < 8) {
            setErro('A nova senha deve ter ao menos 8 caracteres.');
            return;
        }
        if (novaSenha !== confirmarSenha) {
            setErro('A confirmação não corresponde à nova senha.');
            return;
        }

        setLoading(true);

        try {
            const data = await apiRequest('/senha/redefinir', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    token,
                    nova_senha: novaSenha,
                    confirmar_senha: confirmarSenha,
                }),
            });

            setSucesso(data.mensagem || 'Senha redefinida com sucesso.');
        } catch (error) {
            setErro(error.message || 'Não foi possível redefinir a senha.');
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

                <Text style={styles.title}>Criar nova senha</Text>
                <Text style={styles.subtitle}>Digite uma nova senha para acessar o sistema.</Text>

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
                    <Text style={styles.label}>Nova senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Mínimo de 8 caracteres"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        maxLength={255}
                        editable={!loading}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirmar nova senha</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Repita a nova senha"
                        placeholderTextColor="#9CA3AF"
                        secureTextEntry
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        maxLength={255}
                        editable={!loading}
                    />
                </View>

                <TouchableOpacity
                    style={[styles.btnPrimary, loading && styles.btnDisabled]}
                    onPress={handleRedefinir}
                    activeOpacity={0.8}
                    disabled={loading}
                >
                    {loading ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.btnPrimaryText}>Redefinir senha</Text>
                    )}
                </TouchableOpacity>

                {sucesso && (
                    <TouchableOpacity
                        style={styles.backToLogin}
                        onPress={() => router.replace('/')}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backToLoginText}>Voltar para o login</Text>
                    </TouchableOpacity>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
    container: { flexGrow: 1, paddingHorizontal: 24, paddingTop: 24, paddingBottom: 32 },
    backButton: { alignSelf: 'flex-start', paddingVertical: 8, marginBottom: 24 },
    backText: { color: '#2563EB', fontSize: 15, fontWeight: '600' },
    title: { fontSize: 28, fontWeight: '700', color: '#0F172A', marginBottom: 6 },
    subtitle: { fontSize: 15, lineHeight: 22, color: '#64748B', marginBottom: 24 },
    alertErro: { backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 8, padding: 12, marginBottom: 16 },
    alertErroText: { color: '#DC2626', fontSize: 14 },
    alertSucesso: { backgroundColor: '#F0FDF4', borderWidth: 1, borderColor: '#BBF7D0', borderRadius: 8, padding: 12, marginBottom: 16 },
    alertSucessoText: { color: '#16A34A', fontSize: 14, lineHeight: 20 },
    inputGroup: { marginBottom: 16 },
    label: { fontSize: 14, fontWeight: '600', color: '#0F172A', marginBottom: 6 },
    input: { height: 48, backgroundColor: '#FFFFFF', borderRadius: 8, paddingHorizontal: 14, fontSize: 15, color: '#0F172A', borderWidth: 1, borderColor: '#CBD5E1' },
    btnPrimary: { height: 52, backgroundColor: '#2563EB', borderRadius: 8, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
    btnDisabled: { opacity: 0.7 },
    btnPrimaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
    backToLogin: { alignItems: 'center', paddingVertical: 14, marginTop: 8 },
    backToLoginText: { color: '#2563EB', fontSize: 14, fontWeight: '600' },
});
