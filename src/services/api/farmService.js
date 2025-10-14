const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const farmService = {
  async getAll() {
    try {
      const response = await apperClient.fetchRecords('farm_c', {
        fields: [
{"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "soil_type_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "CreatedOn"}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(farm => ({
        Id: farm.Id,
        name: farm.name_c || farm.Name,
        size: farm.size_c,
        unit: farm.unit_c,
location: farm.location_c,
        soilType: farm.soil_type_c,
        currentAmount: farm.current_amount_c,
        createdAt: farm.CreatedOn
      }));
    } catch (error) {
      console.error("Error fetching farms:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const response = await apperClient.getRecordById('farm_c', parseInt(id), {
        fields: [
{"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "size_c"}},
          {"field": {"Name": "unit_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "soil_type_c"}},
          {"field": {"Name": "current_amount_c"}},
          {"field": {"Name": "CreatedOn"}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Farm not found");
      }

      const farm = response.data;
      return {
        Id: farm.Id,
        name: farm.name_c || farm.Name,
        size: farm.size_c,
        unit: farm.unit_c,
location: farm.location_c,
        soilType: farm.soil_type_c,
        currentAmount: farm.current_amount_c,
        createdAt: farm.CreatedOn
      };
    } catch (error) {
      console.error("Error fetching farm:", error?.response?.data?.message || error);
      throw new Error("Farm not found");
    }
  },

  async create(farmData) {
    try {
      const response = await apperClient.createRecord('farm_c', {
        records: [{
          Name: farmData.name,
name_c: farmData.name,
          size_c: parseFloat(farmData.size),
          unit_c: farmData.unit,
          location_c: farmData.location,
          soil_type_c: farmData.soilType,
          current_amount_c: parseFloat(farmData.currentAmount) || 0
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create farm:`, failed);
          throw new Error(failed[0].message || "Failed to create farm");
        }

        const created = response.results[0].data;
        return {
          Id: created.Id,
          name: created.name_c || created.Name,
          size: created.size_c,
unit: created.unit_c,
          location: created.location_c,
          soilType: created.soil_type_c,
          currentAmount: created.current_amount_c,
          createdAt: created.CreatedOn
        };
      }
    } catch (error) {
      console.error("Error creating farm:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, farmData) {
    try {
      const response = await apperClient.updateRecord('farm_c', {
        records: [{
          Id: parseInt(id),
          Name: farmData.name,
          name_c: farmData.name,
size_c: parseFloat(farmData.size),
          unit_c: farmData.unit,
          location_c: farmData.location,
          soil_type_c: farmData.soilType,
          current_amount_c: parseFloat(farmData.currentAmount) || 0
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update farm:`, failed);
          throw new Error(failed[0].message || "Failed to update farm");
        }

        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          name: updated.name_c || updated.Name,
          size: updated.size_c,
          unit: updated.unit_c,
location: updated.location_c,
          soilType: updated.soil_type_c,
          currentAmount: updated.current_amount_c,
          createdAt: updated.CreatedOn
        };
      }
    } catch (error) {
      console.error("Error updating farm:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await apperClient.deleteRecord('farm_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete farm:`, failed);
          throw new Error(failed[0].message || "Failed to delete farm");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting farm:", error?.response?.data?.message || error);
      throw error;
    }
  }
};