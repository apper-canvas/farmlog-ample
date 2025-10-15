import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const EquipmentCard = ({ equipment, onEdit, onDelete }) => {
  const getCategoryIcon = (category) => {
    switch (category) {
      case "tractor": return "Tractor";
      case "harvester": return "Combine";
      case "irrigation": return "Droplets";
      case "tools": return "Wrench";
      case "vehicle": return "Truck";
      case "storage": return "Warehouse";
      case "processing": return "Factory";
      default: return "Package";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "tractor": return "primary";
      case "harvester": return "warning";
      case "irrigation": return "info";
      case "tools": return "secondary";
      case "vehicle": return "success";
      case "storage": return "default";
      case "processing": return "error";
      default: return "default";
    }
  };

  const getConditionColor = (condition) => {
    switch (condition) {
      case "excellent": return "success";
      case "good": return "info";
      case "fair": return "warning";
      case "poor": return "error";
      default: return "default";
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "success";
      case "maintenance": return "warning";
      case "retired": return "error";
      default: return "default";
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <div className="h-8 w-8 bg-primary/10 rounded-lg flex items-center justify-center">
            <ApperIcon name={getCategoryIcon(equipment.category)} className="h-4 w-4 text-primary" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{equipment.name}</h3>
              <span className="text-lg font-semibold text-gray-900">
                ${equipment.purchasePrice.toLocaleString()}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-2">{equipment.description}</p>
            
            <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
              <span>{format(new Date(equipment.purchaseDate), "MMM dd, yyyy")}</span>
              <Badge variant={getCategoryColor(equipment.category)}>
                {equipment.category}
              </Badge>
              <Badge variant={getConditionColor(equipment.condition)}>
                {equipment.condition}
              </Badge>
              <Badge variant={getStatusColor(equipment.status)}>
                {equipment.status}
              </Badge>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-1 ml-3">
          {onEdit && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onEdit(equipment)}
            >
              <ApperIcon name="Edit" size={16} />
            </Button>
          )}
          {onDelete && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDelete(equipment.Id)}
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

export default EquipmentCard;