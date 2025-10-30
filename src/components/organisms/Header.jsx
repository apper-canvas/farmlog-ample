import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Farms from "@/components/pages/Farms";
import { cn } from "@/utils/cn";
import { clearUser } from "@/store/userSlice";

const Header = ({ onMenuClick, selectedFarm, farms, onFarmSelect, weather }) => {
  const [showFarmSelect, setShowFarmSelect] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
  };

useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFarmSelect(false);
      }
    };

    if (showFarmSelect) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFarmSelect]);

  return (
    <header className="bg-white border-b border-secondary/20">
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
            
            <div className="relative" ref={dropdownRef}>
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
            {/* Weather Display */}
            {weather?.current && (
              <div className="hidden lg:flex items-center space-x-3 px-3 py-2 bg-white/50 rounded-lg">
                <ApperIcon 
                  name={weather.current.icon} 
                  className="h-5 w-5 text-accent" 
                />
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{weather.current.temperature}°F</p>
                  <p className="text-xs text-gray-600">{weather.current.condition}</p>
                </div>
              </div>
            )}

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors duration-200"
            >
              <ApperIcon name="LogOut" size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;