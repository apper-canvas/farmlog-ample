import { useState, useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Modal from '@/components/atoms/Modal';
import FormField from '@/components/molecules/FormField';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import Badge from '@/components/atoms/Badge';
import { incomeService } from '@/services/api/incomeService';
import { farmService } from '@/services/api/farmService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function Income() {
  const [incomes, setIncomes] = useState([]);
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    Id: null,
    Name: '',
    farm_id_c: '',
    amount_c: '',
    date_c: '',
    Tags: ''
  });

  useEffect(() => {
    loadIncomes();
    loadFarms();
  }, []);

  async function loadIncomes() {
    setLoading(true);
    setError(null);
    try {
      const data = await incomeService.getAll();
      setIncomes(data);
    } catch (err) {
      setError('Failed to load income records');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function loadFarms() {
    try {
      const data = await farmService.getAll();
      setFarms(data);
    } catch (err) {
      console.error('Failed to load farms:', err);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!formData.Name || !formData.farm_id_c || !formData.amount_c || !formData.date_c) {
      toast.error('Please fill all required fields');
      return;
    }

    try {
      if (isEditing) {
        await incomeService.update(formData);
        toast.success('Income updated successfully');
      } else {
        await incomeService.create(formData);
        toast.success('Income added successfully');
      }
      
      resetForm();
      loadIncomes();
    } catch (err) {
      console.error('Error saving income:', err);
    }
  }

  async function handleDelete(incomeId) {
    if (!confirm('Are you sure you want to delete this income record?')) {
      return;
    }

    try {
      await incomeService.delete(incomeId);
      toast.success('Income deleted successfully');
      loadIncomes();
    } catch (err) {
      console.error('Error deleting income:', err);
    }
  }

  function handleEdit(income) {
    setIsEditing(true);
    setFormData({
      Id: income.Id,
      Name: income.Name,
      farm_id_c: income.farm_id_c?.Id || income.farm_id_c,
      amount_c: income.amount_c,
      date_c: income.date_c,
      Tags: income.Tags || ''
    });
    setIsModalOpen(true);
  }

  function resetForm() {
    setFormData({
      Id: null,
      Name: '',
      farm_id_c: '',
      amount_c: '',
      date_c: '',
      Tags: ''
    });
    setIsEditing(false);
    setIsModalOpen(false);
  }

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadIncomes} />;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Income</h1>
          <p className="text-gray-600 mt-1">Track your farm income</p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <ApperIcon name="Plus" size={20} />
          Add Income
        </Button>
      </div>

      {incomes.length === 0 ? (
        <Empty
          title="No income records found"
          description="Start tracking your farm income by adding your first record"
          icon="DollarSign"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {incomes.map((income) => (
            <Card key={income.Id} className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{income.Name}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {income.farm_id_c?.Name || 'No farm'}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(income)}
                    className="text-secondary hover:text-primary transition-colors"
                  >
                    <ApperIcon name="Pencil" size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(income.Id)}
                    className="text-error hover:text-red-700 transition-colors"
                  >
                    <ApperIcon name="Trash2" size={18} />
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Amount:</span>
                  <span className="font-semibold text-success text-lg">
                    ${parseFloat(income.amount_c || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Date:</span>
                  <span className="text-sm text-gray-800">
                    {income.date_c ? format(new Date(income.date_c), 'MMM dd, yyyy') : 'N/A'}
                  </span>
                </div>
              </div>

              {income.Tags && (
                <div className="mt-3 flex flex-wrap gap-1">
                  {income.Tags.split(',').map((tag, index) => (
                    <Badge key={index} variant="secondary">
                      {tag.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={resetForm}
        title={isEditing ? 'Edit Income' : 'Add Income'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField
            label="Name"
            type="text"
            required
            value={formData.Name}
            onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
            placeholder="Enter income name"
          />

          <FormField
            label="Farm"
            type="select"
            required
            value={formData.farm_id_c}
            onChange={(e) => setFormData({ ...formData, farm_id_c: e.target.value })}
          >
            <option value="">Select a farm</option>
            {farms.map((farm) => (
              <option key={farm.Id} value={farm.Id}>
                {farm.Name}
              </option>
            ))}
          </FormField>

          <FormField
            label="Amount"
            type="number"
            required
            step="0.01"
            min="0"
            value={formData.amount_c}
            onChange={(e) => setFormData({ ...formData, amount_c: e.target.value })}
            placeholder="0.00"
          />

          <FormField
            label="Date"
            type="date"
            required
            value={formData.date_c}
            onChange={(e) => setFormData({ ...formData, date_c: e.target.value })}
          />

          <FormField
            label="Tags"
            type="text"
            value={formData.Tags}
            onChange={(e) => setFormData({ ...formData, Tags: e.target.value })}
            placeholder="Comma-separated tags"
          />

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {isEditing ? 'Update' : 'Add'} Income
            </Button>
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Income;