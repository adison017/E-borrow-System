import * as RepairRequest from '../models/repairRequestModel.js';

export const getAllRepairRequests = async (req, res) => {
  try {
    const results = await RepairRequest.getAllRepairRequests();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRepairRequestById = async (req, res) => {
  try {
    const results = await RepairRequest.getRepairRequestById(req.params.id);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRepairRequestsByUserId = async (req, res) => {
  try {
    const results = await RepairRequest.getRepairRequestsByUserId(req.params.user_id);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRepairRequestsByItemId = async (req, res) => {
  try {
    const results = await RepairRequest.getRepairRequestsByItemId(req.params.item_id);
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addRepairRequest = async (req, res) => {
  try {
    const data = req.body;
    // Set default status if not provided
    if (!data.status) {
      data.status = 'รอดำเนินการ';
    }
    // Set current date if not provided
    if (!data.request_date) {
      data.request_date = new Date().toISOString().split('T')[0];
    }
    await RepairRequest.addRepairRequest(data);
    res.status(201).json({ message: 'Repair request added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateRepairRequest = async (req, res) => {
  try {
    const id = req.params.id;
    const {
      problem_description,
      request_date,
      estimated_cost,
      status,
      pic_filename,
      note,
      budget,
      responsible_person,
      approval_date
    } = req.body;

    console.log('Updating repair request with data:', {
      id,
      problem_description,
      request_date,
      estimated_cost,
      status,
      pic_filename,
      note,
      budget,
      responsible_person,
      approval_date
    });

    const results = await RepairRequest.getRepairRequestById(id);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });

    await RepairRequest.updateRepairRequest(id, {
      problem_description,
      request_date,
      estimated_cost,
      status,
      pic_filename,
      note,
      budget,
      responsible_person,
      approval_date
    });

    res.json({ message: 'Repair request updated successfully' });
  } catch (err) {
    console.error('Error updating repair request:', err);
    res.status(500).json({ error: err.message });
  }
};

export const deleteRepairRequest = async (req, res) => {
  try {
    const results = await RepairRequest.getRepairRequestById(req.params.id);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });

    await RepairRequest.deleteRepairRequest(req.params.id);
    res.json({ message: 'Repair request deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};