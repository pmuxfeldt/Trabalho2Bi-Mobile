import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function TabNavigator({ route }) {
    const params = route.params ?? {};

    return (
        <Tab.Navigator
            screenOptions={({ route: tabRoute }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#161B27',
                    borderTopColor: '#1E2431',
                    height: 64,
                    paddingBottom: 8,
                },
                tabBarActiveTintColor: '#4A8FD4',
                tabBarInactiveTintColor: '#666',
                tabBarIcon: ({ color, size }) => {
                    // Referência de ícones: https://icons.expo.fyi
                    const icons = { Home: 'home', Perfil: 'person-circle' };
                    return <Ionicons name={icons[tabRoute.name]} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen name="HomeTab" component={HomeScreen} initialParams={params} options={{ title: 'Home' }} />
            <Tab.Screen name="Perfil" component={ProfileScreen} initialParams={params} />
        </Tab.Navigator>
    );
}