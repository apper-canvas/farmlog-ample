import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const StatCard = ({ 
  title, 
  value, 
  icon, 
  trend, 
  trendValue,
  className,
  onClick 
}) => {
  return (
    <Card 
      className={cn("p-6 cursor-pointer", className)}
      onClick={onClick}
      hover={!!onClick}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className={cn(
              "flex items-center text-sm",
              trend === "up" ? "text-success" : trend === "down" ? "text-error" : "text-gray-600"
            )}>
              {trend === "up" && <ApperIcon name="TrendingUp" size={16} className="mr-1" />}
              {trend === "down" && <ApperIcon name="TrendingDown" size={16} className="mr-1" />}
              {trendValue}
            </div>
          )}
        </div>
        <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
          <ApperIcon name={icon} className="h-6 w-6 text-primary" />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;