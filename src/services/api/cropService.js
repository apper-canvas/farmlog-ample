const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const cropService = {
  async getAll() {
    try {
      const response = await apperClient.fetchRecords('crop_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planted_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(crop => ({
        Id: crop.Id,
        farmId: crop.farm_id_c?.Id?.toString() || "",
        name: crop.name_c || crop.Name,
        variety: crop.variety_c,
        plantedDate: crop.planted_date_c,
        expectedHarvest: crop.expected_harvest_c,
        stage: crop.stage_c,
        status: crop.status_c,
        notes: crop.notes_c || ""
      }));
    } catch (error) {
      console.error("Error fetching crops:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByFarmId(farmId) {
    try {
      const response = await apperClient.fetchRecords('crop_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planted_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}],
        orderBy: [{"fieldName": "CreatedOn", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(crop => ({
        Id: crop.Id,
        farmId: crop.farm_id_c?.Id?.toString() || "",
        name: crop.name_c || crop.Name,
        variety: crop.variety_c,
        plantedDate: crop.planted_date_c,
        expectedHarvest: crop.expected_harvest_c,
        stage: crop.stage_c,
        status: crop.status_c,
        notes: crop.notes_c || ""
      }));
    } catch (error) {
      console.error("Error fetching crops by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const response = await apperClient.getRecordById('crop_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "variety_c"}},
          {"field": {"Name": "planted_date_c"}},
          {"field": {"Name": "expected_harvest_c"}},
          {"field": {"Name": "stage_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Crop not found");
      }

      const crop = response.data;
      return {
        Id: crop.Id,
        farmId: crop.farm_id_c?.Id?.toString() || "",
        name: crop.name_c || crop.Name,
        variety: crop.variety_c,
        plantedDate: crop.planted_date_c,
        expectedHarvest: crop.expected_harvest_c,
        stage: crop.stage_c,
        status: crop.status_c,
        notes: crop.notes_c || ""
      };
    } catch (error) {
      console.error("Error fetching crop:", error?.response?.data?.message || error);
      throw new Error("Crop not found");
    }
  },

  async create(cropData) {
    try {
      const response = await apperClient.createRecord('crop_c', {
        records: [{
          Name: cropData.name,
          farm_id_c: parseInt(cropData.farmId),
          name_c: cropData.name,
          variety_c: cropData.variety,
          planted_date_c: cropData.plantedDate,
          expected_harvest_c: cropData.expectedHarvest,
          stage_c: cropData.stage || "planted",
          status_c: cropData.status || "healthy",
          notes_c: cropData.notes || ""
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create crop:`, failed);
          throw new Error(failed[0].message || "Failed to create crop");
        }

        const created = response.results[0].data;
        return {
          Id: created.Id,
          farmId: created.farm_id_c?.Id?.toString() || cropData.farmId,
          name: created.name_c || created.Name,
          variety: created.variety_c,
          plantedDate: created.planted_date_c,
          expectedHarvest: created.expected_harvest_c,
          stage: created.stage_c,
          status: created.status_c,
          notes: created.notes_c || ""
        };
      }
    } catch (error) {
      console.error("Error creating crop:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, cropData) {
    try {
      const response = await apperClient.updateRecord('crop_c', {
        records: [{
          Id: parseInt(id),
          Name: cropData.name,
          farm_id_c: parseInt(cropData.farmId),
          name_c: cropData.name,
          variety_c: cropData.variety,
          planted_date_c: cropData.plantedDate,
          expected_harvest_c: cropData.expectedHarvest,
          stage_c: cropData.stage,
          status_c: cropData.status,
          notes_c: cropData.notes || ""
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update crop:`, failed);
          throw new Error(failed[0].message || "Failed to update crop");
        }

        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          farmId: updated.farm_id_c?.Id?.toString() || cropData.farmId,
          name: updated.name_c || updated.Name,
          variety: updated.variety_c,
          plantedDate: updated.planted_date_c,
          expectedHarvest: updated.expected_harvest_c,
          stage: updated.stage_c,
          status: updated.status_c,
          notes: updated.notes_c || ""
        };
      }
    } catch (error) {
      console.error("Error updating crop:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await apperClient.deleteRecord('crop_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete crop:`, failed);
          throw new Error(failed[0].message || "Failed to delete crop");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting crop:", error?.response?.data?.message || error);
      throw error;
    }
  }
};