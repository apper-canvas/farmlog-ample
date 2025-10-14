import { NavLink, useLocation } from 'react-router-dom';
import ApperIcon from '@/components/ApperIcon';
import { cn } from '@/utils/cn';

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed left-0 top-0 h-full bg-white border-r border-gray-200 z-50 transition-transform duration-300",
        "lg:translate-x-0 lg:static lg:z-auto",
        isOpen ? "translate-x-0" : "-translate-x-full",
        "w-64"
      )}>
        <SidebarContent onClose={onClose} />
      </aside>
    </>
  );
}

function SidebarContent({ onClose }) {
  const menuItems = [
    { path: '/', label: 'Dashboard', icon: 'LayoutDashboard' },
    { path: '/farms', label: 'Farms', icon: 'Building' },
    { path: '/crops', label: 'Crops', icon: 'Leaf' },
    { path: '/tasks', label: 'Tasks', icon: 'CheckSquare' },
    { path: '/expenses', label: 'Expenses', icon: 'Receipt' },
    { path: '/income', label: 'Income', icon: 'DollarSign' },
    { path: '/weather', label: 'Weather', icon: 'Cloud' }
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <ApperIcon name="Sprout" size={24} className="text-white" />
          </div>
          <span className="text-xl font-bold text-primary">FarmLog</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                onClick={onClose}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                  isActive 
                    ? "bg-primary text-white" 
                    : "text-gray-700 hover:bg-surface"
                )}
              >
                <ApperIcon name={item.icon} size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          FarmLog © 2024
        </p>
      </div>
    </div>
  );
}

export default Sidebar;