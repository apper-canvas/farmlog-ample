import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Modal from "@/components/atoms/Modal";
import FormField from "@/components/molecules/FormField";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { equipmentService } from "@/services/api/equipmentService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";
import { format } from "date-fns";
import EquipmentCard from "@/components/molecules/EquipmentCard";

const Equipments = () => {
const { selectedFarm, farms } = useOutletContext();
  const [equipments, setEquipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState(null);
  const [availableFarms, setAvailableFarms] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [formData, setFormData] = useState({
    farm_c: "",
    Name: "",
    equipment_type_c: "Tractor",
    manufacturer_c: "",
    model_c: "",
    purchase_date_c: new Date().toISOString().split('T')[0],
    purchase_price_c: "",
    condition_c: "Good",
    notes_c: ""
  });

  useEffect(() => {
    loadData();
  }, [selectedFarm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
const [equipmentsData, farmsData, totalValueData] = await Promise.all([
        selectedFarm ? equipmentService.getByFarmId(selectedFarm.Id) : equipmentService.getAll(),
        farms.length > 0 ? Promise.resolve(farms) : farmService.getAll(),
        equipmentService.getTotalValue(selectedFarm?.Id)
      ]);
      
      setEquipments(equipmentsData);
      setAvailableFarms(farmsData);
      setTotalValue(totalValueData);
      
if (selectedFarm && !formData.farm_c) {
        setFormData(prev => ({ ...prev, farm_c: selectedFarm.Id.toString() }));
      }
    } catch (err) {
      setError("Failed to load equipments");
      console.error("Equipments error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const equipmentData = {
        ...formData,
        purchasePrice: parseFloat(formData.purchasePrice)
      };
      
if (editingEquipment) {
        await equipmentService.update(editingEquipment.Id, equipmentData);
        toast.success("Equipment updated successfully");
      } else {
        await equipmentService.create(equipmentData);
        toast.success("Equipment added successfully");
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error(editingEquipment ? "Failed to update equipment" : "Failed to add equipment");
    }
  };

  const handleDelete = async (equipmentId) => {
    if (!window.confirm("Are you sure you want to delete this equipment?")) return;
    
    try {
      await equipmentService.delete(equipmentId);
      toast.success("Equipment deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to delete equipment");
    }
  };

  const handleEdit = (equipment) => {
    setEditingEquipment(equipment);
setFormData({
      farm_c: equipment.farm_c?.Id ? equipment.farm_c.Id.toString() : "",
      name: equipment.name,
      category: equipment.category,
      purchaseDate: equipment.purchaseDate,
      purchasePrice: equipment.purchasePrice.toString(),
      condition: equipment.condition,
      status: equipment.status,
      description: equipment.description
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
farm_c: selectedFarm ? selectedFarm.Id.toString() : "",
      Name: "",
      category: "tractor",
      purchaseDate: new Date().toISOString().split('T')[0],
      purchasePrice: "",
      condition: "good",
      status: "active",
      description: ""
    });
    setShowAddForm(false);
    setEditingEquipment(null);
  };

const getFarmName = (farm_c) => {
    // Handle both lookup object format and direct ID
    const farmId = farm_c?.Id || farm_c;
    const farm = availableFarms.find(f => f.Id.toString() === farmId.toString());
    return farm ? farm.name : "Unknown Farm";
  };

  const getEquipmentsByCategory = () => {
    const categories = {};
    equipments.forEach(equipment => {
      if (!categories[equipment.category]) {
        categories[equipment.category] = { count: 0, totalValue: 0 };
      }
      categories[equipment.category].count++;
      categories[equipment.category].totalValue += equipment.purchasePrice;
    });
    return categories;
  };

  const getActiveEquipmentCount = () => {
    return equipments.filter(e => e.status === 'active').length;
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const equipmentsByCategory = getEquipmentsByCategory();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedFarm ? `${selectedFarm.name} Equipment` : "All Equipment"}
          </h1>
          <p className="text-gray-600 mt-1">Manage your farm equipment inventory</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          Add Equipment
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-3xl font-bold text-gray-900">${totalValue.toLocaleString()}</p>
              <p className="text-sm text-gray-500">Active equipment only</p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="Wrench" className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Package" className="h-4 w-4 text-info" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{equipments.length}</p>
              <p className="text-sm text-gray-600">Total Equipment</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-success/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="CheckCircle" className="h-4 w-4 text-success" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{getActiveEquipmentCount()}</p>
              <p className="text-sm text-gray-600">Active</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      {Object.keys(equipmentsByCategory).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipment by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(equipmentsByCategory).map(([category, data]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 capitalize">{category}</span>
                  <span className="text-xs text-gray-600">{data.count} items</span>
                </div>
                <p className="text-xl font-bold text-gray-900">${data.totalValue.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Form */}
      <Modal isOpen={showAddForm} onClose={resetForm} title={editingEquipment ? "Edit Equipment" : "Add New Equipment"}>
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
            label="Equipment Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="e.g., John Deere Tractor"
            required
            className={!selectedFarm ? "" : "md:col-span-2"}
          />

          <FormField
            label="Category"
            type="select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: "tractor", label: "Tractor" },
              { value: "harvester", label: "Harvester" },
              { value: "irrigation", label: "Irrigation" },
              { value: "tools", label: "Tools" },
              { value: "vehicle", label: "Vehicle" },
              { value: "storage", label: "Storage" },
              { value: "processing", label: "Processing" },
              { value: "other", label: "Other" }
            ]}
          />

          <FormField
            label="Purchase Date"
            type="date"
            value={formData.purchaseDate}
            onChange={(e) => setFormData({ ...formData, purchaseDate: e.target.value })}
            required
          />

          <FormField
            label="Purchase Price"
            type="number"
            step="0.01"
            value={formData.purchasePrice}
            onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
            placeholder="0.00"
            required
          />

          <FormField
            label="Condition"
            type="select"
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            options={[
              { value: "excellent", label: "Excellent" },
              { value: "good", label: "Good" },
              { value: "fair", label: "Fair" },
              { value: "poor", label: "Poor" }
            ]}
          />

          <FormField
            label="Status"
            type="select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            options={[
              { value: "active", label: "Active" },
              { value: "maintenance", label: "Maintenance" },
              { value: "retired", label: "Retired" }
            ]}
          />

          <FormField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Details about the equipment"
            required
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
              {editingEquipment ? "Update Equipment" : "Add Equipment"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Equipment List */}
      {equipments.length === 0 ? (
        <Empty
          title="No equipment recorded yet"
          description={selectedFarm 
            ? `Start tracking equipment for ${selectedFarm.name}` 
            : "Add your first equipment to start managing inventory"
          }
          icon="Wrench"
          action={{
            label: "Add Equipment",
            onClick: () => setShowAddForm(true),
            icon: "Plus"
          }}
        />
      ) : (
        <div className="space-y-4">
          {equipments.map((equipment) => (
<div key={equipment.Id}>
              <EquipmentCard
                equipment={equipment}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {!selectedFarm && (
                <p className="text-xs text-gray-500 mt-1 ml-4">
{getFarmName(equipment.farm_c)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Equipments;