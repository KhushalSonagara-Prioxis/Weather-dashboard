const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;


export const getWeatherData = async (city: string) => {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!res.ok) {
      throw new Error(`Error fetching weather data: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
};
