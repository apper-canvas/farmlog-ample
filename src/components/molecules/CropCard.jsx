import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, differenceInDays } from "date-fns";

const CropCard = ({ crop, onEdit, onDelete, onViewTasks }) => {
  const getStageIcon = (stage) => {
    switch (stage) {
      case "planted": return "Seed";
      case "growing": return "Sprout";
      case "harvest": return "Apple";
      default: return "Leaf";
    }
  };

  const getDaysToHarvest = () => {
    const today = new Date();
    const harvestDate = new Date(crop.expectedHarvest);
    return differenceInDays(harvestDate, today);
  };

  const daysToHarvest = getDaysToHarvest();

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-success/10 rounded-lg flex items-center justify-center">
            <ApperIcon name={getStageIcon(crop.stage)} className="h-5 w-5 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{crop.name}</h3>
            <p className="text-sm text-gray-600">{crop.variety}</p>
          </div>
        </div>
        <Badge variant={crop.stage}>
          {crop.stage}
        </Badge>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Planted:</span>
          <span className="font-medium">{format(new Date(crop.plantedDate), "MMM dd, yyyy")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Expected Harvest:</span>
          <span className="font-medium">{format(new Date(crop.expectedHarvest), "MMM dd, yyyy")}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Days to Harvest:</span>
          <span className={`font-medium ${daysToHarvest <= 7 ? "text-warning" : daysToHarvest <= 0 ? "text-error" : "text-gray-900"}`}>
            {daysToHarvest <= 0 ? "Ready!" : `${daysToHarvest} days`}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Status:</span>
          <Badge variant={crop.status === "healthy" ? "success" : crop.status === "attention" ? "warning" : "default"}>
            {crop.status}
          </Badge>
        </div>
      </div>

      {crop.notes && (
        <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded-lg">
          {crop.notes}
        </p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onViewTasks && onViewTasks(crop)}
        >
          <ApperIcon name="CheckSquare" size={16} />
          View Tasks
        </Button>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(crop)}
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDelete(crop.Id)}
            className="text-error hover:bg-error/10"
          >
            <ApperIcon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CropCard;