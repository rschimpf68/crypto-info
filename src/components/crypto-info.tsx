"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowUp,
  ArrowDown,
  TrendingUp,
  DollarSign,
  BarChart3,
  Clock,
} from "lucide-react";
import { CryptoDetailData } from "@/app/api/cryptoInfo/route";
import { NewsArticle } from "@/app/api/news/route";

export function CryptoInfo() {
  const searchParams = useSearchParams();
  const cryptoId = searchParams.get("crypto");
  const [cryptoData, setCryptoData] = useState<CryptoDetailData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [newsLoading, setNewsLoading] = useState(false);

  const fetchCryptoData = async () => {
    if (!cryptoId) return;

    setLoading(true);
    setNewsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/cryptoInfo?crypto=${cryptoId}`);
      if (!res.ok) {
        throw new Error("No se pudo obtener la información de la criptomoneda");
      }

      const data = await res.json();
      setCryptoData(data);

      try {
        const newsRes = await fetch(`/api/news?q=${data.name}`);
        if (newsRes.ok) {
          const newsData = await newsRes.json();
          console.group("News Data", newsData);
          setNewsArticles(newsData.articles?.slice(0, 5) || []);
        }
      } catch (newsErr) {
        console.error("Error fetching news:", newsErr);
      } finally {
        setNewsLoading(false);
      }
    } catch (err) {
      setError(
        "Ocurrió un error al obtener los datos. Intenta nuevamente más tarde."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCryptoData();
  }, [cryptoId]);

  if (!cryptoId) {
    return <></>;
  }

  if (loading) {
    return <CryptoInfoSkeleton />;
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardContent className="p-8 text-center">
          <p className="text-red-500">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!cryptoData) return null;

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: currency,
      maximumFractionDigits: value < 1 ? 8 : 2,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("es-AR").format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("es-AR");
  };

  return (
    <Card className="w-full bg-[#1E1E1E] text-white ">
      <CardHeader className="flex  flex-row items-center gap-4">
        <img
          src={cryptoData.image.large || "/placeholder.svg"}
          alt={cryptoData.name}
          className="w-12 h-12"
        />
        <div>
          <CardTitle className="text-2xl">
            {cryptoData.name} ({cryptoData.symbol.toUpperCase()})
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Precio actual:</span>
              <span className="text-xl font-bold">
                {formatCurrency(
                  cryptoData.market_data.current_price.usd,
                  "USD"
                )}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Precio en Pesos Argentinos:
              </span>
              <span className="text-xl font-bold">
                {formatCurrency(
                  cryptoData.market_data.current_price.ars,
                  "ARS"
                )}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-muted-foreground" />
                <span className="text-muted-foreground">Cambio de precio:</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="flex items-center gap-1">
                  <span>24h:</span>
                  <span
                    className={
                      cryptoData.market_data.price_change_percentage_24h >= 0
                        ? "text-green-500 flex items-center"
                        : "text-red-500 flex items-center"
                    }
                  >
                    {cryptoData.market_data.price_change_percentage_24h >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(
                      cryptoData.market_data.price_change_percentage_24h
                    ).toFixed(2)}
                    %
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>7d:</span>
                  <span
                    className={
                      cryptoData.market_data.price_change_percentage_7d >= 0
                        ? "text-green-500 flex items-center"
                        : "text-red-500 flex items-center"
                    }
                  >
                    {cryptoData.market_data.price_change_percentage_7d >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(
                      cryptoData.market_data.price_change_percentage_7d
                    ).toFixed(2)}
                    %
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span>30d:</span>
                  <span
                    className={
                      cryptoData.market_data.price_change_percentage_30d >= 0
                        ? "text-green-500 flex items-center"
                        : "text-red-500 flex items-center"
                    }
                  >
                    {cryptoData.market_data.price_change_percentage_30d >= 0 ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {Math.abs(
                      cryptoData.market_data.price_change_percentage_30d
                    ).toFixed(2)}
                    %
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Cap. de mercado:</span>
              <span className="font-medium">
                {formatCurrency(cryptoData.market_data.market_cap.usd, "USD")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">Volumen (24h):</span>
              <span className="font-medium">
                {formatCurrency(cryptoData.market_data.total_volume.usd, "USD")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <span className="text-muted-foreground">
                Última actualización:
              </span>
              <span className="font-medium">
                {formatDate(cryptoData.last_updated)}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-lg font-medium mb-2">Suministro</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Circulante</p>
              <p className="font-medium">
                {formatNumber(cryptoData.market_data.circulating_supply)}
              </p>
            </div>
            {cryptoData.market_data.total_supply && (
              <div>
                <p className="text-sm text-muted-foreground">Total</p>
                <p className="font-medium">
                  {formatNumber(cryptoData.market_data.total_supply)}
                </p>
              </div>
            )}
            {cryptoData.market_data.max_supply && (
              <div>
                <p className="text-sm text-muted-foreground">Máximo</p>
                <p className="font-medium">
                  {formatNumber(cryptoData.market_data.max_supply)}
                </p>
              </div>
            )}
          </div>
        </div>

        {cryptoData.description?.en && (
          <div className="pt-4 border-t ">
            <h3 className="text-xl font-medium mb-2">
              Acerca de {cryptoData.name}
            </h3>
            <div
              className="text-base text-gray-400 prose max-w-none"
              dangerouslySetInnerHTML={{ __html: cryptoData.description.en }}
            />
          </div>
        )}
        {newsArticles.length > 0 && (
          <div className="pt-4 border-t   ">
            <h3 className="text-lg font-medium mb-4">Noticias relacionadas</h3>
            <div className="space-y-4">
              {newsArticles.map((article, index) => (
                <a
                  key={index}
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Card className="overflow-hidden hover:bg-[#2E2E2E] text-white bg-[#1E1E1E]  transition-colors">
                    <CardContent className="p-4 grid md:grid-cols-[1fr_3fr] gap-4">
                      {article.urlToImage ? (
                        <div className="aspect-video md:aspect-square overflow-hidden rounded-md">
                          <img
                            src={article.urlToImage || "/placeholder.svg"}
                            alt={article.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-video md:aspect-square bg-muted rounded-md flex items-center justify-center">
                          <span className="text-muted-foreground">
                            Sin imagen
                          </span>
                        </div>
                      )}
                      <div className="space-y-2">
                        <h4 className="font-medium line-clamp-2 text-xl">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-400 line-clamp-2">
                          {article.description}
                        </p>
                        <div className="flex items-center text-gray-400 text-base justify-between">
                          <span>{article.source.name}</span>
                          <span>
                            {new Date(article.publishedAt).toLocaleDateString(
                              "es-AR"
                            )}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </a>
              ))}
            </div>
          </div>
        )}

        {newsLoading && (
          <div className="pt-4 border-t">
            <h3 className="text-lg font-medium mb-4">Noticias relacionadas</h3>
            <div className="space-y-4">
              {[...Array(3)].map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4 grid md:grid-cols-[1fr_3fr] gap-4">
                    <Skeleton className="aspect-video md:aspect-square rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-full" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <div className="flex justify-between">
                        <Skeleton className="h-3 w-20" />
                        <Skeleton className="h-3 w-20" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function CryptoInfoSkeleton() {
  return (
    <Card className="w-full bg-[#1E1E1E] text-white ">
      <CardHeader className="flex flex-row items-center gap-4">
        <Skeleton className="w-12 h-12 rounded-full" />
        <div>
          <Skeleton className="h-8 w-48" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </div>
        </div>
        <Skeleton className="h-40 w-full" />
      </CardContent>
    </Card>
  );
}
