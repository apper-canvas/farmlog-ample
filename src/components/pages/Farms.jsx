import React, { useEffect, useState } from "react";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Crops from "@/components/pages/Crops";
import Tasks from "@/components/pages/Tasks";
import Button from "@/components/atoms/Button";
import Modal from "@/components/atoms/Modal";
import Card from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";

const Farms = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingFarm, setEditingFarm] = useState(null);
const [formData, setFormData] = useState({
    name: "",
    size: "",
    unit: "acres",
    location: "",
    soilType: "",
    currentAmount: ""
  });

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      setError("Failed to load farms");
      console.error("Farms error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
if (editingFarm) {
        await farmService.update(editingFarm.Id, {
          ...formData,
          size: parseFloat(formData.size),
          currentAmount: formData.currentAmount ? parseFloat(formData.currentAmount) : 0
        });
        toast.success("Farm updated successfully");
      } else {
await farmService.create({
          ...formData,
          size: parseFloat(formData.size),
          currentAmount: formData.currentAmount ? parseFloat(formData.currentAmount) : 0
        });
        toast.success("Farm added successfully");
      }
      resetForm();
      loadFarms();
    } catch (err) {
      toast.error(editingFarm ? "Failed to update farm" : "Failed to add farm");
    }
  };

  const handleDelete = async (farmId) => {
    if (!window.confirm("Are you sure you want to delete this farm?")) return;
    
    try {
      await farmService.delete(farmId);
      toast.success("Farm deleted successfully");
      loadFarms();
    } catch (err) {
      toast.error("Failed to delete farm");
    }
  };

  const handleEdit = (farm) => {
    setEditingFarm(farm);
    setFormData({
      name: farm.name,
      size: farm.size.toString(),
unit: farm.unit,
      location: farm.location,
      soilType: farm.soilType || "",
      currentAmount: farm.currentAmount || ""
    });
    setShowAddForm(true);
  };

const resetForm = () => {
    setFormData({
      name: "",
      size: "",
unit: "acres",
      location: "",
      soilType: "",
      currentAmount: ""
    });
    setShowAddForm(false);
    setEditingFarm(null);
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadFarms} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Farms</h1>
          <p className="text-gray-600 mt-1">Manage your farm properties</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          Add Farm
        </Button>
      </div>

      {/* Add/Edit Form */}
<Modal
        isOpen={showAddForm}
        onClose={resetForm}
        title={editingFarm ? "Edit Farm" : "Add New Farm"}
      >
<form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            label="Farm Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Enter farm name"
            required
          />
          <FormField
            label="Location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="County, State"
            required
          />
          <FormField
            label="Size"
            type="number"
            step="0.1"
            value={formData.size}
            onChange={(e) => setFormData({ ...formData, size: e.target.value })}
            placeholder="0.0"
            required
          />
          <FormField
            label="Unit"
            type="select"
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            options={[
              { value: "acres", label: "Acres" },
              { value: "hectares", label: "Hectares" },
              { value: "square_feet", label: "Square Feet" }
            ]}
          />
          <FormField
            label="Current Amount"
            type="number"
            step="0.01"
            value={formData.currentAmount}
            onChange={(e) => setFormData({ ...formData, currentAmount: e.target.value })}
            placeholder="$0.00"
            required
          />
          <FormField
            label="Soil Type"
            type="select"
            name="soilType"
            value={formData.soilType}
            onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
            options={[
              { value: "", label: "Select soil type" },
              { value: "sandy", label: "Sandy" },
              { value: "clay", label: "Clay" },
              { value: "silt", label: "Silt" }
            ]}
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
              {editingFarm ? "Update Farm" : "Add Farm"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Farms List */}
      {farms.length === 0 ? (
        <Empty
          title="No farms added yet"
          description="Add your first farm to start managing your agricultural operations"
          icon="TreePine"
          action={{
            label: "Add Farm",
            onClick: () => setShowAddForm(true),
            icon: "Plus"
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {farms.map((farm) => (
            <Card key={farm.Id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                    <ApperIcon name="TreePine" className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{farm.name}</h3>
                    <p className="text-sm text-gray-600">{farm.location}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleEdit(farm)}
                  >
                    <ApperIcon name="Edit" size={16} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(farm.Id)}
                    className="text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" size={16} />
                  </Button>
                </div>
              </div>

<div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium">
                    {farm.size} {farm.unit}
                  </span>
                </div>
                {farm.currentAmount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Current Amount:</span>
                    <span className="font-medium">
                      ${parseFloat(farm.currentAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                )}
                {farm.soilType && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Soil Type:</span>
                    <span className="font-medium capitalize">
                      {farm.soilType}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Added:</span>
                  <span className="font-medium">
                    {format(new Date(farm.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {/* Navigate to crops for this farm */}}
                  >
                    <ApperIcon name="Sprout" size={16} />
                    View Crops
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1"
                    onClick={() => {/* Navigate to tasks for this farm */}}
                  >
                    <ApperIcon name="CheckSquare" size={16} />
                    View Tasks
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Farms;