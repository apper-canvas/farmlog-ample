const { ApperClient } = window.ApperSDK;

const apperClient = new ApperClient({
  apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
  apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
});

export const taskService = {
  async getAll() {
    try {
      const response = await apperClient.fetchRecords('task_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "crop_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        farmId: task.farm_id_c?.Id?.toString() || "",
        cropId: task.crop_id_c?.Id?.toString() || "",
        title: task.title_c || task.Name,
        type: task.type_c,
        dueDate: task.due_date_c,
        priority: task.priority_c,
        completed: task.completed_c || false,
        recurring: task.recurring_c || false,
        notes: task.notes_c || ""
      }));
    } catch (error) {
      console.error("Error fetching tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getByFarmId(farmId) {
    try {
      const response = await apperClient.fetchRecords('task_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "crop_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [{"FieldName": "farm_id_c", "Operator": "EqualTo", "Values": [parseInt(farmId)]}],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}]
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        farmId: task.farm_id_c?.Id?.toString() || "",
        cropId: task.crop_id_c?.Id?.toString() || "",
        title: task.title_c || task.Name,
        type: task.type_c,
        dueDate: task.due_date_c,
        priority: task.priority_c,
        completed: task.completed_c || false,
        recurring: task.recurring_c || false,
        notes: task.notes_c || ""
      }));
    } catch (error) {
      console.error("Error fetching tasks by farm:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getUpcoming(limit = 5) {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await apperClient.fetchRecords('task_c', {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "crop_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ],
        where: [
          {"FieldName": "completed_c", "Operator": "EqualTo", "Values": [false]},
          {"FieldName": "due_date_c", "Operator": "GreaterThanOrEqualTo", "Values": [today]}
        ],
        orderBy: [{"fieldName": "due_date_c", "sorttype": "ASC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      });

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data.map(task => ({
        Id: task.Id,
        farmId: task.farm_id_c?.Id?.toString() || "",
        cropId: task.crop_id_c?.Id?.toString() || "",
        title: task.title_c || task.Name,
        type: task.type_c,
        dueDate: task.due_date_c,
        priority: task.priority_c,
        completed: task.completed_c || false,
        recurring: task.recurring_c || false,
        notes: task.notes_c || ""
      }));
    } catch (error) {
      console.error("Error fetching upcoming tasks:", error?.response?.data?.message || error);
      return [];
    }
  },

  async getById(id) {
    try {
      const response = await apperClient.getRecordById('task_c', parseInt(id), {
        fields: [
          {"field": {"Name": "Id"}},
          {"field": {"Name": "Name"}},
          {"field": {"Name": "title_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "due_date_c"}},
          {"field": {"Name": "priority_c"}},
          {"field": {"Name": "completed_c"}},
          {"field": {"Name": "recurring_c"}},
          {"field": {"Name": "notes_c"}},
          {"field": {"name": "farm_id_c"}, "referenceField": {"field": {"Name": "Name"}}},
          {"field": {"name": "crop_id_c"}, "referenceField": {"field": {"Name": "Name"}}}
        ]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error("Task not found");
      }

      const task = response.data;
      return {
        Id: task.Id,
        farmId: task.farm_id_c?.Id?.toString() || "",
        cropId: task.crop_id_c?.Id?.toString() || "",
        title: task.title_c || task.Name,
        type: task.type_c,
        dueDate: task.due_date_c,
        priority: task.priority_c,
        completed: task.completed_c || false,
        recurring: task.recurring_c || false,
        notes: task.notes_c || ""
      };
    } catch (error) {
      console.error("Error fetching task:", error?.response?.data?.message || error);
      throw new Error("Task not found");
    }
  },

  async create(taskData) {
    try {
      const response = await apperClient.createRecord('task_c', {
        records: [{
          Name: taskData.title,
          farm_id_c: parseInt(taskData.farmId),
          crop_id_c: taskData.cropId ? parseInt(taskData.cropId) : undefined,
          title_c: taskData.title,
          type_c: taskData.type,
          due_date_c: taskData.dueDate,
          priority_c: taskData.priority,
          completed_c: false,
          recurring_c: taskData.recurring || false,
          notes_c: taskData.notes || ""
        }]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to create task:`, failed);
          throw new Error(failed[0].message || "Failed to create task");
        }

        const created = response.results[0].data;
        return {
          Id: created.Id,
          farmId: created.farm_id_c?.Id?.toString() || taskData.farmId,
          cropId: created.crop_id_c?.Id?.toString() || taskData.cropId || "",
          title: created.title_c || created.Name,
          type: created.type_c,
          dueDate: created.due_date_c,
          priority: created.priority_c,
          completed: created.completed_c || false,
          recurring: created.recurring_c || false,
          notes: created.notes_c || ""
        };
      }
    } catch (error) {
      console.error("Error creating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async update(id, taskData) {
    try {
      const updatePayload = {
        Id: parseInt(id),
        Name: taskData.title
      };

      if (taskData.farmId) updatePayload.farm_id_c = parseInt(taskData.farmId);
      if (taskData.cropId) updatePayload.crop_id_c = parseInt(taskData.cropId);
      if (taskData.title) updatePayload.title_c = taskData.title;
      if (taskData.type) updatePayload.type_c = taskData.type;
      if (taskData.dueDate) updatePayload.due_date_c = taskData.dueDate;
      if (taskData.priority) updatePayload.priority_c = taskData.priority;
      if (taskData.completed !== undefined) updatePayload.completed_c = taskData.completed;
      if (taskData.recurring !== undefined) updatePayload.recurring_c = taskData.recurring;
      if (taskData.notes !== undefined) updatePayload.notes_c = taskData.notes;

      const response = await apperClient.updateRecord('task_c', {
        records: [updatePayload]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to update task:`, failed);
          throw new Error(failed[0].message || "Failed to update task");
        }

        const updated = response.results[0].data;
        return {
          Id: updated.Id,
          farmId: updated.farm_id_c?.Id?.toString() || taskData.farmId || "",
          cropId: updated.crop_id_c?.Id?.toString() || taskData.cropId || "",
          title: updated.title_c || updated.Name,
          type: updated.type_c,
          dueDate: updated.due_date_c,
          priority: updated.priority_c,
          completed: updated.completed_c || false,
          recurring: updated.recurring_c || false,
          notes: updated.notes_c || ""
        };
      }
    } catch (error) {
      console.error("Error updating task:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async toggleComplete(id) {
    try {
      const task = await this.getById(id);
      return await this.update(id, { completed: !task.completed });
    } catch (error) {
      console.error("Error toggling task completion:", error?.response?.data?.message || error);
      throw error;
    }
  },

  async delete(id) {
    try {
      const response = await apperClient.deleteRecord('task_c', {
        RecordIds: [parseInt(id)]
      });

      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }

      if (response.results) {
        const failed = response.results.filter(r => !r.success);
        if (failed.length > 0) {
          console.error(`Failed to delete task:`, failed);
          throw new Error(failed[0].message || "Failed to delete task");
        }
      }

      return true;
    } catch (error) {
      console.error("Error deleting task:", error?.response?.data?.message || error);
      throw error;
    }
  }
};