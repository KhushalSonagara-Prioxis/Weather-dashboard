// app/favorites/page.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import WeatherCard from "@/components/WeatherCard";
import { ForecastResponse } from "@/components/types";
import { useTheme } from "@/components/ThemeProvider";

const API_KEY = "3b938407b1a648416a50f49ce29b570b";

export default function Favorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [weatherData, setWeatherData] = useState<ForecastResponse[]>([]);
  const { theme } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      const parsed: string[] = JSON.parse(stored);
      setFavorites(parsed);
      fetchWeatherForFavorites(parsed);
    }
  }, []);

  const fetchWeatherForFavorites = async (cities: string[]) => {
    try {
      const promises = cities.map((c) =>
        fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(
            c
          )}&appid=${API_KEY}&units=metric`
        ).then((res) => res.json())
      );
      const results: ForecastResponse[] = await Promise.all(promises);
      setWeatherData(results.filter((r) => r.cod === "200"));
    } catch (err) {
      console.error(err);
      setWeatherData([]);
    }
  };

  const toggleFavorite = (cityName: string) => {
    let updated: string[] = [];
    if (favorites.includes(cityName)) {
      updated = favorites.filter((c) => c !== cityName);
    } else {
      updated = [...favorites, cityName];
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
    fetchWeatherForFavorites(updated);
  };

  return (
    <div
      className={`min-h-screen p-6 transition-colors ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
        }`}
    >
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Favorite Cities (Today)</h1>

        {weatherData.length === 0 ? (
          <p className={theme === "dark" ? "text-gray-400" : "text-gray-600"}>
            No favorites yet.
          </p>
        ) : (
          <div className="space-y-6">
            {weatherData.map((city) => (
              <WeatherCard
                key={city.city.id ?? city.city.name}
                forecast={city}
                isFavorite={favorites.includes(city.city.name)}
                toggleFavorite={(name) => toggleFavorite(name)}
                showOnlyToday={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
