import { MenuItem, TextField } from '@mui/material';
import { useState } from 'react';
import api from '../../services/api';
import { BaseFormModal } from './BaseFormModal';

const categories = [
  { value: 'equipment', label: 'Equipment' },
  { value: 'software', label: 'Software' },
  { value: 'services', label: 'Services' },
  { value: 'supplies', label: 'Supplies' }
];

const priorities = [
  { value: 'low', label: 'Low Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'high', label: 'High Priority' }
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function PurchaseRequestModal({ open, onClose }: Props) {
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    description: '',
    amount: '',
    category: '',
    priority: 'medium',
    justification: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const resetForm = () => {
    setFormData({
      email: '',
      title: '',
      description: '',
      amount: '',
      category: '',
      priority: 'medium',
      justification: ''
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await api.post('/api/forms/purchase-request', {
        ...formData,
        amount: Number(formData.amount)
      });
      setShowOverlay(true);
      
      // Reset form
      setFormData({
        email: '',
        title: '',
        description: '',
        amount: '',
        category: '',
        priority: 'medium',
        justification: ''
      });

      // Close after 5 seconds
      setTimeout(() => {
        onClose();
        setShowOverlay(false);
      }, 5000);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <BaseFormModal
      open={open}
      onClose={onClose}
      title="Purchase Request"
      subtitle='Please fill out the form below to request a purchase.'
      formId="purchase-form"
      showOverlay={showOverlay}
      submitting={submitting}
      onSubmit={handleSubmit}
      resetForm={resetForm}
    >
      <TextField
        required
        fullWidth
        label="Title"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
      />

      <TextField
        required
        fullWidth
        label="Email"
        type="email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />

      <TextField
        select
        required
        fullWidth
        label="Category"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      >
        {categories.map(cat => (
          <MenuItem key={cat.value} value={cat.value}>{cat.label}</MenuItem>
        ))}
      </TextField>

      <TextField
        select
        required
        fullWidth
        label="Priority"
        value={formData.priority}
        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
      >
        {priorities.map(p => (
          <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
        ))}
      </TextField>

      <TextField
        required
        fullWidth
        label="Amount"
        type="number"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        InputProps={{ 
          startAdornment: '$'
        }}
      />

      <TextField
        required
        fullWidth
        label="Description"
        multiline
        rows={3}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />

      <TextField
        required
        fullWidth
        label="Justification"
        multiline
        rows={3}
        value={formData.justification}
        onChange={(e) => setFormData({ ...formData, justification: e.target.value })}
        placeholder="Please explain why this purchase is needed..."
      />
    </BaseFormModal>
  );
}
