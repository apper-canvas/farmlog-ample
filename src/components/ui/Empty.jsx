import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const Empty = ({ 
  title = "No items found", 
  description = "Get started by adding your first item",
  icon = "Inbox",
  action,
  className 
}) => {
  return (
    <div className={cn("flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-secondary/20", className)}>
      <div className="h-20 w-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={icon} className="h-10 w-10 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
      <p className="text-gray-600 text-center mb-6 max-w-sm">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 font-medium"
        >
          <ApperIcon name={action.icon || "Plus"} size={18} />
          {action.label}
        </button>
      )}
    </div>
  );
};

export default Empty;