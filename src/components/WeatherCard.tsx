"use client";
import Link from "next/link";
import { StarFilled, StarOutlined } from "@ant-design/icons";
import { ForecastResponse, ForecastItem } from "./types";

interface Props {
  forecast: ForecastResponse;
  isFavorite: boolean;
  toggleFavorite: (cityName: string, e?: React.MouseEvent) => void;
  showOnlyToday?: boolean;
}

export default function WeatherCard({
  forecast,
  isFavorite,
  toggleFavorite,
  showOnlyToday = true,
}: Props) {
  const grouped = forecast.list.reduce((acc: Record<string, ForecastItem[]>, item) => {
    const date = item.dt_txt.split(" ")[0];
    if (!acc[date]) acc[date] = [];
    acc[date].push(item);
    return acc;
  }, {});

  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

  const entries = Object.entries(grouped).filter(([date]) => (showOnlyToday ? date === today : true));

  const formatDateHeading = (yyyyMmDd: string) => {
    const d = new Date(yyyyMmDd + "T00:00:00");
    return d.toLocaleDateString(undefined, {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Link to detail page path
  const cityLink = `/city/${encodeURIComponent(forecast.city.name)}`;

  return (
    <div className="space-y-4 p-4">
      <Link href={cityLink} className="block">
        <div className="border p-4 rounded-lg shadow-sm flex items-center justify-between hover:shadow-md transition">
          <h2 className="text-2xl font-bold">{forecast.city.name}</h2>

          <div
            onClick={(e) => {}}
          >
            {isFavorite ? (
              <StarFilled
                style={{ fontSize: 28, color: "#fadb14", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleFavorite(forecast.city.name, e);
                }}
              />
            ) : (
              <StarOutlined
                style={{ fontSize: 28, color: "#aaa", cursor: "pointer" }}
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  toggleFavorite(forecast.city.name, e);
                }}
              />
            )}
          </div>
        </div>
      </Link>


      {entries.length === 0 && showOnlyToday && (
        <div className="p-4 border rounded bg-white text-center text-gray-600">
          No data for today.
        </div>
      )}

      {entries.map(([date, items]) => (
        <div key={date} className="border rounded-lg shadow-md overflow-hidden">

          <div className="px-4 py-3 border-b">
            <div className="flex items-center justify-between">
              <div className="text-lg font-semibold">{formatDateHeading(date)}</div>
              <div className="text-sm text-gray-600">{items.length} slots</div>
            </div>

            <div className="mt-3 grid grid-cols-4 gap-4 text-sm font-semibold text-white-700">
              <div>Time</div>
              <div className="flex items-center">Description</div>
              <div>Temp (°C)</div>
              <div>Humidity (%)</div>
            </div>
          </div>

          <div className="px-4 py-3 space-y-2">
            {items.map((item) => (
              <div
                key={item.dt_txt}
                className="grid grid-cols-4 gap-4 items-center p-2 rounded"
              >
                <div className="text-sm font-medium">{item.dt_txt.split(" ")[1]}</div>

                <div className="flex items-center gap-3">
                  <img
                    src={`https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`}
                    alt={item.weather[0].description}
                    className="w-8 h-8"
                    width={32}
                    height={32}
                  />
                  <div className="text-sm capitalize">{item.weather[0].description}</div>
                </div>

                <div className="text-sm">{Math.round(item.main.temp * 10) / 10}</div>

                <div className="text-sm">{item.main.humidity}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
