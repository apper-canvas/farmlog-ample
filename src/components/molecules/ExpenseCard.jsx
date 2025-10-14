import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const ExpenseCard = ({ expense, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "seeds": return "Seed";
      case "equipment": return "Wrench";
      case "supplies": return "Package";
      case "labor": return "Users";
      case "fuel": return "Fuel";
      case "utilities": return "Zap";
      default: return "DollarSign";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "seeds": return "success";
      case "equipment": return "info";
      case "supplies": return "warning";
      case "labor": return "primary";
      case "fuel": return "error";
      case "utilities": return "secondary";
      default: return "default";
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name={getCategoryIcon(expense.category)} className="h-4 w-4 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{expense.description}</h3>
              <span className="text-lg font-semibold text-gray-900">
                ${expense.amount.toFixed(2)}
              </span>
            </div>
            
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <span>{format(new Date(expense.date), "MMM dd, yyyy")}</span>
              <Badge variant={getCategoryColor(expense.category)}>
                {expense.category}
              </Badge>
              <span className="capitalize">{expense.paymentMethod}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-3">
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(expense)}
            >
              <ApperIcon name="Edit" size={16} />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(expense.Id)}
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

export default ExpenseCard;