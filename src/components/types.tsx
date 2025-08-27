export interface ForecastItem {
  dt_txt: string;
  main: { temp: number; humidity: number };
  weather: { description: string; main: string, icon: string }[];
}

export interface ForecastResponse {
  cod: string;
  city: { id: number; name: string };
  list: ForecastItem[];
}