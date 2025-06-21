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

    // Parse images from pic_filename field
    const repairRequest = results[0];
    const images = RepairRequest.parseRepairImages(repairRequest.pic_filename);

    const responseData = {
      ...repairRequest,
      images: images
    };

    res.json(responseData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Endpoint to get repair request images (parsed from pic_filename)
export const getRepairRequestImages = async (req, res) => {
  try {
    const results = await RepairRequest.getRepairRequestById(req.params.id);
    if (results.length === 0) return res.status(404).json({ error: 'Not found' });

    const images = RepairRequest.parseRepairImages(results[0].pic_filename);
    res.json(images);
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
    if (!data.request_date) {
      data.request_date = new Date().toISOString().split('T')[0];
    }
    // Ensure all NOT NULL fields are present
    if (!('note' in data)) data.note = '';
    if (!('budget' in data)) data.budget = 0;
    if (!('responsible_person' in data)) data.responsible_person = '';
    if (!('approval_date' in data)) data.approval_date = new Date();
    const images = data.images || [];
    const result = await RepairRequest.addRepairRequest({
      ...data,
      images: images
    });
    res.status(201).json({
      message: 'Repair request added successfully',
      repair_id: result.repair_id,
      repair_code: data.repair_code,
      images_count: images.length
    });
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
      note = '',
      budget = 0,
      responsible_person = '',
      approval_date = new Date(),
      images = []
    } = req.body;
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
      approval_date,
      images
    });
    res.json({ message: 'Repair request updated successfully' });
  } catch (err) {
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