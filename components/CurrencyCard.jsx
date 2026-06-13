import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Sparkline } from './Sparkline';

const CRYPTO_ICONS = {
    BTC: 'https://assets.coincap.io/assets/icons/btc@2x.png',
    ETH: 'https://assets.coincap.io/assets/icons/eth@2x.png',
    SOL: 'https://assets.coincap.io/assets/icons/sol@2x.png',
    XRP: 'https://assets.coincap.io/assets/icons/xrp@2x.png',
    BNB: 'https://assets.coincap.io/assets/icons/bnb@2x.png',
    LTC: 'https://assets.coincap.io/assets/icons/ltc@2x.png',
};

const FIAT_FLAGS = {
    USD: 'https://flagcdn.com/w40/us.png',
    EUR: 'https://flagcdn.com/w40/eu.png',
    GBP: 'https://flagcdn.com/w40/gb.png',
    JPY: 'https://flagcdn.com/w40/jp.png',
    CAD: 'https://flagcdn.com/w40/ca.png',
    AUD: 'https://flagcdn.com/w40/au.png',
};

function formatPrice(bid) {
    const v = parseFloat(bid);
    // Preços grandes (crypto): adiciona separador de milhar
    if (v >= 1000) return `R$ ${Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    // Preços médios (fiat): duas casas decimais
    if (v >= 1) return `R$ ${v.toFixed(2)}`;
    // Preços pequenos (JPY): mais casas para não exibir zero
    return `R$ ${v.toFixed(5)}`;
}

export function CurrencyCard({ data, onPress }) {
    const isPositive = parseFloat(data.pctChange) >= 0;
    const color = isPositive ? '#2ECC71' : '#E74C3C';
    // Busca o ícone: primeiro tenta crypto, depois fiat
    const iconUri = CRYPTO_ICONS[data.code] ?? FIAT_FLAGS[data.code];

    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
            {/* Linha superior: ícone + código */}
            <View style={styles.header}>
                <View style={styles.iconWrapper}>
                    {iconUri && (
                        <Image source={{ uri: iconUri }} style={styles.icon} resizeMode="cover" />
                    )}
                </View>
                <Text style={styles.code}>{data.code}</Text>
            </View>

            {/* Nome da moeda (só a parte antes do "/") */}
            <Text style={styles.name} numberOfLines={1}>{data.name.split('/')[0]}</Text>

            {/* Preço com ajuste automático de fonte se não couber */}
            <Text style={styles.price} adjustsFontSizeToFit numberOfLines={1} minimumFontScale={0.6}>
                {formatPrice(data.bid)}
            </Text>

            {/* Rodapé: variação + sparkline */}
            <View style={styles.footer}>
                <Text style={[styles.percentage, { color }]}>
                    {isPositive ? '+' : ''}{parseFloat(data.pctChange).toFixed(2)}%
                </Text>
                <Sparkline code={data.code} pctChange={data.pctChange} color={color} />
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1E2235',
        borderRadius: 16,
        padding: 14,
        width: '48%',
        marginBottom: 16,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    iconWrapper: {
        width: 28,
        height: 28,
        borderRadius: 14,
        overflow: 'hidden',
        backgroundColor: '#2A2F45',
    },
    icon: {
        width: 28,
        height: 28,
    },
    code: {
        color: '#FFFFFF',
        fontSize: 15,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    name: {
        color: '#8A8F9E',
        fontSize: 11,
        marginBottom: 8,
    },
    price: {
        color: '#FFFFFF',
        fontSize: 17,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    percentage: {
        fontSize: 13,
        fontWeight: '600',
    },
});