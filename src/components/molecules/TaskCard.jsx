import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";
import { cn } from "@/utils/cn";

const TaskCard = ({ task, onToggleComplete, onEdit, onDelete, showFarm = false }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "border-l-error";
      case "medium": return "border-l-warning";
      case "low": return "border-l-info";
      default: return "border-l-gray-300";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "watering": return "Droplets";
      case "planting": return "Seed";
      case "harvesting": return "ShoppingBasket";
      case "fertilizing": return "Beaker";
      case "inspection": return "Eye";
      case "maintenance": return "Wrench";
      default: return "CheckSquare";
    }
  };

  return (
    <Card className={cn(
      "p-4 border-l-4 transition-all duration-200",
      getPriorityColor(task.priority),
      task.completed && "opacity-75 bg-gray-50"
    )}>
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <button
            onClick={() => onToggleComplete(task.Id)}
            className={cn(
              "mt-0.5 h-5 w-5 rounded border-2 flex items-center justify-center transition-all duration-200",
              task.completed 
                ? "bg-success border-success text-white" 
                : "border-gray-300 hover:border-primary"
            )}
          >
            {task.completed && <ApperIcon name="Check" size={14} />}
          </button>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <ApperIcon name={getTypeIcon(task.type)} size={16} className="text-gray-600 flex-shrink-0" />
              <h3 className={cn(
                "font-medium text-gray-900",
                task.completed && "line-through text-gray-500"
              )}>
                {task.title}
              </h3>
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-gray-600 mb-2">
              <span>Due: {format(new Date(task.dueDate), "MMM dd, yyyy")}</span>
              <Badge variant={task.priority === "high" ? "error" : task.priority === "medium" ? "warning" : "default"}>
                {task.priority} priority
              </Badge>
              {task.recurring && (
                <Badge variant="primary">
                  <ApperIcon name="Repeat" size={12} className="mr-1" />
                  Recurring
                </Badge>
              )}
            </div>
            
            {task.notes && (
              <p className="text-sm text-gray-600 mb-2">{task.notes}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-3">
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(task)}
            >
              <ApperIcon name="Edit" size={16} />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(task.Id)}
              className="text-error hover:bg-error/10"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TaskCard;