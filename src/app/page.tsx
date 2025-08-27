"use client";
import { useState, useEffect } from "react";
import WeatherCard from "@/components/WeatherCard";
import { ForecastResponse } from "@/components/types";
import { useTheme } from "@/components/ThemeProvider";
import { getWeatherData } from "@/services/weatherApiService";


export default function Dashboard() {
  const [city, setCity] = useState("");
  const [searchedCities, setSearchedCities] = useState<ForecastResponse[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const fetchForecast = async () => {
    if (!city.trim()) return;

    if (searchedCities.some((f) => f.city.name.toLowerCase() === city.toLowerCase())) {
      setCity("");
      return;
    }

    try {
      setLoading(true);
      // const res = await fetch(
      //   `https://api.openweathermap.org/data/2.5/forecast?q=${
      //     city
      //   }&appid=${API_KEY}&units=metric`
      // );
      const data: ForecastResponse = await getWeatherData(city);

      if (data.cod === "200") {
        setSearchedCities((prev) => [data, ...prev]); 
        setCity(""); 
      } else {
        console.warn("API error:", data);
        alert("City not found. Try another one.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch weather data.");
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = (cityName: string) => {
    let updated: string[];
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
        <h1 className="text-3xl font-bold mb-6">Weather App (Today)</h1>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchForecast()}
            className="border p-3 rounded w-full"
          />
          <button
            onClick={fetchForecast}
            disabled={loading}
            className={`px-6 py-3 rounded text-white ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            }`}
          >
            {loading ? "Loading..." : "Search"}
          </button>
        </div>

        {searchedCities.length === 0 ? (
          <p className="text-gray-500">No cities searched yet.</p>
        ) : (
          <div className="space-y-6">
            {searchedCities.map((forecast) => (
              <WeatherCard
                key={forecast.city.id ?? forecast.city.name}
                forecast={forecast}
                isFavorite={favorites.includes(forecast.city.name)}
                toggleFavorite={(cityName) => toggleFavorite(cityName)}
                showOnlyToday={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
