import { NavLink, useLocation } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigationItems = [
    { name: "Dashboard", href: "", icon: "LayoutDashboard" },
    { name: "Farms", href: "farms", icon: "TreePine" },
    { name: "Crops", href: "crops", icon: "Sprout" },
    { name: "Tasks", href: "tasks", icon: "CheckSquare" },
    { name: "Expenses", href: "expenses", icon: "DollarSign" },
    { name: "Weather", href: "weather", icon: "Cloud" }
  ];

  const SidebarContent = () => (
    <>
      <div className="flex items-center space-x-3 p-6 border-b border-secondary/20">
        <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center">
          <ApperIcon name="TreePine" className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">FarmLog</h1>
          <p className="text-sm text-gray-600">Farm Management</p>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={`/${item.href}`}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                "flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group",
                isActive || (item.href === "" && location.pathname === "/")
                  ? "bg-primary text-white shadow-lg"
                  : "text-gray-700 hover:bg-primary/5 hover:text-primary"
              )
            }
          >
            <ApperIcon 
              name={item.icon} 
              size={20} 
              className="flex-shrink-0 group-hover:scale-110 transition-transform duration-200" 
            />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-secondary/20">
        <div className="bg-surface rounded-xl p-4">
          <div className="flex items-center space-x-2 mb-3">
            <ApperIcon name="Info" size={16} className="text-primary" />
            <span className="text-sm font-medium text-gray-900">Farm Tip</span>
          </div>
          <p className="text-xs text-gray-600">
            Regular soil testing helps optimize crop nutrition and yields.
          </p>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:flex-col lg:w-80 lg:bg-white lg:border-r lg:border-secondary/20 lg:h-screen lg:sticky lg:top-0">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        isOpen ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
        <div className={cn(
          "fixed left-0 top-0 h-full w-80 bg-white border-r border-secondary/20 shadow-2xl transition-transform duration-300 ease-out flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex items-center justify-between p-4 border-b border-secondary/20">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <ApperIcon name="TreePine" className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">FarmLog</span>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
            >
              <ApperIcon name="X" size={20} />
            </button>
          </div>
          <SidebarContent />
        </div>
      </div>
    </>
  );
};

export default Sidebar;