import { ScrollView, StyleSheet, Text, TouchableOpacity, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle, Defs, LinearGradient, Path, Stop, Text as SvgText } from 'react-native-svg';

const CHART_H = 180;
const CHART_PAD_TOP = 24;
const CHART_PAD_BOTTOM = 8;

function generateChartPoints(high, low, bid, pctChange, width) {
    const h = parseFloat(high);
    const l = parseFloat(low);
    const b = parseFloat(bid);
    const isNeg = parseFloat(pctChange) < 0;
    const chartH = CHART_H - CHART_PAD_TOP - CHART_PAD_BOTTOM;
    const range = h - l || 0.0001;
    const n = 50;
    const seed = Math.round((h + l) * 97) % 99991;
    const drawW = width - 6;

    const priceToY = (p) =>
        CHART_PAD_TOP + chartH * (1 - (Math.max(l, Math.min(h, p)) - l) / range);

    let price = isNeg ? h * 0.9995 : l * 1.0005;
    const pts = [];
    for (let i = 0; i < n; i++) {
        const t = i / (n - 1);
        const r = ((seed * 9301 + 49297 * (i + 1)) % 233280) / 233280;
        const noise = (r - 0.5) * range * 0.35;
        const target = (isNeg ? h : l) + (b - (isNeg ? h : l)) * t;
        price = price * 0.65 + (target + noise) * 0.35;
        price = Math.max(l, Math.min(h, price));
        pts.push({ x: t * drawW + 3, y: priceToY(price) });
    }
    pts[n - 1] = { x: drawW + 3, y: priceToY(b) };
    return pts;
}

function buildLinePath(pts) {
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
        const cpx = ((pts[i - 1].x + pts[i].x) / 2).toFixed(1);
        d += ` C ${cpx} ${pts[i - 1].y.toFixed(1)}, ${cpx} ${pts[i].y.toFixed(1)}, ${pts[i].x.toFixed(1)} ${pts[i].y.toFixed(1)}`;
    }
    return d;
}

