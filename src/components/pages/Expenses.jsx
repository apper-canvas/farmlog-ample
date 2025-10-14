import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Modal from "@/components/atoms/Modal";
import FormField from "@/components/molecules/FormField";
import ExpenseCard from "@/components/molecules/ExpenseCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import { expenseService } from "@/services/api/expenseService";
import { farmService } from "@/services/api/farmService";
import { toast } from "react-toastify";
import { format, startOfMonth, endOfMonth } from "date-fns";

const Expenses = () => {
  const { selectedFarm, farms } = useOutletContext();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [availableFarms, setAvailableFarms] = useState([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
const [formData, setFormData] = useState({
    farmId: "",
    category: "supplies",
    amount: "",
    date: new Date().toISOString().split('T')[0],
description: "",
    paymentMethod: "cash"
  });

  useEffect(() => {
    loadData();
  }, [selectedFarm]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [expensesData, farmsData, monthlyTotalData] = await Promise.all([
        selectedFarm ? expenseService.getByFarmId(selectedFarm.Id) : expenseService.getAll(),
        farms.length > 0 ? Promise.resolve(farms) : farmService.getAll(),
        expenseService.getMonthlyTotal(selectedFarm?.Id)
      ]);
      
      setExpenses(expensesData);
      setAvailableFarms(farmsData);
      setMonthlyTotal(monthlyTotalData);
      
      // Set default farm in form
      if (selectedFarm && !formData.farmId) {
        setFormData(prev => ({ ...prev, farmId: selectedFarm.Id.toString() }));
      }
    } catch (err) {
      setError("Failed to load expenses");
      console.error("Expenses error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...formData,
        amount: parseFloat(formData.amount)
      };
      
      if (editingExpense) {
        await expenseService.update(editingExpense.Id, expenseData);
        toast.success("Expense updated successfully");
      } else {
        await expenseService.create(expenseData);
        toast.success("Expense added successfully");
      }
      resetForm();
      loadData();
    } catch (err) {
      toast.error(editingExpense ? "Failed to update expense" : "Failed to add expense");
    }
  };

  const handleDelete = async (expenseId) => {
    if (!window.confirm("Are you sure you want to delete this expense?")) return;
    
    try {
      await expenseService.delete(expenseId);
      toast.success("Expense deleted successfully");
      loadData();
    } catch (err) {
      toast.error("Failed to delete expense");
    }
  };

  const handleEdit = (expense) => {
    setEditingExpense(expense);
setFormData({
      farmId: expense.farmId,
      category: expense.category,
      amount: expense.amount.toString(),
date: expense.date,
      description: expense.description,
      paymentMethod: expense.paymentMethod
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
setFormData({
      farmId: selectedFarm ? selectedFarm.Id.toString() : "",
      category: "supplies",
      amount: "",
date: new Date().toISOString().split('T')[0],
      description: "",
      paymentMethod: "cash"
    });
    setShowAddForm(false);
    setEditingExpense(null);
  };

  const getFarmName = (farmId) => {
    const farm = availableFarms.find(f => f.Id.toString() === farmId.toString());
    return farm ? farm.name : "Unknown Farm";
  };

  const getExpensesByCategory = () => {
    const categories = {};
    expenses.forEach(expense => {
      if (!categories[expense.category]) {
        categories[expense.category] = { count: 0, total: 0 };
      }
      categories[expense.category].count++;
      categories[expense.category].total += expense.amount;
    });
    return categories;
  };

  if (loading) return <Loading type="cards" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const expensesByCategory = getExpensesByCategory();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedFarm ? `${selectedFarm.name} Expenses` : "All Expenses"}
          </h1>
          <p className="text-gray-600 mt-1">Track and manage your farm expenses</p>
        </div>
        <Button
          onClick={() => setShowAddForm(true)}
          className="flex items-center gap-2"
        >
          <ApperIcon name="Plus" size={18} />
          Add Expense
        </Button>
      </div>

      {/* Monthly Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-3xl font-bold text-gray-900">${monthlyTotal.toFixed(2)}</p>
              <p className="text-sm text-gray-500">
                {format(new Date(), "MMMM yyyy")}
              </p>
            </div>
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <ApperIcon name="DollarSign" className="h-6 w-6 text-primary" />
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-info/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="Receipt" className="h-4 w-4 text-info" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">{expenses.length}</p>
              <p className="text-sm text-gray-600">Total Expenses</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 bg-warning/10 rounded-lg flex items-center justify-center">
              <ApperIcon name="TrendingUp" className="h-4 w-4 text-warning" />
            </div>
            <div>
              <p className="text-lg font-semibold text-gray-900">
                ${expenses.length > 0 ? (expenses.reduce((sum, e) => sum + e.amount, 0) / expenses.length).toFixed(0) : '0'}
              </p>
              <p className="text-sm text-gray-600">Average</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Category Breakdown */}
      {Object.keys(expensesByCategory).length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Expenses by Category</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Object.entries(expensesByCategory).map(([category, data]) => (
              <div key={category} className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 capitalize">{category}</span>
                  <span className="text-xs text-gray-600">{data.count} items</span>
                </div>
                <p className="text-xl font-bold text-gray-900">${data.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Add/Edit Form */}
<Modal isOpen={showAddForm} onClose={resetForm} title={editingExpense ? "Edit Expense" : "Add New Expense"}>
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
            label="Category"
            type="select"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            options={[
              { value: "seeds", label: "Seeds & Plants" },
              { value: "equipment", label: "Equipment" },
              { value: "supplies", label: "Supplies" },
              { value: "labor", label: "Labor" },
              { value: "fuel", label: "Fuel" },
              { value: "utilities", label: "Utilities" },
              { value: "maintenance", label: "Maintenance" },
              { value: "other", label: "Other" }
            ]}
            className={!selectedFarm ? "" : "md:col-span-2"}
          />

          <FormField
            label="Amount"
            type="number"
            step="0.01"
            value={formData.amount}
            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
            placeholder="0.00"
            required
          />

          <FormField
            label="Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            required
          />

          <FormField
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="What was this expense for?"
            required
            className="md:col-span-2"
          />

<FormField
            label="Payment Method"
            type="select"
            value={formData.paymentMethod}
            onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
            options={[
              { value: "cash", label: "Cash" },
              { value: "check", label: "Check" },
              { value: "credit card", label: "Credit Card" },
              { value: "debit card", label: "Debit Card" },
              { value: "bank transfer", label: "Bank Transfer" }
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
              {editingExpense ? "Update Expense" : "Add Expense"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Expenses List */}
      {expenses.length === 0 ? (
        <Empty
          title="No expenses recorded yet"
          description={selectedFarm 
            ? `Start tracking expenses for ${selectedFarm.name}` 
            : "Add your first expense to start tracking farm costs"
          }
          icon="DollarSign"
          action={{
            label: "Add Expense",
            onClick: () => setShowAddForm(true),
            icon: "Plus"
          }}
        />
      ) : (
        <div className="space-y-4">
          {expenses.map((expense) => (
            <div key={expense.Id}>
              <ExpenseCard
                expense={expense}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
              {!selectedFarm && (
                <p className="text-xs text-gray-500 mt-1 ml-4">
                  {getFarmName(expense.farmId)}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Expenses;