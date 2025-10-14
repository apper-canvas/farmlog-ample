const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const expenseService = {
  async getAll() {
    try {
      const response = await apperClient.fetchRecords('expense_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(expense => ({
        Id: expense.Id,
        farmId: expense.farm_id_c?.Id?.toString() || "",
        category: expense.category_c,
        amount: expense.amount_c,
        date: expense.date_c,
        description: expense.description_c || expense.Name,
        paymentMethod: expense.payment_method_c
      }));
    } catch (error) {
      console.error("Error fetching expenses:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByFarmId(farmId) {
    try {
      const response = await apperClient.fetchRecords('expense_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}],
        orderBy: [{"fieldName": "date_c", "sorttype": "DESC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(expense => ({
        Id: expense.Id,
        farmId: expense.farm_id_c?.Id?.toString() || "",
        category: expense.category_c,
        amount: expense.amount_c,
        date: expense.date_c,
        description: expense.description_c || expense.Name,
        paymentMethod: expense.payment_method_c
      }));
    } catch (error) {
      console.error("Error fetching expenses by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getMonthlyTotal(farmId = null, month = null, year = null) {
    try {
      const now = new Date();
      const targetMonth = month || now.getMonth() + 1;
      const targetYear = year || now.getFullYear();
      
      const startDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-01`;
      const lastDay = new Date(targetYear, targetMonth, 0).getDate();
      const endDate = `${targetYear}-${String(targetMonth).padStart(2, '0')}-${lastDay}`;

      const whereConditions = [
        {"FieldName": "date_c", "Operator": "GreaterThanOrEqualTo", "Values": [startDate]},
        {"FieldName": "date_c", "Operator": "LessThanOrEqualTo", "Values": [endDate]}
      ];

      if (farmId) {
        whereConditions.push({"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]});
      }

      const response = await apperClient.fetchRecords('expense_c', {
        fields: [
          {"field": {"Name": "amount_c"}}
        ],
        where: whereConditions
      });

      if (!response.success) {
        console.error(response.message);
        return 0;
      }

      return response.data.reduce((total, expense) => total + (expense.amount_c || 0), 0);
    } catch (error) {
      console.error("Error calculating monthly total:", error?.response?.data?.message || error);
      return 0;
    }
  },

  async getById(id) {
    try {
      const response = await apperClient.getRecordById('expense_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "category_c"}},
          {"field": {"Name": "amount_c"}},
          {"field": {"Name": "date_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "payment_method_c"}},
          {"field": {"name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Expense not found");
      }

      const expense = response.data;
      return {
        Id: expense.Id,
        farmId: expense.farm_id_c?.Id?.toString() || "",
        category: expense.category_c,
        amount: expense.amount_c,
        date: expense.date_c,
        description: expense.description_c || expense.Name,
        paymentMethod: expense.payment_method_c
      };
    } catch (error) {
      console.error("Error fetching expense:", error?.response?.data?.message || error);
      throw new Error("Expense not found");
    }
  },

  async create(expenseData) {
    try {
      const response = await apperClient.createRecord('expense_c', {
        records: [{
          Name: expenseData.description,
          farm_id_c: parseInt(expenseData.farmId),
          category_c: expenseData.category,
          amount_c: parseFloat(expenseData.amount),
          date_c: expenseData.date,
          description_c: expenseData.description,
          payment_method_c: expenseData.paymentMethod
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create expense:`, failed);
          throw new Error(failed[0].message || "Failed to create expense");
        }

        const created = response.results[0].data;
        return {
          Id: created.Id,
          farmId: created.farm_id_c?.Id?.toString() || expenseData.farmId,
          category: created.category_c,
          amount: created.amount_c,
          date: created.date_c,
          description: created.description_c || created.Name,
          paymentMethod: created.payment_method_c
        };
      }
    } catch (error) {
      console.error("Error creating expense:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, expenseData) {
    try {
      const response = await apperClient.updateRecord('expense_c', {
        records: [{
          Id: parseInt(id),
          Name: expenseData.description,
          farm_id_c: parseInt(expenseData.farmId),
          category_c: expenseData.category,
          amount_c: parseFloat(expenseData.amount),
          date_c: expenseData.date,
          description_c: expenseData.description,
          payment_method_c: expenseData.paymentMethod
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update expense:`, failed);
          throw new Error(failed[0].message || "Failed to update expense");
        }

        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          farmId: updated.farm_id_c?.Id?.toString() || expenseData.farmId,
          category: updated.category_c,
          amount: updated.amount_c,
          date: updated.date_c,
          description: updated.description_c || updated.Name,
          paymentMethod: updated.payment_method_c
        };
      }
    } catch (error) {
      console.error("Error updating expense:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await apperClient.deleteRecord('expense_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete expense:`, failed);
          throw new Error(failed[0].message || "Failed to delete expense");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting expense:", error?.response?.data?.message || error);
      throw error;
    }
  }
};