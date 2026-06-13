import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { fetchCurrencies } from '../services/api';
import { CurrencyCard } from '../components/CurrencyCard';

export default function HomeScreen({ navigation, route }) {
    const { user } = route.params ?? {};
    const [cryptoData, setCryptoData] = useState([]);
    const [fiatData, setFiatData] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        async function loadData() {
            const data = await fetchCurrencies();
            if (data) {
                const dataArray = Object.values(data);
                setCryptoData(dataArray.filter(item => ['BTC', 'ETH', 'SOL', 'XRP', 'BNB', 'LTC'].includes(item.code)));
                setFiatData(dataArray.filter(item => ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD'].includes(item.code)));
            }
        }
        loadData();
    }, []);

    const filterBySearch = (items) => {
        if (!search) return items;
        const q = search.toUpperCase().replace('-', '');
        return items.filter(item =>
            item.code.includes(q) ||
            item.codein.includes(q) ||
            item.name.toUpperCase().includes(search.toUpperCase())
        );
    };

    const filteredCrypto = filterBySearch(cryptoData);
    const filteredFiat = filterBySearch(fiatData);

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>MyCurrency</Text>
                    <TouchableOpacity>
                        <Ionicons name="notifications-outline" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={18} color="#8A8F9E" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Buscar Moeda (ex: EURBRL)"
                        placeholderTextColor="#8A8F9E"
                        value={search}
                        onChangeText={setSearch}
                        autoCapitalize="characters"
                    />
                </View>

                <Text style={styles.mainTitle}>Principais Cotacoes</Text>

                {/* Seção Crypto */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Crypto</Text>
                    <Text style={styles.sectionBadge}>24h</Text>
                </View>
                <View style={styles.grid}>
                    {filteredCrypto.map(coin => (
                        <CurrencyCard
                            key={coin.code}
                            data={coin}
                            onPress={() => navigation.navigate('CurrencyDetail', { coin })}
                        />
                    ))}
                </View>

                {/* Seção Fiat */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Fiat</Text>
                    <Text style={styles.sectionBadge}>24h</Text>
                </View>
                <View style={styles.grid}>
                    {filteredFiat.map(coin => (
                        <CurrencyCard
                            key={coin.code}
                            data={coin}
                            onPress={() => navigation.navigate('CurrencyDetail', { coin })}
                        />
                    ))}
                </View>

                <View style={{ height: 16 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: '#111424' },
    container: { flex: 1, backgroundColor: '#111424' },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingTop: 16,
        paddingBottom: 12,
    },
    headerTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1E2235',
        borderRadius: 12,
        marginHorizontal: 16,
        marginBottom: 20,
        paddingHorizontal: 12,
        height: 44,
    },
    searchIcon: { marginRight: 8 },
    searchInput: { flex: 1, color: '#FFFFFF', fontSize: 14 },
    mainTitle: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginLeft: 16, marginBottom: 16 },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    sectionTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
    sectionBadge: { color: '#4A8FD4', fontSize: 13, fontWeight: '600' },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
});