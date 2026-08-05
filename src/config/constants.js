 export const CARGOS = [
  { value: 'CEO', label: 'CEO' },
  { value: 'DIRETOR_FINANCEIRO', label: 'Departamento Financeiro' },
  { value: 'GERENTE', label: 'Gerente' },
]

export const STORAGE_KEYS = {
  USUARIOS: 'sgr_usuarios',
  TOKEN: 'sgr_token',
  RESET_TOKEN: 'sgr_reset_token',
}

export const APP_NAME = 'SGR'

export const JWT_SECRET = 'sistema_financeiro_tcc_senai_2026_chave_ultra_secreta'

export const API_URL = 'http://localhost:8080'

export const ROTAS_PUBLICAS = ['/', '/login', '/cadastro', '/saiba-mais', '/esqueci-senha', '/redefinir-senha'];