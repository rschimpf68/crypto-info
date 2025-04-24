import { NextRequest, NextResponse } from 'next/server';
import { NewsArticle } from '../news/route';
import { CryptoDetailData } from '../cryptoInfo/route';
import { GET as getCryptoInfo } from '../cryptoInfo/route'; // Importa la función GET de cryptoInfo
import { GET as getNews } from '../news/route'; // Importa la función GET de news

interface CompleteCryptoData {
   cryptoInfo: CryptoDetailData;
   news: NewsArticle[];
}

export async function GET(req: NextRequest) {
   const { searchParams } = new URL(req.url);
   const cryptoId = searchParams.get('crypto') || 'Bitcoin';
   const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
   try {
      // Construye URLs simuladas para pasar a las funciones internas
      const cryptoInfoUrl = new URL(`/api/cryptoInfo?crypto=${cryptoId}`, baseUrl);
      const newsUrl = new URL(`/api/news?q=${cryptoId}`, baseUrl);

      // Llama directamente a las funciones GET de las rutas
      const cryptoInfoResponse = await getCryptoInfo(new NextRequest(cryptoInfoUrl));
      const cryptoData = await cryptoInfoResponse.json();

      const newsResponse = await getNews(new NextRequest(newsUrl));
      const newsData = await newsResponse.json();

      const data: CompleteCryptoData = {
         news: newsData.articles,
         cryptoInfo: cryptoData,

      };

      console.log('Response Data:', data);
      return NextResponse.json(data);
   } catch (error) {
      console.error('Error fetching data:', error);
      return NextResponse.json({ error: 'No se pudo obtener toda la información' }, { status: 500 });
   }
}