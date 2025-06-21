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
    console.log('Updating repair request with ID:', id);
    console.log('Request body:', req.body);

    // Validate ID parameter
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'Invalid repair request ID' });
    }

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

    // Validate required fields
    const requiredFields = {
      problem_description,
      request_date,
      estimated_cost,
      status
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([key, value]) => value === undefined || value === null || value === '')
      .map(([key]) => key);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Validate status values
    const validStatuses = ['approved', 'rejected', 'pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate numeric fields
    if (isNaN(estimated_cost) || estimated_cost < 0) {
      return res.status(400).json({ error: 'Invalid estimated_cost value' });
    }

    if (isNaN(budget) || budget < 0) {
      return res.status(400).json({ error: 'Invalid budget value' });
    }

    console.log('Extracted data:', {
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

    // Check if repair request exists
    const results = await RepairRequest.getRepairRequestById(id);
    if (results.length === 0) {
      return res.status(404).json({ error: 'Repair request not found' });
    }

    // Update the repair request
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

    res.json({
      message: 'Repair request updated successfully',
      repair_id: id,
      status: status
    });
  } catch (err) {
    console.error('Error in updateRepairRequest:', err);
    console.error('Error stack:', err.stack);

    // Handle specific database errors
    if (err.code === 'ER_NO_SUCH_TABLE') {
      return res.status(500).json({ error: 'Database table not found' });
    }

    if (err.code === 'ER_BAD_FIELD_ERROR') {
      return res.status(500).json({ error: 'Invalid database field' });
    }

    if (err.code === 'ER_DATA_TOO_LONG') {
      return res.status(400).json({ error: 'Data too long for field' });
    }

    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
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