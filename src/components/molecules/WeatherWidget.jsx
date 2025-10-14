import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const WeatherWidget = ({ weather, compact = false }) => {
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

  if (compact) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <ApperIcon 
              name={getWeatherIcon(weather.current?.condition)} 
              className="h-8 w-8 text-accent" 
            />
            <div>
              <p className="text-2xl font-bold text-gray-900">{weather.current?.temperature}°F</p>
              <p className="text-sm text-gray-600">{weather.current?.condition}</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p>Humidity: {weather.current?.humidity}%</p>
            <p>Wind: {weather.current?.windSpeed} mph</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Current Weather</h3>
        <ApperIcon name="RefreshCw" className="h-5 w-5 text-gray-400 cursor-pointer hover:text-primary" />
      </div>

      <div className="text-center mb-6">
        <ApperIcon 
          name={getWeatherIcon(weather.current?.condition)} 
          className="h-16 w-16 text-accent mx-auto mb-3" 
        />
        <p className="text-4xl font-bold text-gray-900 mb-2">{weather.current?.temperature}°F</p>
        <p className="text-lg text-gray-600 mb-1">{weather.current?.condition}</p>
        <p className="text-sm text-gray-500">
          Feels like {weather.current?.temperature}°F
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <ApperIcon name="Droplets" className="h-5 w-5 text-info mx-auto mb-1" />
          <p className="text-sm text-gray-600">Humidity</p>
          <p className="font-semibold text-gray-900">{weather.current?.humidity}%</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <ApperIcon name="Wind" className="h-5 w-5 text-info mx-auto mb-1" />
          <p className="text-sm text-gray-600">Wind</p>
          <p className="font-semibold text-gray-900">{weather.current?.windSpeed} mph</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <ApperIcon name="CloudRain" className="h-5 w-5 text-info mx-auto mb-1" />
          <p className="text-sm text-gray-600">Precipitation</p>
          <p className="font-semibold text-gray-900">{weather.current?.precipitation}%</p>
        </div>
        <div className="text-center p-3 bg-gray-50 rounded-lg">
          <ApperIcon name="Sun" className="h-5 w-5 text-accent mx-auto mb-1" />
          <p className="text-sm text-gray-600">UV Index</p>
          <p className="font-semibold text-gray-900">{weather.current?.uvIndex}</p>
        </div>
      </div>

      {weather.alerts && weather.alerts.length > 0 && (
        <div className="border-t border-gray-100 pt-4">
          <h4 className="text-sm font-semibold text-gray-900 mb-2">Weather Alerts</h4>
          {weather.alerts.map((alert, index) => (
            <div key={index} className={cn(
              "p-3 rounded-lg mb-2",
              alert.severity === "high" ? "bg-error/10 text-error" : 
              alert.severity === "medium" ? "bg-warning/10 text-warning" : 
              "bg-info/10 text-info"
            )}>
              <div className="flex items-start space-x-2">
                <ApperIcon name="AlertTriangle" size={16} className="mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium capitalize">{alert.type}</p>
                  <p className="text-sm opacity-90">{alert.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default WeatherWidget;