function fmtMainPrice(bid) {
    const v = parseFloat(bid);
    if (v >= 1000) return `R$${Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    if (v >= 1) return `R$${v.toFixed(4)}`;
    return `R$${v.toFixed(5)}`;
}

function fmtDetailPrice(val) {
    const v = Math.abs(parseFloat(val));
    if (v >= 1000) return `R$ ${v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`;
    if (v >= 1) return `R$ ${v.toFixed(5)}`;
    return `R$ ${v.toFixed(7)}`;
}

function fmtVarBid(varBid) {
    const v = parseFloat(varBid);
    const abs = Math.abs(v);
    const sign = v >= 0 ? '+' : '-';
    const fmt = abs >= 1000
        ? abs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, '.')
        : abs >= 1 ? abs.toFixed(5)
        : abs.toFixed(7);
    return `${sign}R$${fmt}`;
}

function formatDate(createDate) {
    if (!createDate) return '';
    const [date, time] = createDate.split(' ');
    const [y, m, d] = date.split('-');
    return `${d}/${m}/${y}, ${time}`;
}

function DetailRow({ label, value, valueColor }) {
    return (
        <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={[styles.detailValue, valueColor ? { color: valueColor } : null]}>{value}</Text>
        </View>
    );
}

export default function CurrencyDetailScreen({ navigation, route }) {
    const { coin } = route.params;
    const { width } = useWindowDimensions();
    const chartWidth = width - 64; // 16 marginHorizontal + 16 padding em cada lado

    const isPositive = parseFloat(coin.pctChange) >= 0;
    const lineColor = isPositive ? '#4A8FD4' : '#E74C3C';
    const varColor = isPositive ? '#2ECC71' : '#E74C3C';

    const pts = generateChartPoints(coin.high, coin.low, coin.bid, coin.pctChange, chartWidth);
    const linePath = buildLinePath(pts);
    const first = pts[0];
    const last = pts[pts.length - 1];
    const areaPath = `${linePath} L ${last.x} ${CHART_H} L ${first.x} ${CHART_H} Z`;

    return (
        <SafeAreaView style={styles.safe}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={26} color="#4A8FD4" />
                    </TouchableOpacity>
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerTitle}>{coin.code}/{coin.codein}</Text>
                        <Text style={styles.headerSub}>({coin.name})</Text>
                    </View>
                    <View style={{ width: 42 }} />
                </View>

                {/* Chart Card */}
                <View style={styles.card}>
                    <Text style={styles.mainPrice} adjustsFontSizeToFit numberOfLines={1}>
                        {coin.code}1={fmtMainPrice(coin.bid)}
                    </Text>

                    <TouchableOpacity style={styles.periodBtn}>
                        <Text style={styles.periodText}>24h </Text>
                        <Ionicons name="chevron-down" size={13} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View style={{ marginTop: 12 }}>
                        <Svg width={chartWidth} height={CHART_H}>
                            <Defs>
                                <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                                    <Stop offset="0" stopColor={lineColor} stopOpacity="0.35" />
                                    <Stop offset="1" stopColor={lineColor} stopOpacity="0" />
                                </LinearGradient>
                            </Defs>
                            <Path d={areaPath} fill="url(#grad)" />
                            <Path d={linePath} fill="none" stroke={lineColor} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                            <Circle cx={first.x} cy={first.y} r={5} fill="#4A8FD4" />
                            <Circle cx={last.x} cy={last.y} r={5} fill={lineColor} />
                            <SvgText x={first.x + 8} y={first.y - 8} fill="#AAAAAA" fontSize="11">
                                {parseFloat(coin.high).toFixed(5)}
                            </SvgText>
                            <SvgText x={last.x - 68} y={last.y + 16} fill="#AAAAAA" fontSize="11">
                                {parseFloat(coin.low).toFixed(5)}
                            </SvgText>
                        </Svg>
                    </View>

                    {/* Variação Bar */}
                    <View style={[styles.varBar, { backgroundColor: isPositive ? '#1A3D28' : '#3D1A1A' }]}>
                        <Text style={styles.varLabel}>Variação</Text>
                        <Text style={[styles.varValue, { color: varColor }]}>
                            {isPositive ? '+' : ''}{parseFloat(coin.pctChange).toFixed(2)}%
                            {'  '}{fmtVarBid(coin.varBid)}
                        </Text>
                    </View>
                </View>

                {/* Details Card */}
                <View style={styles.card}>
                    <DetailRow label="Alta (high):" value={fmtDetailPrice(coin.high)} />
                    <DetailRow label="Baixa (low):" value={fmtDetailPrice(coin.low)} />
                    <DetailRow label="Variacao (varBid):" value={fmtVarBid(coin.varBid)} valueColor={varColor} />
                    <DetailRow label="Variacao % (pctChange):" value={`${isPositive ? '+' : ''}${parseFloat(coin.pctChange).toFixed(2)}%`} valueColor={varColor} />
                    <DetailRow label="Compra (bid):" value={fmtDetailPrice(coin.bid)} />
                    <DetailRow label="Venda (ask):" value={fmtDetailPrice(coin.ask)} />
                    <View style={styles.detailRowDouble}>
                        <View>
                            <Text style={styles.detailLabel}>Ultima Atualizacao:</Text>
                            <Text style={styles.detailValue}>{formatDate(coin.create_date)}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={styles.detailLabel}>Timestamp:</Text>
                            <Text style={styles.detailValue}>{coin.timestamp}</Text>
                        </View>
                    </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.btnRow}>
                    <TouchableOpacity style={styles.btnPrimary}>
                        <Text style={styles.btnPrimaryTxt}>Adicionar aos Favoritos</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnSecondary}>
                        <Text style={styles.btnSecondaryTxt}>Criar Alerta</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ height: 24 }} />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safe: { flex: 1, backgroundColor: '#111424' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 8,
        paddingVertical: 12,
    },
    backBtn: { width: 42, alignItems: 'center' },
    headerCenter: { flex: 1, alignItems: 'center' },
    headerTitle: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
    headerSub: { color: '#8A8F9E', fontSize: 12, marginTop: 2 },
    card: {
        backgroundColor: '#1E2235',
        borderRadius: 16,
        padding: 16,
        marginHorizontal: 16,
        marginBottom: 16,
    },
    mainPrice: {
        color: '#FFFFFF',
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    periodBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#2A2F45',
        alignSelf: 'flex-start',
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 4,
    },
    periodText: { color: '#FFFFFF', fontSize: 13, fontWeight: '600' },
    varBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 8,
        paddingHorizontal: 14,
        paddingVertical: 12,
        marginTop: 12,
    },
    varLabel: { color: '#FFFFFF', fontSize: 14, fontWeight: '600' },
    varValue: { fontSize: 14, fontWeight: '600' },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#2A2F45',
    },
    detailRowDouble: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10,
    },
    detailLabel: { color: '#8A8F9E', fontSize: 13 },
    detailValue: { color: '#FFFFFF', fontSize: 13, fontWeight: '500' },
    btnRow: {
        flexDirection: 'row',
        gap: 12,
        marginHorizontal: 16,
        marginTop: 4,
    },
    btnPrimary: {
        flex: 1,
        backgroundColor: '#1E2D4A',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#2A4A7F', 
    },
    btnPrimaryTxt: { color: '#4A8FD4', fontSize: 14, fontWeight: '600' },
    btnSecondary: {
        flex: 1,
        backgroundColor: '#2A2F45',
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: 'center',
    },
    btnSecondaryTxt: { color: '#8A8F9E', fontSize: 14, fontWeight: '600' },
});
