import { NextRequest, NextResponse } from 'next/server';
export interface CryptoDetailData {
   id: string;
   symbol: string;
   name: string;
   image: {
      large: string;
   };
   market_data: {
      current_price: {
         usd: number;
         ars: number;
      };
      price_change_percentage_24h: number;
      price_change_percentage_7d: number;
      price_change_percentage_30d: number;
      market_cap: {
         usd: number;
      };
      total_volume: {
         usd: number;
      };
      circulating_supply: number;
      total_supply: number;
      max_supply: number;
   };
   description: {
      en: string;
   };
   last_updated: string;
}

export async function GET(req: NextRequest) {
   const { searchParams } = new URL(req.url);
   const cryptoId = searchParams.get('q') || 'Bitcoin';
   console.log(cryptoId);



   const url = `https://api.coingecko.com/api/v3/coins/${encodeURIComponent(cryptoId)}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`;

   try {
      const response = await fetch(url);
      const data = await response.json();
      return NextResponse.json(data);
   } catch (error) {
      return NextResponse.json({ error: 'Error fetching news' }, { status: 500 });
   }
}