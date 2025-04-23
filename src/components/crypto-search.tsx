"use client";

import type React from "react";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";

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
  ath_date: string;
  atl: number;
  atl_change_percentage: number;
  atl_date: string;
  last_updated: string;
}

interface CryptoSearchProps {
  cryptoList: CoinMarketData[];
}

export function CryptoSearch({ cryptoList }: CryptoSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCryptos, setFilteredCryptos] = useState<CoinMarketData[]>([]);
  const [showResults, setShowResults] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (value.length > 0) {
      const filtered = cryptoList.filter(
        (crypto) =>
          crypto.symbol.toLowerCase().includes(value) ||
          crypto.name.toLowerCase().includes(value)
      );
      setFilteredCryptos(filtered.slice(0, 5));
      setShowResults(true);
    } else {
      setFilteredCryptos([]);
      setShowResults(false);
    }
  };

  const handleSelectCrypto = (cryptoId: string) => {
    router.push(`?crypto=${cryptoId}`);
    setShowResults(false);
  };

  return (
    <div className="w-full max-w-md relative">
      <div className="relative ">
        <Input
          type="text"
          placeholder="Buscar por símbolo (BTC, ETH) o nombre"
          value={searchTerm}
          onChange={handleSearch}
          className="pl-10 h-12"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      </div>

      {showResults && filteredCryptos.length > 0 && (
        <Card className="absolute w-full mt-1 z-10  bg-[#1E1E1E] text-white">
          <CardContent className="p-2">
            <ul className="divide-y">
              {filteredCryptos.map((crypto) => (
                <li key={crypto.id}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start py-2 px-3 h-auto"
                    onClick={() => handleSelectCrypto(crypto.id)}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={crypto.image || "/placeholder.svg"}
                        alt={crypto.name}
                        className="w-6 h-6"
                      />
                      <div>
                        <p className="font-medium">{crypto.name}</p>
                        <p className="text-xs text-muted-foreground uppercase">
                          {crypto.symbol}
                        </p>
                      </div>
                    </div>
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {showResults && filteredCryptos.length === 0 && searchTerm && (
        <Card className="absolute w-full mt-1 z-10">
          <CardContent className="p-4 text-center">
            <p className="text-muted-foreground">
              No se encontraron resultados para "{searchTerm}"
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
