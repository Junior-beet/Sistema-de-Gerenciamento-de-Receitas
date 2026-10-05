import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_TIMEOUT_MS = 15000;
const DEFAULT_API_PORT = 8080;

function getDevelopmentHost() {
    const hostUri = Constants.expoConfig?.hostUri;
    const host = hostUri?.split(':')[0];

    if (host) {
        return host;
    }

    return Platform.OS === 'android' ? '10.0.2.2' : 'localhost';
}

function normalizeApiUrl(value) {
    try {
        const parsedUrl = new URL(value);
        const isSupportedProtocol = ['http:', 'https:'].includes(parsedUrl.protocol);

        if (!isSupportedProtocol) {
            throw new Error('Protocolo não suportado');
        }

        return value.replace(/\/+$/, '');
    } catch {
        if (__DEV__) {
            console.warn(`[API] EXPO_PUBLIC_API_URL inválida: ${value}`);
        }

        return null;
    }
}

function getApiUrl() {
    const configuredUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

    if (configuredUrl) {
        const normalizedUrl = normalizeApiUrl(configuredUrl);

        if (normalizedUrl) {
            return normalizedUrl;
        }
    }

    return `http://${getDevelopmentHost()}:${DEFAULT_API_PORT}`;
}

export const API_URL = getApiUrl();

export async function apiRequest(path, options = {}) {
    const {
        timeout = DEFAULT_TIMEOUT_MS,
        ...fetchOptions
    } = options;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(`${API_URL}${path}`, {
            ...fetchOptions,
            signal: controller.signal,
        });
        const rawBody = await response.text();
        let data = {};

        if (rawBody) {
            try {
                data = JSON.parse(rawBody);
            } catch {
                data = { mensagem: rawBody };
            }
        }

        if (!response.ok) {
            const error = new Error(
                data?.mensagem || `Não foi possível concluir a solicitação (${response.status}).`,
            );
            error.status = response.status;
            error.data = data;
            throw error;
        }

        return data;
    } catch (error) {
        if (error.status) {
            throw error;
        }

        if (__DEV__) {
            console.error(`[API] Falha ao acessar ${API_URL}:`, error);
        }

        if (error.name === 'AbortError') {
            throw new Error(`A conexão com ${API_URL} demorou demais. Verifique a rede e tente novamente.`);
        }

        throw new Error(
            `Não foi possível conectar à API em ${API_URL}. Confirme que o back-end está rodando e que o dispositivo está na mesma rede.`,
        );
    } finally {
        clearTimeout(timeoutId);
    }
}
