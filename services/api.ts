const BASE_URL = 'https://economia.awesomeapi.com.br/json/last';

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutos
let cache: { data: unknown; timestamp: number } | null = null;

export const fetchCurrencies = async () => {
    // 6 Crypto e 6 Fiat
    const pairs = 'BTC-BRL,ETH-BRL,SOL-BRL,XRP-BRL,BNB-BRL,LTC-BRL,USD-BRL,EUR-BRL,GBP-BRL,JPY-BRL,CAD-BRL,AUD-BRL';

    // Retorna do cache se ainda estiver válido
    if (cache && Date.now() - cache.timestamp < CACHE_TTL_MS) {
        return cache.data;
    }

    try {
        const response = await fetch(`${BASE_URL}/${pairs}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36',
                'Accept': 'application/json',
            },
        });
        const data = await response.json();
        cache = { data, timestamp: Date.now() }; // armazena no cache
        return data;
    } catch (error) {
        console.error('Erro ao buscar cotações:', error);
        return null;
    }
};