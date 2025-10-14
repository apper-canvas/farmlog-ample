import expensesData from "@/services/mockData/expenses.json";

let expenses = [...expensesData];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const expenseService = {
  async getAll() {
    await delay(300);
    return [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  async getByFarmId(farmId) {
    await delay(250);
    return expenses
      .filter(e => e.farmId === farmId.toString())
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map(e => ({ ...e }));
  },

  async getMonthlyTotal(farmId = null, month = null, year = null) {
    await delay(200);
    const now = new Date();
    const targetMonth = month || now.getMonth() + 1;
    const targetYear = year || now.getFullYear();
    
    let filtered = expenses;
    if (farmId) {
      filtered = expenses.filter(e => e.farmId === farmId.toString());
    }
    
    const monthlyExpenses = filtered.filter(e => {
      const expenseDate = new Date(e.date);
      return expenseDate.getMonth() + 1 === targetMonth && 
             expenseDate.getFullYear() === targetYear;
    });
    
    return monthlyExpenses.reduce((total, expense) => total + expense.amount, 0);
  },

  async getById(id) {
    await delay(200);
    const expense = expenses.find(e => e.Id === parseInt(id));
    if (!expense) {
      throw new Error("Expense not found");
    }
    return { ...expense };
  },

  async create(expenseData) {
    await delay(400);
    const newExpense = {
      Id: Math.max(...expenses.map(e => e.Id)) + 1,
      ...expenseData
    };
    expenses.unshift(newExpense);
    return { ...newExpense };
  },

  async update(id, expenseData) {
    await delay(350);
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Expense not found");
    }
    expenses[index] = { ...expenses[index], ...expenseData };
    return { ...expenses[index] };
  },

  async delete(id) {
    await delay(250);
    const index = expenses.findIndex(e => e.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Expense not found");
    }
    expenses.splice(index, 1);
    return true;
  }
};