import { useState } from "react";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import WeatherWidget from "@/components/molecules/WeatherWidget";

const Header = ({ onMenuClick, selectedFarm, farms, onFarmSelect, weather }) => {
  const [showFarmSelect, setShowFarmSelect] = useState(false);

  return (
    <header className="bg-white border-b border-secondary/20 sticky top-0 z-40">
      <div className="px-4 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onMenuClick}
              className="lg:hidden"
            >
              <ApperIcon name="Menu" size={20} />
            </Button>
            
            <div className="relative">
              <button
                onClick={() => setShowFarmSelect(!showFarmSelect)}
                className="flex items-center space-x-2 px-4 py-2 bg-surface rounded-xl hover:bg-secondary/10 transition-colors duration-200"
              >
                <ApperIcon name="MapPin" size={16} className="text-primary" />
                <span className="font-medium text-gray-900">
                  {selectedFarm ? selectedFarm.name : "All Farms"}
                </span>
                <ApperIcon name="ChevronDown" size={16} className="text-gray-400" />
              </button>

              {showFarmSelect && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-secondary/20 rounded-xl shadow-lg z-50">
                  <div className="p-2">
                    <button
                      onClick={() => {
                        onFarmSelect(null);
                        setShowFarmSelect(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="flex items-center space-x-2">
                        <ApperIcon name="MapPin" size={16} className="text-gray-400" />
                        <span className="font-medium">All Farms</span>
                      </div>
                    </button>
                    {farms.map((farm) => (
                      <button
                        key={farm.Id}
                        onClick={() => {
                          onFarmSelect(farm);
                          setShowFarmSelect(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="flex items-center space-x-2">
                          <ApperIcon name="TreePine" size={16} className="text-primary" />
                          <div>
                            <p className="font-medium text-gray-900">{farm.name}</p>
                            <p className="text-xs text-gray-600">{farm.location}</p>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:block">
              {weather && <WeatherWidget weather={weather} compact />}
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary/10 rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-primary" />
              </div>
              <span className="hidden sm:block text-sm font-medium text-gray-900">Farmer</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;