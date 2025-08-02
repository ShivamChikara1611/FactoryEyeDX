import React, { useState, useContext } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AdminContext } from '../../context/AdminContext.jsx';

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const AssignTask = () => {
  const { aToken } = useContext(AdminContext);
  const [form, setForm] = useState({
    empId: '',
    sensorId: '',
    issueDescription: '',
    priority: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        backendUrl + '/api/admin/assign-task',
        {
          empId: form.empId,
          sensorId: form.sensorId,
          issueDescription: form.issueDescription,
          priority: form.priority
        },
        {
          headers: { aToken }
        }
      );
      if (data.success) {
        toast.success(data.message);
        setForm({ empId: '', sensorId: '', issueDescription: '', priority: '' });
      } else {
        toast.error(data.message); // Show backend error (e.g. "Employee not found")
      }
    } catch (err) {
      toast.error('Error assigning task');
    }
    setLoading(false);
};

  return (
    <div className="w-full max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Assign Task</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="text"
          name="empId"
          placeholder="Employee ID"
          value={form.empId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          name="sensorId"
          placeholder="Sensor ID"
          value={form.sensorId}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <textarea
          name="issueDescription"
          placeholder="Issue Description"
          value={form.issueDescription}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        />
        <select
          name="priority"
          value={form.priority}
          onChange={handleChange}
          className="border p-2 rounded"
          required
        >
          <option value="">Select Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? 'Assigning...' : 'Assign Task'}
        </button>
      </form>
    </div>
  );
};

export default AssignTask;