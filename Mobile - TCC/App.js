import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from './src/screens/Login';
import CadastroScreen from './src/screens/Cadastro';
import ReceitasScreen from './src/screens/Receitas';
import DespesasScreen from './src/screens/Despesas';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="CadastroScreen" component={CadastroScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ReceitasScreen" component={ReceitasScreen} options={{ title: 'Nova Receita' }} />
        <Stack.Screen name="DespesasScreen" component={DespesasScreen} options={{ title: 'Nova Despesa' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}