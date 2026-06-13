import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './screens/LoginScreen';
import HomeScreen from './screens/HomeScreen';
import TabNavigator from './navigation/TabNavigator';
import CurrencyDetailScreen from './screens/CurrencyDetailScreen';

const Stack = createNativeStackNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Home" component={TabNavigator} />
                <Stack.Screen name="CurrencyDetail" component={CurrencyDetailScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}