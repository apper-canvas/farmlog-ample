import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { taskService } from "@/services/api/taskService";
import { farmService } from "@/services/api/farmService";
import { cropService } from "@/services/api/cropService";
import { toast } from "react-toastify";

const Tasks = () => {
  const { selectedFarm, farms } = useOutletContext();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [availableFarms, setAvailableFarms] = useState([]);
  const [availableCrops, setAvailableCrops] = useState([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [formData, setFormData] = useState({
    farmId: "",
    cropId: "",
    title: "",
    type: "watering",
    dueDate: "",
    priority: "medium",
    recurring: false,
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, [selectedFarm]);

  useEffect(() => {
    if (formData.farmId) {
      loadCropsForFarm(formData.farmId);
    }
  }, [formData.farmId]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [tasksData, farmsData] = await Promise.all([
        selectedFarm ? taskService.getByFarmId(selectedFarm.Id) : taskService.getAll(),
        farms.length > 0 ? Promise.resolve(farms) : farmService.getAll()
      ]);
      
      setTasks(tasksData);
      setAvailableFarms(farmsData);
      
      // Set default farm in form
      if (selectedFarm && !formData.farmId) {
        setFormData(prev => ({ ...prev, farmId: selectedFarm.Id.toString() }));
        loadCropsForFarm(selectedFarm.Id.toString());
      }
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Tasks error:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadCropsForFarm = async (farmId) => {
    try {
      const crops = await cropService.getByFarmId(farmId);
      setAvailableCrops(crops);
    } catch (err) {
      console.error("Failed to load crops for farm:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTask) {
        await taskService.update(editingTask.Id, formData);
        toast.success("Task updated successfully");
      } else {
        await taskService.create(formData);
        toast.success("Task added successfully");
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error(editingTask ? "Failed to update task" : "Failed to add task");
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      await taskService.toggleComplete(taskId);
      toast.success("Task updated successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to update task");
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    
    try {
      await taskService.delete(taskId);
      toast.success("Task deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setFormData({
      farmId: task.farmId,
      cropId: task.cropId || "",
      title: task.title,
      type: task.type,
      dueDate: task.dueDate,
      priority: task.priority,
      recurring: task.recurring,
      notes: task.notes || ""
    });
    setShowAddForm(true);
  };

const resetForm = () => {
    setFormData({
      farmId: selectedFarm ? selectedFarm.Id.toString() : "",
      cropId: "",
      title: "",
      type: "watering",
      dueDate: "",
      priority: "medium",
      recurring: false,
      notes: ""
    });
    setShowAddForm(false);
    setEditingTask(null);
  };

  const getFilteredTasks = () => {
    switch (filterStatus) {
      case "pending":
        return tasks.filter(t => !t.completed);
      case "completed":
        return tasks.filter(t => t.completed);
      case "overdue":
        return tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date());
      default:
        return tasks;
    }
  };

  const getFarmName = (farmId) => {
    const farm = availableFarms.find(f => f.Id.toString() === farmId.toString());
    return farm ? farm.name : "Unknown Farm";
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const filteredTasks = getFilteredTasks();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedFarm ? `${selectedFarm.name} Tasks` : "All Tasks"}
          </h1>
          <p className="text-gray-600 mt-1">Manage your farm tasks and schedules</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          Add Task
        </Button>
      </div>

      {/* Task Filters */}
      <Card className="p-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-gray-700">Filter:</span>
          <div className="flex space-x-2">
            {[
              { value: "all", label: "All Tasks", count: tasks.length },
              { value: "pending", label: "Pending", count: tasks.filter(t => !t.completed).length },
              { value: "completed", label: "Completed", count: tasks.filter(t => t.completed).length },
              { value: "overdue", label: "Overdue", count: tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length }
            ].map((filter) => (
              <button
                key={filter.value}
                onClick={() => setFilterStatus(filter.value)}
                className={`px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
                  filterStatus === filter.value
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {filter.label} ({filter.count})
              </button>
            ))}
          </div>
        </div>
      </Card>

{/* Add/Edit Form Modal */}
      <Modal
        isOpen={showAddForm}
        onClose={resetForm}
        title={editingTask ? "Edit Task" : "Add New Task"}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!selectedFarm && (
            <FormField
              label="Farm"
              type="select"
              value={formData.farmId}
              onChange={(e) => setFormData({ ...formData, farmId: e.target.value, cropId: "" })}
              required
            >
              <option value="">Select a farm</option>
              {availableFarms.map((farm) => (
                <option key={farm.Id} value={farm.Id}>
                  {farm.name} - {farm.location}
                </option>
              ))}
            </FormField>
          )}
          
          <FormField
            label="Related Crop (Optional)"
            type="select"
            value={formData.cropId}
            onChange={(e) => setFormData({ ...formData, cropId: e.target.value })}
          >
            <option value="">General farm task</option>
            {availableCrops.map((crop) => (
              <option key={crop.Id} value={crop.Id}>
                {crop.name} - {crop.variety}
              </option>
            ))}
          </FormField>

          <FormField
            label="Task Title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Water tomatoes, Check irrigation"
            required
            className={!selectedFarm ? "" : "md:col-span-2"}
          />

          <FormField
            label="Task Type"
            type="select"
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            options={[
              { value: "watering", label: "Watering" },
              { value: "fertilizing", label: "Fertilizing" },
              { value: "planting", label: "Planting" },
              { value: "harvesting", label: "Harvesting" },
              { value: "inspection", label: "Inspection" },
              { value: "maintenance", label: "Maintenance" },
              { value: "pest_control", label: "Pest Control" }
            ]}
          />

          <FormField
            label="Due Date"
            type="date"
            value={formData.dueDate}
            onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            required
          />

          <FormField
            label="Priority"
            type="select"
            value={formData.priority}
            onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" }
            ]}
          />

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="recurring"
              checked={formData.recurring}
              onChange={(e) => setFormData({ ...formData, recurring: e.target.checked })}
              className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2"
            />
            <label htmlFor="recurring" className="text-sm font-medium text-gray-700">
              Recurring Task
            </label>
          </div>

          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Optional notes about this task..."
            className="md:col-span-2"
          />

          <div className="md:col-span-2 flex justify-end space-x-3">
            <Button
              type="button"
              variant="outline"
              onClick={resetForm}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingTask ? "Update Task" : "Add Task"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Tasks List */}
      {filteredTasks.length === 0 ? (
        <Empty
          title={filterStatus === "all" ? "No tasks created yet" : `No ${filterStatus} tasks`}
          description={filterStatus === "all" 
            ? "Add your first task to start managing your farm activities"
            : `No tasks match the ${filterStatus} filter`
          }
          icon="CheckSquare"
          action={filterStatus === "all" ? {
            label: "Add Task",
onClick: () => setShowAddForm(true),
            icon: "Plus"
          } : {
            label: "View All Tasks",
            onClick: () => setFilterStatus("all"),
            icon: "List"
          }}
        />
      ) : (
        <>
          {/* Tasks Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-info/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="List" className="h-4 w-4 text-info" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">{tasks.length}</p>
                  <p className="text-sm text-gray-600">Total Tasks</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-warning/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Clock" className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {tasks.filter(t => !t.completed).length}
                  </p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {tasks.filter(t => t.completed).length}
                  </p>
                  <p className="text-sm text-gray-600">Completed</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-error/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="AlertTriangle" className="h-4 w-4 text-error" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length}
                  </p>
                  <p className="text-sm text-gray-600">Overdue</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.Id}>
                <TaskCard
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                {!selectedFarm && (
                  <p className="text-xs text-gray-500 mt-1 ml-8">
                    {getFarmName(task.farmId)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Tasks;