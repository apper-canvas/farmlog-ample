import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import WeatherWidget from "@/components/molecules/WeatherWidget";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { weatherService } from "@/services/api/weatherService";
import { format } from "date-fns";

const Weather = () => {
const { weather: contextWeather } = useOutletContext();
  const [weather, setWeather] = useState(contextWeather);
  const [loading, setLoading] = useState(!contextWeather);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!contextWeather) {
      loadWeather();
    }
  }, [contextWeather]);

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await weatherService.getWeatherData();
      setWeather(data);
    } catch (err) {
      setError("Failed to load weather data");
      console.error("Weather error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    const iconMap = {
      "Sunny": "Sun",
      "Partly Cloudy": "PartlyCloudyDay",
      "Cloudy": "Cloud",
      "Light Rain": "CloudRain",
      "Rain": "CloudRain",
      "Heavy Rain": "CloudRainWind",
      "Thunderstorm": "Zap",
      "Snow": "Snowflake",
      "Fog": "Cloud"
    };
    return iconMap[condition] || "Sun";
  };

  const getPrecipitationColor = (precipitation) => {
    if (precipitation >= 70) return "error";
    if (precipitation >= 30) return "warning";
    return "success";
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadWeather} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Weather Forecast</h1>
          <p className="text-gray-600 mt-1">Current conditions and 5-day forecast</p>
        </div>
        <button
          onClick={loadWeather}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors duration-200"
        >
          <ApperIcon name="RefreshCw" size={16} />
          Refresh
        </button>
      </div>

      {/* Current Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeatherWidget weather={weather} />
        </div>
        
        {/* Quick Stats */}
        <div className="space-y-4">
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Thermometer" className="h-4 w-4 text-accent" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Temperature</p>
                <p className="text-lg font-semibold text-gray-900">
                  {weather?.current?.temperature}°F
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-info/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Droplets" className="h-4 w-4 text-info" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Humidity</p>
                <p className="text-lg font-semibold text-gray-900">
                  {weather?.current?.humidity}%
                </p>
              </div>
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Wind" className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Wind Speed</p>
                <p className="text-lg font-semibold text-gray-900">
                  {weather?.current?.windSpeed} mph {weather?.current?.windDirection}
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* 5-Day Forecast */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">5-Day Forecast</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {weather?.forecast?.map((day, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-sm font-medium text-gray-900 mb-2">
                {index === 0 ? "Today" : day.dayOfWeek}
              </p>
              <ApperIcon 
                name={getWeatherIcon(day.condition)} 
                className="h-8 w-8 text-accent mx-auto mb-2" 
              />
              <p className="text-xs text-gray-600 mb-2">{day.condition}</p>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold text-gray-900">{day.high}°</span>
                <span className="text-gray-600">{day.low}°</span>
              </div>
              <Badge variant={getPrecipitationColor(day.precipitation)} className="text-xs">
                {day.precipitation}% rain
              </Badge>
            </div>
          ))}
        </div>
      </Card>

      {/* Agricultural Insights */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Agricultural Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Droplets" size={16} className="text-info" />
              <span className="font-medium text-gray-900">Watering Recommendation</span>
            </div>
            <p className="text-sm text-gray-600">
              {weather?.forecast?.[0]?.precipitation > 50 
                ? "Skip watering today - rain expected"
                : "Good day for watering crops"
              }
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Sun" size={16} className="text-accent" />
              <span className="font-medium text-gray-900">UV Conditions</span>
            </div>
            <p className="text-sm text-gray-600">
              UV Index: {weather?.current?.uvIndex} - 
              {weather?.current?.uvIndex > 6 ? " High exposure risk" : " Moderate exposure"}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Wind" size={16} className="text-primary" />
              <span className="font-medium text-gray-900">Wind Conditions</span>
            </div>
            <p className="text-sm text-gray-600">
              {weather?.current?.windSpeed > 15 
                ? "High winds - avoid spraying pesticides"
                : "Good conditions for field work"
              }
            </p>
          </div>
        </div>
      </Card>

      {/* Weather Alerts */}
      {weather?.alerts && weather.alerts.length > 0 && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Weather Alerts</h2>
          <div className="space-y-3">
            {weather.alerts.map((alert, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border-l-4 ${
                  alert.severity === "high" 
                    ? "bg-error/5 border-error text-error" 
                    : alert.severity === "medium"
                    ? "bg-warning/5 border-warning text-warning"
                    : "bg-info/5 border-info text-info"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <ApperIcon name="AlertTriangle" size={20} className="mt-1 flex-shrink-0" />
                  <div>
                    <p className="font-semibold capitalize">{alert.type}</p>
                    <p className="text-sm opacity-90 mt-1">{alert.message}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Historical Data Placeholder */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">This Week Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ApperIcon name="Thermometer" className="h-6 w-6 text-accent mx-auto mb-2" />
            <p className="text-sm text-gray-600">Average High</p>
            <p className="text-xl font-bold text-gray-900">
              {weather?.forecast ? 
                Math.round(weather.forecast.reduce((sum, day) => sum + day.high, 0) / weather.forecast.length) 
                : '--'
              }°F
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ApperIcon name="CloudRain" className="h-6 w-6 text-info mx-auto mb-2" />
            <p className="text-sm text-gray-600">Rain Days</p>
            <p className="text-xl font-bold text-gray-900">
              {weather?.forecast ? 
                weather.forecast.filter(day => day.precipitation > 30).length 
                : '--'
              } days
            </p>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <ApperIcon name="Sun" className="h-6 w-6 text-warning mx-auto mb-2" />
            <p className="text-sm text-gray-600">Sunny Days</p>
            <p className="text-xl font-bold text-gray-900">
              {weather?.forecast ? 
                weather.forecast.filter(day => day.condition === "Sunny").length 
                : '--'
              } days
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Weather;