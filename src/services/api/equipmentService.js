// Initialize ApperClient
const { ApperClient } = window.ApperSDK;
const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'equipments_c';

export const equipmentService = {
  async getAll() {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "farm_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "equipment_type_c" } },
          { field: { Name: "manufacturer_c" } },
          { field: { Name: "model_c" } },
          { field: { Name: "purchase_date_c" } },
          { field: { Name: "purchase_price_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "notes_c" } }
        ],
        orderBy: [{ fieldName: "purchase_date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching equipments:", error?.message || error);
      return [];
    }
  },

  async getByFarmId(farmId) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "farm_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "equipment_type_c" } },
          { field: { Name: "manufacturer_c" } },
          { field: { Name: "model_c" } },
          { field: { Name: "purchase_date_c" } },
          { field: { Name: "purchase_price_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "notes_c" } }
        ],
        where: [
          { FieldName: "farm_c", Operator: "EqualTo", Values: [parseInt(farmId)] }
        ],
        orderBy: [{ fieldName: "purchase_date_c", sorttype: "DESC" }],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      const response = await apperClient.fetchRecords(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching equipments by farm:", error?.message || error);
      return [];
    }
  },

  async getTotalValue(farmId = null) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "purchase_price_c" } }
        ],
        pagingInfo: { limit: 1000, offset: 0 }
      };

      if (farmId) {
        params.where = [
          { FieldName: "farm_c", Operator: "EqualTo", Values: [parseInt(farmId)] }
        ];
      }

      const response = await apperClient.fetchRecords(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        return 0;
      }

      const equipments = response.data || [];
      return equipments.reduce((total, equipment) => {
        return total + (equipment.purchase_price_c || 0);
      }, 0);
    } catch (error) {
      console.error("Error calculating equipment value:", error?.message || error);
      return 0;
    }
  },

  async getById(id) {
    try {
      const params = {
        fields: [
          { field: { Name: "Id" } },
          { field: { Name: "Name" } },
          { field: { Name: "farm_c" }, referenceField: { field: { Name: "Name" } } },
          { field: { Name: "equipment_type_c" } },
          { field: { Name: "manufacturer_c" } },
          { field: { Name: "model_c" } },
          { field: { Name: "purchase_date_c" } },
          { field: { Name: "purchase_price_c" } },
          { field: { Name: "condition_c" } },
          { field: { Name: "notes_c" } }
        ]
      };

      const response = await apperClient.getRecordById(TABLE_NAME, id, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Equipment not found");
      }

      if (!response.data) {
        throw new Error("Equipment not found");
      }

      return response.data;
    } catch (error) {
      console.error("Error fetching equipment:", error?.message || error);
      throw new Error(error?.message || "Equipment not found");
    }
  },

  async create(equipmentData) {
    try {
      // Only include Updateable fields
      const payload = {
        Name: equipmentData.Name,
        farm_c: parseInt(equipmentData.farm_c),
        equipment_type_c: equipmentData.equipment_type_c,
        purchase_date_c: equipmentData.purchase_date_c,
        purchase_price_c: parseFloat(equipmentData.purchase_price_c),
        condition_c: equipmentData.condition_c
      };

      // Add optional fields only if they have values
      if (equipmentData.manufacturer_c) {
        payload.manufacturer_c = equipmentData.manufacturer_c;
      }
      if (equipmentData.model_c) {
        payload.model_c = equipmentData.model_c;
      }
      if (equipmentData.notes_c) {
        payload.notes_c = equipmentData.notes_c;
      }

      const params = {
        records: [payload]
      };

      const response = await apperClient.createRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to create equipment");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create equipment:`, failed);
          const errorMessage = failed[0].message || failed[0].errors?.[0] || "Failed to create equipment";
          throw new Error(errorMessage);
        }
        return response.results[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error creating equipment:", error?.message || error);
      throw error;
    }
  },

  async update(id, equipmentData) {
    try {
      // Only include Updateable fields
      const payload = {
        Id: parseInt(id),
        Name: equipmentData.Name,
        farm_c: parseInt(equipmentData.farm_c),
        equipment_type_c: equipmentData.equipment_type_c,
        purchase_date_c: equipmentData.purchase_date_c,
        purchase_price_c: parseFloat(equipmentData.purchase_price_c),
        condition_c: equipmentData.condition_c
      };

      // Add optional fields only if they have values
      if (equipmentData.manufacturer_c) {
        payload.manufacturer_c = equipmentData.manufacturer_c;
      }
      if (equipmentData.model_c) {
        payload.model_c = equipmentData.model_c;
      }
      if (equipmentData.notes_c) {
        payload.notes_c = equipmentData.notes_c;
      }

      const params = {
        records: [payload]
      };

      const response = await apperClient.updateRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to update equipment");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update equipment:`, failed);
          const errorMessage = failed[0].message || failed[0].errors?.[0] || "Failed to update equipment";
          throw new Error(errorMessage);
        }
        return response.results[0].data;
      }

      throw new Error("Unexpected response format");
    } catch (error) {
      console.error("Error updating equipment:", error?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };

      const response = await apperClient.deleteRecord(TABLE_NAME, params);

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message || "Failed to delete equipment");
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete equipment:`, failed);
          const errorMessage = failed[0].message || "Failed to delete equipment";
          throw new Error(errorMessage);
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error("Error deleting equipment:", error?.message || error);
      throw error;
    }
  }
};