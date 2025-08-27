"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import WeatherCard from "@/components/WeatherCard";
import { ForecastResponse } from "@/components/types";
import { useTheme } from "@/components/ThemeProvider";
import { getWeatherData } from "@/services/weatherApiService";



export default function CityDetailPage() {
  const params = useParams();
  const router = useRouter();
  const cityName = Array.isArray(params?.name) ? params.name[0] : params?.name || "";
  const [forecast, setForecast] = useState<ForecastResponse | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (!cityName) return;
    const fetchForecast = async () => {
      try {
        // const res = await fetch(
        //   `https://api.openweathermap.org/data/2.5/forecast?q=${
        //     cityName
        //   }&appid=${API_KEY}&units=metric`
        // );
        const data: ForecastResponse = await getWeatherData(cityName);
        if (data.cod === "200") setForecast(data);
        else setForecast(null);
      } catch (err) {
        console.error(err);
        setForecast(null);
      }
    };
    fetchForecast();
  }, [cityName]);

  const toggleFavorite = (cityName: string) => {
    let updated: string[] = [];
    if (favorites.includes(cityName)) updated = favorites.filter((c) => c !== cityName);
    else updated = [...favorites, cityName];

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className={theme === "dark" ? "text-blue-400" : "text-blue-600"}
          >
            ← Back
          </button>
        </div>

        {forecast ? (
          <WeatherCard
            forecast={forecast}
            isFavorite={favorites.includes(forecast.city.name)}
            toggleFavorite={(name) => toggleFavorite(name)}
            showOnlyToday={false}
          />
        ) : (
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            Loading forecast...
          </p>
        )}
      </div>
    </div>
  );
}
