import { CryptoInfo } from "@/components/crypto-info";
import { CryptoSearch } from "@/components/crypto-search";
import { Suspense } from "react";

interface CoinMarketData {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  market_cap_rank: number;
  fully_diluted_valuation: number | null;
  total_volume: number;
  high_24h: number;
  low_24h: number;
  price_change_24h: number;
  price_change_percentage_24h: number;
  market_cap_change_24h: number;
  market_cap_change_percentage_24h: number;
  circulating_supply: number;
  total_supply: number | null;
  max_supply: number | null;
  ath: number;
  ath_change_percentage: number;
  ath_date: string; // ISO 8601 format
  atl: number;
  atl_change_percentage: number;
  atl_date: string; // ISO 8601 format
  roi: {
    times: number;
    currency: string;
    percentage: number;
  } | null;
  last_updated: string; // ISO 8601 format
}

export default async function Home() {
  // Use CoinMarket interface to type the response from the API
  const url =
    "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false";
  console.log("Fetching URL", url);
  const res = await fetch(
    url,

    { next: { revalidate: 60 } }
  );

  // Parse the response as JSON
  const cryptoList: CoinMarketData[] = await res.json();
  //First five elements of the array
  console.log("Response", cryptoList.slice(0, 5));

  return (
    <div className="flex bg-[#121212] text-white flex-col  items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="text-center max-w-2xl">
        <h1 className="text-3xl font-bold mb-4">Crypto Cloud</h1>
        <p className="text-lg  mb-8 text-gray-300">
          Obtené información relevante al instante sobre la crypto que querés
          investigar
        </p>
      </div>
      <Suspense fallback={<div>Loading...</div>}>
        <CryptoSearch cryptoList={cryptoList} />
      </Suspense>
      <div className="w-full max-w-4xl mt-8">
        <Suspense fallback={<div>Loading...</div>}>
          <CryptoInfo />
        </Suspense>
      </div>
    </div>
  );
}
