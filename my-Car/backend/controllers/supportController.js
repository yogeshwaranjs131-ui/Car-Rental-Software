const Support = require('../models/Support');

// 1. Create a Support Ticket
const createTicket = async (req, res) => {
  try {
    const newTicket = new Support(req.body);
    await newTicket.save();
    res.status(201).json({ success: true, message: 'Support ticket created successfully!', ticket: newTicket });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 2. Get All Support Tickets
const getAllTickets = async (req, res) => {
  try {
    const tickets = await Support.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, tickets });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// 3. Delete a Support Ticket
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params;
    await Support.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: 'Support ticket deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createTicket,
  getAllTickets,
  deleteTicket
};