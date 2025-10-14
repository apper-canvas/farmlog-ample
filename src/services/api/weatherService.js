import weatherData from "@/services/mockData/weather.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const weatherService = {
  async getCurrent() {
    await delay(500);
    return { ...weatherData.current };
  },

  async getForecast(days = 5) {
    await delay(400);
    return weatherData.forecast.slice(0, days).map(day => ({ ...day }));
  },

  async getAlerts() {
    await delay(300);
    return [...weatherData.alerts];
  },

  async getWeatherData() {
    await delay(600);
    return {
      current: { ...weatherData.current },
      forecast: weatherData.forecast.map(day => ({ ...day })),
      alerts: [...weatherData.alerts]
    };
  }
};