import { NextRequest, NextResponse } from 'next/server';

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