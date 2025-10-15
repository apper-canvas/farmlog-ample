import mockData from '@/services/mockData/equipment.json';

// Utility function for realistic delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const equipmentService = {
  async getAll() {
    try {
      await delay(300);
      return [...mockData].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    } catch (error) {
      console.error("Error fetching equipments:", error);
      return [];
    }
  },

  async getByFarmId(farmId) {
    try {
      await delay(300);
      const filtered = mockData.filter(e => e.farmId.toString() === farmId.toString());
      return [...filtered].sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));
    } catch (error) {
      console.error("Error fetching equipments by farm:", error);
      return [];
    }
  },

  async getTotalValue(farmId = null) {
    try {
      await delay(200);
      const equipments = farmId 
        ? mockData.filter(e => e.farmId.toString() === farmId.toString())
        : mockData;
      
      return equipments.reduce((total, equipment) => {
        if (equipment.status !== 'retired') {
          return total + (equipment.purchasePrice || 0);
        }
        return total;
      }, 0);
    } catch (error) {
      console.error("Error calculating equipment value:", error);
      return 0;
    }
  },

  async getById(id) {
    try {
      await delay(200);
      const equipment = mockData.find(e => e.Id.toString() === id.toString());
      if (!equipment) {
        throw new Error("Equipment not found");
      }
      return { ...equipment };
    } catch (error) {
      console.error("Error fetching equipment:", error);
      throw new Error("Equipment not found");
    }
  },

  async create(equipmentData) {
    try {
      await delay(300);
      const newEquipment = {
        Id: Date.now(),
        name: equipmentData.name,
        farmId: parseInt(equipmentData.farmId),
        category: equipmentData.category,
        purchaseDate: equipmentData.purchaseDate,
        purchasePrice: parseFloat(equipmentData.purchasePrice),
        condition: equipmentData.condition,
        status: equipmentData.status,
        description: equipmentData.description
      };
      
      mockData.push(newEquipment);
      return { ...newEquipment };
    } catch (error) {
      console.error("Error creating equipment:", error);
      throw error;
    }
  },

  async update(id, equipmentData) {
    try {
      await delay(300);
      const index = mockData.findIndex(e => e.Id.toString() === id.toString());
      
      if (index === -1) {
        throw new Error("Equipment not found");
      }
      
      mockData[index] = {
        ...mockData[index],
        name: equipmentData.name,
        farmId: parseInt(equipmentData.farmId),
        category: equipmentData.category,
        purchaseDate: equipmentData.purchaseDate,
        purchasePrice: parseFloat(equipmentData.purchasePrice),
        condition: equipmentData.condition,
        status: equipmentData.status,
        description: equipmentData.description
      };
      
      return { ...mockData[index] };
    } catch (error) {
      console.error("Error updating equipment:", error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await delay(300);
      const index = mockData.findIndex(e => e.Id.toString() === id.toString());
      
      if (index === -1) {
        throw new Error("Equipment not found");
      }
      
      mockData.splice(index, 1);
      return true;
    } catch (error) {
      console.error("Error deleting equipment:", error);
      throw error;
    }
  }
};