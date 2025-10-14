import { useState, useEffect } from "react";
import { useOutletContext, useNavigate } from "react-router-dom";
import StatCard from "@/components/molecules/StatCard";
import TaskCard from "@/components/molecules/TaskCard";
import WeatherWidget from "@/components/molecules/WeatherWidget";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { cropService } from "@/services/api/cropService";
import { taskService } from "@/services/api/taskService";
import { expenseService } from "@/services/api/expenseService";
import { toast } from "react-toastify";
import { format } from "date-fns";

const Dashboard = () => {
  const { selectedFarm, weather } = useOutletContext();
  const navigate = useNavigate();
  
  const [crops, setCrops] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, [selectedFarm]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [cropsData, upcomingTasks, expenseTotal] = await Promise.all([
        selectedFarm ? cropService.getByFarmId(selectedFarm.Id) : cropService.getAll(),
        taskService.getUpcoming(5),
        expenseService.getMonthlyTotal(selectedFarm?.Id)
      ]);

      setCrops(cropsData);
      setTasks(upcomingTasks);
      setMonthlyExpenses(expenseTotal);
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      toast.success("Task updated successfully");
      loadDashboardData();
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const getActiveCrops = () => crops.filter(crop => crop.stage !== "harvest");
  const getPendingTasks = () => tasks.filter(task => !task.completed);
  const getReadyForHarvest = () => crops.filter(crop => crop.stage === "harvest").length;

  if (loading) return <Loading type="stats" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedFarm ? `${selectedFarm.name} Dashboard` : "Farm Dashboard"}
          </h1>
          <p className="text-gray-600 mt-1">
            {selectedFarm ? selectedFarm.location : "Overview of all farms"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Today</p>
          <p className="text-lg font-semibold text-gray-900">
            {format(new Date(), "MMMM dd, yyyy")}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Active Crops"
          value={getActiveCrops().length}
          icon="Sprout"
          onClick={() => navigate("/crops")}
        />
        <StatCard
          title="Pending Tasks"
          value={getPendingTasks().length}
          icon="CheckSquare"
          onClick={() => navigate("/tasks")}
        />
        <StatCard
          title="Ready for Harvest"
          value={getReadyForHarvest()}
          icon="Apple"
          onClick={() => navigate("/crops")}
        />
        <StatCard
          title="Monthly Expenses"
          value={`$${monthlyExpenses.toFixed(0)}`}
          icon="DollarSign"
          onClick={() => navigate("/expenses")}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Tasks */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Upcoming Tasks</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/tasks")}
            >
              View All
            </Button>
          </div>
          
          {tasks.length === 0 ? (
            <Empty
              title="No upcoming tasks"
              description="All caught up! Consider adding some maintenance tasks."
              icon="CheckSquare"
              action={{
                label: "Add Task",
                onClick: () => navigate("/tasks"),
                icon: "Plus"
              }}
            />
          ) : (
            <div className="space-y-4">
              {tasks.slice(0, 3).map((task) => (
                <TaskCard
                  key={task.Id}
                  task={task}
                  onToggleComplete={handleToggleTask}
                />
              ))}
              {tasks.length > 3 && (
                <div className="text-center">
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/tasks")}
                    className="text-primary"
                  >
                    View {tasks.length - 3} more tasks
                    <ApperIcon name="ArrowRight" size={16} />
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Weather Widget */}
        <div className="lg:col-span-1">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Weather</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/weather")}
            >
              Full Forecast
            </Button>
          </div>
          
          {weather ? (
            <WeatherWidget weather={weather} />
          ) : (
            <div className="bg-white rounded-xl border border-secondary/20 p-6 text-center">
              <ApperIcon name="Cloud" className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">Weather data unavailable</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Farm Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl border border-secondary/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-success/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Sprout" className="h-5 w-5 text-success" />
              </div>
              <h3 className="font-semibold text-gray-900">Crop Health</h3>
            </div>
            <p className="text-2xl font-bold text-success mb-2">
              {crops.filter(c => c.status === "healthy").length}
            </p>
            <p className="text-sm text-gray-600">
              of {crops.length} crops are healthy
            </p>
          </div>

          <div className="bg-white rounded-xl border border-secondary/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-warning/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="Clock" className="h-5 w-5 text-warning" />
              </div>
              <h3 className="font-semibold text-gray-900">Overdue Tasks</h3>
            </div>
            <p className="text-2xl font-bold text-warning mb-2">
              {tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length}
            </p>
            <p className="text-sm text-gray-600">tasks need attention</p>
          </div>

          <div className="bg-white rounded-xl border border-secondary/20 p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <ApperIcon name="TrendingUp" className="h-5 w-5 text-accent" />
              </div>
              <h3 className="font-semibold text-gray-900">This Month</h3>
            </div>
            <p className="text-2xl font-bold text-accent mb-2">
              {tasks.filter(t => t.completed && 
                new Date(t.dueDate).getMonth() === new Date().getMonth()).length}
            </p>
            <p className="text-sm text-gray-600">tasks completed</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;