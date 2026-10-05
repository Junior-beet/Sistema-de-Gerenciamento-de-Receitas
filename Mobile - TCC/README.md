# Aplicativo mobile

Aplicativo Expo/React Native do Sistema de Gerenciamento Financeiro.

Todos os usuários autenticados podem entrar e consultar as movimentações. Somente usuários com cargo `DIRETOR_FINANCEIRO` podem adicionar receitas e despesas. Contas e categorias usadas nos novos lançamentos são carregadas exclusivamente do usuário autenticado.

## Executar

```bash
npm install
npx expo start
```

## Endereço da API

Copie `.env.example` para `.env.local` e ajuste `EXPO_PUBLIC_API_URL` para o ambiente que será usado:

- Android Emulator: `http://10.0.2.2:8080`
- iOS Simulator: `http://localhost:8080`
- Celular físico: use o IP IPv4 do computador, por exemplo `http://192.168.1.100:8080`

No PowerShell, o IP local pode ser consultado com:

```powershell
Get-NetIPAddress -AddressFamily IPv4 | Where-Object { $_.IPAddress -notlike '127.*' }
```

Depois de criar ou alterar o `.env.local`, reinicie o Expo e recarregue o app. O computador e o celular precisam estar na mesma rede, e a porta `8080` precisa estar liberada no firewall.

Antes de testar o cadastro, inicie o back-end em `Back-end` com `npm start`. O banco MySQL deve estar ativo e as variáveis de `Back-end/.env` devem estar configuradas.

Em builds de produção, configure `EXPO_PUBLIC_API_URL` com uma URL **HTTPS** pública.

## Recuperação de senha

O app usa o deep link `sgr://redefinir-senha`. O e-mail enviado pelo back-end oferece essa opção no aplicativo e um link web como alternativa.

## Validações

```bash
npx expo-doctor
npx expo export --platform android
```
