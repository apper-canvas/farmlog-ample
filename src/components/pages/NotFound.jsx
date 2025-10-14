import { useNavigate } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ApperIcon from "@/components/ApperIcon";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md mx-auto">
        <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="TreePine" className="h-10 w-10 text-primary" />
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Button
            onClick={() => navigate("/")}
            className="w-full"
          >
            <ApperIcon name="Home" size={18} />
            Back to Dashboard
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/farms")}
            className="w-full"
          >
            <ApperIcon name="TreePine" size={18} />
            View Farms
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;