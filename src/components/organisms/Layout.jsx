import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { farmService } from "@/services/api/farmService";
import { weatherService } from "@/services/api/weatherService";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [farms, setFarms] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const loadFarms = async () => {
      try {
        const farmsData = await farmService.getAll();
        setFarms(farmsData);
      } catch (error) {
        console.error("Failed to load farms:", error);
      }
    };

    const loadWeather = async () => {
      try {
        const weatherData = await weatherService.getWeatherData();
        setWeather(weatherData);
      } catch (error) {
        console.error("Failed to load weather:", error);
      }
    };

    loadFarms();
    loadWeather();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={() => setSidebarOpen(false)} 
        />
        
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            onMenuClick={() => setSidebarOpen(true)}
            selectedFarm={selectedFarm}
            farms={farms}
            onFarmSelect={setSelectedFarm}
            weather={weather}
          />
          
          <main className="flex-1 overflow-auto">
            <div className="p-4 lg:p-8 max-w-7xl mx-auto">
              <Outlet context={{ selectedFarm, farms, weather }} />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;