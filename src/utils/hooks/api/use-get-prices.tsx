import { CurrencyExt, ForeignAsset } from '@interlay/interbtc-api';
import { Bitcoin } from '@interlay/monetary-js';
import { useEffect } from 'react';
import { useQuery } from 'react-query';
import { useSelector } from 'react-redux';

import { StoreType } from '@/common/types/util.types';
import { PRICES_API } from '@/utils/constants/api';
import { COINGECKO_ID_BY_CURRENCY_TICKER } from '@/utils/constants/currency';

import { useGetCurrencies } from './use-get-currencies';

const getCoingeckoId = (currency: CurrencyExt) => {
  const asForeignAsset = currency as ForeignAsset;
  return asForeignAsset.foreignAsset?.coingeckoId || COINGECKO_ID_BY_CURRENCY_TICKER[currency.ticker];
};

const composeIds = (currencies: CurrencyExt[]): string =>
  currencies.reduce((acc, currency) => {
    const coingeckoId = getCoingeckoId(currency);
    if (!coingeckoId) {
      return acc;
    }

    if (!acc) {
      return coingeckoId;
    }

    return [acc, coingeckoId].join(',');
  }, '');

const composeUrl = (assetsIds: string): string => {
  const url = new URL(PRICES_API.URL);
  url.searchParams.append(PRICES_API.QUERY_PARAMETERS.ASSETS_IDS, assetsIds);

  return url.toString();
};

const getPricesByTicker = (currencies: CurrencyExt[], prices: Prices) =>
  currencies.reduce((acc, currency) => {
    const coingeckoId = getCoingeckoId(currency);
    return { ...acc, [currency.ticker]: prices[coingeckoId] };
  }, {});

const getPrices = async (currencies?: CurrencyExt[]): Promise<Prices | undefined> => {
  if (!currencies) {
    return;
  }

  const allCurrencies = [Bitcoin, ...currencies];
  const assetsIds = composeIds(allCurrencies);
  const url = composeUrl(assetsIds);

  const response = await fetch(url);
  const pricesByCoingeckoId = await response.json();

  return getPricesByTicker(allCurrencies, pricesByCoingeckoId);
};

type Price = {
  usd: number;
};

type Prices = {
  [ticker: string]: Price;
};

// TODO: return UseQueryResult<Prices | undefined, Error> type
const useGetPrices = (): Prices | undefined => {
  const { bridgeLoaded } = useSelector((state: StoreType) => state.general);
  const { data: currencies, isSuccess: isGetCurrenciesSuccess } = useGetCurrencies(bridgeLoaded);
  const { data, error } = useQuery<Prices | undefined, Error>(['prices'], () => getPrices(currencies), {
    enabled: isGetCurrenciesSuccess,
    refetchInterval: 60000
  });

  useEffect(() => {
    if (!error) return;

    console.warn('Unable to fetch prices', error);
  }, [error]);

  return data;
};

export { useGetPrices };
export type { Price, Prices };
