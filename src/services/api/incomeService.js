import { toast } from 'react-toastify';

const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

const TABLE_NAME = 'income_c';

// Get all income records
async function getAll() {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { name: "farm_id_c" }, referenceField: { field: { Name: "Name" } } },
        { field: { Name: "amount_c" } },
        { field: { Name: "date_c" } }
      ],
      orderBy: [{ fieldName: "date_c", sorttype: "DESC" }],
      pagingInfo: { limit: 100, offset: 0 }
    };

    const response = await apperClient.fetchRecords(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    if (!response?.data?.length) {
      return [];
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching income records:", error?.response?.data?.message || error);
    toast.error("Failed to load income records");
    return [];
  }
}

// Get income by ID
async function getById(id) {
  try {
    const params = {
      fields: [
        { field: { Name: "Name" } },
        { field: { Name: "Tags" } },
        { field: { name: "farm_id_c" }, referenceField: { field: { Name: "Name" } } },
        { field: { Name: "amount_c" } },
        { field: { Name: "date_c" } }
      ]
    };

    const response = await apperClient.getRecordById(TABLE_NAME, id, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return null;
    }

    if (!response?.data) {
      return null;
    }

    return response.data;
  } catch (error) {
    console.error(`Error fetching income ${id}:`, error?.response?.data?.message || error);
    toast.error("Failed to load income details");
    return null;
  }
}

// Create new income records
async function create(incomeData) {
  try {
    const records = Array.isArray(incomeData) ? incomeData : [incomeData];
    
    // Only include Updateable fields
    const cleanedRecords = records.map(record => ({
      Name: record.Name,
      Tags: record.Tags || "",
      farm_id_c: parseInt(record.farm_id_c),
      amount_c: parseFloat(record.amount_c),
      date_c: record.date_c
    }));

    const params = {
      records: cleanedRecords
    };

    const response = await apperClient.createRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to create ${failed.length} income records: ${JSON.stringify(failed)}`);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      return successful.map(r => r.data);
    }

    return [];
  } catch (error) {
    console.error("Error creating income records:", error?.response?.data?.message || error);
    toast.error("Failed to create income");
    return [];
  }
}

// Update income records
async function update(incomeData) {
  try {
    const records = Array.isArray(incomeData) ? incomeData : [incomeData];
    
    // Only include Id and Updateable fields
    const cleanedRecords = records.map(record => ({
      Id: record.Id,
      Name: record.Name,
      Tags: record.Tags || "",
      farm_id_c: parseInt(record.farm_id_c),
      amount_c: parseFloat(record.amount_c),
      date_c: record.date_c
    }));

    const params = {
      records: cleanedRecords
    };

    const response = await apperClient.updateRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return [];
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to update ${failed.length} income records: ${JSON.stringify(failed)}`);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      return successful.map(r => r.data);
    }

    return [];
  } catch (error) {
    console.error("Error updating income records:", error?.response?.data?.message || error);
    toast.error("Failed to update income");
    return [];
  }
}

// Delete income records
async function deleteIncome(ids) {
  try {
    const recordIds = Array.isArray(ids) ? ids : [ids];

    const params = {
      RecordIds: recordIds
    };

    const response = await apperClient.deleteRecord(TABLE_NAME, params);

    if (!response.success) {
      console.error(response.message);
      toast.error(response.message);
      return false;
    }

    if (response.results) {
      const successful = response.results.filter(r => r.success);
      const failed = response.results.filter(r => !r.success);

      if (failed.length > 0) {
        console.error(`Failed to delete ${failed.length} income records: ${JSON.stringify(failed)}`);
        failed.forEach(record => {
          if (record.message) toast.error(record.message);
        });
      }
      return successful.length === recordIds.length;
    }

    return false;
  } catch (error) {
    console.error("Error deleting income records:", error?.response?.data?.message || error);
    toast.error("Failed to delete income");
    return false;
  }
}

export const incomeService = {
  getAll,
  getById,
  create,
  update,
  delete: deleteIncome
};