import { NextRequest, NextResponse } from 'next/server';

export interface NewsArticle {
   source: {
      id: string | null;
      name: string;
   };
   author: string | null;
   title: string;
   description: string;
   url: string;
   urlToImage: string;
   publishedAt: string;
   content: string;
}

export async function GET(req: NextRequest) {
   const { searchParams } = new URL(req.url);
   const query = searchParams.get('q') || 'Bitcoin';

   const apiKey = process.env.NEWS_API_KEY;
   if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
   }

   const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&domains=coindesk.com,cointelegraph.com,decrypt.co,u.today,cryptotimes.io,beincrypto.com,news.bitcoin.com,crypto.news,cryptopotato.com,coincodex.com,cryptoslate.com,thedefiant.io,blockworks.co,cryptobriefing.com,cryptonews.com&searchIn=title,description&sortBy=relevancy&language=en&pageSize=5&apiKey=${apiKey}`;
   console.log('Fetching URL:', url);

   try {
      const response = await fetch(url);
      const data = await response.json();
      console.log('Response Data:', data);
      return NextResponse.json(data);
   } catch (error) {
      return NextResponse.json({ error: 'Error fetching news' }, { status: 500 });
   }
}