import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Modal from "@/components/atoms/Modal";
import FormField from "@/components/molecules/FormField";
import CropCard from "@/components/molecules/CropCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { cropService } from "@/services/api/cropService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";

const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const Crops = () => {
  const { selectedFarm, farms } = useOutletContext();
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCrop, setEditingCrop] = useState(null);
  const [availableFarms, setAvailableFarms] = useState([]);
  const [formData, setFormData] = useState({
    farmId: "",
    name: "",
    variety: "",
    plantedDate: "",
    expectedHarvest: "",
    stage: "planted",
    status: "healthy",
    notes: ""
  });

  useEffect(() => {
    loadData();
  }, [selectedFarm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [cropsData, farmsData] = await Promise.all([
        selectedFarm ? cropService.getByFarmId(selectedFarm.Id) : cropService.getAll(),
        farms.length > 0 ? Promise.resolve(farms) : farmService.getAll()
      ]);
      
      setCrops(cropsData);
      setAvailableFarms(farmsData);
      
      // Set default farm in form
      if (selectedFarm && !formData.farmId) {
        setFormData(prev => ({ ...prev, farmId: selectedFarm.Id.toString() }));
      }
    } catch (err) {
      setError("Failed to load crops");
      console.error("Crops error:", err);
    } finally {
      setLoading(false);
    }
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Check if status changed during edit to generate new notes
      if (editingCrop && formData.status !== editingCrop.status) {
        try {
          toast.info("Generating crop notes...");
          
          const response = await apperClient.functions.invoke(
            import.meta.env.VITE_GENERATE_CROP_NOTES,
            {
              body: JSON.stringify({
                cropName: formData.name,
                variety: formData.variety,
                stage: formData.stage,
                status: formData.status
              }),
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );

          if (response.success && response.notes) {
            // Update formData with generated notes
            formData.notes = response.notes;
            toast.success("Notes generated successfully");
          } else {
            console.info(`apper_info: Got an error in this function: ${import.meta.env.VITE_GENERATE_CROP_NOTES}. The response body is: ${JSON.stringify(response)}.`);
          }
        } catch (error) {
          console.info(`apper_info: Got this error in this function: ${import.meta.env.VITE_GENERATE_CROP_NOTES}. The error is: ${error.message}`);
          // Continue with update even if note generation fails
        }
      }

      if (editingCrop) {
        await cropService.update(editingCrop.Id, formData);
        toast.success("Crop updated successfully");
      } else {
        await cropService.create(formData);
        toast.success("Crop added successfully");
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error(editingCrop ? "Failed to update crop" : "Failed to add crop");
    }
  };

  const handleDelete = async (cropId) => {
    if (!window.confirm("Are you sure you want to delete this crop?")) return;
    
    try {
      await cropService.delete(cropId);
      toast.success("Crop deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to delete crop");
    }
  };

  const handleEdit = (crop) => {
    setEditingCrop(crop);
    setFormData({
      farmId: crop.farmId,
      name: crop.name,
      variety: crop.variety,
      plantedDate: crop.plantedDate,
      expectedHarvest: crop.expectedHarvest,
      stage: crop.stage,
      status: crop.status,
      notes: crop.notes || ""
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      farmId: selectedFarm ? selectedFarm.Id.toString() : "",
      name: "",
      variety: "",
      plantedDate: "",
      expectedHarvest: "",
      stage: "planted",
      status: "healthy",
      notes: ""
    });
    setShowAddForm(false);
    setEditingCrop(null);
  };

  const getFarmName = (farmId) => {
    const farm = availableFarms.find(f => f.Id.toString() === farmId.toString());
    return farm ? farm.name : "Unknown Farm";
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedFarm ? `${selectedFarm.name} Crops` : "All Crops"}
          </h1>
          <p className="text-gray-600 mt-1">Manage your crop plantings and harvest schedule</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          Add Crop
        </Button>
      </div>

      {/* Add/Edit Form */}
<Modal
        isOpen={showAddForm}
        onClose={resetForm}
        title={editingCrop ? "Edit Crop" : "Add New Crop"}
      >
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!selectedFarm && (
            <FormField
              label="Farm"
              type="select"
              value={formData.farmId}
              onChange={(e) => setFormData({ ...formData, farmId: e.target.value })}
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
            label="Crop Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., Tomatoes, Corn, Lettuce"
            required
          />
          <FormField
            label="Variety"
            value={formData.variety}
            onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
            placeholder="e.g., Roma, Sweet Corn, Romaine"
            required
          />
          <FormField
            label="Planted Date"
            type="date"
            value={formData.plantedDate}
            onChange={(e) => setFormData({ ...formData, plantedDate: e.target.value })}
            required
          />
          <FormField
            label="Expected Harvest"
            type="date"
            value={formData.expectedHarvest}
            onChange={(e) => setFormData({ ...formData, expectedHarvest: e.target.value })}
            required
          />
          <FormField
            label="Growth Stage"
            type="select"
            value={formData.stage}
            onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
            options={[
              { value: "planted", label: "Planted" },
              { value: "growing", label: "Growing" },
              { value: "harvest", label: "Ready for Harvest" }
            ]}
          />
          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: "healthy", label: "Healthy" },
              { value: "attention", label: "Needs Attention" },
              { value: "struggling", label: "Struggling" }
            ]}
          />
          <FormField
            label="Notes"
            type="textarea"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            placeholder="Optional notes about this crop..."
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
              {editingCrop ? "Update Crop" : "Add Crop"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Crops List */}
      {crops.length === 0 ? (
        <Empty
          title="No crops planted yet"
          description={selectedFarm 
            ? `Start tracking crops for ${selectedFarm.name}` 
            : "Add your first crop to start tracking your plantings"
          }
          icon="Sprout"
          action={{
            label: "Add Crop",
            onClick: () => setShowAddForm(true),
            icon: "Plus"
          }}
        />
      ) : (
        <>
          {/* Crops Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-success/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Seed" className="h-4 w-4 text-success" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {crops.filter(c => c.stage === "planted").length}
                  </p>
                  <p className="text-sm text-gray-600">Planted</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-warning/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Sprout" className="h-4 w-4 text-warning" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {crops.filter(c => c.stage === "growing").length}
                  </p>
                  <p className="text-sm text-gray-600">Growing</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center space-x-3">
                <div className="h-8 w-8 bg-accent/10 rounded-lg flex items-center justify-center">
                  <ApperIcon name="Apple" className="h-4 w-4 text-accent" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {crops.filter(c => c.stage === "harvest").length}
                  </p>
                  <p className="text-sm text-gray-600">Ready to Harvest</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crops.map((crop) => (
              <div key={crop.Id}>
                <CropCard
                  crop={crop}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
                {!selectedFarm && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    {getFarmName(crop.farmId)}
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

export default Crops;