const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Get all events
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new event
router.post('/', async (req, res) => {
  const { projectName, meetingDate, startTime, endTime, meetingRoom } = req.body;
  const email = req.headers['user-email'];
  const role = req.headers['role-value'];

  if (!email || !['Project Coordinator', 'Team Lead'].includes(role)) {
    return res.status(403).json({ message: 'Unauthorized' });
  }

  const event = new Event({
    projectName,
    meetingDate,
    startTime,
    endTime,
    meetingRoom,
    createdBy: email
  });

  try {
    const newEvent = await event.save();
    res.status(201).json(newEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update event
router.put('/:id', async (req, res) => {
  const email = req.headers['user-email'];
  const role = req.headers['role-value'];

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.createdBy !== email || !['Project Coordinator', 'Team Lead'].includes(role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete event
router.delete('/:id', async (req, res) => {
  const email = req.headers['user-email'];
  const role = req.headers['role-value'];

  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    if (event.createdBy !== email || !['Project Coordinator', 'Team Lead'].includes(role)) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Event.findByIdAndDelete(req.params.id);
    res.json({ message: 'Event deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
